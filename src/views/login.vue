<template>
  <div class="login-container" v-if="!isHidden">
    <div class="login-box">
      <h2>登录</h2>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input type="text" v-model="username" required />
          <label>用户名</label>
        </div>
        <div class="input-group">
          <input type="password" v-model="password" required />
          <label>密码</label>
        </div>
        <button type="submit">登录</button>
      </form>
	  <div v-if="tips" > 用户密码错误  </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      username: '',
      password: '',
	  tips:false,
    };
  },
  methods: {
	setToken(token) {
			console.log('set token: ',token)
	        localStorage.setItem('token', token);
	      },
    handleSubmit() {
      // 模拟登录成功
	  this.tips = false
	  var that = this
	  
	  this.axios.post(`/api/v1/login`, {
		  'username':this.username,
		  'password':this.password,
	  })
	    .then((result) => {
	      console.log(result);
		  console.log(result.data.code)
		  console.log(result.data.data)
	      if(result.data.code==200){
			  that.$emit('login-success'); // 触发登录成功事件
			  const token=result.data.data
			  that.setToken(token)
			  // window.location.reload()
			  window.location.href = '/home';
		  }
		  if(result.data.code==401){
		  			  
			localStorage.removeItem('token');
			that.tips = true
		  }
		  
		  
	    })
	    .catch((err) => {
	    });
	  
      console.log('登录信息:', this.username);
      // 这里可以添加实际的登录逻辑
      
	  
    },
  },
};
</script>

<style scoped>
body {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
}

.login-container {
	
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://example.com/your-anime-background.jpg');
  background-size: cover;
  background-position: center;
  perspective: 1000px;
}

.login-box {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  padding: 40px;
  position: relative;
  overflow: hidden;
  transform: rotateY(0deg);
  transition: transform 0.5s;
}

.login-box:hover {
  transform: rotateY(10deg);
}

h2 {
  text-align: center;
  color: #ff6f61;
  margin-bottom: 20px;
}

.input-group {
  position: relative;
  margin-bottom: 30px;
}

input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid #ff6f61;
  background: transparent;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ff6f61;
}

label {
  position: absolute;
  left: 10px;
  top: 10px;
  color: #999;
  transition: all 0.3s;
}

input:focus + label,
input:not(:placeholder-shown) + label {
  top: -15px;
  left: 5px;
  color: #ff6f61;
  font-size: 12px;
}

button {
  width: 100%;
  padding: 10px;
  background: #ff6f61;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #ff4a3d;
}
</style>
