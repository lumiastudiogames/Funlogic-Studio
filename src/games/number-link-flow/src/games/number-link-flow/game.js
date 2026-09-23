/**
 * Number Link Flow - Platform Game Module
 */

export function render(container, onWin) {
  let startTime = Date.now();
  let level = 1;

  container.innerHTML = `
    <div style="width:100%;height:100%;display:flex;flex-direction:column;background:#0f172a;color:#f8fafc;align-items:center;justify-content:center;text-align:center;padding:16px;">
      <h2 style="font-size:24px;font-weight:900;margin-bottom:8px;color:#38bdf8;">NUMBER LINK FLOW</h2>
      <p style="font-size:14px;color:#94a3b8;max-width:320px;margin-bottom:20px;">Connect matching colored numbers to fill 100% of the grid without crossing pipes.</p>
      <button id="btn-start-standalone" style="padding:14px 28px;background:linear-gradient(to right, #2563eb, #4f46e5);color:white;border:none;border-radius:14px;font-weight:bold;font-size:16px;cursor:pointer;box-shadow:0 4px 12px rgba(37,99,235,0.4);">
        START LEVEL ${level}
      </button>
    </div>
  `;

  document.getElementById('btn-start-standalone')?.addEventListener('click', () => {
    // In standalone wrapper, dispatch win upon completing stage
    const timeInSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    if (typeof onWin === 'function') {
      onWin(timeInSeconds);
    }
    window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
  });
}
