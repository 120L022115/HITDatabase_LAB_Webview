<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">
      <view class="tline">
        <view class="ltitle">
          我的课程
        </view>
        <view class="ttitle err"></view>
        
          <view class="ltitle">
            其他课程
          </view>
          <view class="ttitle warn"></view>
      </view>
      <view class="tline" style="margin-bottom: 50rpx;">
        <view>
          点击空白处添加课程，点击我的课程删除课程
        </view>
      </view>
      <view class="tline">
        <view class="ltitle">
          节次
        </view>
        <view class="ttitle" v-for="(time,index) in [1,2,3,4]">{{time}}</view>
      </view>
      <view v-for="(item,index) in roomlist.keys" class="tline">
        <view class="ltitle">{{item}}</view>
        <view class="p25" v-for="(time,indx) in [1,2,3,4]" :class="!roomlist.data[item][time]||!roomlist.data[item][time].cid?'':(MYID==roomlist.data[item][time].data.ctuid_id?'err':'warn')" @click="opencourse(roomlist.data[item][time])">{{roomlist.data[item][time]?roomlist.data[item][time].cid: ''}}</view>
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
        
        MYID: -1,
        roomlist: {
          keys: [],
          data: []
        }

      }
    },
    onLoad(options) {
      that = this
      that.PageReflesh()
    },
    methods: {
      opencourse(data){
        var room = data.data
        if(data.cid){
          if(that.MYID==room.ctuid_id){
            uni.showModal({
              title: '删除课程',
              content: room.cname+'：'+room.rbuilding+room.rname+"["+room.rtime+"]",
              success(res) {
                if(res.confirm){
                  db.sql().table(["courses"]).where({
                    cid: data.cid
                  }).delete().exec({
                    success(res){
                      that.PageReflesh()
                    }
                  })
                }
              }
            })
          }
        }else
        uni.showModal({
          title: '开设课程：'+room.rbuilding+room.rname+"["+room.rtime+"]",
          editable: true,
          success(res) {
            if(res.confirm){
              var name = res.content
              db.sql().table(["courses"]).insert({
                crid_id: room.rid,
                cname: name,
                ctuid_id: g.USERDATA_TYPE.tuid
              }).exec({
                success(res){
                  that.PageReflesh()
                }
              })
            }
          }
        })
      },
      PageReflesh() {
        that.MYID = g.USERDATA_TYPE.tuid
        g.RefleshGlobalData()
        uni.setNavigationBarColor({
          backgroundColor: g.COLORTHEME["--color-main"],
          frontColor: g.COLORTHEME["--color-navitext"]
        })

        db.sql().select(["*"]).table(['rooms','courses']).exec({
          success(res) {
            //.group(["SUM(time) as sum","rbuilding","rname"])
            var data = res.data
            var dict = {}, key = []
            for (var item of data) {
              var k = item.rbuilding + item.rname
              if (typeof dict[k] != 'object') dict[k] = {}
              if(typeof dict[k][item.rtime] == 'object' &&  dict[k][item.rtime].cid>=0 ){
                continue
              }
              dict[k][item.rtime] = {
                data: item,
                //cid: 0
              }
              if(item.rid==item.crid_id){
                
                dict[k][item.rtime].cid = item.cid
              } 
              
            }
            console.log(dict)
            that.roomlist = {
              //ridd: ridd,
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
  .err{
    background-color: var(--color-err);
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
