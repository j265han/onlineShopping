<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import {userRegisterService, userLoginService} from "@/api/user.js";
import {useRouter, useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {useProductStore, useUserStore} from '@/stores'
import {ConfirmInfo} from "@/api/getCartPage.js";
const userStore = useUserStore()
const productStore = useProductStore()
const isRegister = ref(false)

//获取整个表单的信息，进行统一的校验
//只有信息都输入正确后，才能进行注册的
const form = ref()

// 整个的用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
  // repassword: ''
})

const rules = {
  username: [
    { required: true, message: 'Please enter the username', trigger: 'blur' },
    { min: 6, max: 10, message: 'The username must be 6-10 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter the password', trigger: 'blur' },
    {
      min:8,
      message: 'The password must be 8 or more characters',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      message: 'The password must be 8 or more characters',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('Re-enter password doesn\'t match'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

const home = async () => {
  const redirectPath = route.query.redirect || '/';
  router.push(redirectPath)
  // router.push('/onlineShopping')
}

const register = async () => {
  await form.value.validate()
  const res = await userRegisterService(formModel.value)
  alert(res.message)
  isRegister.value = false
  router.push('/onlineShopping/user/login')
}

const router = useRouter()
const route = useRoute()

const login = async () => {
  await form.value.validate()

  // const res = await userLoginService(formModel.value)
  // alert(res.message)

  const {code, data, message} = await userLoginService(formModel.value)
  let token = data
  if(code === 0){
    ElMessage.error(message)
  } else {
    ElMessage.success(message)
    userStore.token = token
    userStore.username = formModel.value.username
    localStorage.setItem('token', token)
    const {data } = await ConfirmInfo({ username: formModel.value.username})
    // // localStorage.setItem("userInfo",JSON.stringify(data))
    userStore.userInfo = data
    // localStorage.setItem('username', formModel.value.username)
  }
  const redirectPath = route.query.redirect || '/';
  router.push(redirectPath)
  // if (productStore.singleResult != null){
  //
  //   router.push(`/onlineShopping/goods/search?id=${productStore.singleResult[0].id}`)
  // } else {
  //   router.push('/onlineShopping')
  // }

}



// 切换的时候，重置表单内容
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <!--
  1. 结构相关
  el-row表示一行，一行分成24份
  el-col表示列
  (1) :span="12"  代表在一行中，占12份 (50%)
  (2) :span="6"   表示在一行中，占6份  (25%)
  (3) :offset="3" 代表在一行中，左侧margin份数

  el-form 整个表单组件
  el-form-item 表单的一行 （一个表单域）
  el-input 表单元素（输入框）
  2. 校验相关
  (1) el-form => :model="ruleForm"      绑定的整个form的数据对象 { xxx, xxx, xxx }
  (2) el-form => :rules="rules"         绑定的整个rules规则对象  { xxx, xxx, xxx }
  (3) 表单元素 => v-model="ruleForm.xxx" 给表单元素，绑定form的子属性
  (4) el-form-item => prop配置生效的是哪个校验规则 (和rules中的字段要对应)
  -->
  <el-row class="login-page" >
    <!--左边的大事件的图片-->
<!--    <el-col :span="12" class="bg"></el-col>-->
    <el-col :span="5" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
          :model="formModel"
          :rules="rules"
          ref="form"
          size="large"
          autocomplete="off"
          v-if="isRegister"

      >
        <el-form-item>
          <h1>Register</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
              v-model="formModel.username"
              :prefix-icon="User"
              placeholder="Username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="Password"
              show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
              v-model="formModel.repassword"
              :prefix-icon="Lock"
              type="password"
              placeholder="Re-enter Password"
              show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              @click="register"
              class="button"
              type="primary"
              auto-insert-space
          >
            Register
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← Back
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form
          :rules="rules"
          :model="formModel"
          ref="form"
          size="large"
          autocomplete="off"
          v-else
      >
        <el-form-item >
          <div style="justify-content: center">
            <h1>Login</h1>
          </div>

        </el-form-item>
        <el-form-item prop="username">
          <el-input
              v-model="formModel.username"
              :prefix-icon="User"
              placeholder="Username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="formModel.password"
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="Password"
              show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>Remember me</el-checkbox>
            <el-link type="primary" :underline="false">Forgot Password？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
              @click="login"
              class="button"
              type="primary"
              auto-insert-space
          >Login</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-link type="info" :underline="false" @click="home">
              ← Back
            </el-link>
            <el-link type="info" :underline="false" @click="isRegister = true">
              Register →
            </el-link>
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  display: flex;
  //flex-direction: column;
  justify-content: center;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    margin-left: 0;
    :deep .el-form-item__content {
      justify-content: center;
    }
    .title {
      text-align: center;
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>