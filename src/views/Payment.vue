<script setup>

import {CaretBottom, EditPen, SwitchButton} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ElMessageBox} from "element-plus";
import {GetOrderDetail, GetOrderList, UpdateStatus} from "@/api/order.js";
import { useUserStore } from '@/stores'
import { useCartStore } from '@/stores'
import { useOrderStore} from "@/stores";
import { useImageStore } from '@/stores/index.js';
const imageStore = useImageStore();
const imgList = imageStore.imgList;
const orderStore = useOrderStore();
const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()
const username = JSON.parse(JSON.stringify(userStore.username))
// const orderDetail = Array(JSON.parse(JSON.stringify(orderStore.orderDetail)))
const orderDetail = ref([])
const itemDetail = ref([])
const orderId = JSON.parse(JSON.stringify(orderStore.orderId))
const cartTotalPrice= cartStore.totalPrice
const loading = ref(false)
const isLoading = ref(true)
// const selectionData = JSON.parse(localStorage.getItem("selectedData"))
//
// const userInfo = JSON.parse(localStorage.getItem("userInfo"))

const MyCart = async () => {
  router.push('/onlineShopping/cart')
}

const Home = async () => {
  router.push('/onlineShopping')
}

const pay = async () => {
  const status = 20
  orderStore.paid = true
  await UpdateStatus({orderId , status})
  router.push('/onlineShopping/paymentDone')
}

const MyOrders = async () => {
  router.push('/onlineShopping/order/list')
}

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('Are you sure you want to Logout?' , 'Caution', {
      type: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    })

    // 清除本地的数据 (token + user信息)
    localStorage.removeItem('token')
    userStore.token = ''
    userStore.username = ''
    userStore.userInfo = []
    // localStorage.removeItem('userInfo')
    router.push('/onlineShopping/user/login')

  } else {
    router.push(`/onlineShopping/user/${key}`)
  }
}

// const totalPrice = async () => {
//   cartTotalPrice.value = 0
//
//   orderDetail[0].itemsDetails.forEach(item => {
//     cartTotalPrice.value +=  item.totalPrice;
//   })
// }

const getOrderDetail = async () => {
  await orderStore.getOrderDetail({orderId})
  orderDetail.value = Array(JSON.parse(JSON.stringify(orderStore.orderDetail)))
  itemDetail.value = orderDetail.value[0].itemsDetails
  isLoading.value = false
}

const cancelOrder = async (orderId) => {
  const status=0
  orderStore.paid = false
  await UpdateStatus({orderId , status})
  await getOrderDetail()
  router.push("/onlineShopping/confirmOrder")
}


onMounted(()=>{

  getOrderDetail()
  // totalPrice()
})

</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loader"></div>
  </div>
  <el-container class="layout-container" v-else>
    <el-header>
      <div>
        Hello! <strong>{{
          username
        }}</strong>
      </div>
      <img src="../assets/logo.png" @click="Home" :style="{ width: 'auto', height: '70px' }" >
      <div style="display: flex; align-items: center;">

        <el-link v-if="username!==''" @click="MyCart">My Cart </el-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-link v-if="username!==''" @click="MyOrders">My Orders </el-link>
        <el-dropdown v-if="username!==''" placement="bottom-end" @command="handleCommand"  >
          <!-- 展示给用户，默认看到的 -->

          <span class="el-dropdown__box">
                  <el-icon><CaretBottom /></el-icon>
              </span>

          <!-- 折叠的下拉部分 -->
          <!-- 在图像下面有一个下拉框 -->
          <template #dropdown>
            <el-dropdown-menu>
              <!--            <el-dropdown-item command="profile" :icon="User"-->
              <!--            >基本资料</el-dropdown-item-->
              <!--            >-->
              <el-dropdown-item command="updatePwd" :icon="EditPen"
              >Reset Password</el-dropdown-item
              >
              <el-dropdown-item command="updateAddr" :icon="EditPen"
              >Reset Address</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
              >Logout</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <div class="cart-contain">
      <div class="cart-table-container">
        <div class="cart-filter-bar">
          <span class="switch-cart">Payment</span>

        </div>
        <el-steps
            style="width: 100%; margin: 50px 0px 20px 0px"
            :active="1"
            finish-status="success"
            align-center
        >
          <el-step title="Confirm your Order" />
          <el-step title="Payment" />
          <el-step title="Done" />
        </el-steps>
        <div class="cart-filter-bar-sub" >
          <span class="switch-cart-sub">Order id: {{ orderId }}</span>
        </div>
        <div class="cart-list-content" >
          <el-table
              ref="cartTable"
              :data="orderDetail"
              v-loading="loading"
              size="default"
              style="width: 95%; margin: 0px 0px 30px 20px"
              border="border"
          >

            <el-table-column label="Receiver" width="100" prop="receiverName"></el-table-column>
            <el-table-column label="Receiver Phone" width="150" prop="receiverPhone"></el-table-column>
            <el-table-column label="Receiver Address" prop="receiverAddress"></el-table-column>
            <el-table-column label="Created Time" width="180" prop="createdTime"></el-table-column>

