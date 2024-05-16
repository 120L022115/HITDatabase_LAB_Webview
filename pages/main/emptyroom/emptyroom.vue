<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">
      <view class="tline">
          <view class="ltitle">
            被占用
          </view>
          <view class="ttitle warn"></view>
      </view>
      
      <view class="tline">
        <view class="ltitle">
          节次
        </view>
        <view class="ttitle" v-for="(time,index) in [1,2,3,4]">{{time}}</view>
      </view>

      <view v-for="(item,index) in roomlist.keys" class="tline">
        <view class="ltitle">{{item}}</view>
        <view class="p25" v-for="(time,indx) in [1,2,3,4]" :class="roomlist.data[item][time]?'warn':''">{{roomlist.data[item][time]}}</view>
      </view>
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
        
        
        roomlist: {
          keys: []
        }

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

        db.sql().select(["*"]).table(['rooms','courses']).exec({
          success(res) {
            //.group(["SUM(time) as sum","rbuilding","rname"])
            var data = res.data
            var dict = {},
              key = []
            for (var item of data) {
              var k = item.rbuilding + item.rname
              if (typeof dict[k] != 'object') dict[k] = {}
              if(item.rid==item.crid_id)  dict[k][item.rtime] = item.cid
            }
            console.log(dict)
            that.roomlist = {
              data: dict,
              keys: Object.keys(dict)
            }
            console.log(that.roomlist)
          }
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
  view {
    font-size: 30rpx;
    
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .warn{
    background-color: var(--color-warn);
  }

  .p25 {
    width: 100rpx;
    height: 100%;
  }

  .ltitle {
    width: 200rpx;
  }

  .tline {
    border-bottom: 1px solid var(--color-border);
    height: 50rpx;
  }

  .ttitle {
    width: 100rpx;
    height: 50rpx;
  }
</style>
