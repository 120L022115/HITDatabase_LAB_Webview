<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">
      <view class="tline">
        <view class="ltitle" style="width: 700rpx;">
          [课程号]课程名（培养方案） 教室教师
        </view>
        <view></view>
      </view>
      <block v-if="roomlist.length==0">
        <view class="tline">暂无</view>
      </block>
      <view v-else v-for="(item,index) in roomlist" class="tline" v-if="item.haschoose">
        <view>
          <view class="ltitle" style="width: 300rpx;font-weight: 600;">{{"["+item.cid+"]"+item.cname}}</view>
          <view class="ltitle" style="width: 300rpx;">{{item.rbuilding+item.rname+"[第"+item.rtime+"节]"+item.username}}
          </view>
        </view>
        <view class="ltitle" style="width: 300rpx;text-align: right;color: red;font-size: 45rpx;">
          {{item.score?item.score:'暂无'}}</view>

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
        //var sql = db.sql().select()
        db.sql().select(["*"]).table(['rooms', 'courses', "teachers", "accounts"]).where([
          'rid=crid_id',
          //'pcid_id=cid',
          "tuuid_id=uuid",
          "ctuid_id=tuid"
          //"pdid_id=" + g.USERDATA_TYPE.sdid_id
        ]).exec({
          success(res) {
            //.group(["SUM(time) as sum","rbuilding","rname"])
            var data = res.data

            db.sql().select(["*"]).table(["scores"]).where({
              suid_id: g.USERDATA_TYPE.suid
            }).exec({
              success(res2) {
                var data2 = res2.data
                for (var p of data) {
                  for (var u of data2) {
                    if (p.cid == u.scid_id) {
                      p.haschoose = true
                      p.score = u.score
                    }
                  }
                }
                that.roomlist = data
                console.log(that.roomlist)
              }
            })
          }
        })

        //必须登录的需要使用：
        /*
          g.ServerReady(()=>{
            
            //do something...
          })
        */

      },
      choosecourse(item, index, choose) {
        if (choose) {
          db.sql().table(["scores"]).insert({
            scid_id: item.cid,
            suid_id: g.USERDATA_TYPE.suid
          }).exec({
            success(res) {
              that.PageReflesh()
            }
          })
        } else {
          if (typeof item.score == 'number') {
            uni.showModal({
              title: "本门课已有成绩，不可退选",
              showCancel: false
            })
            return
          }
          db.sql().table(["scores"]).delete({
            scid_id: item.cid,
            suid_id: g.USERDATA_TYPE.suid
          }).exec({
            success(res) {
              that.PageReflesh()
            }
          })
        }

      }
    }

  }
</script>

<style>
  view {
    font-size: 30rpx;

  }

  .warn {
    background-color: var(--color-warn);
  }

  .p25 {
    width: 100rpx;
    height: 100%;
  }

  .ltitle {
    width: 200rpx;
    height: 50rpx;
  }

  .tline {
    border-bottom: 1px solid var(--color-border);
    height: min-content;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: left;
    width: 700rpx;
  }

  .ttitle {
    width: 100rpx;
    height: 50rpx;
  }
</style>
