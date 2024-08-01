<script setup>

import {CaretBottom, EditPen, Search, SwitchButton} from "@element-plus/icons-vue";
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {ElMessageBox} from "element-plus";

import {useProductStore} from "@/stores/index.js";
const productStore = useProductStore()
const router = useRouter()
const isLogin = ref(false)
const username = localStorage.getItem("username")

const searchName = ref({
  categoryName:'',
  name:'',
})

const login = async () => {
  isLogin.value = true
  router.push('/onlineShopping/user/login')
}

const MyCart = async () => {
  router.push('/onlineShopping/cart')
}

const MyOrders = async () => {
  router.push('/onlineShopping/order/list')
}

const mockData = JSON.parse(JSON.stringify(productStore.searchResult))

function refreshWait(){
  setTimeout(refresh,300)
}

function refresh(){
  location.reload()
}

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 清除本地的数据 (token + user信息)
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userInfo')
    router.push('/onlineShopping/user/login')

  } else {
    router.push(`/onlineShopping/user/${key}`)
  }
}

const searchBar = async () => {
  searchName.value.categoryName=null;
  // const res = await SearchProductService(searchName.value)
  await productStore.getSearchResult(searchName.value)
  router.push('/onlineShopping/home/search')

}

const singleProduct = async (id) => {
  // const res = await SearchSingleProduct({id})
  await productStore.getSingleResult({id})
  console.log(productStore.singleResult)
  router.push('/onlineShopping/goods/search?id='+id)
}

</script>

<template>
  <el-container class="layout-container">
    <el-header >
      <div>
        Hello! <strong>{{
          username
        }}</strong>
      </div>

      <div style="display: flex; align-items: center;">
        <el-link v-if="username===null" @click="login">Login </el-link>
        <el-link v-if="username!==null" @click="MyCart">My Cart </el-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-link v-if="username!==null" @click="MyOrders">My Orders </el-link>
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
    <el-row style="display: flex; justify-content: center; align-items: center;">
      <el-container class="search">
        <el-input
            v-model="searchName.name"
            style="max-width: 600px"
            placeholder="Please input"
            class="input-with-select"
        >
          <template #append>
            <el-button :icon="Search" @click="searchBar(); refreshWait()" />
          </template>
        </el-input>
      </el-container>
    </el-row>
    <el-row style="margin-top: 20px">
      <ul v-for="(item,index) in mockData" style="list-style-type:none; padding: 0">
        <li class="item" @click="singleProduct(item.id)">
          <div class="img_box"><img v-bind:src="item.picture" alt=""></div>
          <p v-html="item.name"></p>
          <span >&dollar;{{item.price}}</span>
        </li>
      </ul>
    </el-row>
    <el-footer>
      OnlineShop @2024 Created by Jamieson
    </el-footer>
  </el-container>
</template>

<style scoped>
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
  .search {
    line-height: 50px;
    display: flex;
    justify-content: center;
  }
  .input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
  }
  .el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
    text-align: center;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  #app {
    width: 1000px;
    margin-left: 100px;
    margin-right: 0px;

  }


  .item {
    float: left;
    width: 190px;
    height: 266px;
    margin: 0 23px 8px;
    text-align: center;
    background: #e3e4e5;
  }

  .item .img_box {
    width: 120px;
    height: 120px;
    margin: 30px auto;
  }

  .img_box img {
    width: 100%;
    height: 100%;
  }

  .item p {
    font-size: 12px;
    line-height: 20px;
    height: 40px;
    padding: 0 10px;
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .more2_info_self {
    background-color: #e1251b;
    border-radius: 2px;
    color: #fff;
    padding: 0 5px;
    margin-right: 4px;
    line-height: 16px;
    height: 16px;
    font-size: 12px;
    font-style: normal;
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