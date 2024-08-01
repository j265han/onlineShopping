import {defineStore} from 'pinia'
import {GetCartPage} from "@/api/getCartPage.js";

export const useCartStore = defineStore(
    'cartInfo',{

        state: () => {
            return {
                selectedData: [],
                cartList: []
            }
        },

        actions: {

            async getCartList({userId}) {
                this.cartList = await GetCartPage({userId})
            },
        },

        persist: {
            key: 'cartStore',
            storage: sessionStorage,
            paths: null,
        },
    }
)