<!--            <el-table-column type="expand" prop="itemsDetails">-->
<!--              <template v-slot:default="scope">-->
          </el-table>
          <el-table
            ref="item"
            :data="itemDetail"
            v-loading="loading"
            size="default"
            style="width: 95%; margin: 0px 0px 30px 20px"
            border
          >
            <el-table-column label="Item Image">
              <template v-slot:default="scope">
                <el-image
                    :src="imgList[scope.row.goodId].src"
                    style="width: 120px; height: 120px"
                >

                </el-image>
              </template>
            </el-table-column>
            <el-table-column label="Item Name"  prop="goodName"> </el-table-column>
            <el-table-column label="Specification"  >
<!--              <div  >-->
                <template style="display: flex; align-items: center;" v-slot:default="scope">
                  <el-row v-for="(valueItem,index) in scope.row.specList" >
                    {{ valueItem.specItem }}
                  </el-row>
                </template>
<!--              </div>-->

            </el-table-column>
            <el-table-column label="Quantity" width="110" prop="quantity"></el-table-column>
            <el-table-column label="Total Price" width="100">
              <template v-slot:default="scope">
                <span>{{ scope.row.totalPrice }}</span>
              </template>
            </el-table-column>

          </el-table>
<!--              </template>-->
<!--            </el-table-column>-->
          <div class="cart-filter-bar-bottom">
            <div class="bar-bottom-left">
              <el-link @click="cancelOrder(orderId)">← Back</el-link>
            </div>
            <div class="cart-sum">
              <span class="total-text">Total：</span>
              <span class="total-symbol">{{ cartTotalPrice }}</span>
              <div class="pay-btn-active" @click="pay">
                Pay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-footer>
      OnlineShop @2024 Created by Jamieson
    </el-footer>
  </el-container>
</template>

<style scoped>
@keyframes spinner {
  to { transform: rotate(360deg); }
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3eaf7c; /* Customize the color */
  border-radius: 50%;
  animation: spinner 1s linear infinite;
  margin: 100px auto; /* Center the spinner */
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full height of the viewport */
}
.layout-container {
  height: 100vh;
  margin: 50px 150px 0px 150px;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
    }

    .el-menu {
      border-right: none;
    }

  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }


  }
  .cart-contain {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .cart-table-container {
    width: 100%;
    border-radius: 25px;

    background: #fff;

    position: relative;
  }

  .cart-filter-bar {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .cart-filter-bar .switch-cart {
    overflow: hidden;
    color: #000;
    font-size: 24px;
    font-weight: 600;
    height: 50px;
    line-height: 50px;
  }
  .cart-filter-bar-sub {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .cart-filter-bar-sub .switch-cart-sub {
    overflow: hidden;
    color: #000;
    font-size: 18px;
    font-weight: 600;
    height: 50px;
    line-height: 50px;
  }
  .cart-list-content {
    padding-bottom: 30px;
    overflow-y: auto;
  }

  .cart-filter-bar .cart-sum {
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .cart-sum .total-symbol {
    font-weight: 400;
    margin-right: 12px;
    font-size: 24px;
    color: #ff5000;
  }

  /* 激活状态的支付按钮 */
  .cart-sum .pay-btn-active {
    width: 100px;
    height: 50px;
    line-height: 50px;
    color: #fff;
    background: #ff5000;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    font-size: 24px;
  }


  .inactive-btn {
    background: #aaa !important;
    color: #fff;
    cursor: not-allowed !important;
  }
  .cart-filter-bar-bottom {
    width: 95%;
    display: flex;
    justify-content: space-between;
    background: #fff;

  }

  .cart-filter-bar-bottom .bar-bottom-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 全选 */
  .cart-filter-bar-bottom .all-check {
    overflow: hidden;
    color: #000;
    height: 72px;
    line-height: 72px;
    font-size: 12px;
  }

  .cart-filter-bar-bottom .all-check .all-check-checkbox {
    margin-right: 10px;
  }

  /* 全部删除 */
  .cart-filter-bar-bottom .all-del {
    margin-left: 20px;
  }

  .cart-filter-bar-bottom .cart-sum {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  .cart-sum .pay-text {
    margin: 0 12px;
  }

  .cart-sum .total-text {
    margin: 0 0 0 12px;
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>