import { createRouter, createWebHistory} from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import UpdatePwd from "@/views/user/UserUpdatePwd.vue"
import UpdateAddr from "@/views/user/UserUpdateAddr.vue"
import SearchBar from "@/views/List.vue";
import Single from "@/views/Single.vue"
import Cart from "@/views/Cart.vue"
import ConfirmOrder from "@/views/ConfirmOrder.vue"
import Payment from "@/views/Payment.vue"
import OrderList from "@/views/OrderList.vue"
import PaymentDone from "@/views/PaymentDone.vue"

const routes = [
    {path: "/onlineShopping/user/login", component: Login},
    {
        path: "/onlineShopping",
        component: Home,
        // children: [
        //     {
        //         path: "/home/search"
        //     }
        // ]
    },
    {path: "/onlineShopping/user/updatePwd", component: UpdatePwd},
    {path: "/onlineShopping/user/updateAddr", component: UpdateAddr},
    {path: "/onlineShopping/home/search/", component: SearchBar},
    {path: "/onlineShopping/goods/search/", component: Single},
    {path: "/onlineShopping/cart", component: Cart},
    {path: "/onlineShopping/confirmOrder", component: ConfirmOrder},
    {path: "/onlineShopping/payment", component: Payment},
    {path: "/onlineShopping/order/list", component: OrderList},
    {path: "/onlineShopping/paymentDone", component: PaymentDone},
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;
