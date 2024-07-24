import request from '@/utils/request'

export const SearchProductService = ({categoryName, name }) => {

    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }
    return request.get('/home/search',
        {
            //key: value  key固定写法 params 参数对象
            params: {
                //再写用户的参数
                name: name,
                categoryName: categoryName
            }
        }).then(function(res) {localStorage.setItem('searchResult', JSON.stringify(res.data))})
}

export const SearchSingleProduct = ({ id }) => {

    const params = new URLSearchParams()
    for (const key in params) {
        params.append(key, params[key]);
    }

    return request.get('/goods/search',
        {
            //key: value  key固定写法 params 参数对象
            params: {
                //再写用户的参数
                id: id,
            }
        }).then(function(res) {localStorage.setItem('singleResult', JSON.stringify(res.data))})
}
