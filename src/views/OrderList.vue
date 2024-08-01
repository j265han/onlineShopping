<script setup>

import {CaretBottom, Close, CloseBold, Delete, EditPen, Money, SwitchButton} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ElMessageBox} from "element-plus";
import { UpdateStatus, GetOrderList, DeleteOrder} from "@/api/order.js";
import {CanceledError} from "axios";
import { useUserStore } from '@/stores'
import { useCartStore } from '@/stores'
import { useOrderStore} from "@/stores";
const orderStore = useOrderStore();
const cartStore = useCartStore()
const userStore = useUserStore()

const router = useRouter()
const username = JSON.parse(JSON.stringify(userStore.username))
const orderDetail = JSON.parse(JSON.stringify(orderStore.orderList))
const cartTotalPrice= ref(0.0)
const loading = ref(false)
const selectionData = JSON.parse(JSON.stringify(cartStore.selectedData))
const userInfo = JSON.parse(JSON.stringify(userStore.userInfo))
const userId = userInfo[0].id;
const homepage = async () => {
  router.push("/onlineShopping")
}

const stuList = {
  0:"Cancelled",
  10:"Unpaid",
  20:"Paid"
}

const MyCart = async () => {
  router.push('/onlineShopping/cart')
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

const getOrderDetail = async () => {
  await orderStore.getOrderList({userId})
}

const payment = async (orderId) => {
  orderStore.orderId = orderId
  router.push('/onlineShopping/payment')
}

const cancelOrder = async (orderId) => {
  await ElMessageBox.confirm('Are you sure you want to Cancel this order?' , 'Caution', {
    type: 'warning',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })
  const status=0
  await UpdateStatus({orderId , status})
  await getOrderDetail()
  location.reload();
}

const deleteOrder = async (orderId) => {
  await ElMessageBox.confirm('Are you sure you want to Delete this order?' , 'Caution', {
    type: 'warning',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })
  await DeleteOrder({orderId})
  await getOrderDetail()
  location.reload();
}

const totalPrice = async () => {
  cartTotalPrice.value = 0

  selectionData.forEach(item => {
    cartTotalPrice.value +=  item.price * item.quantity;
  })

}
getOrderDetail()
totalPrice()

function refreshWait(){
  setTimeout(refresh,300)
}

function refresh(){
  location.reload()
}
onMounted(()=>{

  if (location.href.indexOf("#reloaded") === -1) {
    location.href = location.href + "#reloaded";
    refreshWait();
  }
})

</script>

<template>
  <el-container class="layout-container">
    <el-header>
      <div>
        Hello! <strong>{{
          username
        }}</strong>
      </div>
      <div style="display: flex; align-items: center;">
        <el-link v-if="username!==null" @click="MyCart">My Cart </el-link>
        <el-dropdown v-if="username!==null" placement="bottom-end" @command="handleCommand"  >
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
      <div class="cart-table-container" >
        <div v-for="(item, index) in orderDetail">
          <div class="cart-filter-bar-sub" >
            <span class="switch-cart-sub">Order id: {{ orderDetail[index][0].orderId }}</span>
          </div>
          <div class="cart-list-content" >
            <el-table
                ref="cartTable"
                :data="item"
                v-loading="loading"
                size="default"
                style="width: 95%; margin: 0 auto"
                border
                :default-sort="{ prop: 'createdTime', order: 'descending' }"
            >

              <el-table-column label="Receiver" width="100" prop="receiverName"></el-table-column>
              <el-table-column label="Receiver Phone" width="150" prop="receiverPhone"></el-table-column>
              <el-table-column label="Receiver Address" prop="receiverAddress"></el-table-column>
              <el-table-column label="Status" width="100" >
                <template #default="{row}">
                  {{stuList[row.status]}}
                </template>
              </el-table-column>
              <el-table-column label="Created Time" width="180" prop="createdTime"></el-table-column>
              <el-table-column label="Operation" width="150">
                <el-button type="primary" :icon="Money" circle :disabled="orderDetail[index][0].status!==10" @click="payment(orderDetail[index][0].orderId)"></el-button>
                <el-button type="warning" :icon="CloseBold" circle :disabled="orderDetail[index][0].status!==10" @click="cancelOrder(orderDetail[index][0].orderId )"></el-button>
                <el-button type="danger" :icon="Delete" circle  @click="deleteOrder(orderDetail[index][0].orderId )"></el-button>
              </el-table-column>
              <el-table-column type="expand" prop="itemsDetails">
                <template v-slot:default="scope">
                  <el-table
                      ref="cartTable"
                      :data="scope.row.itemsDetails"
                      v-loading="loading"
                      size="default"
                      style="width: 95%; margin: 0 auto"
                      border
                      show-summary
                      sum-text="Total"
                  >
                    <el-table-column label="Item Image" width="250" prop="goodImage"></el-table-column>
                    <el-table-column label="Item Name"  prop="goodName"></el-table-column>

                    <el-table-column label="Quantity" width="110" prop="quantity"></el-table-column>
                    <el-table-column label="Total Price" width="100" prop="totalPrice"> </el-table-column>

                  </el-table>
                </template>
              </el-table-column>

            </el-table>

          </div>
        </div>

        <div class="cart-filter-bar-bottom">
          <div class="bar-bottom-left">
            <el-link @click="homepage">← Homepage</el-link>
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
  .el-footer {
         display: flex;
         align-items: center;
         justify-content: center;
         font-size: 14px;
         color: #666;
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
    max-height: 100vh;
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
}
</style>