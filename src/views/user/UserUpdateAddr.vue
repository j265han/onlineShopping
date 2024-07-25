<script setup>

import {Lock, Cellphone, HomeFilled} from "@element-plus/icons-vue";
import { ref, watch } from 'vue'
import {userLoginService, userUpdateAddr, userUpdatePwd} from "@/api/user.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import Home from "@/views/Home.vue";

const form = ref()
const token =localStorage.getItem('token')
const username =localStorage.getItem('username')

const formModel = ref({
  address: '',
  phoneNo: '',
  username: ''
})

const confirm = async () => {
  await form.value.validate()
  formModel.value.username = username

  // const res = await userLoginService(formModel.value)
  // alert(res.message)

  const {code, data, message} = await userUpdateAddr(formModel.value)

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
  address: [
    { required: true, message: 'Please enter new address', trigger: 'blur' },
    {
      min:8,
      message: 'The password must be 8 or more characters',
      trigger: 'blur'
    }
  ],
  phoneNo: [
    { required: true, message: 'Please enter new phone No.', trigger: 'blur' },
    {

      message: 'The format is wrong',
      trigger: 'blur'
    }
  ],
}

</script>

<template>
  <el-row class="login-page" >
    <!--左边的大事件的图片-->
    <!--    <el-col :span="12" class="bg"></el-col>-->
    <el-col :span="5" :offset="3" class="form">
      <el-form

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
          <h1>Update Address</h1>
        </el-form-item>
        <el-form-item prop="address">
          <el-input
              v-model="formModel.address"
              :prefix-icon="HomeFilled"
              placeholder="Address"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phoneNo" >
          <el-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formModel.phoneNo"
              :prefix-icon="Cellphone"
              placeholder="Phone No."
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