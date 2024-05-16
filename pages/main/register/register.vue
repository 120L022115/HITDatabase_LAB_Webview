<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">

      <!--等待页面-->
      <view class="WaitingModel" v-if="WAIT.show">
        <view class="WaitingModelWin">
          <view class="WaitingModelTitle">{{WAIT.title}}</view>
          <view class="WaitingModelSubtitle">{{WAIT.subtitle}}</view>
          <view class="WaitingModelTime">{{WAIT.time}}</view>
          <button v-if="!WAIT.cannotCancal" class="WaitingModelCancel" :disabled="WAIT.WAITCANCEL"
            @click="hideWait(false)">{{!WAIT.WAITCANCEL?WAIT.buttontitle:(WAIT.WAITEND?'即将完成':'正在取消')}}</button>
        </view>
      </view>

      <view style="justify-self: center;display:flex;flex-direction: column;">
        <view style="justify-content: center;align-items: center;display: flex;">
          <image src="@/static/logo.png" mode="aspectFit" style="height: 400rpx;"></image>
        </view>
        <view class="subtitle" style="margin: 20rpx auto;font-size: 45rpx;">注册账号
        </view>

        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">账户名</view>
          <input @input="EmailInput" class="formInput" placeholder="请输入账户名" id="email" :disabled="LOADINGREG"
            :value="UserEmail" />
        </view>

        <!-- <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">身份证号</view>
          <input @input="InputData" data-id="IDNO" class="formInput" :disabled="LOADINGREG"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请输入身份证号"
            :value="DataInput.IDNO" />
        </view> -->

        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">姓名</view>
          <input @input="InputData" class="formInput" :disabled="LOADINGREG"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请输入姓名"
            data-id="RealName" :value="DataInput.RealName" />
        </view>

        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">密码</view>
          <input password @input="PasswordInput" class="formInput" :disabled="LOADINGREG"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请输入密码" id="name"
            type="safe-password" :value="UserPassword" />
        </view>
        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">确认密码</view>
          <input password @input="PasswordEnsureInput" class="formInput" :disabled="LOADINGREG"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请再输入一次密码" id="name"
            type="safe-password" :value="UserPasswordEnsure" />
        </view>
        <view style="margin: 20rpx;">
          <button class="BTNline" style="white-space: pre;font-size: 40rpx;margin: 30rpx auto;width: 700rpx"
            :disabled="LOADINGREG" @click="UserRegPre()">
            <block v-if="LOADINGREG">
              <image src="@/static/images/LOADINGblack.gif" class="loadingBTNicon" mode="aspectFit"
                style="margin-right: 10rpx;"></image>
            </block>
            <view v-if="!LOADINGREG" class="btnicon iconfont icon-denglu" style="margin-right: 15rpx;font-size: 40rpx;">
            </view>注册
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
        LOADINGREG: false,

        COLORTHEMECOMMON: g.COLORTHEMECOMMON,
        COLORTHEME: g.COLORTHEME,
        THEMEID: g.THEMEID,
        THEMETYPE: g.THEMETYPE,
        THEMELIST: g.THEMELIST,
        VERSION: g.VERSION,
        UserPasswordEnsure: '',
        UserPassword: '',
        UserEmail: '',

        DataInput: {
          IDNO: '',
          RealName: ''
        },

        WAITCANCEL: false,
        WAIT: {
          show: false,
          title: '',
          subtitle: '',
          time: '00:00',
          sec: 0,
          buttontitle: '',
          cancelfun: null,
          hasCancel: false,
          cannotCancal: false,
          WAITEND: false,
          WAITCANCEL: false
        },
        WAITEND: undefined, //是否不是人工取消，即计算完成了
      }
    },
    onLoad(options) {
      that = this
      that.PageReflesh()
    },
    methods: {
      InputData(e) {
        var id = e.currentTarget.dataset.id;
        console.log(id, e.detail.value)
        that.DataInput[id] = e.detail.value
      },
      PageReflesh() {
        g.RefleshGlobalData()
        uni.setNavigationBarColor({
          backgroundColor: g.COLORTHEME["--color-main"],
          frontColor: g.COLORTHEME["--color-navitext"]
        })
      },
      UserRegPre() {
        var tip = true

        var email = that.UserEmail,
          pswd = that.UserPassword,
          pswden = that.UserPasswordEnsure,
          name = that.DataInput.RealName,
          idno = that.DataInput.IDNO;

        console.log(that.DataInput)

        var showFail = (text) => {
          uni.hideLoading()
          uni.showModal({
            title: '注册失败',
            content: text,
            showCancel: false
          })
        }
        //console.log(JSON.stringify(data))

        if (email == "") {
          if (tip) showFail("请输入账户名")
          return
        }
        /*if (email.indexOf("@") == -1 || email == "") {
          if (tip) uni.showModal({
            title: "提示",
            content: "请输入正确的邮箱地址！",
            showCancel: false
          })
          return
        }*/

        /* if (idno == "") {
          if (tip) showFail("请输入身份证号")
          return
        } */
        if (name == "") {
          if (tip) showFail("请输入姓名")
          return
        }
        if (pswd == "") {
          if (tip) showFail("请输入密码")
          return
        }
        if (pswd == "") {
          if (tip) showFail("请输入密码")
          return
        }
        if (pswden == "") {
          if (tip) showFail("请输入确认密码")
          return
        }

        if (pswden != pswd) {
          if (tip) showFail("两次输入密码不一致")
          return
        }
        that.UserReg()
      },
      UserReg() {
        that.LOADINGREG = true;
        var email = that.UserEmail,
          pswd = that.UserPassword,
          pswden = that.UserPasswordEnsure,
          name = that.DataInput.RealName; //idno = that.DataInput.IDNO;

        uni.showModal({
          //editable: true,
          title: '请牢记您的账号信息',
          content: '账户名：' + email + "\n密码：" + pswd,
          confirmText: '注册',
          success(res) {
            if (res.cancel) {
              that.LOADINGREG = false;
            }
            if (res.confirm) {
              //var salt = cr.hash.gen()
              var data = {
                //"id": 0,
                "account": email,
                "password": pswd, //salt + ":" + cr.hash.en(pswd, salt)
                //"idNumber": idno,
                "username": name
              }
              db.sql().table(["accounts"]).insert(data).exec({
                success: (data) => {

                  g.USEREMAIL = email
                  g.USERPASSWORD = pswd
                  uni.setStorage({
                    data: {
                      'email': email,
                      'pswd': pswd
                    },
                    key: 'USERLOGIN'
                  })
                  uni.showModal({
                    title: "注册成功",
                    showCancel: false,
                    success() {
                      uni.navigateBack()
                    }
                  })

                  that.LOADINGREG = false;
                },
                fail(data) {
                  server.showFail(data.errMsg);
                  that.LOADINGREG = false;
                }
              })


            }
          }
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
      EmailInput(e) {
        var text = e.detail.value
        that.UserEmail = text
      },
      //等待页面
      hideWait(end) {
        g.hideWait(that.WAIT, end)
      },
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
