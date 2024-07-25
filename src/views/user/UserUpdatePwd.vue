<script setup>

import {Lock, User} from "@element-plus/icons-vue";
import { ref, watch } from 'vue'
import {userLoginService, userUpdatePwd} from "@/api/user.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import Home from "@/views/Home.vue";

const form = ref()
const token =localStorage.getItem('token')

const formModel = ref({
  oldPwd: '',
  newPwd: '',
  rePwd: ''
})

const confirm = async () => {
  await form.value.validate()

  // const res = await userLoginService(formModel.value)
  // alert(res.message)

  const {code, data, message} = await userUpdatePwd(formModel.value)

  if(code === 0){
    ElMessage.error(message)
  } else {
    ElMessage.success(message)
  }

  router.push('/onlineShopping')
}

const home = async () => {
  router.push('/onlineShopping')
}

const rules = {
  newPwd: [
    { required: true, message: 'Please enter the password', trigger: 'blur' },
    {
      min:8,
      message: 'The password must be 8 or more characters',
      trigger: 'blur'
    }
  ],
  rePwd: [
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
</script>

<template>
  <el-row class="login-page" >
    <!--左边的大事件的图片-->
    <!--    <el-col :span="12" class="bg"></el-col>-->
    <el-col :span="5" :offset="3" class="form">
      <el-form
          :rules="rules"
          :model="formModel"
          ref="form"
          size="large"
          autocomplete="off"
          :headers="{'Authorization': token}"
      >
        <el-link type="info" :underline="false" @click="home">
          ← Back
        </el-link>
        <el-form-item >
            <h1>Update Password</h1>
        </el-form-item>
        <el-form-item prop="oldPwd">
          <el-input
              v-model="formModel.oldPwd"
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="Old Password"
              show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPwd">
          <el-input
              v-model="formModel.newPwd"
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="New Password"
              show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePwd">
          <el-input
              v-model="formModel.rePwd"
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="Re-enter Password"
              show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              @click="confirm"
              class="button"
              type="primary"
              auto-insert-space
          >Confirm</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  display: flex;
  justify-content: center;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    margin-left: 0;
    ::v-deep .el-form-item__content {
      justify-content: center;
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