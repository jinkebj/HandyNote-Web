<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-logo">
        <span class="login-logo-strong">Handy</span> Note
      </div>

      <div class="login-box-body">
        <el-row class="login-box-msg">
          Sign in to your account
        </el-row>

        <el-row class="login-box-row">
          <el-input placeholder="Username">
            <template slot="prepend"><i class="material-icons">person</i></template>
          </el-input>
        </el-row>

        <el-row class="login-box-row">
          <el-input type="password" placeholder="Password">
            <template slot="prepend"><i class="material-icons">vpn_key</i></template>
          </el-input>
        </el-row>

        <el-row type="flex" justify="end" class="login-box-row">
          <el-button type="primary" @click="$router.replace('/dashboard')">Sign In</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style>
.login-page {
  height: 100vh;
  background: #EFF3F8;

  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 450px;
}

.login-logo {
  color: #444;
  font-size: 32px;
  text-align: center;
  margin-bottom: 25px;
  font-weight: 100;
  text-shadow: 5px 5px 15px #000000;
}

.login-logo-strong {
  font-weight: 500;
}

.login-box-body {
  background: #fff;
  padding: 20px;
  box-shadow: 5px 5px 5px #888888;
  color: #666;
}

.login-box-msg {
  text-align: center;
  padding: 20px 20px 30px 20px;
}

.login-box-row {
  padding: 0px 20px 20px 20px;
}
</style>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>
