<template>
  <div id="App">
    <img class="APPimg" src="./assets/logo.gif">
    <p class="logofont">OA管理系统</p>
    <logininput></logininput>
  </div>
</template>

<script>
import logininput from './components/Logininput'

export default {
  name: 'Login',
  components: {
    logininput,
  },
  data () {
    return {
      
    }
  },
  methods:{
    
  },
  beforeMount(){
    
  }
}
</script>

<style>
html{height:100%;}
body{height:100%;}
#App {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: -o-linear-gradient(top, #666e7b, #515968);
  background: -webkit-linear-gradient(top, #666e7b, #515968);
  background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#666e7b), to(#515968));
  FILTER: progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=#666e7b,endColorStr=#515968);
  background: -ms-linear-gradient(top, #666e7b, #515968);
  background: -moz-linear-gradient(top,#666e7b,#515968);
  color: #2c3e50;
  height: 100%;
  width:100%;
}
#App .APPimg{height: 1.25rem;width:auto;margin: 2.2rem 0 0.2rem;}
#App .logofont{color:#fff; font-size: 0.4rem;margin: 0 0 1rem;}
</style>
