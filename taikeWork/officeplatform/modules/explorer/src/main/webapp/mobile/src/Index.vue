<template>
    <div class="Indexapp">
        <router-view transition="expand"></router-view>
        <keep-alive>
            <foot></foot>
        </keep-alive>
    </div>
    
</template>

<script>
import foot from './components/foot'
 export default {
    name: 'Index',
    components: {
        foot
     },
    watch: {
     },
     methods:{
    },
    beforeMount(){
    }
 }
</script>

<style>
.Indexapp{height: 100%;width: 100%;background:#F4F5F9;}
</style>