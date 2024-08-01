<script setup>

import {CaretBottom, EditPen, SwitchButton} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {ElMessageBox} from "element-plus";
import { useUserStore } from '@/stores'
import { useCartStore } from '@/stores'
import { useOrderStore} from "@/stores";
const orderStore = useOrderStore();
const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()
const username = JSON.parse(JSON.stringify(userStore.username))

const homepage = async () => {
  router.push("/onlineShopping")
}

const MyCart = async () => {
  router.push('/onlineShopping/cart')
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
    userStore.username = null
    userStore.userInfo = []
    // localStorage.removeItem('userInfo')
    router.push('/onlineShopping/user/login')

  } else {
    router.push(`/onlineShopping/user/${key}`)
  }
}


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
        <el-link v-if="username!==null" @click="MyCart">My Cart </el-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-link v-if="username!==null" @click="MyOrders">My Orders </el-link>
        <el-dropdown v-if="userId!==null" placement="bottom-end" @command="handleCommand"  >
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
          <span class="switch-cart">Your Order is on the Way!</span>

        </div>
        <el-steps
            style="width: 100%; margin: 50px 0px 50px "
            :active="3"
            finish-status="success"
            align-center
        >
          <el-step title="Confirm your Order" />
          <el-step title="Payment" />
          <el-step title="Done" />
        </el-steps>

      </div>
    </div>
    <div class="bar-bottom-left">
      <el-link @click="homepage">← Homepage</el-link>
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
  .el-footer {
         display: flex;
         align-items: center;
         justify-content: center;
         font-size: 14px;
         color: #666;
       }
}
</style>