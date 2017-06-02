<template>
    <div class="work">
        <div class="title" @click="information">
            <div class="el-row">
                <div class="grid-content bg-purple-dark">touxiang img</mt-button></div>
            </div>
        </div>
        <div class="MyTaskagents" @click="password">
            <div class="el-row">
                <div class="el-row90"><div class="grid-content bg-purple-dark" style="line-height:1rem;text-indent:0.1rem;">
                        修改密码
                    </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="mint-cell-allow-right"></i></div></div>
            </div>
        </div>

        <div class="MyTaskagents">
           <div class="el-row">
                <div class="el-row50"><div class="grid-content bg-purple-dark" style="line-height:1rem;text-indent:0.1rem;">
                       版本信息
                    </div></div>
                <div class="el-row40"><div class="grid-content bg-purple-dark">
                    <div class="Mylistcom">2016.12.22001</div>
                </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="mint-cell-allow-right"></i></div></div>
            </div>
        </div> 
        <div class="centerbutton">
             <mt-button type="primary" size="large" @click="loginout">退出</mt-button> 
        </div>
    </div> 
</template>

<script>
/*这是《我的》页面*/
import { Button,Toast } from 'mint-ui'
export default {
  name: 'message',
  components: {
    [Button.name]: Button
  },
  data () {
    return {
    }
  },
  methods:{
      password(){
          this.$router.push({ path:'/password' })
      },
      information(){
          this.$router.push({ path:'/information' })
      },
      loginout(){
          const thisrouter = this.$router;
          const that = this;
          this.$http({
            method: 'post',
            url: '/officedyanmic/loginOut.do',
            params:{systemExit : "0"},
            headers: {"X-Requested-With": "XMLHttpRequest"},
          })
            .then(function (response) {
              if(response.data.success){
                Toast({
                  message: "成功退出",
                  position: 'bottom',
                  duration: 5000
                });
                thisrouter.push({ path: '/login' });
                that.clearCookie("id");
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
      clearCookie($name){
            var myDate=new Date();    
            myDate.setTime(-1000);//设置时间    
            document.cookie=$name+"=''; expires="+myDate.toGMTString();                
      }        
  },
  mounted(){
      this.getCookie("id")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.MyTaskagents{border-bottom: 1px solid #D0CFD4;overflow: hidden;}
.MyTaskagents .el-row{font-size: 0.3rem;background:#FFFFFF;height: 1rem;}
.Mylistimg{height: 0.8rem;margin: 0.2rem;}
.Mylistcom{width: 100%;height: 0.8rem;line-height: 0.8rem;margin: 0.1rem 0;text-align: right;text-indent:0.2rem;color:#999;}
.centerbutton{height: 1rem;width: 100%;margin-top:1rem;text-align: center;}
</style>