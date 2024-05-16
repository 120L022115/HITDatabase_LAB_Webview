<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">
      <block v-if="show_apploading">
        <view class="loadingpage">
          <view class="loadingtop">
            <image class="loadingphoto" mode="aspectFill" src="/static/logo.png"></image>
          </view>
          <view class="loadingtext" style="margin-top: 10vh">教务管理</view>
          <view v-if="!show_loadingerr" style="margin-top: 5vh">
            <image class="loadingicon" mode="aspectFill" src="/static/images/LOADING.gif"></image>
          </view>
          <view v-else style="margin-top: 5vh">
            <text class="loadingtip">{{ show_loadingerr }}</text>
            <button style="margin: 50rpx auto" @tap="getReady">重新连接</button>
          </view>
        </view>
      </block>
      <block v-else>
        <view class="content">
          <image class="logo" src="/static/logo.png"></image>
          <view class="text-area">
            <text class="title">将于{{enterTime-timeCount}}秒后进入</text>
          </view>
        </view>
      </block>
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

        show_apploading: true,
        show_loadingerr: '',
        enterTime: 1,
        timeCount: 0,

      }
    },
    onLoad() {
      that = this
      that.getReady()


    },
    methods: {
      getAppPublicKey(callback) {
        console.log("开始验证签名")
        callback(true)
      },
      getReady(e, skip) {
        if (skip) g.skipSign = true;
        that.show_apploading = true
        that.show_loadingerr = ''
        g.ServerReady(() => {
          console.log("开始DH获取签名")
          that.getAppPublicKey((success) => {
            if (g.AppInit.status && success) {
              that.show_apploading = false

              uni.redirectTo({
                url: '/pages/main/main'
              })
              return

              // var intid = setInterval(() => {
              //   if (that.enterTime > that.timeCount) {
              //     that.timeCount++
              //   } else {
              //     uni.redirectTo({
              //       url: '/pages/main/main'
              //     })
              //     clearInterval(intid)

              //   }
              // }, 1000)
            } else {
              if (!success) {
                that.show_loadingerr = "签名验证失败"
              } else {
                that.show_loadingerr = g.AppInit.info
              }

            }
          })


          //console.log(g)



        })
      }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }
</style>