<script>
  var uf = require('@/common/util.js')

  var VERSION = {
    id: 1,
    text: 'Ver.2.2.17.Beta',
    update: 'Ver.2.2.17.Beta 2022-12-17',
  }

  var g = null
  var db = require("@/common/DBserver.js")

  var initCbSet = []

  var PrivatePolicy = require('@/common/PrivatePolicy.js').PrivatePolicy
  var EXCOLORTHEME = require("@/common/themes.js").data


  export default {
    globalData: {
      USER_STUDENTID: -1,
      USER_TEACHERID: -1,

      skipSign: true,
      ENCRYPTO: {},
      COLORTHEMECOMMON: EXCOLORTHEME.common['light'],
      COLORTHEME: EXCOLORTHEME.themes['青草绿'],
      THEMEID: '青草绿',
      THEMETYPE: 'light',
      THEMELIST: EXCOLORTHEME.lists,
      VERSION: VERSION,
      PrivatePolicy: PrivatePolicy,

      USERLOGIN: false,
      USEREMAIL: '',
      USERPASSWORD: '',
      USERDATA: {},
      USERDATA_LOCAL: {},

      NewVersion: false,
      AppSet: {
        ServerOpen: false
      },
      AppInit: {
        loading: false,
        status: false, //是否可以使用
        info: ''
      },
      ServerUrl: '127.0.0.1',

      modalSet({
        o,
        title,
        content
      }) {

        o.title = title
        o.content = content
        o.show = true
      },
      modalHide(o) {
        o.show = false
      },
      //等待页面
      hideWait(obj, end) {
        obj.WAITEND = end
        obj.WAITCANCEL = true
      },
      setWait(obj, title, subtitle, buttontitle) {
        if (typeof title == 'undefined');
        else obj.title = title
        if (typeof subtitle == 'undefined');
        else obj.subtitle = subtitle
        if (typeof buttontitle == 'undefined');
        else obj.buttontitle = buttontitle
      },
      showWait(obj, title, subtitle, buttontitle, cancelfun, clear, cannotcancal) {
        if (typeof title == 'undefined') title = '请稍后'
        if (typeof subtitle == 'undefined') subtitle = '正在完成您的请求，请您耐心等待'
        if (typeof buttontitle == 'undefined') buttontitle = '取消'
        if (typeof clear == 'undefined') clear = true
        if (typeof cannotcancal == 'undefined') cannotcancal = false
        var time = '00:00',
          sec = 0
        if (!clear) {
          time = obj.time;
          sec = obj.sec
        }
        obj.show = true
        obj.title = title
        obj.subtitle = subtitle
        obj.time = time
        obj.sec = sec
        obj.buttontitle = buttontitle
        obj.cancelfun = cancelfun
        obj.hasCancel = false
        obj.cannotCancal = cannotcancal
        obj.WAITEND = undefined
        obj.WAITCANCEL = false

        var wait = obj
        var interid;
        var clock = () => {
          //console.log(wait.time, that.WAITCANCEL)
          if (!wait.WAITCANCEL) {
            wait.sec++;
            wait.time = uf.timeFormat(wait.sec)
            //that.$set(that,'WAIT.time',time)
          } else {
            clearInterval(interid)
            if (typeof wait.cancelfun == 'function') wait.cancelfun(wait.WAITEND, () => {
              wait.show = false
              //that.$set(that, 'WAITCANCELOK', true)
            })
            //that.$set(that,'WAIT.show',false)
          }
        }
        interid = setInterval(() => {
          clock()
        }, 1000)

      },

      RefleshGlobalData() {
        //g.testRequest()
        //ifdef APP-PLUS
        //  page = page.$page
        //endif
        //console.log(Object.keys(page))
        var list = getCurrentPages()
        //console.log(list.length)
        var page = list[list.length - 1].$vm
        var that = page.$data
        //console.log(JSON.stringify(list),that)
        that.COLORTHEMECOMMON = g.COLORTHEMECOMMON
        that.COLORTHEME = g.COLORTHEME
        that.THEMETYPE = g.THEMETYPE
        that.THEMEID = g.THEMEID
        that.THEMELIST = g.THEMELIST
        that.VERSION = g.VERSION
      },
      initTheme() {
        var l = EXCOLORTHEME.lists;
        var o = EXCOLORTHEME.themes;
        for (var p in l) {
          var key = l[p].name
          l[p].main = o[key]['--color-main']
          l[p].text = o[key]['--color-btn-text']
        }
        uni.getStorage({
          key: 'THEME',
          success(res) {
            console.log(res)
            g.setTheme(res.data)
          }
        })
      },
      setTheme(THEMEID) {
        console.log("设置主题", THEMEID)
        g.THEMEID = THEMEID
        g.COLORTHEME = EXCOLORTHEME.themes[THEMEID]
        var TYPE = g.THEMETYPE = EXCOLORTHEME.themes[THEMEID].type

        g.COLORTHEMECOMMON = EXCOLORTHEME.common[TYPE]
        //console.log(JSON.stringify(this.$data.COLORTHEMECOMMON),TYPE)
        uni.setStorage({
          data: THEMEID,
          key: "THEME"
        })
        console.log("设置主题完毕")
      },
      CheckVersion() {
        console.log("版本检查", g.VERSION.id, g.AppSet.Version, g.AppSet.MinVersion)
        if (g.VERSION.id < Number(g.AppSet.Version)) {
          g.NewVersion = true
          if (g.VERSION.id < Number(g.AppSet.MinVersion)) {
            g.AppInit.status = false
            g.AppInit.info = '当前版本已停用，请及时更新'
          }
          return true
        }
        return false
      },
      ServerReady(cb) {
        if (g.AppInit.status) {
          if (typeof cb == 'function') cb()
          return true
        }
        if (g.AppInit.loading) {
          if (typeof cb == 'function') initCbSet.push(cb)
        } else {
          g.AppInit.loading = true

          db.request({
            path: 'init',
            success(res) {
              var data = res.data
              console.log("APP 设置", data)
              g.AppSet = data
              g.AppInit.loading = false
              g.AppInit.status = true
              g.CheckVersion()
              if (typeof cb == 'function') cb()
              for (var i = 0; i < initCbSet.length; i++) {
                var ccb = initCbSet.shift()
                if (typeof ccb == 'function') ccb()
              }
            },
            fail(res) {
              g.AppInit.info = res.errMsg
              g.AppInit.loading = false
              g.AppInit.status = false
              if (typeof cb == 'function') cb()
              for (var i = 0; i < initCbSet.length; i++) {
                var ccb = initCbSet.shift()
                if (typeof ccb == 'function') ccb()
              }
            }
          })

        }
        return false
      },

    },

    onLaunch: function() {
      g = this.globalData
      //      console.log(11)
      g.initTheme()
      g.ServerReady()
      //console.log(uf.getTime())
      console.log('App Launch')
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style>
  @import url('@/style/iconfont.css');

  /*每个页面公共css */
  .pagecontent {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    align-self: center;
    width: 750rpx;
    overflow: hidden;
    background-color: var(--color-pageback);
    min-height: 100%;
    color: var(--color-text);
  }

  page {
    --color-main: #45bfa5;
    --color-btn-sina: #b93b1b;
    --color-btn-false: #b93b1b;
    --color-active: #50debd;
    --color-btn-press: #74b4a2;
    --color-btn-disabled: #c0d6d0;
    --color-border: #EEEEEE;
    --color-blk-back: #DDDDDD;
    --color-blk-back2: #EEEEEE;
    --color-gray: #EEEEEE;
    --color-warn: #ffe37c;
    --color-err: #ffa0a2;
    --colorimg-info: linear-gradient(90deg, #FFFFFF 0%, #EEEEEE 20%);
    --colorimg-warn: linear-gradient(90deg, #ffffff 0%, #ffe37c 20%);
    --colorimg-err: linear-gradient(90deg, #FFFFFF 0%, #ffa0a2 20%);
    --color-btn-text: #FFFFFF;
    --color-text: #000000;
    --color-texttip: #8f8f94;
    --color-pageback: #FFFFFF;
    background-color: var(--color-pageback);
  }

  input,
  textarea {
    background-color: var(--color-blk-back);
  }

  input {
    padding: 2rpx 10rpx;
    border-radius: 10rpx;
    border: 1px solid var(--color-border);
  }

  .uni-textarea-placeholder {
    color: var(--color-texttip)
  }

  .uni-input-placeholder {
    color: var(--color-texttip)
  }

  view {
    color: inherit;
    //overflow: hidden;
  }

  button[sina] {
    background-color: var(--color-btn-false) !important;
    color: var(--color-btn-text);
  }

  button {
    font-size: 40rpx;
    background-color: var(--color-main);
    color: var(--color-btn-text);
  }

  button:not([disabled]):active {
    background-color: var(--color-btn-press);
    box-shadow: 0 1px #666;
  }

  button[disabled] {
    background-color: var(--color-btn-disabled);
    color: #FFFFFF;
  }

  .loadingBTNicon {
    height: 60rpx;
    border-radius: 100rpx;
    width: 60rpx;
  }

  .BTNline {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .MID-CONTENT {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }

  .MID-CONTENT.FullHeight {}

  radio {
    font-size: 36rpx;
  }


  .topImageSlider {
    margin: 0 auto;
    width: 700rpx;
    height: 200rpx;
    border-top: 0;
    border: 0px solid var(--color-border);
    background-color: var(--color-pageback);
  }

  .topContainer {
    width: 750rpx;
  }

  .topImage {
    width: 100%;
    height: 100%;
    background-color: var(--color-pageback);
  }

  .topbarback {
    background-color: var(--color-main);
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    width: 750rpx;
  }

  .topbar {
    background-color: var(--color-main);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 600;
    width: 750rpx;
  }

  .navbarback {
    height: 110rpx;
    top: 0px;
  }

  .navigationbar {
    position: fixed;
    width: 704rpx;
    //left: 0;
    //right: 0;
    z-index: 600;
    display: flex;
    align-self: center;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    height: 60rpx;
    background-color: var(--color-main);
    padding: 25rpx;
  }

  .navigationbar.top {
    top: 0;
  }

  .navigationbar.bottom {
    bottom: 0;
  }

  .navsubbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }

  .navicon {
    height: 60rpx;
    width: 60rpx;
    font-size: 60rpx;
    margin-left: 10rpx;
    color: var(--color-btn-text);
    font-weight: 600;
  }

  .navtitle {
    font-size: 50rpx;
    color: var(--color-btn-text);
  }

  .naviMenuBack {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 20000;
  }

  .naviMenu {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 350rpx;
    left: 0;
    background-color: var(--color-main);
    z-index: 20001;
  }

  .naviMenutop {
    margin: 200rpx;
  }

  .naviMenucard {
    display: flex;
    justify-content: flex-start;
    padding: 30rpx;
    width: 340rpx;
  }

  .naviMenucard.active {
    background-color: var(--color-active);
  }

  .WaitingModel {
    z-index: 800;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .WaitingModelWin {
    width: 600rpx;
    margin-top: -100rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .WaitingModelTitle {
    font-size: 80rpx;
    color: white;
    font-weight: 500;
  }

  .WaitingModelSubtitle {
    margin-top: 30rpx;
    font-size: 40rpx;
    color: white;
    font-weight: 200;
  }

  .WaitingModelTime {
    margin-top: 80rpx;
    padding: 20rpx;
    background-color: white;
    color: black;
    font-size: 30rpx;
    width: min-content;
    height: min-content;
    border-radius: 30rpx;
  }

  .WaitingModelCancel {
    margin-top: 100rpx;
    font-size: 32rpx;
  }

  .loadingpage {
    left: 0;
    top: 0;
    position: absolute;
    justify-content: center;
    text-align: center;
    align-items: center;
    width: 90vw !important;
    padding: 5vw;
    height: 100vh;
    display: block;
  }

  .loadingphoto {
    width: 30vw;
    height: 30vw;
    border-radius: 0vw;
  }

  .loadingtop {
    margin-top: 18vh;
  }

  .loadingtext {
    font-size: 5vw;
  }

  .loadingtip {
    font-size: 4vw;
  }

  .loadingicon {
    width: 40vw;
    height: 20vw;
    border-radius: 15vw;
  }

  .MODEL {
    background: rgb(0, 0, 0, 0.5);
    position: fixed;
    z-index: 900;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .MODELbtn {
    width: 200rpx !important;
    margin: 15rpx !important;
    font-size: 30rpx !important;
  }

  .MODELtitle {
    display: flex;
    justify-content: center;
    text-align: center;
    height: 75rpx;
    line-height: 75rpx;
    font-weight: 700;
    font-size: 40rpx;
    margin: 15rpx 0;
    color: var(--color-text);
  }

  .MODELrow {
    display: flex;
    justify-content: space-around;
  }

  .MODELchild {
    max-width: 600rpx;
    position: fixed;
    display: block;
    border-radius: 30rpx;
    padding: 30rpx 50rpx;
    opacity: 1;
    background-color: var(--color-blk-back);
    justify-content: space-between;
    align-items: center;
  }

  .MODELchildimg {
    position: fixed;
    display: block;
    border-radius: 15rpx;
    padding: 0;
    justify-content: center;
  }

  .MODELtext {
    text-align: left;
    height: 50vh;
    overflow-y: scroll;
    word-break: break-all;
    overflow-x: hidden;
    white-space: pre-wrap;
    font-size: 30rpx;
    justify-content: center;
    display: block;
    margin: 21rpx;
  }

  .MODELblock {
    justify-content: center;
    text-align: center;
    display: block;
    margin: 3vw;
  }

  .MODELpicker {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    border-radius: 2vw;
    padding-left: 2vw;
    padding-right: 2vw;
    line-height: 6vw;
    font-size: 4vw;
    height: 8vw;
  }

  .MODELinput {
    text-align: left;
    border-radius: 2vw;
    padding-left: 2vw;
    padding-right: 2vw;
    line-height: 6vw;
    font-size: 4vw;
    height: 8vw;
  }
</style>