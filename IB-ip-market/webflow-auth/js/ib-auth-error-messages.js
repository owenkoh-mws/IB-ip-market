(function(){
  function setLoginErrorText(text){
    var root=document.activeElement && document.activeElement.closest('form');
    var wrap=root?root.parentElement:document;
    var err=wrap && wrap.querySelector('[data-auth-message="login-error"]');
    if(!err) return;
    var node=err.querySelector('[data-auth-error-text]') || err;
    node.textContent=text;
  }
  document.addEventListener('ib-auth:login:error',function(e){
    var msg=String((e && e.detail) || '').toLowerCase();
    if(msg.includes('invalid login credentials')||msg.includes('invalid-credentials')||msg.includes('invalid credentials')){
      setLoginErrorText('이메일 또는 비밀번호가 올바르지 않습니다. 가입하지 않았다면 회원가입을 진행해 주세요.');
    }else if(msg.includes('confirm')||msg.includes('not confirmed')){
      setLoginErrorText('이메일 인증이 필요합니다. 받은 편지함의 인증 메일을 확인해 주세요.');
    }else{
      setLoginErrorText('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  });
})();


