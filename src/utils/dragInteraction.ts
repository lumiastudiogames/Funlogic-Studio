/**
 * Unified Drag & Touch Interaction Utility
 * Supports both mouse pointer dragging (arrow) and touch screen dragging (finger).
 */

/**
 * Enables click-and-drag horizontal or vertical scrolling on any element for both Mouse and Touch.
 */
export function enableDragScroll(element: HTMLElement): void {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;

  element.style.cursor = 'grab';
  element.style.userSelect = 'none';
  (element.style as any).webkitUserSelect = 'none';

  element.addEventListener('mousedown', (e: MouseEvent) => {
    isDown = true;
    isDragging = false;
    element.style.cursor = 'grabbing';
    startX = e.pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  });

  element.addEventListener('mouseleave', () => {
    isDown = false;
    element.style.cursor = 'grab';
  });

  element.addEventListener('mouseup', () => {
    isDown = false;
    element.style.cursor = 'grab';
  });

  element.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDown) return;
    const x = e.pageX - element.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll sensitivity multiplier
    if (Math.abs(walk) > 5) {
      isDragging = true;
      window.getSelection()?.removeAllRanges();
    }
    element.scrollLeft = scrollLeft - walk;
  });

  // Touch gesture support: detect swipe/drag so child links are not clicked on drag
  let touchStartX = 0;
  let isTouchDragging = false;

  element.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].pageX;
      isTouchDragging = false;
    }
  }, { passive: true });

  element.addEventListener('touchmove', (e: TouchEvent) => {
    if (e.touches.length === 1) {
      const currentX = e.touches[0].pageX;
      if (Math.abs(currentX - touchStartX) > 8) {
        isTouchDragging = true;
        isDragging = true;
      }
    }
  }, { passive: true });

  element.addEventListener('touchend', () => {
    if (isTouchDragging) {
      setTimeout(() => {
        isDragging = false;
        isTouchDragging = false;
      }, 100);
    }
  }, { passive: true });

  // Prevent click on child links/buttons if user was dragging
  element.addEventListener('click', (e: MouseEvent) => {
    if (isDragging || isTouchDragging) {
      e.preventDefault();
      e.stopPropagation();
      isDragging = false;
      isTouchDragging = false;
    }
  }, true);
}

export interface DragDropItem {
  element: HTMLElement;
  data: any;
}

export interface PointerDragOptions {
  draggableSelector: string;
  dropTargetSelector: string;
  onDrop: (draggedData: any, targetElement: HTMLElement) => void;
  onDragStart?: (draggedData: any, sourceElement: HTMLElement) => void;
  onDragEnd?: () => void;
  container: HTMLElement;
}

/**
 * Configures unified Pointer Drag & Drop for both Touch finger and Mouse pointer arrow.
 */
export function setupPointerDragAndDrop(options: PointerDragOptions): () => void {
  const { draggableSelector, dropTargetSelector, onDrop, onDragStart, onDragEnd, container } = options;

  let activeItem: HTMLElement | null = null;
  let activeData: any = null;
  let ghostEl: HTMLElement | null = null;
  let hoveredTarget: HTMLElement | null = null;
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  function clearHoverState() {
    if (hoveredTarget) {
      hoveredTarget.classList.remove('drag-over', 'ring-4', 'ring-emerald-400', 'scale-105');
      hoveredTarget = null;
    }
  }

  function removeGhost() {
    if (ghostEl && ghostEl.parentNode) {
      ghostEl.parentNode.removeChild(ghostEl);
    }
    ghostEl = null;
  }

  function onPointerDown(e: PointerEvent) {
    const target = (e.target as HTMLElement).closest(draggableSelector) as HTMLElement;
    if (!target) return;

    // Read stored data
    const rawData = target.dataset.dragData;
    if (!rawData) return;

    try {
      activeData = JSON.parse(rawData);
    } catch {
      activeData = rawData;
    }

    activeItem = target;
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;

    // Capture pointer to handle mouse/touch globally
    target.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!activeItem) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!isDragging && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      isDragging = true;

      if (onDragStart) {
        onDragStart(activeData, activeItem);
      }

      // Create floating ghost element for touch & mouse drag feedback
      ghostEl = activeItem.cloneNode(true) as HTMLElement;
      ghostEl.style.position = 'fixed';
      ghostEl.style.pointerEvents = 'none';
      ghostEl.style.zIndex = '99999';
      ghostEl.style.opacity = '0.85';
      ghostEl.style.transform = 'scale(1.15) rotate(3deg)';
      ghostEl.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      ghostEl.style.transition = 'none';

      document.body.appendChild(ghostEl);
    }

    if (isDragging && ghostEl) {
      const rect = activeItem.getBoundingClientRect();
      const ghostX = e.clientX - rect.width / 2;
      const ghostY = e.clientY - rect.height / 2;
      ghostEl.style.left = `${ghostX}px`;
      ghostEl.style.top = `${ghostY}px`;

      // Find drop target under current pointer location
      ghostEl.style.display = 'none'; // Temporarily hide to hit element beneath
      const elementUnderPointer = document.elementFromPoint(e.clientX, e.clientY);
      ghostEl.style.display = 'flex';

      const dropTarget = elementUnderPointer?.closest(dropTargetSelector) as HTMLElement | null;

      if (dropTarget !== hoveredTarget) {
        clearHoverState();
        if (dropTarget) {
          hoveredTarget = dropTarget;
          hoveredTarget.classList.add('drag-over', 'ring-4', 'ring-emerald-400', 'scale-105');
        }
      }
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (!activeItem) return;

    if (isDragging) {
      // Find element under pointer
      removeGhost();

      const elementUnderPointer = document.elementFromPoint(e.clientX, e.clientY);
      const dropTarget = elementUnderPointer?.closest(dropTargetSelector) as HTMLElement | null;

      clearHoverState();

      if (dropTarget) {
        onDrop(activeData, dropTarget);
      }

      if (onDragEnd) {
        onDragEnd();
      }
    }

    try {
      activeItem.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture might already be released
    }

    activeItem = null;
    activeData = null;
    isDragging = false;
    removeGhost();
    clearHoverState();
  }

  function onPointerCancel(e: PointerEvent) {
    if (activeItem) {
      try {
        activeItem.releasePointerCapture(e.pointerId);
      } catch {}
    }
    activeItem = null;
    activeData = null;
    isDragging = false;
    removeGhost();
    clearHoverState();
  }

  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerup', onPointerUp);
  container.addEventListener('pointercancel', onPointerCancel);

  return () => {
    container.removeEventListener('pointerdown', onPointerDown);
    container.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('pointerup', onPointerUp);
    container.removeEventListener('pointercancel', onPointerCancel);
    removeGhost();
    clearHoverState();
  };
}
