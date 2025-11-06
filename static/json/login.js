const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('account');
const passwordInput = document.getElementById('password');
 if (!loginForm || !usernameInput || !passwordInput) {
  console.error('未找到登录表单或输入框！请检查id是否正确');
} else {
 /*添加监听事件*/
 const registerBtn = document.getElementById("register-Btn");
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      window.location.href = 'register.html';
    });
 loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); /*阻止默认提交*/
     /*从前面的input标签中获取数据并记录*/
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

  /*验证账号密码*/
    if (username === 'admin' && password === '123456') {
      alert('登录成功！即将进入系统');

      window.location.href = 'main.html'; /*转到主界面*/
    } else {
      alert('账号或密码错误！默认账号：admin，密码：123456');
    }
  });
  }
}