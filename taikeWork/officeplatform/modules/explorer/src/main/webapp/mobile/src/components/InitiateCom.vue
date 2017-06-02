<template>
    <div class="work">
        <div class="title">
            <div class="el-row">
                <div class="grid-content bg-purple-dark"><mt-button icon="back" class="back" @click="back"></mt-button>发起流程</div>
            </div>
        </div>
        <div class="Taskagents" v-for="i in datelast">
            <InputCtrl v-if="i.formType === 'textControl'" :thisvalue="i.defaultValue" :title="i.title" :thiskey="i.id" @shishi="shishi"></InputCtrl>
            <Datetime v-else-if="i.formType === 'timeControl'||i.formType === 'dateControl'" :title="i.title" :thisvalue="i.defaultValue" :thiskey="i.id" @shishi="shishi"></Datetime>
            <SelectCtrl v-else-if="i.formType === 'dropDownControl'" :title="i.title" :thisvalue="i.defaultValue" :thisselect="i.selectval" :thiskey="i.id" @shishi="shishi"></SelectCtrl>
            <RadioCtrl v-else-if="i.formType === 'radioControl'" :title="i.title" :thisvalue="i.defaultValue" :thisselect="i.selectiveValue" :thiskey="i.id" @shishi="shishi"></RadioCtrl>
        
        </div>
         <div class="inbottom">
            <mt-button type="primary" size="large" @click="loaddata()">提交</mt-button>
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
    [DatetimePicker.name]: DatetimePicker,
    [Picker.name]: Picker,
    InputCtrl,
    Datetime,
    SelectCtrl,
    RadioCtrl
  },
  data () {
    return {
      datelast:{},
      thisdata:[],
      thisdatatitle:""
    }
  },
  methods:{
      back(){
          this.$router.go(-1);
      },
      getlist(){
        /*获取数据*/
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
                  for(let i=0;i< that.datelast.length;i++){
                    if(that.datelast[i].formType == "dropDownControl"){
                      console.log(that.datelast[i].title);
                      that.changeSelectValue(that.datelast[i].dataSource,i);
                    }
                  };
                that.setdata();
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
      setdata(){
        for(let i=0;i in this.datelast;i++){
            this.thisdata.push({[this.datelast[i].id] : this.datelast[i].defaultValue});
        }
      },
      loaddata(){
        // 提交数据
          this.thisdata.push({"task_id": this.$route.params.taskid});
          var i ={};
          console.log(json);
          for(let t = 0;t in this.thisdata;t++){
              i[Object.keys(this.thisdata[t])] = this.thisdata[t][Object.keys(this.thisdata[t])];
          };
          var json = JSON.stringify(i);
          /*提交*/
          var that = this;
          var thisrouter =  this.$router;
          this.$http({
            method: 'post',
            url: '/officedyanmic/handle.do',
            params:{paramMap:json},
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
      },
      changeSelectValue(data,item){
        // 获取选择器中的值
        let that = this; 
        const dataArr = data.split("_");
        this.$http({
              method: 'post',
              url: '/officedyanmic/dataSource.do',
              params:{paramMap:{controlType:"query",dataType:dataArr[0],dataName:dataArr[1]}},
              headers: {"X-Requested-With": "XMLHttpRequest"}
            })
          .then(function (response) {
              if(response.data.success){
                var thisvalue = response.data.values
                console.log(thisvalue);
                that.datelast[item].selectval = thisvalue;
                console.log(that.datelast[item]);
              }else{
        
              }
            })
        .catch(function (error) {
              console.log(error);
        });
      }
  },
  created(){
      this.getlist();
      
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.piple input{width: 100%;height: 0.8rem;float: right; margin-top: 0.05rem;border: 0;text-align: right;}
.piple .el-input{float: right;}
.height100{line-height: 1rem;}
.inbottom{position: absolute;bottom: 0;width: 100%;height: 1rem;}
.inbottom button{position: fixed;bottom: 0;}
</style>