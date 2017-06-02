<template>
    <div class="Message">
        <div class="title">
            <div class="el-row">
                <div class="el-row"><div class="grid-content bg-purple-dark">消息<mt-button icon="search"></mt-button></div></div>
            </div>
        </div>
        <div class="Taskagents" @click="Tudolist">
            <div class="el-row">
                <div class="el-row15">
                     <img src="../assets/daiban.png" class="listimg"/>
                     <div class="yuandiandian">{{daiban}}</div>
                </div>
                <div class="el-row75">
                     <div class="listcom">
                       <p>代办任务(5)</p>    
                       <span>有5条代办流程</span>
                     </div>  
                </div>
                <div class="el-row10"><i class="mint-cell-allow-right"></i></div>
            </div>
        </div>
        <div class="Taskagents" @click="Tudolist">
            <div class="el-row">
                <div class="el-row15">
                     <img src="../assets/daiban.png" class="listimg"/>
                     <div class="yuandiandian">{{weidu}}</div>
                </div>
                <div class="el-row75">
                     <div class="listcom">
                       <p>消息提醒(12)</p>    
                       <span>有12条新消息未读</span>
                     </div>  
                </div>
                <div class="el-row10"><i class="mint-cell-allow-right"></i></div>
            </div>
        </div>
        {{ $route.params.id }}
    </div> 
</template>

<script>
import { Cell,Button } from 'mint-ui'
import Vue from 'vue'
export default {
  name: 'message',
  components:{
      [Cell.name]:Cell,
      [Button.name]: Button
    },
  data () {
    return {
        daiban:'5',
        weidu:'12'
    }
  },
  methods:{
      Tudolist:function(){
          this.$router.push({ path: '/todolist' })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.title .grid-content{text-align: center;font-size: 0.4rem;background:#3699FC;color:#fff;line-height: 1rem;position:relative;}
.title .grid-content button{background: none;border: 0;position: absolute;right: 0.1rem;top:0.12rem;box-shadow:0 0 0;}
.title .grid-content button i{color:#fff;}
.title .grid-content button span{color:#fff;}
.Taskagents{border-bottom: 1px solid #D0CFD4;overflow: hidden;}
.Taskagents .el-row{font-size: 0.3rem;background:#FFFFFF;height: 1rem;}
.listimg{height: 0.7rem;margin: 0.15rem;}
.listcom{width: 100%;height: 0.8rem;line-height: 0.45rem;margin: 0.1rem 0;}
.listcom p{font-size: 0.35rem;}
.listcom span{color:#999;font-size: 0.25rem;}
.yuandiandian{height: 0.25rem;width:0.25rem;position: absolute;right: 0;top:0.1rem;border-radius:100%;background: #CB0101;font-size: 0.1rem;color:#fff;line-height: 0.25rem;text-align: center;}
.el-row{width: 100%;position: relative;}
.el-row10{width: 10%;height:100%;position: relative;float: left;}
.el-row15{width: 15%;float: left;position: relative;}
.el-row30{width: 30%;float: left;position: relative;}
.el-row40{width: 40%;float: left;position: relative;}
.el-row50{width: 50%;float: left;position: relative;}
.el-row60{width: 60%;float: left;position: relative;}
.el-row70{width: 70%;float: left;position: relative;}
.el-row75{width: 75%;float: left;position: relative;}
.el-row85{width: 85%;float: left;position: relative;}
.el-row90{width: 90%;float: left;position: relative;}
</style>