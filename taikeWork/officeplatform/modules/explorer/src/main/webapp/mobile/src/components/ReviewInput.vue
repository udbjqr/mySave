<template>
    <div class="work">
        <div class="title">
            <div class="el-row">
                <div class="grid-content bg-purple-dark"><mt-button icon="back" class="back" @click="back"></mt-button>发起流程</div>
            </div>
        </div>
        <div class="Taskagents" v-for="(i, index) in datelast">
            <InputCtrl :thisvalue="i.defaultValue" :title="i.title" :thiskey="i.id" :type="disabled" @shishi="shishi"></InputCtrl>      
        </div>
         <div class="inbottom1">
            <mt-button type="primary" @click="loaddata(1)">审核通过</mt-button>
            <mt-button type="primary" @click="loaddata(0)">审核不通过</mt-button>
         </div>
            
    </div> 
</template>

<script>
import { Field,Button,DatetimePicker,Picker,Toast } from 'mint-ui';
import InputCtrl from './inputCtrl';
import Datetime from './datetime';
import SelectCtrl from './selectCtrl';
import RadioCtrl from './radioCtrl'
export default {
  name: 'message',
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    InputCtrl
  },
  data () {
    return {
      datelast:{},
      thisdata:[],
      thisdatatitle:"",
      disabled:"disabled",
    }
  },
  methods:{
      back(){
          this.$router.go(-1);
      },
      getlist(){
          var that = this;
          var thisrouter =  this.$router;
          this.$http({
            method: 'post',
            url: '/officedyanmic/handle.do',
            params:{paramMap:{"controlType" : "query","task_id" : this.$route.params.taskid}},
            headers: {"X-Requested-With": "XMLHttpRequest"}
          })
        .then(function (response) {
              if(response.data.success){
                  that.datelast = response.data.values.formStructure.formArr;
                  that.setdata(response.data.values.formData);
            //   console.log(response.data.values.formStructure.formArr);
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
      setdata(formData){
          var formDatalist = Object.keys(formData);
        for(var i=0;i<this.datelast.length;i++){
            this.thisdata.push({[this.datelast[i].id] : this.datelast[i].defaultValue});
        };
        for(var u= 0;u<formDatalist.length;u++){
            for(var y in this.thisdata){
                if(formDatalist[u] == Object.keys(this.thisdata[y])){
                    this.datelast[y].defaultValue = formData[Object.keys(this.thisdata[y])];
                }
            }
        };
      },
      openPicker() {
        this.$refs.picker.open();
      },
      loaddata(taf){
          /*提交*/
          var that = this;
          var thisrouter =  this.$router;
          this.$http({
            method: 'post',
            url: '/officedyanmic/handle.do',
            params:{paramMap:{"auditStatus":taf,"task_id": this.$route.params.taskid}},
            headers: {"X-Requested-With": "XMLHttpRequest"}
          })
        .then(function (response) {
              if(response.data.success){
                Toast({
                  message: response.data.msg,
                  position: 'bottom',
                  duration: 5000
                });
                thisrouter.go(-1);
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
      shishi(key,value){
          for(let i = 0;i in this.thisdata;i++){
              if(Object.keys(this.thisdata[i]) == key){
                  this.thisdata[i][key] = value;
              }
          };
          console.log(this.thisdata);
      }
  },
  mounted(){
      this.getlist();
      
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.inbottom1{position: absolute;bottom: 0;width: 100%;height: 1rem;}
.inbottom1 button:first-child{position: fixed;bottom: 0;left: 0;width: 50%;border-radius: 0;}
.inbottom1 button:last-child{position: fixed;bottom: 0;left: 50%;width: 50%;border-radius: 0;}
</style>