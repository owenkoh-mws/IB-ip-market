(function(){
  function wrap(){
    var a=document.activeElement;
    var f=a && a.closest && a.closest('form');
    return f ? f.parentElement : document;
  }
  function toggle(ok){
    var w=wrap();
    var form=w.querySelector('form');
    var okEl=w.querySelector('[data-auth-message="login-success"], [data-auth-message="signup-success"], .w-form-done');
    var errEl=w.querySelector('[data-auth-message="login-error"], [data-auth-message="signup-error"], .w-form-fail');
    if(ok){
      if(form) form.style.display='none';
      if(okEl){ okEl.style.display=''; okEl.setAttribute('aria-hidden','false'); }
      if(errEl){ errEl.style.display='none'; errEl.setAttribute('aria-hidden','true'); }
    }else{
      if(form) form.style.display='';
      if(okEl){ okEl.style.display='none'; okEl.setAttribute('aria-hidden','true'); }
      if(errEl){ errEl.style.display=''; errEl.setAttribute('aria-hidden','false'); }
    }
  }
  document.addEventListener('ib-auth:login:success',function(){ toggle(true); });
  document.addEventListener('ib-auth:signup:success',function(){ toggle(true); });
  document.addEventListener('ib-auth:login:error',function(){ toggle(false); });
  document.addEventListener('ib-auth:signup:error',function(){ toggle(false); });
})();


