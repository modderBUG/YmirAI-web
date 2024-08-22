import axios from 'axios';

// 创建一个 axios 实例
const axiosInstance = axios.create({
  baseURL:"http://49.232.24.59",  // "http://www.modderbug.cn:8080",   //'http://localhost:8888/', // "http://49.232.24.59" ,		// 'http://localhost:8888/', // 你的 API 基础 URL  
  timeout: 30000, // 请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 从 localStorage 中获取 token
    const token = localStorage.getItem('token');
    if (token) {
      // 如果存在 token，将其添加到请求头中
      config.headers['Authorization'] = `Bearer ${token}`;
	  
	  console.log(config)
    }
    return config;
  },
  error => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
	
	if(response.data.code==401){
		localStorage.removeItem('token');
		window.location.href = '/login';
		// window.location.reload()
	}
	
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 如果响应状态为 401，删除本地 token 并重定向到 /login
      localStorage.removeItem('token');
      window.location.href = '/login';
	  // window.location.reload()
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
