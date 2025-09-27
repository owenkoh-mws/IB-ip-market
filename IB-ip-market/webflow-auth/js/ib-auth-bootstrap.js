(function(){
  function load(cb){
    if(window.supabase){ cb(); return; }
    var e=document.createElement('script');
    e.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
    e.async=true;
    e.onload=cb;
    document.head.appendChild(e);
  }

  load(function(){
    if(window.IB_AUTH && window.IB_AUTH.client) return;

    var C={
      url:'https://ppasriosvznnpodikthz.supabase.co',
      key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYXNyaW9zdnpubnBvZGlrdGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjQwNTYsImV4cCI6MjA3Mzg0MDA1Nn0.UDqM1iGtNw4x7sueOI6TxoW8YOcj5OJckQguNa5kIL4'
    };

    var a=window.supabase.createClient(C.url,C.key);

    function val(el){ return el && typeof el.value==='string' ? el.value.trim() : ''; }

    function bind(){
      var le=document.querySelector('[data-auth="login-email"]');
      var lp=document.querySelector('[data-auth="login-password"]');
      var ls=document.querySelector('[data-auth="login-submit"]');

      var se=document.querySelector('[data-auth="signup-email"]');
      var sp=document.querySelector('[data-auth="signup-password"]');
      var ss=document.querySelector('[data-auth="signup-submit"]');

      if(ls){
        ls.addEventListener('click',function(e){
          e.preventDefault();
          a.auth.signInWithPassword({email:val(le),password:val(lp)})
            .then(function(r){
              if(r.error){
                document.dispatchEvent(new CustomEvent('ib-auth:login:error',{detail:r.error.message}));
              }else{
                document.dispatchEvent(new CustomEvent('ib-auth:login:success',{detail:r.data}));
              }
            })
            .catch(function(err){
              document.dispatchEvent(new CustomEvent('ib-auth:login:error',{detail:String(err && err.message || err)}));
            });
        });
      }

      if(ss){
        ss.addEventListener('click',function(e){
          e.preventDefault();
          var sc=document.querySelector('[data-auth="signup-password-confirm"]');
          if(sc && val(sp)!==val(sc)){
            document.dispatchEvent(new CustomEvent('ib-auth:signup:error',{detail:'password-mismatch'}));
            return;
          }
          a.auth.signUp({email:val(se),password:val(sp)})
            .then(function(r){
              if(r.error){
                document.dispatchEvent(new CustomEvent('ib-auth:signup:error',{detail:r.error.message}));
              }else{
                document.dispatchEvent(new CustomEvent('ib-auth:signup:success',{detail:r.data}));
              }
            })
            .catch(function(err){
              document.dispatchEvent(new CustomEvent('ib-auth:signup:error',{detail:String(err && err.message || err)}));
            });
        });
      }

      document.querySelectorAll('[data-auth-action="logout"]').forEach(function(n){
        n.addEventListener('click',function(e){
          e.preventDefault();
          a.auth.signOut()
            .then(function(){ document.dispatchEvent(new CustomEvent('ib-auth:logout:success')); })
            .catch(function(err){ document.dispatchEvent(new CustomEvent('ib-auth:logout:error',{detail:String(err && err.message || err)})); });
        });
      });
    }

    window.IB_AUTH = { client:a, bind:bind };
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
  });
})();


