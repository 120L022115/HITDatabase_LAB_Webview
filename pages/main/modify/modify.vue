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

        <view class="subtitle"
          style="margin: 0 auto 50rpx auto;font-size: 45rpx;justify-content: center;align-items: center;display: flex;">
          <icon :type="!ChangeSuccess?'warn':'success'" :color="'var(--color-main)'" size="55rpx"
            style="margin-right: 20rpx;"></icon>
          {{ChangeSuccess?'信息修改成功':'修改您的账号信息'}}
        </view>

        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">{{UserEmail?'*':''}}账户名</view>
          <input @input="EmailInput" class="formInput" placeholder="请输入账户名" id="email" :value="UserOriginData.email"
            :disabled="ChangeSuccess||LOADINGUPDATE" />
        </view>
        <!-- 
        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">{{DataInput.IDNO?'*':''}}身份证号</view>
          <input @input="InputData" data-id="IDNO" class="formInput" :disabled="ChangeSuccess||LOADINGUPDATE"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请输入身份证号"
            :value="UserOriginData.idNumber" />
        </view> -->

        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">{{DataInput.RealName?'*':''}}姓名</view>
          <input @input="InputData" class="formInput" :disabled="ChangeSuccess||LOADINGUPDATE"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请输入姓名"
            data-id="RealName" :value="UserOriginData.name" />
        </view>
        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">
            {{UserPassword||DataInput.originpswd||UserPasswordEnsure?'*':''}}原始密码
          </view>
          <input password @input="InputData" class="formInput" :disabled="ChangeSuccess||LOADINGUPDATE"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请输入原始密码"
            data-id="originpswd" type="safe-password" :value="UserOriginData.originpswd" />
        </view>
        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">
            {{UserPassword||DataInput.originpswd||UserPasswordEnsure?'*':''}}修改密码
          </view>
          <input password @input="PasswordInput" class="formInput" :disabled="ChangeSuccess||LOADINGUPDATE"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请输入修改密码" id="name"
            type="safe-password" :value="UserPassword" />
        </view>
        <view class="formLine">
          <view class="subtitle" style="margin-left: 10rpx;">
            {{UserPassword||DataInput.originpswd||UserPasswordEnsure?'*':''}}确认密码
          </view>
          <input password @input="PasswordEnsureInput" class="formInput" :disabled="ChangeSuccess||LOADINGUPDATE"
            style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请再输入一次密码" id="name"
            type="safe-password" :value="UserPasswordEnsure" />
        </view>
        <view style="margin-top: 50rpx;" v-if="!ChangeSuccess">
          <button class="BTNline" style="white-space: pre;font-size: 40rpx;margin: 30rpx auto;width: 700rpx"
            :disabled="!(UserPassword||DataInput.originpswd||UserPasswordEnsure||UserEmail||DataInput.IDNO||DataInput.RealName)||LOADINGUPDATE"
            @click="UserRegPre()">
            <block v-if="LOADINGUPDATE">
              <image src="@/static/images/LOADINGblack.gif" class="loadingBTNicon" mode="aspectFit"
                style="margin-right: 10rpx;"></image>
            </block>
            <block v-else>
              <view class="btnicon iconfont icon-baocun" style="font-size: 40rpx;margin-right: 15rpx;">
              </view>
            </block>
            确认修改
          </button>
        </view>
        <view v-if="ChangeSuccess" style="margin-top: 50rpx;">
          <button class="BTNline" style="white-space: pre;font-size: 40rpx;margin: 30rpx auto;width: 700rpx"
            @click="SuccessBack()">
            <view class="btnicon iconfont icon-shangyiyehoutuifanhui" style="font-size: 40rpx;margin-right: 15rpx;">
            </view>
            返回并重新登录
          </button>
        </view>

      </view>
      <view style="margin-top: 10rpx;text-align: center;">
        <view style="font-size: 30rpx;">标注*的表项被修改</view>
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
        ChangeSuccess: false,
        LOADINGUPDATE: false,
        COLORTHEMECOMMON: g.COLORTHEMECOMMON,
        COLORTHEME: g.COLORTHEME,
        THEMEID: g.THEMEID,
        THEMETYPE: g.THEMETYPE,
        THEMELIST: g.THEMELIST,
        VERSION: g.VERSION,
        UserOriginData: {
          id: 0,
          email: '',
          idNumber: '',
          name: ''
        },
        UserPasswordEnsure: '',
        UserPassword: '',
        UserEmail: '',

        DataInput: {
          IDNO: '',
          RealName: '',
          originpswd: ''
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
      that.setData({
        UserOriginData: JSON.parse(JSON.stringify(g.USERDATA))
      })
    },
    methods: {
      SuccessBack() {
        uni.navigateBack()
      },
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
          idno = that.DataInput.IDNO,
          pswdorigin = that.DataInput.originpswd;

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

        if (email == "" && idno == "" && name == "" && pswd == "" && pswden == "") {
          if (tip) showFail("请至少修改一项")
          return
        }

        if (pswd != "" || pswden != "") {

          if (pswdorigin == "") {
            if (tip) showFail("请输入原始密码")
            return
          }
          if (pswd == "") {
            if (tip) showFail("请输入修改密码")
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
        }

        that.UserReg()
      },
      UserReg() {
        var email = that.UserEmail,
          pswd = that.UserPassword,
          pswden = that.UserPasswordEnsure,
          name = that.DataInput.RealName,
          idno = that.DataInput.IDNO,
          pswdorigin = that.DataInput.originpswd;

        var text = "将修改：";
        var data = {
          //uuid: that.UserOriginData.id,
          //"id": 0,
          //"email": email,
          //"pswdhash": pswd, //salt + ":" + cr.hash.en(pswd, salt)
          //"idNumber": idno,
          //"name": name
        }



        if (email != "") {
          data.account = email;
          text += '账户名、'
        }
        if (pswd != "") {
          if (pswdorigin != g.USERDATA.password) {
            uni.showModal({
              title: "原始密码错误",
              showCancel: false
            })

            return
          }
          //data.pswdorigin = pswdorigin;
          data.password = pswd;
          text += '密码、'
        }
        /* if (idno != "") {
          data.idNumber = idno;
          text += '身份证号、'
        } */
        if (name != "") {
          data.username = name;
          text += '姓名、'
        }
        text = text.substring(0, text.length - 1);
        text += '，是否确认？'

        that.LOADINGUPDATE = true;
        uni.showModal({
          //editable: true,
          title: '修改账户信息',
          content: text,
          confirmText: '修改',
          success(res) {
            if (res.cancel) {
              that.LOADINGUPDATE = false;
            }
            if (res.confirm) {
              //var salt = cr.hash.gen()
              db.sql().table(["accounts"]).where({
                uuid: g.USERDATA.uuid
              }).update(data).exec({
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
                  g.MODIFY_STATUS = true;
                  that.ChangeSuccess = true;

                  uni.showToast({
                    title: "修改成功"
                  })
                  that.LOADINGUPDATE = false;

                  return true
                },
                fail(data) {
                  server.showFail(data.errMsg);
                  that.LOADINGUPDATE = false;
                }
              })

              //              console.log("发送数据", data)
              /* server.request({
                tipShow: false,
                title: '修改账户信息',
                tipOption: {
                  WAIT: that.WAIT
                },
                packPublicKey: true,
                urlPath: 'updateuserinfo',
                data: data,
                
              }) */

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
