import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { userGetInfoService } from '../../api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
    'big-user',
    () => {
        const token = ref('')
        const setToken = (newToken) => {
            token.value = newToken
        }

        const removeToken = () => {
            token.value = ''
        }

        //当退出登录时，要进行置空
        const user = ref({})

        // const getUser = async () => {
        //     const res = await userGetInfoService() // 请求获取数据
        //     user.value = res.data.data
        // }

        const setUser = (obj) => {
            user.value = obj
        }

        return {
            token,
            setToken,
            removeToken,
            user,
            // getUser,
            setUser
        }
    },
    {
        persist: true
    }
)