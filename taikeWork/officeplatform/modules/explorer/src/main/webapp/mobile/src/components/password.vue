<template>
    <div class="work">
        <div class="title">
           <div class="el-row">
               <div class="grid-content bg-purple-dark"><mt-button icon="back" class="back" @click="back"></mt-button>修改密码<mt-button type="default">提交</mt-button></div>
            </div>
        </div>
      
        <mt-field placeholder="请输入原始密码" type="password"></mt-field>
        
        <mt-field placeholder="请输入新密码" type="password"></mt-field>
          
        <mt-field placeholder="请再次输入新密码" type="password"></mt-field>
         
    </div> 
</template>

<script>
import { Button,Toast,Field } from 'mint-ui'
export default {
  name: 'message',
  components:{
      [Button.name]:Button,
      [Field.name]: Field
  },
  data () {
    return {
    }
  },
  methods:{
      back(){
          this.$router.go(-1);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.faqiliuc{margin-bottom: 0.2rem;}
.back{position: absolute;left: 0.2rem;top:0.2rem;}
.passwordinput{width: 100%;height: 1rem;}
.passwordinput input{width: 94%;height: 0.6rem;margin: 0.2rem 3%;border: 0;}
.title label{color: #fff;}
</style>