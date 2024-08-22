import { defineStore } from 'pinia'
import {BuildOrder, BuildOrderDirect, GetOrderDetail, GetOrderList} from "@/api/order.js";

export const useOrderStore = defineStore(
    'orderInfo',{
        state: () => {
            return {
                paid: true,
                orderId: '',
                orderList: [],
                orderDetail: []
            }


        },
        actions: {
            async buildOrderGetId({ userId, receiverName, receiverPhone, receiverAddress, goodId }) {
                const res = await BuildOrder({ userId, receiverName, receiverPhone, receiverAddress, goodId })
                this.orderId = res.data
            },

            async buildOrderDirectGetId({ userId, receiverName, receiverPhone, receiverAddress, goodId, quantity }) {
                const res = await BuildOrderDirect({ userId, receiverName, receiverPhone, receiverAddress, goodId, quantity })
                this.orderId = res.data
            },

            async getOrderList({ userId }) {
                const res = await GetOrderList({ userId })
                this.orderList = res.data
            },

            async getOrderDetail({ orderId }) {
                const res = await GetOrderDetail({ orderId })
                this.orderDetail = res.data
            },

        },
        persist: {
            key: 'orderStore',
            storage: sessionStorage,
            paths: null,
        },
    }

)