import { defineStore } from 'pinia'
import {SearchProductService, SearchSingleProduct} from "@/api/product.js";

export const useUserStore = defineStore(
    'userInfo',{

        state: () => {
            return {
                token: '',
                username: '',
                userId: '',
                userInfo: []
            }
        },

        actions: {
            // async getSearchResult({categoryName, name}) {
            //     const res = await SearchProductService({categoryName, name})
            //     this.searchResult = res.data
            // },
            //
            // async getSingleResult({id}) {
            //     const res = await SearchSingleProduct({id})
            //     this.singleResult = res.data
            // },
        },

        persist: {
            key: 'userStore',
            storage: sessionStorage,
            paths: null,
        },
    }
)