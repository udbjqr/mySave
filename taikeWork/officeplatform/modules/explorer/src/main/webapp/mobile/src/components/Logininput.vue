<template>
  <div class="hello">
    <div class="name">
      <img src="../assets/name.gif"/>
      <input v-model="name">
    </div>
    <div class="password">
      <img src="../assets/password.png"/>
      <input v-model="password" type="password">
    </div>
    <mt-button type="primary" v-on:click="login">登录</mt-button>
  </div>
</template>

<script>
import { Button,Toast } from 'mint-ui'
// import Vue from 'vue'
// Vue.use(Button.name, Button);
// Vue.component(Button.name, Button);
export default {
  name: 'logininput',
  components: {
    [Button.name]: Button
  },
  data () {
    return {
      name:'',
      password:'',
      ajaxbutton:true
    }
  },
  methods:{
    login:function(event){
      var ajaxbutton = this.ajaxbutton;
      if(ajaxbutton){
        ajaxbutton = false;
        const thisrouter = this.$router;
        const ajaxjson = JSON.stringify({controlType:"mangerLogin", "loginName": this.name, "passWord": this.password});
          if(this.name&&this.password){
            this.$http({
              method: 'post',
              url: '/officedyanmic/userLogin.do',
              params:{paramMap : ajaxjson},
              headers: {"X-Requested-With": "XMLHttpRequest"},
            })
              .then(function (response) {
                if(response.data.success){
                  Toast({
                    message: "登录成功",
                    position: 'bottom',
                    duration: 3000
                  });
                  thisrouter.push({ path: '/'})
                  document.cookie="id="+response.data.values.employeeId;
                }else{
                  Toast({
                    message: response.data.msg,
                    position: 'bottom',
                    duration: 3000
                  });
                  ajaxbutton = true;
                }
              
              })
              .catch(function (error) {
                console.log(error);
                ajaxbutton = true;
              });
          }else{
            this.$message({
              showClose: true,
              message: '请填写账号、密码',
              type: 'warning'
            });
            ajaxbutton = true;
          }
      }else{
        return false;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.name{width:4rem;height:0.8rem;margin: 0 auto;line-height: 0.8rem;border-radius:1rem;border:1px solid #fff;}
.name img {width:0.4rem;float:left;margin: 0.2rem 0.2rem;;}
.name input{float:left;width:3rem;height:100%;background:none;border:0;}
.password{width:4rem;height:0.8rem;margin: .2rem auto;line-height: 0.8rem;border-radius:1rem;border:1px solid #fff;}
.password img {width:0.4rem;float:left;margin: 0.2rem 0.2rem;;}
.password input{float:left;width:3rem;height:100%;background:none;border:0;}

.hello button{height: 0.7rem;width: 4rem;background:#3399ff;border-radius:1rem;}
</style>
