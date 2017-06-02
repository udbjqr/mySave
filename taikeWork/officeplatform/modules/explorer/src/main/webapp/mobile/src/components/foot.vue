<template>
    <ul class="footnav">
        <li @click="changeurl('0')"><div>
          <img v-if="nowyouyouyou==='0'" src="../assets/message.png"/>
          <img v-else src="../assets/Desktop/message.png"/>
          <p :class="nowyouyouyou=='0' ? 'blue' : ''">消息</p></div></li>
        <li @click="changeurl('1')"><div>
          <img v-if="nowyouyouyou==='1'" src="../assets/work.png"/>
          <img v-else src="../assets/Desktop/work.png"/>
          <p :class="nowyouyouyou=='1' ? 'blue' : ''">工作</p></div></li>
        <li @click="changeurl('2')"><div>
          <img v-if="nowyouyouyou==='2'" src="../assets/tongxunlu.png"/>
          <img v-else src="../assets/Desktop/tongxunlu.png"/>
          <p :class="nowyouyouyou=='2' ? 'blue' : ''">通讯录</p></div></li>
        <li @click="changeurl('3')"><div>
          <img v-if="nowyouyouyou==='3'" src="../assets/my.png"/>
          <img v-else src="../assets/Desktop/my.png"/>
          <p :class="nowyouyouyou=='3' ? 'blue' : ''">我</p></div></li>
    </ul>
</template>

<script>
export default {
  name: 'message',
  data () {
    return {
      messageimng : '/message.png',
      nowyouyouyou:'0'
    }
  },
  methods: {
     changeurl(tourl){
       this.nowyouyouyou=tourl;
       if(tourl=='0'){
         this.$router.push({ path: '/' })
       }else if(tourl=='1'){
         this.$router.push({ path: '/work' })
       }else if(tourl=='2'){
         this.$router.push({ path: '/contacts' })
       }else{
         this.$router.push({ path: '/my' })
       }
     },
     nowurl(){
       console.log(this.$route.path);
        if(this.$route.path=='/'){
          this.nowyouyouyou='0'
        }else if(this.$route.path=='/work'){
          this.nowyouyouyou='1'
        }else if(this.$route.path=='/contacts'){
          this.nowyouyouyou='2'
        }else if(this.$route.path=='/my'){
          this.nowyouyouyou='3'
        }
     }
  },
  mounted(){
    this.nowurl();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.footnav{width:100%;height: 1rem;font-size: 0.1rem;position: fixed;bottom: 0;background:#FFFFFF;}
.footnav li{width:25%;float: left;text-align: center;}
.footnav li img{height: 0.5rem;margin: 0.1rem 0.25rem;}
.blue{color:#7FCCFD}
</style>