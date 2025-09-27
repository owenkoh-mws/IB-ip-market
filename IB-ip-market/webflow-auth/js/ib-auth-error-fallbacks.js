(function(){
  function $(s,r){return (r||document).querySelector(s)}
  function wrap(){var a=document.activeElement;var f=a&&a.closest&&a.closest('form');return f?f.parentElement:document}
  function onErr(){var w=wrap();var form=$('form',w);var done=$('[data-auth-message="login-success"], [data-auth-message="signup-success"], .w-form-done',w);var fail=$('[data-auth-message="login-error"], [data-auth-message="signup-error"], .w-form-fail',w);if(form)form.style.display='';if(done){done.style.display='none';done.setAttribute('aria-hidden','true')}if(fail){fail.style.display='';fail.setAttribute('aria-hidden','false')}}
  function onOk(){var w=wrap();var form=$('form',w);var done=$('[data-auth-message="login-success"], [data-auth-message="signup-success"], .w-form-done',w);var fail=$('[data-auth-message="login-error"], [data-auth-message="signup-error"], .w-form-fail',w);if(form)form.style.display='none';if(done){done.style.display='';done.setAttribute('aria-hidden','false')}if(fail){fail.style.display='none';fail.setAttribute('aria-hidden','true')}}
  document.addEventListener('ib-auth:login:error',onErr);
  document.addEventListener('ib-auth:signup:error',onErr);
  document.addEventListener('ib-auth:login:success',onOk);
  document.addEventListener('ib-auth:signup:success',onOk);
})();


