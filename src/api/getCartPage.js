import request from "@/utils/request.js";

export const AddToCart = ({ userId, goodId, quantity }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/cart/add', { userId, goodId, quantity })
}

// export const getCartPage = ({ userId }) => {
//
//     const params = new URLSearchParams()
//     for (const key in params) {
//         params.append(key, params[key]);
//     }
//
//     return request.get('/cart/page',
//         {
//             //key: value  key固定写法 params 参数对象
//             params: {
//                 //再写用户的参数
//                 userId: userId,
//             }
//         }).then(function(res) {localStorage.setItem('cartList', JSON.stringify(res))})
// }
export const GetCartPage = ({ userId }) => request.get('/cart/page', {
    params: {
        userId: userId,
    }
})
export const DeleteOne = ({ id }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/cart/delete', { id })
}

export const ConfirmInfo = ({ username }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/cart/confirmInfo', { username })
}