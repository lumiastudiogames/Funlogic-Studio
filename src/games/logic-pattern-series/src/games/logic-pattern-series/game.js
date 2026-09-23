// Logic Pattern Series - Standalone Web Engine
(function() {
  const startTime = Date.now();

  function triggerPlatformWin(seconds) {
    const elapsed = seconds || Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: elapsed }, '*');
      }
    } catch {}
  }

  window.triggerPlatformWin = triggerPlatformWin;
})();
