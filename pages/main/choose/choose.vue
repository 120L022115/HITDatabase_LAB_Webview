<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">
      <view class="tline" style="justify-content: space-between;">
        <view style="font-size: 40rpx;">选择外专业课</view>
        <switch color="var(--color-main)" v-model="WAIZHUANYE" @change="PageReflesh($event)"></switch>
      </view>
      <view class="tline" style="margin-top: 50rpx;">
        <view class="ltitle" style="width: 700rpx;">
          [课程号]课程名 教室教师
        </view>
        <view></view>
      </view>


      <block v-if="roomlist.length==0">
        <view class="tline">暂无</view>
      </block>
      <view v-else v-for="(item,index) in roomlist" class="tline">
        <view>
          <view class="ltitle" style="width: 300rpx;font-weight: 600;">{{"["+item.cid+"]"+item.cname}}</view>
          <view class="ltitle" style="width: 300rpx;">{{item.rbuilding+item.rname+"[第"+item.rtime+"节]"+item.username}}
          </view>
        </view>
        <button v-if="!item.haschoose" @click="choosecourse(item,index,true)" class="iconfont icon-duihao"></button>
        <button v-else :disabled="item.score" @click="choosecourse(item,index,false)"
          class="iconfont icon-cuo"></button>
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

        WAIZHUANYE: false,
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
      PageReflesh(e) {
        console.log(e)
        if (e && e.detail) that.WAIZHUANYE = e.detail.value
        g.RefleshGlobalData()
        uni.setNavigationBarColor({
          backgroundColor: g.COLORTHEME["--color-main"],
          frontColor: g.COLORTHEME["--color-navitext"]
        })
        //var sql = db.sql().select()
        var arr = [
          'rid=crid_id',
          "ctuid_id=tuid",
          "tuuid_id=uuid"//,
          //'(pcid_id=cid or pcid_id is null)',
          //"(psgrade is null or psgrade = "+g.USERDATA_TYPE.sgrade+")"

        ]
        // FULL OUTER JOIN plan
        var uaarr = ['rooms', 'courses', "teachers", "accounts"]

        if (!that.WAIZHUANYE) {
          uaarr.push("plan")
          arr.push('pcid_id=cid')
          arr.push("pdid_id=" + g.USERDATA_TYPE.sdid_id)
        }
        db.sql().select(["*"]).table(uaarr).where(arr).order({
          cid: 1
        }).exec({
          success(res) {
            //.group(["SUM(time) as sum","rbuilding","rname"])
            var data = res.data

            var arr = [],
              cidl = {}

            for (var item of data) {
              if (cidl[item.cid]) {

              } else {
                cidl[item.cid] = true //去重

                arr.push(item)
              }
            }
            data = arr


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
