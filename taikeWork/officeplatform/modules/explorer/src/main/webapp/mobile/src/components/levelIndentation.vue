<template id="item-template">
    <div>
        <li>
            <div class="item" :class="{'checkColor':isCheck}">
                <!-- <span @click="depaCheck" class="mint-checkbox-core check-icon" :class="{'check-style':isCheck}" ></span> -->
                <span class="type-img">
                    <img v-if="isType === undefined" src="../assets/depa.png" width="100%" height="100%"/>
                    <img v-else-if="isType === 'role'" src="../assets/role.png" width="100%" height="100%"/>
                    <img v-else-if="isType === 'user'" src="../assets/personnel.png" width="100%" height="100%"/>
                </span>
                <p @click="toggle" class="item-name" >{{model.name}}</p>
                <span @click="depaSelect" class="folder-icon" v-if="isType != 'user'">{{model.id == saveDepaId ? '-' : '+'}}</span>
            </div>
            <ul class="depa-child" v-show="model.type==undefined?model.id == saveDepaId:open" v-if="isFolder">
                <item v-for="model in model.child.parent" :model="model" ></item>
            </ul>
        </li>
    </div>
</template>

<script>

import { MessageBox } from 'mint-ui';
var [depaId,selectedArr] = ["",[]];
export default {
    name:"item",
    template: '#item-template',
    props: {model: Object,saveDepaId:Number},
    data: function () {
        return {
            open: false,
            isCheck:false,
        }
    },
    computed: {
        isFolder: function () {
            return this.model.child &&　this.model.child.parent.length;
        },
        isType(){
            return this.model.type;
        }
    },
    methods: {
        ajaxFn(data,callback,javaUrl = '/officedyanmic/department.do'){
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
        },/*选中的列表是否已近存在*/
        thereExist(joinCode){
            if(selectedArr.indexOf(joinCode) == -1){
                return true;
            }else{
                var index = selectedArr.indexOf(joinCode);
                selectedArr.splice(index,1);
                return false;
            }
        },/*选中、取消*/
        toggle() {
            this.isCheck = !this.isCheck;
            if(this.model.type == undefined){
                var joinCode = "D"+this.model.id;
                if(this.thereExist(joinCode))selectedArr.push(joinCode);
            }else if (this.model.type == "role") {
                var joinCode = "SD"+depaId+"R"+this.model.id;
                if(this.thereExist(joinCode))selectedArr.push(joinCode);
            }else if (this.model.type == "user") {
                var joinCode = "E"+this.model.id;
                if(this.thereExist(joinCode))selectedArr.push(joinCode);
            }
            console.log("USER"+selectedArr.join("_"));
            this.$emit('transfer',"USER"+selectedArr.join("_"));
        },/*列表选择*/
        depaSelect(){
            if(this.saveDepaId == this.model.id){
                this.$emit('isShowList',NaN);
            }else{
                this.$emit('isShowList',this.model.id);
                if(this.model.type==undefined){
                    depaId = this.model.id;
                    if(!this.model.mark){
                        this.model.mark = true;
                        this.ajaxFn({controlType:"getRoleByDeptId",dept_id:this.model.id},data=>{
                            if(data.values instanceof Array){
                                if(this.model.child){
                                    var ArrVal =  this.model.child;
                                    ArrVal.parent.push(...data.values);
                                    this.$set(this.model,'child',ArrVal);
                                }else{
                                    var ArrVal = {parent:data.values};
                                    this.$set(this.model,'child',ArrVal);
                                }
                                //console.log(JSON.stringify(this.model));
                            }else{
                                MessageBox('提示', '该部门下没有角色！');
                            }
                        });
                    }
                }else if (this.model.type == "role") {
                    this.open = !this.open
                    if(!this.model.mark){
                        this.model.mark = true;
                        this.ajaxFn({controlType:"getUserByDeptAndrole",dept_id:depaId,role_id:this.model.id},data=>{
                            if(data.values.child instanceof Array){
                                if(this.model.child){
                                    var ArrVal =  this.model.child;
                                    ArrVal.parent.push(...data.values.child);
                                    this.$set(this.model,'child',ArrVal);
                                }else{
                                    var ArrVal = {parent:data.values.child};
                                    this.$set(this.model,'child',ArrVal);
                                }
                                //console.log(JSON.stringify(this.model));
                            }else{
                                MessageBox('提示', '该角色下没有人员！');
                            }
                        });
                    }
                }
            }
        },
    }
};




</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.checkColor{background: #e7f4fd}

.item {
  cursor: pointer;
  width: 100%;
  line-height: .8rem;
  border-bottom: 1px solid #D0CFD4;
  font-size: 0.35rem;
}

.item::after{clear: both;content:"";display: table;zoom:1}

.check-icon{
    width: 10%;
    height: 100%;
    margin: 0 .1rem;
}

.check-style{
    background-color: #26a2ff !important;
    border-color: #26a2ff !important;
}

.check-style::after{
    border-color: #fff !important;
    -webkit-transform: rotate(45deg) scale(1) !important;
    transform: rotate(45deg) scale(1) !important;
}

.item-name{
    display: inline-block;
    width: 75%;
    height: 100%;

}

.folder-icon{
    width: 10%;
    height: 100%;
    display: inline-block;
    float: right;
}

.depa-child{
    padding-left: .5rem;
}

.bold {
  font-weight: bold;
}

.type-img{
    width: .3rem;
    height: .3rem;
    display: inline-block;
    padding-left: .1rem;
}

.type-img > img{
    float: left;
}

</style>
