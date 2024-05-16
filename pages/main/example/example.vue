<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">
    </view>
  </view>
</template>

<script>
  var uf = require('@/common/util.js')
  var that = null
  var app = getApp()
  var g = app.globalData

  var db = require("@/common/DBserver.js")


  export default {
    data() {
      return {
        COLORTHEMECOMMON: g.COLORTHEMECOMMON,
        COLORTHEME: g.COLORTHEME,
        THEMEID: g.THEMEID,
        THEMETYPE: g.THEMETYPE,
        THEMELIST: g.THEMELIST,
        VERSION: g.VERSION,

      }
    },
    onLoad(options) {
      that = this
      that.PageReflesh()
    },
    methods: {
      PageReflesh() {
        g.RefleshGlobalData()
        uni.setNavigationBarColor({
          backgroundColor: g.COLORTHEME["--color-main"],
          frontColor: g.COLORTHEME["--color-navitext"]
        })

        //必须登录的需要使用：
        /*
          g.ServerReady(()=>{
            
            //do something...
          })
        */

      }
    }
  }
</script>

<style>

</style>