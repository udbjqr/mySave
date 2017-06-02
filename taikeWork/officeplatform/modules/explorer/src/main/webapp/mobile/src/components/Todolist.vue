<template>
    <div class="work">
        <div class="title">
            <div class="el-row">
                <div class="grid-content bg-purple-dark">
                    <mt-button icon="back" class="back" @click="back"></mt-button>
                    待办事项
                    <mt-button icon="search"></mt-button>
                </div>
            </div>
        </div>
        <div class="Taskagents" v-for="i in list" @click="initiatecom(i.jumpUrl)">
            <div class="el-row">
                <div class="el-row15">
                    <div class="grid-content bg-purple-dark" style="line-height:0.8rem;">
                        <img src="../assets/daiban.png" class="listimg"/>
                    </div>
                </div>
                <div class="el-row75"><div class="grid-content bg-purple-dark">
                    <div class="listcom">
                        <p>{{i.task_name}}</p>    
                        <span>{{i.create_time}}</span>
                    </div>
                </div></div>
                 <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:0.8rem;"><i class="mint-cell-allow-right"></i></div></div>
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
        list:""
    }
  },
  filters: {
    time: function (value) {
        return new Date(parseInt(value) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    }
  },
  methods:{
      back(){
          this.$router.go(-1);
      },
      todolist(){
          var that = this;
          var thisrouter =  this.$router;
          this.$http({
            method: 'post',
            url: '/officedyanmic/task.do',
            params:{paramMap:{"controlType" : "queryWaitTask"}},
            headers: {"X-Requested-With": "XMLHttpRequest"},
          })
        .then(function (response) {
              if(response.data.success){
                  that.list = response.data.values;
              }else if(response.data.code === "1"){
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
      },initiatecom(taskid){
          this.$router.push({ path: '/'+taskid})
      }
  },
  mounted(){
      this.todolist();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.faqiliuc{margin-bottom: 0.2rem;}
.back{position: absolute;left: 0.2rem;top:0.2rem;}
</style>