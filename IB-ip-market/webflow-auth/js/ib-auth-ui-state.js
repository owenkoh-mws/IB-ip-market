(function(){
  function setDisplay(els,show){
    els.forEach(function(el){
      el.style.display = show ? '' : 'none';
      el.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
  }
  function refresh(){
    if(!window.IB_AUTH || !window.IB_AUTH.client){ setTimeout(refresh,80); return; }
    var api=window.IB_AUTH;
    api.client.auth.getSession().then(function(r){
      var s=!!(r.data && r.data.session && r.data.session.user);
      setDisplay(Array.from(document.querySelectorAll('[data-auth-visible="signed-in"]')), s);
      setDisplay(Array.from(document.querySelectorAll('[data-auth-visible="signed-out"]')), !s);
    });
  }
  if(window.IB_AUTH && window.IB_AUTH.client){
    window.IB_AUTH.client.auth.onAuthStateChange(function(){ refresh(); });
  }
  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',refresh) : refresh();
})();


