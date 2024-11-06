import store from "@/store";
import axios from "axios";

//创建一个axios实例
const requests = axios.create({
    timeout: 5000,
});
//请求拦截器
requests.interceptors.request.use((config) => {

    if (store.state.user.token) {
        config.headers.Authorization = 'Bearer ' + store.state.user.token

    }
    return config;
})
//响应拦截器
requests.interceptors.response.use((res) => {

    return res.data;
}, (error) => {
    return Promise.reject(new Error("FAIL"));
})
export default requests;