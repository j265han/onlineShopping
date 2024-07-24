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
    {path: "/user/login", component: Login},
    {
        path: "/",
        component: Home,
        // children: [
        //     {
        //         path: "/home/search"
        //     }
        // ]
    },
    {path: "/user/updatePwd", component: UpdatePwd},
    {path: "/user/updateAddr", component: UpdateAddr},
    {path: "/home/search/", component: SearchBar},
    {path: "/goods/search/", component: Single},
    {path: "/cart", component: Cart},
    {path: "/confirmOrder", component: ConfirmOrder},
    {path: "/payment", component: Payment},
    {path: "/order/list", component: OrderList},
    {path: "/paymentDone", component: PaymentDone},
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;
