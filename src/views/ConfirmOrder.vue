<script setup>

import {CaretBottom, EditPen, SwitchButton, User} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ElMessageBox} from "element-plus";

import { useUserStore } from '@/stores'
import { useCartStore } from '@/stores'
import { useOrderStore} from "@/stores";
import { useImageStore } from '@/stores/index.js';
const imageStore = useImageStore();
const imgList = imageStore.imgList;
const orderStore = useOrderStore();
const cartStore = useCartStore()
const userStore = useUserStore()

const isLoading = ref(true)
const router = useRouter()
const userId = localStorage.getItem("username")
const cartList = JSON.parse(localStorage.getItem("cartList")) ;
const cartTotalPrice= cartStore.totalPrice
const loading = ref(false)
const selectionData = JSON.parse(JSON.stringify(cartStore.selectedData))
const username = ref({
  username:userId
})
const userInfo = JSON.parse(JSON.stringify(userStore.userInfo))
const receiverInfo = ref({
  userId: userInfo[0].id,
  receiverName:userInfo[0].username,
  receiverPhone:userInfo[0].phoneNo,
  receiverAddress:userInfo[0].address,
  quantity:selectionData[0].quantity,
  goodId:[]
})
const rules = {
  receiverPhone: [
    {required: true, message: 'Please enter PhoneNo.', trigger: 'blur'},
  ],
  receiverAddress: [
    {required: true, message: 'Please enter Address', trigger: 'blur'},
  ]
}
const Home = async () => {
  router.push('/onlineShopping')
  orderStore.paid = true
}

const MyCart = async () => {
  router.push('/onlineShopping/cart')
  orderStore.paid = true
}

const MyOrders = async () => {
  router.push('/onlineShopping/order/list')
  orderStore.paid = true
}

// const getUserInfo = async () => {
//   const {data} = await ConfirmInfo(username.value)
//   localStorage.setItem("userInfo",JSON.stringify(data))
//
// }

const getGoodId = async () => {

  selectionData.forEach((item, index) => {
    receiverInfo.value.goodId[index]=item.specList[0].goodsId

  })
  isLoading.value = false
}

const handleCommand = async (key) => {
  orderStore.paid = true
  if (key === 'logout') {
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
//
// const getCart = async () => {
//   //localStorage.getItem('selectedData')
//   await totalPrice()
// }

// const totalPrice = async () => {
//   cartTotalPrice.value = 0
//
//   selectionData.forEach(item => {
//     cartTotalPrice.value +=  item.price * item.quantity;
//   })
// }

const buildOrder = async () => {
  if (receiverInfo.value.receiverPhone == null || receiverInfo.value.receiverAddress == null) {
    await ElMessageBox.confirm('Receiver PhoneNo. and Address cannot be empty', 'Warning', {
      type: 'warning',
      confirmButtonText: 'Ok',
    })
  } else {
    if (orderStore.paid === true) {
      if(selectionData[0].goodId!==undefined){
        // const {data} = await BuildOrder(receiverInfo.value)
        // localStorage.setItem('orderId', data)
        await orderStore.buildOrderGetId(receiverInfo.value)
      } else {

        // const {data} = await BuildOrderDirect(receiverInfo.value)
        // localStorage.setItem('orderId', data)
        await orderStore.buildOrderDirectGetId(receiverInfo.value)
      }
    }

    // localStorage.setItem('userInfo', JSON.stringify( receiverInfo.value))
    router.push('/onlineShopping/payment')
  }

}

// totalPrice()
// getUserInfo()

onMounted(()=>{
  getGoodId()

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
          userId
        }}</strong>
      </div>
      <img src="../assets/logo.png" @click="Home" :style="{ width: 'auto', height: '70px' }" >
      <div style="display: flex; align-items: center;">
        <el-link v-if="userId!==''" @click="MyCart">My Cart </el-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-link v-if="userId!==''" @click="MyOrders">My Orders </el-link>
        <el-dropdown v-if="userId!==''" placement="bottom-end" @command="handleCommand"  >
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
          <span class="switch-cart">Confirm your Order</span>

        </div>
        <el-steps
            style="width: 100%; margin: 50px 0px 50px "
            :active="0"
            finish-status="success"
            align-center
        >
          <el-step title="Confirm your Order" />
          <el-step title="Payment" />
          <el-step title="Done" />
        </el-steps>
        <div class="cart-filter-bar-sub">
          <span class="switch-cart-sub">Receiver Info</span>
        </div>
        <div class="cart-list-content">
          <el-form :model="receiverInfo" :rules="rules" ref="formRef" label-width="100px">
          <el-table
              :rules="rules"
              ref="cartTable"
              :data="userInfo"
              v-loading="loading"
              size="default"
              style="width: 95%; margin: 0 auto"
          >

            <el-table-column label="Receiver" width="180">
              <template v-slot:default>
                <el-input
                    v-model="receiverInfo.receiverName"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Phone No." width="180">
              <template v-slot:default>
                <el-input
                    v-model="receiverInfo.receiverPhone"  >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="Receiver Address" >
              <template v-slot:default>
                <el-input
                    v-model="receiverInfo.receiverAddress"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          </el-form>

          <div class="cart-filter-bar-bottom">
            <div class="bar-bottom-left">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-contain">
      <div class="cart-table-container">
        <div class="cart-filter-bar-sub">
          <span class="switch-cart-sub">Items Info</span>
        </div>
        <div class="cart-list-content">
          <el-table
              ref="cartTable"
              :data="selectionData"
              v-loading="loading"
              size="default"
              style="width: 95%; margin: 0 auto"
              border="border"
          >

            <el-table-column label="Picture" width="180">
              <template v-slot:default="scope">
                <el-image
                    :src="imgList[scope.row.specList[0].goodsId].src"
                    style="width: 120px; height: 120px"
                >
                </el-image>
              </template>
            </el-table-column>
            <el-table-column label="Name" prop="name"></el-table-column>
            <el-table-column label="Unit Price" prop="price"></el-table-column>
            <el-table-column label="Quantity" width="220" prop="quantity"> </el-table-column>

            <el-table-column label="Total Price">
              <template v-slot:default="scope">
                <span>{{ scope.row.quantity * scope.row.price }}</span>
              </template>
            </el-table-column>

          </el-table>

        </div>
        <div class="cart-filter-bar-bottom">
          <div class="bar-bottom-left">
            <el-link @click="MyCart">← Back</el-link>
          </div>
          <div class="cart-sum">
            <span class="total-text">Total：</span>
            <span class="total-symbol">{{ cartTotalPrice }}</span>
            <div class="pay-btn-active" @click="buildOrder">
              Confirm
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
  margin: 0px 150px 0px 150px;
  min-height: 100%;
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
    max-height: 100vh;
    padding-bottom: 30px;
    overflow-y: auto;


  }
  .el-form-item.custom-form-item .el-form-item__content  {
    margin-left: 0;
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