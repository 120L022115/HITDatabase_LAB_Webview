<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">
      <block v-if="!selectCourse">
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
          <button @click="choosecourse(item,index,true)" class="iconfont icon-duihao"></button>
        </view>
      </block>
      <block v-else>
        <view class="tline">
          <view style="font-size: 40rpx;">已选：{{selectCourse.cname}}</view>
          <button class="BTNline" @click="PageReflesh()">重选</button>
        </view>
        <view class="tline" style="margin-top: 50rpx;">
          <view class="ltitle" style="width: 700rpx;">
            [学号] 学生名称
          </view>
          <view></view>
        </view>

        <block v-if="roomlist.length==0">
          <view class="tline">暂无</view>
        </block>
        <view v-else v-for="(item,index) in roomlist" class="tline">
          <view>
            <view class="ltitle" style="width: 300rpx;font-weight: 600;">{{"["+item.suid_id+"]"+item.username}}</view>
            <view class="ltitle" style="width: 300rpx;">{{item.dname+"("+item.dmajor+")"}}</view>
          </view>
          <view class="ltitle" style="width: 300rpx;text-align: right;color: red;font-size: 45rpx;">{{item.score}}
          </view>
          <button v-if="!item.score" @click="setScore(item,index,true)" class="iconfont icon-duihao"></button>
          <button v-else @click="setScore(item,index,false)" class="iconfont icon-cuo"></button>
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
        selectCourse: false,

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
      PageReflesh() {
        that.selectCourse = false
        g.RefleshGlobalData()
        uni.setNavigationBarColor({
          backgroundColor: g.COLORTHEME["--color-main"],
          frontColor: g.COLORTHEME["--color-navitext"]
        })
        //var sql = db.sql().select()
        var arr = [
          'rid=crid_id',
          'ctuid_id=tuid',
          "tuuid_id=uuid",
          "ctuid_id=" + g.USERDATA_TYPE.tuid
        ]
        db.sql().select(["*"]).table(['rooms', 'courses', "teachers", "accounts"]).where(arr).order({
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
                cidl[item.cid] = true
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
      setScore(item, index, choose) {
        if (choose) {
          uni.showModal({
            title: '设置成绩：' + item.username,
            editable: true,
            success(res) {
              if (res.confirm) {
                var n = Number(res.content)
                if (isNaN(n) || n > 100 || n < 0) {
                  uni.showToast({
                    icon: 'error',
                    title: '成绩错误'
                  })
                  return
                }
                db.sql().table(["scores"]).where({
                  scid_id: item.scid_id,
                  suid_id: item.suid
                }).update({
                  score: n
                }).exec({
                  success(res) {
                    item.score = n
                    that.$forceUpdate()
                  }
                })

              }
            }
          })

        } else {
          db.sql().table(["scores"]).where({
            scid_id: item.scid_id,
            suid_id: item.suid
          }).update([
            'score=null'
          ]).exec({
            success(res) {
              item.score = null
              that.$forceUpdate()
            }
          })
        }

      },
      choosecourse(item, index) {

        db.sql().select(['*']).table(["scores", "students", "accounts", "departments"]).where([
          "scid_id=" + item.cid,
          "uuid=suuid_id",
          "suid=suid_id",
          "did=sdid_id"
        ]).exec({
          success(res) {
            that.roomlist = res.data
            that.selectCourse = item
          }
        })


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