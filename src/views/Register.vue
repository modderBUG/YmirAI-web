<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Ymir-AI</h2>
	  <h2>注册</h2>
	   
      <form @submit.prevent="validateForm">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            v-model="username"
            id="username"
            @blur="validateUsername"
            placeholder="请输入用户名"
          />
          <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
        </div>
		<div class="form-group">
		  <label for="username">昵称</label>
		  <input
		    type="text"
		    v-model="nickname"
		    id="nickname"
		    placeholder="昵称"
		  />
		  <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
		</div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            type="email"
            v-model="email"
            id="email"
            @blur="validateEmail"
            placeholder="请输入邮箱"
          />
          <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            v-model="password"
            id="password"
            @change="validatePassword"
            placeholder="请输入密码"
          />
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            type="password"
            v-model="confirmPassword"
            id="confirmPassword"
          
			@change="validateConfirmPassword"
            placeholder="请再次输入密码"
          />
          <span v-if="errors.confirmPassword" class="error-msg" :id="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>
        <button type="submit" class="submit-btn">注册</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
	  nickname: '分析员9527',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {},
    };
  },
  methods: {
    validateUsername() {
      if (!this.username) {
        this.errors.username = '用户名不能为空';
      } else if (this.username.length < 3) {
        this.errors.username = '用户名长度不能少于3个字符';
      } else {
        this.errors.username = '';
      }
    },
    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!this.email) {
        this.errors.email = '邮箱不能为空';
      } else if (!emailPattern.test(this.email)) {
        this.errors.email = '请输入有效的邮箱地址';
      } else {
        this.errors.email = '';
      }
    },
    validatePassword() {
      if (!this.password) {
        this.errors.password = '密码不能为空';
      } else if (this.password.length < 6) {
        this.errors.password = '密码长度不能少于6个字符';
      } else {
        this.errors.password = '';
      }
    },
    validateConfirmPassword() {
      if (this.confirmPassword !== this.password) {
        this.errors.confirmPassword ='两次输入的密码不一致';
      } else {
        this.errors.confirmPassword = null;
      }
    },
	setToken(token) {
			console.log('set token: ',token)
	        localStorage.setItem('token', token);
	      },
    validateForm() {
		
		
      this.validateUsername();
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();

      if (!this.errors.username && !this.errors.email && !this.errors.password && !this.errors.confirmPassword) {
		  
		  
		  const body = {
			  username:this.username,
			  password:this.password,
			  nickname:this.nickname,
			  email:this.email,
		  }
		  
		  this.axios.post(`/api/v1/register`,body )
		  	.then((result) => {
		  		
				if(result.data.code==400){
					alert(result.data.message)
					return
				}
				const token=result.data.data
				this.setToken(token)
				alert('注册成功！');
				window.location.href = '/home';
				
		  	})
		  	.catch((err) => {
		  		console.error("Error:", err);
		  		alert('注册失败');
		  	});
		  
        
        // 这里可以添加表单提交逻辑
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://example.com/your-anime-background.jpg');
  background-size: cover;
  background-position: center;
}

.register-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 400px;
  animation: fadeIn 1s ease-in-out;
}

h2 {
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: #ff69b4;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  color: #333;
  float: left;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 5px #ff69b4;
  outline: none;
}

.error-msg {
  color: red;
  font-size: 12px;
  text-align: left;
  margin-top: 5px;
}

.submit-btn {
  background-color: #ff69b4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #ff1493;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
