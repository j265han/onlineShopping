<script setup>
import {
  Document,

  Menu as IconMenu,
  Location,
  Setting,
  EditPen,
  SwitchButton,
  CaretBottom, Search
} from '@element-plus/icons-vue'

import {onMounted, reactive, watch} from 'vue'
import { ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from "element-plus";
import {SearchProductService, SearchSingleProduct} from "@/api/product.js";
import {ConfirmInfo} from "@/api/getCartPage.js";
import carouselImg from "../assets/img_1.png";
import {useProductStore} from "@/stores/index.js";
const productStore = useProductStore()
import { useUserStore } from '@/stores'
const userStore = useUserStore()
// const {searchResult} = storeToRefs(productStore)
const router = useRouter()
const route = useRoute()
const isLogin = ref(false)
const categoryName = ref({})
const username = JSON.parse(JSON.stringify(userStore.username))
const searchName = ref({
  categoryName:'',
  name:'',
})

const imgList = [
  {src: new URL('../assets/img_1.png', import.meta.url).href},
  {src: new URL('../assets/img_1.png', import.meta.url).href},
  {src: new URL('../assets/img_1.png', import.meta.url).href},
]

const login = async () => {
  isLogin.value = true
  const previousPath = route.fullPath;
  router.push({
    path: '/onlineShopping/user/login',
    query: {redirect: previousPath}
  })
}

const MyCart = async () => {
  router.push('/onlineShopping/cart')
}

const MyOrders = async () => {
  router.push('/onlineShopping/order/list')
}


// const getUserInfo = async () => {
//   if(username !== '') {
//     const {data} = await ConfirmInfo({username})
//     // localStorage.setItem("userInfo",JSON.stringify(data))
//     userStore.userInfo = data
//   }
// }
// getUserInfo()

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
    userStore.token = ''
    userStore.username = ''
    userStore.userInfo = []
    // localStorage.removeItem('userInfo')
    router.push('/onlineShopping/user/login')

  } else {
    router.push(`/onlineShopping/user/${key}`)
  }
}

const created = async (categoryName) => {

  if (categoryName === null) {
    searchName.value.categoryName = null
  } else {
    searchName.value.categoryName = categoryName
  }
  // await SearchProductService(searchName.value)
  await productStore.getSearchResult(searchName.value)



}



onMounted(()=>{
  created('')

})


const mockData = JSON.parse(JSON.stringify(productStore.searchResult))

// const mockData = JSON.parse(localStorage.getItem("searchResult"))

const searchNav = async (categoryName) => {
  searchName.value.categoryName=categoryName;
  searchName.value.name=null;
  // const res = await SearchProductService(searchName.value)
  await productStore.getSearchResult(searchName.value)

 router.push('/onlineShopping/home/search')

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
        <el-link v-if="username===''" @click="login">Login </el-link>
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

    <!--路由来填充-->
<!--    <el-main>-->
      <el-row>
        <el-container class="search">
          <el-input
              v-model="searchName.name"
              style="max-width: 600px"
              placeholder="Please input"
              class="input-with-select"
          >
            <template #append>
              <el-button :icon="Search" @click="searchBar" />
            </template>
          </el-input>
        </el-container>
      </el-row>
      <el-row >

        <el-col :span="4" >
          <h5 class="mb-2"></h5>
          <el-scrollbar style="height: 93%;">
            <el-menu
                style="height: 300px"
                active-text-color="#ffd04b"
                background-color="#545c64"
                class="el-menu-vertical-demo"
                default-active="2"
                text-color="#fff"
                @open="handleOpen"
                @close="handleClose"
            >
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><icon-menu /></el-icon>
                  <span>Supplies</span>
                </template>
                <el-menu-item index="1-1" @click="searchNav('Pen')">Pen</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><icon-menu /></el-icon>
                  <span >Electronics</span>
                </template>

                <el-sub-menu index="2-1">
                  <template #title>Computer</template>
                  <el-menu-item index="2-1-1" @click="searchNav('Laptop')">Laptop</el-menu-item>
                  <el-menu-item index="2-1-2" @click="searchNav('Desktop')">Desktop</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2-2">
                  <template #title >Phone</template>
                  <el-menu-item index="2-2-1" @click="searchNav('iPhone')">iPhone</el-menu-item>
                  <el-menu-item index="2-2-2" @click="searchNav('iPhone')">iPhone</el-menu-item>
                </el-sub-menu>

                <el-menu-item index="2-3" @click="searchNav('Speaker')">Speaker</el-menu-item>
                <el-menu-item index="2-4" @click="searchNav('Earphone')">Earphone</el-menu-item>

              </el-sub-menu>
              <el-menu-item index="3" style="background-color: #545c64">
                <template #title >
                  <el-icon><icon-menu /></el-icon>
                  <span @click="searchNav('Clothes')">Clothes</span>
                </template>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-col>
        <el-col :span="15" style="margin: 22px 0px 0px 20px">
          <el-carousel height="300px">
            <el-carousel-item v-for="item in imgList" :key="item">
                <img :src="item.src" style="height: 100%; width:100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    <div style="margin-top: 30px; display: flex; justify-content: center; align-items: center;">
      <el-icon ></el-icon>
      <span > Suggested Items</span>
    </div>
    <el-row style="display: flex; justify-content: center; align-items: center;">

          <div id="app">
            <ul v-for="(item,index) in mockData" style="list-style-type:none; padding: 0">
              <li class="item" @click="singleProduct(item.id)">
                <div class="img_box"><img v-bind:src="item.picture" alt=""></div>
                <p v-html="item.name"></p>
                <span >&dollar;{{item.price}}</span>
              </li>
            </ul>
          </div>


    </el-row>
<!--    </el-main>-->
    <el-footer>
      OnlineShop @2024 Created by Jamieson
    </el-footer>
  </el-container>
</template>

<style lang="scss" scoped>

.layout-container {
  height: 100vh;
  margin:50px 150px 0px 150px;
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
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;

    //background: #e3e4e5;
  }


  .item {
    float: left;
    width: 190px;
    height: 266px;
    margin: 0 23px 23px;
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

  .el-footer {
       display: flex;
       align-items: center;
       justify-content: center;
       font-size: 14px;
       color: #666;
  }
}


</style>