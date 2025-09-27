(function(){
  function resolve(attr,def){
    var a=document.activeElement;
    var f=a && a.closest && a.closest('form');
    var w=f?f.parentElement:document;
    var v=w && w.getAttribute && w.getAttribute(attr);
    return v || def;
  }
  document.addEventListener('ib-auth:login:success', function(){
    var to=resolve('data-auth-redirect-login','/');
    setTimeout(function(){ location.assign(to); }, 500);
  });
  document.addEventListener('ib-auth:signup:success', function(){
    var to=resolve('data-auth-redirect-signup','/login');
    setTimeout(function(){ location.assign(to); }, 800);
  });
})();


