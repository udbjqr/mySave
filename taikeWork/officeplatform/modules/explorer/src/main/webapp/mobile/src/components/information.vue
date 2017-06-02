<template>
    <div class="work">
        <div class="title">
            <div class="el-row">
                <div class="grid-content bg-purple-dark"><mt-button icon="back" class="back" @click="back"></mt-button>个人信息</div>
            </div>
        </div>
         <div class="MyTaskagents">
            <div class="el-row">
                <div class="el-row15"><div class="grid-content bg-purple-dark" style="line-height:1rem;text-indent:0.1rem;">
                       头像
                    </div></div>
                <div class="el-row75"><div class="grid-content bg-purple-dark">
                    <div class="Mylistcom">
                        点击上传头像
                    </div>
                </div></div>
                <div class="el-row10">
                    <div class="grid-content bg-purple-dark" style="line-height:1rem;">
                         <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
        </div>  
       <div class="MyTaskagents">
            <div class="el-row">
                <div class="el-row15"><div class="grid-content bg-purple-dark" style="line-height:1rem;text-indent:0.1rem;">
                       姓名
                    </div></div>
                <div class="el-row75"><div class="grid-content bg-purple-dark">
                    <div class="Mylistcom">
                        {{information.real_name}}
                    </div>
                </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="el-icon-arrow-right"></i></div></div>
            </div>
        </div>  

        <div class="MyTaskagents">
            <div class="el-row">
                <div class="el-row30"><div class="grid-content bg-purple-dark" style="line-height:1rem;text-indent:0.1rem;">
                       登陆名
                    </div></div>
                <div class="el-row60"><div class="grid-content bg-purple-dark">
                    <div class="Mylistcom">
                        {{information.login_name}}
                    </div>
                </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="el-icon-arrow-right"></i></div></div>
            </div>
        </div>  
        <div class="MyTaskagents">
            <div class="el-row">
                <div class="el-row15"><div class="grid-content bg-purple-dark" style="line-height:1rem;text-indent:0.1rem;">
                       职位
                    </div></div>
                <div class="el-row75"><div class="grid-content bg-purple-dark">
                    <div class="Mylistcom">
                        {{information.position}}
                    </div>
                </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="el-icon-arrow-right"></i></div></div>
            </div>
        </div>  
        
        
    </div> 
</template>

<script>
import { Button,Toast } from 'mint-ui';
export default {
  name: 'message',
  components:{
      [Button.name]:Button
  },
  data () {
    return {
        information:{}
    }
  },
  methods:{
      back(){
          this.$router.go(-1);
      },
      getCookie(cookie_name){
            var allcookies = document.cookie;
            var cookie_pos = allcookies.indexOf(cookie_name);   
   
            if (cookie_pos != -1)
            {
                cookie_pos += cookie_name.length + 1; 
                var cookie_end = allcookies.indexOf(";", cookie_pos);
                if (cookie_end == -1)
                {
                    cookie_end = allcookies.length;
                }    
                var value = unescape(allcookies.substring(cookie_pos, cookie_end));
            }
            return value;
      },
      getmymessage(id){
        const that = this;
        const thisrouter = this.$router;
        const ajaxjson = JSON.stringify({controlType:"load", "employee_id": id});
          this.$http({
            method: 'post',
            url: '/officedyanmic/userManger.do',
            params:{paramMap : ajaxjson },
            headers: {"X-Requested-With": "XMLHttpRequest"},
          })
            .then(function (response) {
              if(response.data.success){
                that.information = response.data.values;
              }else if(response.data.code=="1"){
                  Toast({
                    message: response.data.msg,
                    position: 'bottom',
                    duration: 5000
                    });
                  thisrouter.push({ path: '/login'})
              }else{
                Toast({
                  message: response.data.msg,
                  position: 'bottom',
                  duration: 5000
                });
              }
            
            })
            .catch(function (error) {
              console.log(error);
            });
      }
  },
  mounted(){
      var a = this.getCookie("id");
      this.getmymessage(a);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.faqiliuc{margin-bottom: 0.2rem;}
.back{position: absolute;left: 0.2rem;top:0.2rem;}
</style>