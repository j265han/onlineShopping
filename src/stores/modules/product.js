import { defineStore } from 'pinia'
import { ref } from 'vue'
import {SearchProductService, SearchSingleProduct} from "@/api/product.js";

export const useProductStore = defineStore(
    'productInfo',{
        state: () => {
            return {
                searchResult: [],
                singleResult: []
            }


        },
        actions: {
            async getSearchResult({categoryName, name}) {
                const res = await SearchProductService({categoryName, name})
                this.searchResult = res.data
            },

            async getSingleResult({id}) {
                const res = await SearchSingleProduct({id})
                this.singleResult = res.data
            },
        },
        persist: {
            key: 'productStore',
            storage: sessionStorage,
            paths: null,
        },
    }

)