import axios from "axios";
import {ElMessage} from "element-plus";
import httpConfig from './config.js'
import NProgress from "nprogress";
NProgress.configure({
    showSpinner: false
})
const instance = axios.create(httpConfig.config);

instance.interceptors.request.use(config => {
    NProgress.start()
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

let timer
instance.interceptors.response.use(response => {
    NProgress.done()
    const {code, message} = response.data
    if (code === 200) {
        return response.data
    } else if (code === 4001) {
        ElMessage.warning(message)
        localStorage.removeItem('token')
        setTimeout(()=>{
            window.location.reload()
        },1000)
    }else if( code === 500 ){
        ElMessage.error('后端接口报错,请联系管理员解决')
    }
    else {
        ElMessage.error(`错误码:${code},错误信息:${message}`)
    }
}, (error) => {
    clearTimeout(timer)
    timer = setTimeout(()=>{
        NProgress.done()
        ElMessage(`请等待${httpConfig.retryTimes * httpConfig.reDelay}s，接口异常，重试中...`);
        const config = error.config;
        if (!config || !config.retryTimes) {
            return Promise.reject(error);
        }
        let {_retryCount = 0, retryTimes, retryDelay} = config;
        config._retryCount = _retryCount;
        if (config._retryCount >= retryTimes) {
            setTimeout(() => {
                ElMessage.error("接口请求超限，网络系统异常,请联系管理员");
            }, retryDelay)
            return Promise.reject(error);
        }
        config._retryCount++;
        const backOff = new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, retryDelay);
        });
        return backOff.then(() => {
            // isAlert = true
            return instance(config);
        });
    },1000)

})

export default instance