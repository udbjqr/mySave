<template>
    <div class="work">
        <div class="title">
            <div class="el-row">
                <div class="grid-content bg-purple-dark">工作<mt-button icon="search"></mt-button></div>
            </div>
        </div>
        <div class="Taskagents faqiliuc" @click="Initiate()">
            <div class="el-row">
                <div class="el-row15">
                     <img src="../assets/daiban.png" class="listimg"/>
                </div>
                <div class="el-row75">
                     <div class="listcom">
                       <p>发起流程</p>
                       <span>有5条代办流程</span>
                     </div>
                </div>
                <div class="el-row10"><i class="mint-cell-allow-right"></i></div>
            </div>
        </div>

        <div class="Taskagents" @click="Tudolist">
            <div class="el-row">
                <div class="el-row15">
                     <img src="../assets/wancheng.png" class="listimg"/>
                </div>
                <div class="el-row75">
                     <div class="listcom">
                       <p>代办任务</p>
                       <span>有5条代办流程</span>
                     </div>
                </div>
                <div class="el-row10"><i class="mint-cell-allow-right"></i></div>
            </div>
        </div>
        <div class="Taskagents" @click="historyTask">
            <div class="el-row">
                <div class="el-row15">
                     <img src="../assets/wofaqi.png" class="listimg"/>
                </div>
                <div class="el-row75">
                     <div class="listcom">
                       <p>已完成流程</p>
                       <span>已完成流程12条</span>
                     </div>
                </div>
                <div class="el-row10"><i class="mint-cell-allow-right"></i></div>
            </div>
        </div>
        <div class="Taskagents" @click="sponsorByMeTask">
            <div class="el-row">
                <div class="el-row15">
                     <img src="../assets/daiban.png" class="listimg"/>
                </div>
                <div class="el-row75">
                     <div class="listcom">
                       <p>我发起的流程</p>
                       <span>已完成流程12条</span>
                     </div>
                </div>
                <div class="el-row10"><i class="mint-cell-allow-right"></i></div>
            </div>
        </div>

        <mt-button type="primary" size="large" @click="gaogao()">小高页面</mt-button>


    </div>
</template>

<script>
import { Button } from 'mint-ui'
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
      Initiate(){
          this.$router.push({ path:'/Initiate' })
      },
      Tudolist:function(){
          this.$router.push({ path: '/todolist' })
      },
      gaogao(){
        this.$router.push({ path: '/selectNextNode' })
      },
      historyTask(){
          this.$router.push({ path: '/historyTask' })
      },
      sponsorByMeTask(){
          this.$router.push({ path: '/sponsorByMeTask'})
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.faqiliuc{margin-bottom: 0.2rem;}
</style>
