// Presentation layer: binds to DOM, uses IBAuthService for logic

(function () {
  const SELECTORS = {
    login: {
      email: '[data-auth="login-email"]',
      password: '[data-auth="login-password"]',
      submit: '[data-auth="login-submit"]',
      errorContainer: '[data-auth="login-error"]',
    },
    signup: {
      email: '[data-auth="signup-email"]',
      password: '[data-auth="signup-password"]',
      passwordConfirm: '[data-auth="signup-password-confirm"]',
      name: '[data-auth="signup-name"]',
      company: '[data-auth="signup-company"]',
      phone: '[data-auth="signup-phone"]',
      submit: '[data-auth="signup-submit"]',
      successContainer: '[data-auth="signup-success"]',
      errorContainer: '[data-auth="signup-error"]',
    },
    gnb: {
      loginButton: '[data-auth="gnb-login"]',
      signupLink: '[data-auth="gnb-signup"]',
      logoutButton: '[data-auth="gnb-logout"]',
    },
  };

  function $(selector) {
    return document.querySelector(selector);
  }
  function $$(selector) {
    try { return Array.from(document.querySelectorAll(selector)); } catch (_) { return []; }
  }

  function setWait(el, waiting) {
    if (!el) return;
    const originalText = el.getAttribute('data-original-text') || el.value || el.textContent;
    if (!el.getAttribute('data-original-text')) {
      el.setAttribute('data-original-text', originalText);
    }
    const waitText = el.getAttribute('data-wait') || 'Please wait...';
    if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
      el.disabled = waiting;
      el.value = waiting ? waitText : originalText;
      if (el.textContent) el.textContent = waiting ? waitText : originalText;
    } else {
      el.textContent = waiting ? waitText : originalText;
    }
  }

  function show(el) { if (el) el.style.display = ''; }
  function hide(el) { if (el) el.style.display = 'none'; }
  function showAll(els) { (els || []).forEach(show); }
  function hideAll(els) { (els || []).forEach(hide); }

  // Minimal accessible toast
  function ensureToastRoot() {
    let root = document.getElementById('ib-auth-toast-root');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'ib-auth-toast-root';
    root.setAttribute('aria-live', 'polite');
    root.setAttribute('aria-atomic', 'true');
    root.style.position = 'fixed';
    root.style.zIndex = '2147483647';
    root.style.right = '16px';
    root.style.bottom = '16px';
    root.style.display = 'flex';
    root.style.flexDirection = 'column';
    root.style.gap = '8px';
    document.body.appendChild(root);
    return root;
  }

  function showToast(message) {
    try {
      const root = ensureToastRoot();
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.background = 'rgba(0,0,0,0.85)';
      toast.style.color = '#fff';
      toast.style.padding = '10px 14px';
      toast.style.borderRadius = '8px';
      toast.style.fontSize = '14px';
      toast.style.maxWidth = '320px';
      toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.35)';
      root.appendChild(toast);
      setTimeout(() => { try { root.removeChild(toast); } catch (_) {} }, 2600);
    } catch (e) {
      // Fallback alert
      alert(message);
    }
  }
  function setText(el, text) { if (el) el.textContent = text; }

  function getInputValue(el) {
    return el && 'value' in el ? String(el.value || '').trim() : '';
  }

  function initGNB() {
    try {
      const loginBtns = $$(SELECTORS.gnb.loginButton);
      const signupLnks = $$(SELECTORS.gnb.signupLink);
      const logoutBtns = $$(SELECTORS.gnb.logoutButton);

      function applyVisibility(isLoggedIn) {
        try {
          if (isLoggedIn) { hideAll(loginBtns); hideAll(signupLnks); showAll(logoutBtns); }
          else { showAll(loginBtns); showAll(signupLnks); hideAll(logoutBtns); }
        } catch (e) {
          console.error('[IBAuthUI] Failed to apply GNB visibility', e);
        }
      }

      // Initial state from current session
      window.IBAuthService.getSession()
        .then((session) => applyVisibility(!!session))
        .catch((e) => {
          console.error('[IBAuthUI] Failed to load session for GNB', e);
          // Default to logged-out view on error
          applyVisibility(false);
        });

      // Subscribe to auth state changes
      window.IBAuthService.onAuthStateChange(({ isLoggedIn }) => {
        applyVisibility(!!isLoggedIn);
      });

      // Logout click handler
      (logoutBtns || []).forEach((btn) => {
        btn.addEventListener('click', async function (e) {
          try { e && e.preventDefault && e.preventDefault(); } catch (_) {}
          try {
            await window.IBAuthService.signOut();
            applyVisibility(false);
            // Avoid duplicate toast if a global logout toast script is active
            if (!window.__IB_AUTH_LOGOUT_TOAST_ACTIVE && !window.__IB_AUTH_LOGOUT_TOAST_ACTIVE_V2) {
              showToast('로그아웃되었습니다.');
            }
          } catch (err) {
            console.error('[IBAuthUI] Logout failed', err);
            alert((err && err.message) || '로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          }
        });
      });
    } catch (e) {
      console.error('[IBAuthUI] initGNB error', e);
    }
  }

  function initLogin() {
    const emailEl = $(SELECTORS.login.email);
    const passwordEl = $(SELECTORS.login.password);
    const submitEl = $(SELECTORS.login.submit);
    const errorEl = $(SELECTORS.login.errorContainer);
    if (!submitEl || !emailEl || !passwordEl) return;

    hide(errorEl);

    submitEl.addEventListener('click', async function (e) {
      e.preventDefault();
      hide(errorEl);
      setWait(submitEl, true);
      try {
        await window.IBAuthService.signIn({
          email: getInputValue(emailEl),
          password: getInputValue(passwordEl),
        });
        // Redirect to home or intended page
        window.location.href = '/';
      } catch (err) {
        setText(errorEl, err && err.message ? err.message : '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        show(errorEl);
      } finally {
        setWait(submitEl, false);
      }
    });
  }

  function initSignup() {
    const emailEl = $(SELECTORS.signup.email);
    const passwordEl = $(SELECTORS.signup.password);
    const passwordConfirmEl = $(SELECTORS.signup.passwordConfirm);
    const nameEl = $(SELECTORS.signup.name);
    const companyEl = $(SELECTORS.signup.company);
    const phoneEl = $(SELECTORS.signup.phone);
    const submitEl = $(SELECTORS.signup.submit);
    const successEl = $(SELECTORS.signup.successContainer);
    const errorEl = $(SELECTORS.signup.errorContainer);
    if (!submitEl || !emailEl || !passwordEl) return;

    hide(successEl);
    hide(errorEl);

    submitEl.addEventListener('click', async function (e) {
      e.preventDefault();
      hide(successEl);
      hide(errorEl);
      setWait(submitEl, true);
      try {
        const password = getInputValue(passwordEl);
        const passwordConfirm = getInputValue(passwordConfirmEl);
        if (passwordConfirmEl && password !== passwordConfirm) {
          const err = new Error('비밀번호가 일치하지 않습니다.');
          err.code = window.IBAuthService.ERROR_CODES.PASSWORD_MISMATCH;
          throw err;
        }
        await window.IBAuthService.signUp({
          email: getInputValue(emailEl),
          password,
          name: getInputValue(nameEl),
          company: getInputValue(companyEl),
          phone: getInputValue(phoneEl),
        });
        // Ensure profile is saved immediately
        try {
          const session = await window.IBAuthService.getSession();
          const userId = session && session.user && session.user.id;
          if (userId) {
            await window.IBAuthService.upsertProfile({
              id: userId,
              email: getInputValue(emailEl).toLowerCase(),
              name: getInputValue(nameEl),
              company: getInputValue(companyEl),
              phone: getInputValue(phoneEl),
            });
          }
        } catch (profileErr) {
          console.warn('[IBAuthUI] profile upsert after signup failed', profileErr);
        }
        // Optional debug output
        try {
          const debugEl = document.querySelector('[data-auth="signup-profile-debug"]');
          if (debugEl) {
            const profile = await window.IBAuthService.getProfile();
            debugEl.textContent = profile ? JSON.stringify(profile) : 'no profile';
          }
        } catch (_) {}
        setText(successEl, '가입이 완료되었어요. 이메일을 확인해 주세요.');
        show(successEl);
      } catch (err) {
        setText(errorEl, err && err.message ? err.message : '죄송합니다. 폼을 제출하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        show(errorEl);
      } finally {
        setWait(submitEl, false);
      }
    });
  }

  function bootstrap() {
    // Run after DOM is ready
    function initAll() {
      initLogin();
      initSignup();
      initGNB();
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  window.IBAuthUI = { bootstrap };
})();


