
import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({username, password }) => {

    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/user/register', { username, password})
}


// 登录接口
export const userLoginService = ({ username, password }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/user/login', { username, password })
}

export const userUpdatePwd = ({ oldPwd, newPwd, rePwd }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.patch('/user/updatePwd', { oldPwd, newPwd, rePwd })
}

export const userUpdateAddr = ({ address, phoneNo, username }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.patch('/user/updateAddr', { address, phoneNo, username  })
}

