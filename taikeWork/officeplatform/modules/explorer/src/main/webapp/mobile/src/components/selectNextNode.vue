<template>
    <div>
        <div class="title">
            <div class="el-row">
                <div class="grid-content bg-purple-dark">选择部门</div>
            </div>
        </div>
        <ul>
          <item v-for="model in treeData" :model="model" :saveDepaId="saveDepaId" @transfer="transfer" @isShowList="isShowList"></item>
        </ul>

        <div class="inbottom">
            <mt-button type="primary" size="large" @click="randerDepa()">提交</mt-button>
        </div>
    </div>
</template>
<script>
import { Button } from 'mint-ui';
import item from './levelIndentation.vue'
export default {
    components: { [Button.name]: Button,item},
    data(){
        return {
            treeData: [],
            selectedArr:[],
            saveDepaId:NaN
        }
    },
    methods:{
        ajaxFn(data,callback,javaUrl = '/officedyanmic/task.do'){
            const that = this;
            this.$http({
              method: 'post',
              url: javaUrl,
              params:{paramMap:JSON.stringify(data)},
              headers: {"X-Requested-With": "XMLHttpRequest"},
            })
                .then(function (response) {
                    callback.call(that,response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        Initiate(){
            const ajaxjson = JSON.stringify({controlType:"getAllDeptByTree"});
            const that = this;
            this.$http({
              method: 'post',
              url: '/officedyanmic/department.do',
              params:{paramMap : ajaxjson},
              headers: {"X-Requested-With": "XMLHttpRequest"},
            })
                .then(function (response) {
                    that.treeData = response.data.values.root;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },/*提交*/
        randerDepa(){
            this.ajaxFn({controlType:"setAssigenee",name_expression:this.selectedArr,task_id:"",execution_id:""},data=>{
                
            });
        },/*传递选中的值*/
        transfer(data){
            this.selectedArr = data;
        },/*传递控制是否显示列表的ID*/
        isShowList(modelId){
            this.saveDepaId = modelId;
        }
    },
    mounted(){
        this.Initiate();
    }

}



</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
