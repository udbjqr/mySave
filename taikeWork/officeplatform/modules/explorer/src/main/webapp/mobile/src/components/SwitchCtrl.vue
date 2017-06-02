<template>
  <mt-switch v-model="hehe">{{title}}</mt-switch>
</template>
<script>
import { Switch } from 'mint-ui';
export default {
  name: 'SwitchCtrl',
  components: {
    [Switch.name]: Switch,
  },
  props: ['title','thisvalue',"thiskey"],
  data () {
    return {
      hehe:""
    }
  },
  methods:{
      chuanruvalue(){
        this.$emit('shishi',this.thiskey,this.hehe)
      }
  },
  mounted(){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>