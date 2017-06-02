<template>
    <div class="work">
        <div class="title">
            <div class="el-row">
                <div class="grid-content bg-purple-dark">通讯录<mt-button icon="search"></mt-button></div>
            </div>
        </div>
        <div class="Taskagents">
            <div class="el-row">
                 <div class="el-row15"><div class="grid-content bg-purple-dark" style="line-height:0.8rem;">
                        <img src="../assets/faqi.png" class="listimg"/>
                    </div></div>
                <div class="el-row75"><div class="grid-content bg-purple-dark">
                    <div class="listcom">
                        <p>研发部</p>    
                        <span>有13人</span>
                    </div>
                </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="mint-cell-allow-right"></i></div></div>
            </div>
        </div>

        <div class="Taskagents">
            <div class="el-row">
                <div class="el-row15"><div class="grid-content bg-purple-dark" style="line-height:0.8rem;">
                        <img src="../assets/wancheng.png" class="listimg"/>
                    </div></div>
                <div class="el-row75"><div class="grid-content bg-purple-dark">
                    <div class="listcom">
                        <p>产品部</p>    
                        <span>有5条代办流程</span>
                    </div>
                </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="mint-cell-allow-right"></i></div></div>
            </div>
        </div>
        <div class="Taskagents">
            <div class="el-row">
                <div class="el-row15"><div class="grid-content bg-purple-dark" style="line-height:0.8rem;">
                        <img src="../assets/wofaqi.png" class="listimg"/>
                    </div></div>
                <div class="el-row75"><div class="grid-content bg-purple-dark">
                    <div class="listcom">
                        <p>销售部</p>    
                        <span>已完成流程12条</span>
                    </div>
                </div></div>
                <div class="el-row10"><div class="grid-content bg-purple-dark" style="line-height:1rem;"><i class="mint-cell-allow-right"></i></div></div>
            </div>
        </div>
        
        
    </div> 
</template>

<script>
import { Button } from 'mint-ui'
export default {
  name: 'message',
  components: {
    [Button.name]: Button
  },
  data () {
    return {
    }
  },
  methods:{
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>