<template>
  <div class="typeinput">
      <mt-field :label="title" :value="thisvalue" v-on:change.native="chuanruvalue" v-model="hehe" v-if="thistype"></mt-field>
      <mt-field :label="title" :value="thisvalue" v-on:change.native="chuanruvalue" v-model="hehe" disabled="disabled" v-else></mt-field>
  </div>
</template>
<script>
import { Field } from 'mint-ui';
export default {
  name: 'inputCtrl',
  components: {
    [Field.name]: Field,
  },
  props: ['title','thisvalue',"thiskey","type"],
  data () {
    return {
      hehe:"",
      thistype:true
    }
  },
  methods:{
      chuanruvalue(){
        this.$emit('shishi',this.thiskey,this.hehe)
      }
  },
  mounted(){
    if(this.type){
      this.thistype = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.typeinput input{background: #fff;}
</style>