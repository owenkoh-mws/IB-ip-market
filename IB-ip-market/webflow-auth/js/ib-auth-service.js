// Business logic for authentication using Supabase
// No DOM operations here. Pure logic and small helpers only.

(function () {
  const ERROR_CODES = {
    EMAIL_REQUIRED: "EMAIL_REQUIRED",
    PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
    PASSWORD_MISMATCH: "PASSWORD_MISMATCH",
    UNKNOWN: "UNKNOWN",
  };

  function normalizeEmail(raw) {
    return (raw || "").trim().toLowerCase();
  }

  function ensureNonEmpty(value, code) {
    if (!value || !String(value).trim()) {
      const error = new Error(code);
      error.code = code;
      throw error;
    }
    return value;
  }

  async function signUp({ email, password, name, company, phone }) {
    const supabase = await window.IBAuthSupabase.getSupabase();
    const normalizedEmail = normalizeEmail(ensureNonEmpty(email, ERROR_CODES.EMAIL_REQUIRED));
    ensureNonEmpty(password, ERROR_CODES.PASSWORD_REQUIRED);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name: name || null,
          company: company || null,
          phone: phone || null,
        },
      },
    });

    if (error) {
      const wrapped = new Error(error.message);
      wrapped.code = error.status || ERROR_CODES.UNKNOWN;
      throw wrapped;
    }

    return data;
  }

  async function signIn({ email, password }) {
    const supabase = await window.IBAuthSupabase.getSupabase();
    const normalizedEmail = normalizeEmail(ensureNonEmpty(email, ERROR_CODES.EMAIL_REQUIRED));
    ensureNonEmpty(password, ERROR_CODES.PASSWORD_REQUIRED);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      const wrapped = new Error(error.message);
      wrapped.code = error.status || ERROR_CODES.UNKNOWN;
      throw wrapped;
    }

    return data;
  }

  async function getSession() {
    const supabase = await window.IBAuthSupabase.getSupabase();
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  }

  async function signOut() {
    const supabase = await window.IBAuthSupabase.getSupabase();
    await supabase.auth.signOut();
  }

  // Subscribe to auth state changes
  // handler receives { event, session, isLoggedIn }
  function onAuthStateChange(handler) {
    return window.IBAuthSupabase.getSupabase()
      .then((supabase) => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          try {
            handler({ event, session, isLoggedIn: !!session });
          } catch (e) {
            console.error('[IBAuth] onAuthStateChange handler error', e);
          }
        });
        const sub = data && data.subscription;
        return function unsubscribe() {
          try { sub && sub.unsubscribe && sub.unsubscribe(); } catch (e) { /* noop */ }
        };
      })
      .catch((e) => {
        console.error('[IBAuth] Failed to initialize auth state subscription', e);
        return function noop() {};
      });
  }

  window.IBAuthService = {
    signUp,
    signIn,
    signOut,
    getSession,
    onAuthStateChange,
    ERROR_CODES,
  };
})();


