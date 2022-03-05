
import axios from "axios"
// request实际就是一个promise
export function request(config) {
    //1.创建axios实例
    const instance = axios.create({
        baseURL: 'http://152.136.185.210:7878/api/hy66',
        timeout: 5000
    })

    //2.axios拦截器
    //2.1 请求拦截
    instance.interceptors.request.use(config => {
        console.log(config);

        //1.比如config中一些信息不符合服务器要求
        //2.比如每次发送网络请求时，都希望在界面显示请求图标
        //3.某些网络请求（比如登录（token）），必修携带一些特殊信息

        return config;
    }, err => {
            console.log(err);
    })
    //2.2 响应拦截
    instance.interceptors.response.use(res => {
        // console.log(res);
        return res.data
    },err => {
        console.log(err);
    })

    return instance(config);
}