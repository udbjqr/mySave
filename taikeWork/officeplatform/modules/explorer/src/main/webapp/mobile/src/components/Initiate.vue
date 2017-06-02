<template>
    <div class="work">
        <div class="title">
           <div class="el-row">
               <div class="grid-content bg-purple-dark"><mt-button icon="back" class="back" @click="back"></mt-button>发起流程<mt-button icon="search"></mt-button></div>
            </div>
        </div>
         <div class="MyTaskagents" v-for="item in inititem" @click="initiatecom(item.process_key)">
           <div class="el-row">
                <div class="el-row90"><div class="grid-content bg-purple-dark" style="line-height:1rem;text-indent:0.1rem;">
                        {{item.process_name}}
                    </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="el-icon-arrow-right"></i></div></div>
            </div>
        </div>

        
        
    </div> 
</template>

<script>
import { Button,Toast } from 'mint-ui'
export default {
  name: 'message',
  components: {
    [Button.name]: Button
  },
  data () {
    return {
        inititem:""
    }
  },
  methods:{
      back(){
          this.$router.go(-1);
      },
      initiatecom(key){
          console.log(key);
           var thisrouter =  this.$router;
          this.$http({
            method: 'post',
            url: '/officedyanmic/processManger.do',
            params:{paramMap:{"controlType" : "startProcess","processKey":key}},
            headers: {"X-Requested-With": "XMLHttpRequest"},
          })
        .then(function (response) {
              
              if(response.data.success){
                  if(response.data.success){
                      Toast({
                          message: key+'发起成功',
                      });
                  }else if(response.data.code == "0"){
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
        //   this.$router.push({path:'/initiatecom'})
      },
      initdata(){
          var that = this;
           var thisrouter =  this.$router;
          this.$http({
            method: 'post',
            url: '/officedyanmic/processManger.do',
            params:{paramMap:{"controlType" : "queryProcess"}},
            headers: {"X-Requested-With": "XMLHttpRequest"},
          })
        .then(function (response) {
              
              if(response.data.success){
                  console.log(response.data.values);
                  that.inititem = response.data.values;
              }else if(response.data.code == "1"){
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
      this.initdata();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.faqiliuc{margin-bottom: 0.2rem;}
.back{position: absolute;left: 0.2rem;top:0.2rem;}
</style>