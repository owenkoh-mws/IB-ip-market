(function(){
  function setSignupErrorText(text){
    var btn=document.activeElement;
    var form=btn && btn.closest && btn.closest('form');
    var wrap=form?form.parentElement:document;
    var err=wrap && wrap.querySelector('[data-auth-message="signup-error"]');
    if(!err) return;
    var node=err.querySelector('[data-auth-error-text]') || err;
    node.textContent=text;
  }
  document.addEventListener('ib-auth:signup:error',function(e){
    var msg=String((e && e.detail) || '').toLowerCase();
    if(msg.includes('user already registered')||msg.includes('already registered')){
      setSignupErrorText('이미 가입된 이메일입니다. 로그인해 주세요.');
    }else if(msg.includes('password') && msg.includes('weak')){
      setSignupErrorText('비밀번호가 안전하지 않습니다. 더 강력한 비밀번호를 설정해 주세요.');
    }else if(msg.includes('invalid email')){
      setSignupErrorText('올바른 이메일 형식이 아닙니다.');
    }else if(msg.includes('rate limit')||msg.includes('too many requests')){
      setSignupErrorText('요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.');
    }else{
      setSignupErrorText('회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  });
})();


