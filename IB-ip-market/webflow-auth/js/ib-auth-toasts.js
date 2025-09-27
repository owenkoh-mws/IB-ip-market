(function(){
  var c;
  function ensure(){
    if(c && document.body.contains(c)) return c;
    c=document.createElement('div');
    c.id='ib-toast';
    c.style.position='fixed';
    c.style.top='16px';
    c.style.right='16px';
    c.style.zIndex='999999';
    document.body.appendChild(c);
    return c;
  }
  function show(text,bg){
    var root=ensure();
    var t=document.createElement('div');
    t.style.cssText='min-width:220px;max-width:360px;padding:10px 12px;border-radius:10px;color:#fff;margin-bottom:8px;box-shadow:0 6px 30px rgba(0,0,0,.25);opacity:0;transform:translateY(-6px);transition:.2s';
    t.style.background=bg;
    t.textContent=text;
    root.appendChild(t);
    requestAnimationFrame(function(){t.style.opacity='1';t.style.transform='translateY(0)'});
    setTimeout(function(){
      t.style.opacity='0'; t.style.transform='translateY(-6px)';
      setTimeout(function(){ t.remove(); }, 220);
    }, 2000);
  }
  document.addEventListener('ib-auth:logout:success',function(){show('로그아웃되었습니다.','rgba(22,163,74,.95)')});
  document.addEventListener('ib-auth:logout:error',function(){show('로그아웃에 실패했습니다.','rgba(220,38,38,.95)')});
})();


