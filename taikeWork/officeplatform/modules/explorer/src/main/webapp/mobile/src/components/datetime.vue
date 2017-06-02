<template>
<div>
  <div @click="openPicker">
    <mt-field :label="title" :value="hehe" v-on:change.native="chuanruvalue" v-model="lasthehe"></mt-field>
  </div>
  <mt-datetime-picker
    ref="picker"
    v-model="aa"
    type="date"
    year-format="{value} 年"
    month-format="{value} 月"
    date-format="{value} 日"
    @confirm="handleConfirm">
  </mt-datetime-picker>
</div>
</template>
<script>
import { Field,DatetimePicker } from 'mint-ui';
export default {
  name: 'datetime',
  components: {
    [Field.name]: Field,
    [DatetimePicker.name]:DatetimePicker
  },
  props: ['title','thisvalue','thiskey'],
  data () {
    return {
      hehe:"",
      aa:"",
      lasthehe:""
    }
  },
  methods:{
      chuanruvalue(){
        console.log(this.hehe);
        this.$emit('shishi',this.thiskey,this.hehe)
      },
      openPicker() {
        this.$refs.picker.open();
      },
      handleConfirm(){
        let d = this.aa;
        let youWant=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.hehe = youWant;
        this.chuanruvalue();
      }
  },
  mounted(){
    this.hehe = this.thisvalue;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
