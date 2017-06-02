<template>
  <div>
      <div @click="open"><mt-field :label="title" :value="lasthehe" @change="chuanruvalue" v-model="hehe"></mt-field></div>
      <div class="pickerslote" v-if="ok"><mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        <mt-button type="primary" @click="cloct">确定</mt-button>
      </div>
  </div>
</template>
<script>
import { Field,Picker,Button } from 'mint-ui';


export default {
  name: 'inputCtrl',
  components: {
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Button.name]: Button
  },
  props: ['title',"thisvalue",'thisselect',"thiskey"],
  data () {
    return {
      hehe:"",
      lasthehe:"",
      ok:false,
      slots: [
        {
          flex: 1,
          values: this.thisselect,
        }
      ],
     
    }
  },
  methods:{
      chuanruvalue(){
        this.$emit('shishi',this.thiskey,this.hehe)
      },
       onValuesChange(picker, values) {
            if (values[0] > values[1]) {
                picker.setSlotValue(1, values[0]);
            }
            this.lasthehe = values[0];
        },
        open(){
            this.ok = true;
        },
        cloct(){
            this.ok = false;
            this.chuanruvalue();
        }
  },
  mounted(){
     this.lasthehe = this.thisvalue;
     console.log(this.thisselect);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .pickerslote{position: absolute;top: 0;height: 100%;width: 100%;background: rgba(0,0,0,.6);z-index: 99;}
    .pickerslote .picker{ position: absolute;  background: #fff; bottom: 1rem;width: 100%;}
    .pickerslote button{position: absolute; bottom: 0;height: 1rem;width: 100%;}
</style>