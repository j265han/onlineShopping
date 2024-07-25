<script setup>

import {CaretBottom, EditPen, Search, SwitchButton} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import { SearchProductService} from "@/api/product.js";
import {AddToCart, ConfirmInfo} from "@/api/cart.js"
import {useRouter} from "vue-router";

const router = useRouter()
const isLogin = ref(false)
const userId = localStorage.getItem("username")
const userInfo = JSON.parse(localStorage.getItem("userInfo"))
const username = ref({
  username:userId
})

let num = ref(1)
let loading = ref(true)

const searchName = ref({
  categoryName:'',
  name:'',
})

const sku = ref(0)

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
  const res = await SearchProductService(searchName.value)
  router.push('/onlineShopping/home/search')

}

onMounted(() => {

  setTimeout(() => {
    loading.value = false
  }, 100)
})

const mockData = JSON.parse(localStorage.getItem("singleResult"))

const stock = mockData[0].stock
const info = ref({
  userId:'',
  goodId:mockData[0].id,
  quantity:'1'
})


const addCart = async () => {console.log(info.value.userId)
  if (localStorage.getItem('username')===null) {
    ElMessageBox.confirm(
        'Continue to Login?',
        'You have to Login first',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true,
        }
    )
        .then(()=>{router.push('/onlineShopping/user/login')})
        .catch()

  } else if (info.value.quantity > stock){
    ElMessage.error('Not Enough Stock')
  } else {
    info.value.goodId = mockData[sku.value].id
    info.value.userId = userInfo[0].id
    const {code, data} = await AddToCart(info.value)
      if(code === 1) {
        ElMessageBox.confirm(
            'Continue to Cart?',
            data,
            {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning',
              center: true,
            }
        )
            .then(()=>{router.push('/onlineShopping/cart')})
            .catch()
      }
  }
}

const toConfirmOrder = async () => {
  if (localStorage.getItem('username')===null) {
    ElMessageBox.confirm(
        'Continue to Login?',
        'You have to Login first',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true,
        }
    )
        .then(()=>{router.push('/onlineShopping/user/login')})
        .catch()
  } else if (info.value.quantity > stock) {
    ElMessage.error('Not Enough Stock')
  } else {
    mockData[sku.value].quantity = info.value.quantity
    localStorage.setItem('selectedData', JSON.stringify(Array(mockData[sku.value])))
    router.push('/onlineShopping/confirmOrder')
  }

}

</script>

<template>
  <el-container class="layout-container">
    <el-header >
      <div>
        Hello! <strong>{{
          userId
        }}</strong>
      </div>


      <div style="display: flex; align-items: center;">
        <el-link v-if="userId===null" @click="login">Login </el-link>
        <el-link  v-if="userId!==null" @click="MyCart">My Cart </el-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-link v-if="userId!==null" @click="MyOrders">My Orders </el-link>
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
    <el-row style="display: flex; justify-content: center; align-items: center;">
      <el-container class="search">
        <el-input
            v-model="searchName.name"
            style="max-width: 600px"
            placeholder="Please input"
            class="input-with-select"
        >
          <template #append>
            <el-button :icon="Search" @click="searchBar(); refreshWait" />
          </template>
        </el-input>
      </el-container>
    </el-row>
    <el-skeleton :loading="loading" animated>
      <template #default>
        <div class="detail_sku_box">
          <el-row >
            <el-col :span="20" >
              <div class="img_box"><img src="../assets/img_1.png" /></div>
            </el-col>
          </el-row>
          <el-col :span="14">

            <div>
              <h2>{{ mockData[sku].name }}</h2>
<!--              <h5>{{ skuItemInfo?.skuInfo?.skuSubtitle }}</h5>-->
              <div>
                <span >&dollar;{{ mockData[sku].price }}</span>
              </div>
              <div style="display: flex; align-items: center; margin-top: 20px; flex-wrap: wrap;">
                <div v-for="(item, index) in mockData" :key="index" >
                    <button @click="sku = index" class="sku" :class="{'active':index===sku}">
                      <el-row v-for="valueItem in item.specList" :key="valueItem.id" >
                        {{ valueItem.specItem }}&nbsp;
                      </el-row>
                    </button>
                </div>
              </div>
              <div style="margin-top: 30px">
                Stock:{{ mockData[sku].stock }}
              </div>
              <div style="margin-top: 30px">
                <el-input-number v-model="info.quantity"/>
              </div>
              <div style="margin-top: 50px">
                <button class="button button2" @click="addCart"><span>Add to Cart</span></button>
                <button class="button button2" @click="toConfirmOrder"><span>Buy</span></button>
              </div>
            </div>
          </el-col>
        </div>
      </template>
<!--      <template #template>-->
<!--        <div style="height: 100%">-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="7" :offset="1">-->
<!--              <el-skeleton-item variant="image" style="height: 500px"/>-->
<!--            </el-col>-->
<!--            <el-col :span="13" :offset="1">-->
<!--              <div>-->
<!--                <el-skeleton-item variant="text" style="width: 100%;height: 40px"/>-->
<!--                <el-skeleton-item variant="text" style="width: 100%;height: 40px;margin-top: 20px"/>-->
<!--                <div style="margin-top: 30px">-->
<!--                  <span class="price_class"><el-skeleton-item variant="text" style="height: 30px;width: 80%"/></span>-->
<!--                </div>-->
<!--                <div style="margin-top: 150px">-->
<!--                  <div v-for="item in 2" :key="item">-->
<!--                    <el-row :gutter="20">-->
<!--                      <el-col :span="3">-->
<!--                        <el-skeleton-item variant="text" style="height: 30px"/>-->
<!--                      </el-col>-->
<!--                      <el-col :span="3" v-for="(i) in 3" :key="i">-->
<!--                        <el-skeleton-item variant="text" style="height: 30px"/>-->
<!--                      </el-col>-->
<!--                    </el-row>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--      </template>-->
    </el-skeleton>

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
    margin: 20px 20px 20px 20px;
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

  .detail_sku_box {
    display: flex;
    height: 400px;
    /*background-color: #99a9bf;*/
  }

  .sku{
    width: auto;
    display: flex;
    align-items: center;
    margin: 0 10px 10px 0
  }
  .sku:focus{
    background: #288FC7;
  }
  .active{
    background: #288FC7;
  }

  .button {
    width: 150px;
    height: 50px;
    background-color: #288FC7;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;
  }
  .button2:hover {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
    background-color: #1DAEEE;

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