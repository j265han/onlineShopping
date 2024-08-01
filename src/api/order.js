import request from "@/utils/request.js";

export const BuildOrder = ({ userId, receiverName, receiverPhone, receiverAddress, goodId }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/order/build', { userId, receiverName, receiverPhone, receiverAddress, goodId })
}

export const BuildOrderDirect = ({ userId, receiverName, receiverPhone, receiverAddress, goodId, quantity }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/order/buildDirect', { userId, receiverName, receiverPhone, receiverAddress, goodId, quantity })
}

// export const GetOrderList = ({ userId }) => {
//     const params = new URLSearchParams()
//     for (const key in params) {
//         params.append(key, params[key]);
//     }
//     return request.get('/order/list',  {
//         //key: value  key固定写法 params 参数对象
//         params: {
//             userId: userId
//         }
//     }).then(function(res) {localStorage.setItem('orderList', JSON.stringify(res.data))})
// }

export const GetOrderList = ({ userId }) => request.get('/order/list', {
    params: {
        userId: userId,
    }
})

// export const GetOrderDetail = ({ orderId }) => {
//     const params = new URLSearchParams()
//     for (const key in params) {
//         params.append(key, params[key]);
//     }
//     return request.get('/order/detail',  {
//         //key: value  key固定写法 params 参数对象
//         params: {
//             orderId: orderId
//         }
//     }).then(function(res) {localStorage.setItem('orderDetail', JSON.stringify(res.data))})
// }

export const GetOrderDetail = ({ orderId }) => request.get('/order/detail', {
    params: {
        orderId: orderId,
    }
})

export const UpdateStatus = ({ orderId, status }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/order/updateStatus', { orderId, status})
}

export const DeleteOrder = ({ orderId }) => {
    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.post('/order/delete', { orderId })
}