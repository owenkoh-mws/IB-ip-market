// Supabase client singleton for browser
// Presentation-free business utility: only concerns creating and returning the client

(function () {
  const SUPABASE_URL = "https://ppasriosvznnpodikthz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYXNyaW9zdnpubnBvZGlrdGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjQwNTYsImV4cCI6MjA3Mzg0MDA1Nn0.UDqM1iGtNw4x7sueOI6TxoW8YOcj5OJckQguNa5kIL4";

  let supabaseClientPromise = null;

  async function loadSupabase() {
    if (supabaseClientPromise) return supabaseClientPromise;
    supabaseClientPromise = (async () => {
      // Dynamically import ESM build from CDN to avoid global pollution and ensure availability in Webflow
      const { createClient } = await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm"
      );
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
      return client;
    })();
    return supabaseClientPromise;
  }

  async function getSupabase() {
    return await loadSupabase();
  }

  // UMD-style export on window namespace
  window.IBAuthSupabase = {
    getSupabase,
  };
})();


