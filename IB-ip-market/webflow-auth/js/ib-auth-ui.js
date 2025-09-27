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
  };

  function $(selector) {
    return document.querySelector(selector);
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
  function setText(el, text) { if (el) el.textContent = text; }

  function getInputValue(el) {
    return el && 'value' in el ? String(el.value || '').trim() : '';
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
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initLogin();
        initSignup();
      });
    } else {
      initLogin();
      initSignup();
    }
  }

  window.IBAuthUI = { bootstrap };
})();


