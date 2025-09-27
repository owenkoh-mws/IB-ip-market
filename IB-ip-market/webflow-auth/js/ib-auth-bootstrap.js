// Bootstrap that wires presentation to business logic
// Loads in order: supabase client -> service -> UI -> start

(function () {
  async function start() {
    try {
      // Ensure Supabase module is initialized at least once
      await window.IBAuthSupabase.getSupabase();
    } catch (e) {
      // Surface a console error; UI handlers will still show errors on action
      console.error('[IBAuth] Failed to initialize Supabase', e);
    }
    if (window.IBAuthUI && typeof window.IBAuthUI.bootstrap === 'function') {
      window.IBAuthUI.bootstrap();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();


