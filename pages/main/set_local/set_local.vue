<template>
  <view :style="COLORTHEMECOMMON">
      <view class="pagecontent" :style="COLORTHEME">
        <view style="justify-self: center;display:flex;flex-direction: column;">
          <view class="subtitle" style="margin: 20rpx auto;font-size: 45rpx;">选择您的身份</view>
          <view class="subtitle" style="margin: 20rpx auto;"></view>
          
          <view v-for="(item,index) in idlist" style="margin: 20rpx 0;">
            <button class="BTNline" style="white-space: pre;font-size: 40rpx;margin: 30rpx auto;width: 700rpx"
              @click="savePswd(item)">
              <view class="btnicon iconfont icon-duihao" style="font-size: 40rpx;margin-right: 15rpx;">
              </view>{{item.type?"教师":"学生"}} ( 学工号：{{item.id}} )
            </button>
          </view>
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
        idlist: [],
        COLORTHEMECOMMON: g.COLORTHEMECOMMON,
        COLORTHEME: g.COLORTHEME,
        THEMEID: g.THEMEID,
        THEMETYPE: g.THEMETYPE,
        THEMELIST: g.THEMELIST,
        VERSION: g.VERSION,
        UserPasswordEnsure: '',
        UserPassword: '',
        UserPasswordOld: undefined
      }
    },
    onLoad(options) {
      that = this
      that.PageReflesh()
    },
    methods: {
      PageReflesh(){
        g.RefleshGlobalData()
        uni.setNavigationBarColor({
          backgroundColor: g.COLORTHEME["--color-main"],
          frontColor: g.COLORTHEME["--color-navitext"]
        })
        
          g.ServerReady(()=>{
            that.idlist = []
            db.sql().table(["students","departments"]).select(["*"]).where([
              "suuid_id="+ g.USERDATA.uuid,
              "sdid_id=did"
            ]).exec({
              success(res){
                for(var item of res.data){
                  that.idlist.push({
                    type: 0,
                    id: item.suid,
                    data: item
                  })
                }
              },
              fail(res){
                
              }
            })
            
            db.sql().table(["teachers","departments"]).select(["*"]).where([
              "tuuid_id=" +g.USERDATA.uuid,
              "tdid_id=did"
            ]).exec({
              success(res){
                for(var item of res.data){
                  that.idlist.push({
                    type: 1,
                    id: item.tuid,
                    data: item
                  })
                  
                }
              },
              fail(res){
                
              }
            })
          })
        
        
      },
     PasswordEnsureInput(e) {
       var text = e.detail.value
       that.UserPasswordEnsure = text
     
     },
     PasswordInput(e) {
       var text = e.detail.value
       that.UserPassword = text
     },
     OldPasswordInput(e) {
       var text = e.detail.value
       that.UserPasswordOld = text
     },
     savePswd(res){
       g.USER_STUDENTID = res.type==0?res.id:-1
       g.USER_TEACHERID = res.type==1?res.id:-1
       console.log(res)
       g.USERDATA_TYPE = res.data
       uni.navigateBack()
       
       
       /* if(typeof g.USERDATA_LOCAL.paymentpswd != 'string'||that.UserPasswordOld ==g.USERDATA_LOCAL.paymentpswd || g.USERDATA_LOCAL.paymentpswd == ""){
         if(that.UserPassword==that.UserPasswordEnsure){
           g.USERDATA_LOCAL.paymentpswd = that.UserPassword
             uni.setStorage({
               key: "USERDATA_LOCAL",
               data: g.USERDATA_LOCAL,
               success() {
                 uni.navigateBack()
               },
               fail(res) {
                 uni.showModal({
                   title:"错误",
                   content: res.errMsg,
                   showCancel: false
                 })
               }
             })
           return
         } 
       }
       
       uni.showModal({
         title:"错误",
         content: "密码错误",
         showCancel: false
       })*/
     }
      
    }
  }
</script>

<style>
.subtitle {
    font-size: 40rpx;
  }

  .formInput {
    text-align: left;
    font-size: 40rpx;
    margin-left: 20rpx;
    width: 380rpx
  }

  .formLine {
    align-items: center;
    display: flex;
    margin: 30rpx auto 0 auto;
    justify-content: space-between;
    width: 700rpx
  }
</style>
