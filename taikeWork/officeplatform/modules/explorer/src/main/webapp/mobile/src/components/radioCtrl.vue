<template>
  <mt-radio
  :title="title"
  v-model="hehe"
  :options="options">
</mt-radio>
</template>
<script>
import { Radio } from 'mint-ui';
export default {
  name: 'inputCtrl',
  components: {
    [Radio.name]: Radio,
  },
  props: ['title','thisvalue',"thisselect","thiskey"],
  data () {
    return {
      hehe:"",
      options:this.thisselect.xzArr
    }
  },
  methods:{
      chuanruvalue(){
        this.$emit('shishi',this.thiskey,this.hehe)
      }
  },
  mounted(){
      console.log("412");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>