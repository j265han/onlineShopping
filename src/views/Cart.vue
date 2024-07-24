<script setup>

import {CaretBottom, EditPen, SwitchButton} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ElMessageBox} from "element-plus";
import {DeleteOne, getCartPage} from "@/api/cart.js";


const router = useRouter()
const username = localStorage.getItem("username")
const userInfo = JSON.parse(localStorage.getItem("userInfo"))
const userId = userInfo[0].id
const cartList = JSON.parse(localStorage.getItem("cartList")) ;
const cartTotalPrice= ref(0.0)
const isAllChecked = ref(false)
const loading = ref(false)
const selectionData = ref()
const dataLength = ref(0)

const homepage = async () => {
  router.push("/")
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
    localStorage.removeItem('username')
    localStorage.removeItem('userInfo')
    router.push('/user/login')

  } else {
    router.push(`/user/${key}`)
  }
}

const getCart = async () => {
  const res = await getCartPage({userId})
}
getCart()

const MyOrders = async () => {
  router.push('/order/list')
}

const totalPrice = async () => {
  cartTotalPrice.value = 0
  console.log(selectionData.value)
  if(selectionData.value.length>0){
    selectionData.value.forEach(item => {
      cartTotalPrice.value +=  item.price * item.quantity;
    })
  }
}

const handleSelectionChange = async (data) => {
  console.log(data)
  selectionData.value = data

  await totalPrice();
}

const deleteOne = async (id) => {
  await ElMessageBox.confirm('Are you sure you want to Delete this item?' , 'Caution', {
    type: 'warning',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })

  await DeleteOne({id})
  await getCart()
  location.reload()
}

const toConfirmOrder = async () => {
  localStorage.setItem('selectedData', JSON.stringify(selectionData.value))
  router.push('/confirmOrder')
}

function refreshWait(){
  setTimeout(refresh,300)
}

function refresh(){
  location.reload()
}

onMounted(()=>{

  if (location.href.indexOf("#reloaded") === -1) {
    location.href = location.href + "#reloaded";
    refreshWait()
  }
})


</script>

<template>
  <el-container class="layout-container">
    <el-header >
      <div>
        Hello! <strong>{{
          username
        }}</strong>
      </div>
        <div style="display: flex; align-items: center;">&nbsp;&nbsp;&nbsp;&nbsp;
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
    <div class="cart-contain">
      <div class="cart-table-container">
        <div class="cart-filter-bar">
          <span class="switch-cart">MyCart( Total: {{ cartList.allCount }} )</span>
        </div>
        <div class="cart-list-content">
          <el-table
              ref="cartTable"
              :data="cartList.dataItems"
              v-loading="loading"
              size="default"
              style="width: 95%; margin: 0 auto"
              v-on:selection-change="handleSelectionChange"
              border="border"
          >
            <el-table-column
                type="selection"
                align="center"
                width="50"
            ></el-table-column>
            <el-table-column label="Picture" width="180">
              <template v-slot:default="scope">
                <el-image
                    src="../assets/img_1.png"
                    style="width: 120px; height: 120px"
                >
                  <div slot="placeholder" class="image-slot">
                    Loading<span class="dot">...</span>
                  </div>
                  <div slot="error" class="image-slot">
                    <el-image
                        style="width: 120px; height: 120px"
                        src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                    ></el-image>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
                label="Name"
                prop="name"
            ></el-table-column>
            <el-table-column label="Unit Price" prop="price"></el-table-column>
            <el-table-column label="Quantity" width="220" prop="quantity">
              <template v-slot:default="scope">
                <el-input-number
                    setp="1"
                    :min="1"
                    v-model="scope.row.quantity"
                    plain
                    v-on:change="totalPrice()"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="Total Price">
              <template v-slot:default="scope">
                <span>{{ scope.row.quantity * scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Operation" fixed="right" align="center">
              <template v-slot:default="scope">
                <el-button
                    size="default"
                    type="danger"
                    v-on:click="deleteOne(scope.row.id)"
                >Delete</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="cart-filter-bar-bottom">
            <div class="bar-bottom-left">
<!--              <span class="all-check">-->
<!--                <div>-->
<!--                  <el-checkbox-->
<!--                      class="all-check-checkbox"-->
<!--                      v-model="isAllChecked"-->
<!--                      v-on:change="checkAll"-->
<!--                  >Select All</el-checkbox-->
<!--                  >-->
<!--                </div>-->
<!--              </span>-->
<!--              <span class="all-del" v-show="isAllChecked">-->
<!--                <el-button type="danger" size="small" v-on:click="delAll"-->
<!--                >Delete</el-button-->
<!--                >-->
<!--              </span>-->
              <el-link @click="homepage">← Homepage</el-link>
            </div>
            <div class="cart-sum">
              <span class="pay-text">Selected Items</span>
              <span class="total-text">Total：</span>
              <span class="total-symbol">{{ cartTotalPrice }}</span>
              <div v-if="cartTotalPrice > 0" class="pay-btn-active" @click="toConfirmOrder">
                Confirm
              </div>
              <div v-else class="pay-btn-inactive">Confirm</div>
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
    min-height: calc(100vh - 130px);
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
    font-size: 18px;
    font-weight: 600;
    height: 50px;
    line-height: 50px;
  }
  .cart-list-content {
    max-height: 100vh;
    padding-bottom: 72px;
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
    width: 74px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background: #ff5000;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    font-size: 16px;
  }

  /* 未激活状态的支付按钮 */
  .cart-sum .pay-btn-inactive {
    width: 74px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background: #a3a3a3;
    border-radius: 21px;
    text-align: center;
    cursor: not-allowed;
    text-decoration: none;
    font-size: 16px;
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
    position: absolute;
    bottom: 0;
    background: #fff;
    z-index: 999;
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