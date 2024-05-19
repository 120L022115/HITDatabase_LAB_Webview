<template>
  <view :style="COLORTHEMECOMMON">
    <view class="pagecontent" :style="COLORTHEME">
      <!--富文本信息弹窗-->
      <view class="MODEL" v-if="MODAL.show">
        <view class="MODELchild">
          <view class="MODELtitle">
            <text>{{MODAL.title}}</text>
          </view>
          <scroll-view :scroll-y="true" style="font-size: 32rpx; max-height: 70vh">
            <rich-text :nodes="MODAL.content"></rich-text>
          </scroll-view>
          <view class="MODELrow">
            <button class="MODELbtn" data-id="hide" @tap="modalHide">关闭</button>
          </view>
        </view>
      </view>
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

      <!--手机顶部状态栏-->
      <view class="topbarback" :style="navHeightStyle"></view>
      <view class="topbar" :style="navHeightStyle"></view>

      <!--左侧抽屉导航-->
      <uni-drawer ref="navMenu" mode="left" @change="MenuChange($event)">
        <view class="naviMenutop">

        </view>
        <view v-for="(item,index) in PAGES" :class="'naviMenucard '+(item.id==PAGE?'active':'')"
          @click="changePage(item.id)">
          <view :class="'navicon '+item.icon"></view>
          <view class="navtitle" style="margin-left: 30rpx;">{{item.text}}</view>
        </view>
      </uni-drawer>

      <!--顶部导航-->
      <view class="navbarback" :style="'background-color: '+(PAGE==0?'var(color-main)':'transparent')+';'"></view>
      <view class="navigationbar" :style="navTopStyle">
        <!--左侧-->
        <view class="navsubbar">
          <view @click="showDrawer('navMenu')" class="navicon iconfont icon-fenlei"></view>
        </view>
        <!--右侧-->
        <view class="navsubbar">
          <view class="navtitle" @click="testRequest()">{{WINTITLE?WINTITLE:'教务管理'}}</view>

        </view>
      </view>

      <!--关于-->
      <block v-if="PAGE==2">
        <image class="logoImg" src="../../static/logo.png"></image>
        <view class="text-area" style="margin: 20rpx;">
          <view class="subtitle" style="font-size: 50rpx;font-weight: 400;">教务管理</view>
        </view>
        <view class="text">{{VERSION.text}}</view>
        <button class="linebtnn" @click="testRequest">插入测试用例</button>
        <view class="textcellarea">
          <view class="textcell">{{VERSION.update}}</view>
        </view>
        <view v-if="false" class="tiparea"
          style="width: 700rpx;justify-content: center;display: flex;flex-direction: column;text-align: center;">
          <uni-collapse class="tiparea" ref="collapseInfo" v-model="value">
            <uni-collapse-item style="width: 700rpx;" title="日志" thumb="iconfont icon-tishi" class="tipcard info">
              <text class="infotext" style="overflow-y: scroll;">{{info}}</text>
            </uni-collapse-item>
          </uni-collapse>
        </view>
        <view class="infocell">
          <view class="iconfont icon-ziliaoku infocell-icon"></view>
          <view class="infocell-text">
            <view class="text" style="font-size: 40rpx;">主题设置</view>
            <view class="UILIST">
              <view v-for="(item,index) in THEMELIST" class="UIitem" @click="setTheme(item.id)">
                <view class="UISelectDui" :style="'color:'+item.text+';background-color:'+item.main">
                  <view v-if="THEMEID==item.id" class="iconfont icon-duihao"></view>
                </view>
                <view class="UISelectName">
                  {{item.name}}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="infocell">
          <view class="iconfont icon-kefu infocell-icon"></view>
          <view class="infocell-text">
            <view class="text">联系我们</view>
            <view class="text">Email: 1487819688@qq.com</view>
          </view>
        </view>
        <view class="infocell">
          <view class="iconfont icon-tishi infocell-icon"></view>
          <view class="infocell-text">
            <view class="text">隐私政策</view>
            <view class="text" @click="showPrivacy">点击此处查看</view>
          </view>
        </view>
        <view class="infocell" style="margin-bottom: 100rpx;">
          <view class="iconfont icon-banquan infocell-icon"></view>
          <view class="infocell-text">
            <view class="text">教务管理</view>
            <view class="text"> 版权所有</view>
          </view>
        </view>
      </block>
      <!--账户-->
      <block v-if="PAGE==4">
        <view class="MID-CONTENT FullHeight" :style="'min-height: calc(100vh - 220rpx - '+statusBarHeight+'px);'">
          <block v-if="USERLOGIN">
            <view style="margin-top: 100rpx;">
              <button class="addBtn">
                <view class="iconfont icon-duihao" style="font-size: 80rpx;"></view>
              </button>
              <view style="margin-top: 100rpx;"></view>
              <view class="subtitle" style="font-size: 50rpx;">{{UserEmail}}</view>
              <view class="subtitle" style="font-size: 35rpx;">账户已登录</view>
            </view>
            <view>
              <button class="BTNline linebtnn" @click="setAccountInfo()">
                <view class="btnicon iconfont icon-shezhi">
                </view>修改账户信息
              </button>
              <button class="BTNline linebtnn" @click="setPayPswd()">
                <view class="btnicon iconfont icon-shezhi">
                </view>
                {{USER_STUDENTID==-1&&USER_TEACHERID==-1?"选择您的身份":("已选择 ( "+ (USER_STUDENTID!=-1 ? "学生 "+USER_STUDENTID: "教师 "+ USER_TEACHERID )+" )")}}
              </button>
              <button class="BTNline linebtnn" @click="QuitLogin()">
                <view class="btnicon iconfont icon-cuo">
                </view>退出登录
              </button>
            </view>

          </block>
          <block v-else>
            <view style="margin-top: 50rpx;">
              <button class="addBtn">
                <view class="iconfont icon-zhanghao" style="font-size: 80rpx;"></view>
              </button>
              <view class="subtitle" style="margin-top:50rpx;margin-left: 10rpx;">登录/注册您在本应用的账号
              </view>

              <view class="formLine">
                <view class="subtitle" style="margin-left: 10rpx;">账户名</view>
                <input @input="EmailInput" class="formInput" placeholder="请输入账户名" id="email" :value="UserEmail"
                  :disabled="LOADINGSTATUS" />
              </view>
              <view class="formLine">
                <view class="subtitle" style="margin-left: 10rpx;">密码</view>
                <input password @input="PasswordInput" class="formInput"
                  style="text-align: left;font-size:40rpx;margin-left:20rpx;width: 380rpx" placeholder="请输入密码" id="name"
                  :disabled="LOADINGSTATUS" type="safe-password" :value="UserPassword" />
              </view>
              <view style="margin: 0 ;">
                <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="UserLogin(true)">
                  <block v-if="LOADINGDETAIL.login">
                    <image src="@/static/images/LOADINGblack.gif" class="loadingBTNicon" mode="aspectFit"
                      style="margin-right: 10rpx;"></image>
                  </block>
                  <block v-else>
                    <view class="btnicon iconfont icon-zhanghao"></view>
                  </block>

                  登录
                </button>
                <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="UserRegPre()">
                  <view class="btnicon iconfont icon-bianji">
                  </view>注册
                </button>
              </view>
            </view>
          </block>
        </view>

      </block>
      <!--管理-->
      <block v-if="PAGE==0">
        <block v-if="USER_ADMIN">
          <view class="tipbtnarea">
            <view class="formLine">
              <button style="width: 150rpx; font-size: 30rpx;" v-for="(item,index) in qModelist"
                :disabled="index==qmodelid" @click="setqmodelid(index)">{{item}}</button>
            </view>
            <view v-for="(item,index) in qmodeltype[qmodelid]">
              <view class="formLine">
                <view style="font-size: 40rpx;">{{item.info}}</view>
                <button class="icon-cuo iconfont" style="font-size: 20rpx;"
                  @click="setmodelinput({detail:{value:''}},item.type)"></button>
                <block v-if="item.type=='json'">
                  <textarea style="width: 400rpx;height: 200rpx;text-align: left;padding: 20rpx;" maxlength="-1"
                    :placeholder="item.type" @input="setmodelinput($event,item.type)" :value="qmodelvalue[item.type]" />
                </block>
                <input v-else class="formInput" :placeholder="item.type" @input="setmodelinput($event,item.type)"
                  :value="qmodelvalue[item.type]" />
              </view>
              <view class="formLine">
                <view @click="appendstr(item.type,key.val)" v-for="(key,kindex) in qmodelpre[item.type]">{{key.info}}
                </view>
              </view>

            </view>
            <view style="margin-top: 20rpx;" @click="getsql(true)">
              <button class="BTNline" style="white-space: pre;font-size: 40rpx;margin-top: 10rpx;width: 700rpx;">
                <view class="btnicon iconfont icon-chakan">
                </view>构建
              </button>
            </view>
            <textarea style="width: 660rpx;height: 200rpx;text-align: left;padding: 20rpx;margin: 20rpx 0;"
              placeholder="SQL" @input="setSql($event)" maxlength="-1" :value="SQL" />
            <view style="margin-top: 20rpx;display: flex;">
              <button class="BTNline" style="white-space: pre;font-size: 40rpx;margin-top: 10rpx;width: 400rpx;"
                @click="ShowPop">
                <view class="btnicon iconfont icon-chakan">
                </view>工具与历史
              </button>
              <button class="BTNline" style="white-space: pre;font-size: 40rpx;margin-top: 10rpx;width: 200rpx;"
                @click="getsql()">
                <view class="btnicon iconfont icon-chakan">
                </view>执行
              </button>
            </view>
            <block v-if="roomlist.length==0">
              <view class="tline">结果为空</view>
            </block>
            <view v-else v-for="(item,index) in roomlist" class="tline"
              style="margin: 20rpx;border: 1px solid var(--color-main);padding: 20rpx;">
              <view>
                <view v-for="(key,i) in Object.keys(item)"
                  style="display: flex;justify-content: space-between;align-items: center;width: 100%;text-align: left !important;">
                  <view class="ltitle" style="width: 300rpx;font-weight: 600;">{{key}}</view>
                  <view style="width: 300rpx;">{{item[key]}}
                  </view>
                </view>

              </view>

            </view>
          </view>
          <!-- 底部弹出层 -->
          <view class="pop" @touchmove.stop.prevent="">
            <!-- 	蒙层 -->
            <view v-if="false" class="pop-mask" @tap="HidePop"></view>
            <!-- 内容块 -->
            <view class="pop-box" :animation="popanimationData">
              <view class="pop-headline">
                <view style="display: flex;">SQL工具与历史<button @click="changeHistoryType"
                    style="margin-left: 10rpx;padding: 5rpx 10rpx;line-height: 40rpx;display: flex;justify-content: center;align-items: center;font-size: 30rpx;">{{!HistoryType?'历史':'工具'}}</button>
                </view><text class="iconfont icon-cuo" @click="HidePop"></text>
              </view>
              <scroll-view class="infoarea" scroll-y="true" style="height: calc(55vh - 80rpx);">
                <view v-for="(item,index) in UTILSQL[['tools','history'][HistoryType]]"
                  style="padding: 10rpx;margin-top: 10rpx;border-bottom: 1px solid var(--color-border);"
                  @click="setHistoryToSql(item.sql)">
                  <view>{{item.sql}}</view>
                  <view style="font-size: 25rpx;">{{item.info}}</view>
                </view>
              </scroll-view>
            </view>
          </view>
        </block>
        <block v-else>
          <view class="subtitle" style="margin-top:00rpx;margin-left: 10rpx;">您不具有管理员权限！
          </view>

        </block>
      </block>



      <!--教师-->
      <block v-if="PAGE==1">
        <block v-if="!USERLOGIN || USER_TEACHERID<0">
          <view class="subtitle" style="width: 700rpx;margin: auto;text-align:left"></view>
          <view class="subtitle" style="margin-top:50rpx;margin-left: 10rpx;">您不是教师！暂无此权限！
          </view>
          <view class="subtitle" style="margin-left: 10rpx;">您可切换登录或注册
          </view>
          <view style="margin: 0 ;">
            <button class="BTNline linebtnn" @click="changePage(4)">
              <view class="btnicon iconfont icon-zhanghao">
              </view>登录/注册
            </button>
          </view>
        </block>
        <block v-else>
          <view style="margin: 0 ;">
            <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="transferBalance()">
              <view class="btnicon iconfont icon-zhuanzhang">
              </view>空教室查询
            </button>
            <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="chargeBalance(2)">
              <block v-if="LOADINGDETAIL.withdraw">
                <image src="@/static/images/LOADINGblack.gif" class="loadingBTNicon" mode="aspectFit"
                  style="margin-right: 10rpx;"></image>
              </block>
              <block v-else>
                <view class="btnicon iconfont icon-wukaqukuan"></view>
              </block>
              课程管理
            </button>
            <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="chargeBalance(1)">
              <block v-if="LOADINGDETAIL.charge">
                <image src="@/static/images/LOADINGblack.gif" class="loadingBTNicon" mode="aspectFit"
                  style="margin-right: 10rpx;"></image>
              </block>
              <block v-else>
                <view class="btnicon iconfont icon-cunkuan"></view>
              </block>
              填写成绩
            </button>
          </view>
          <view class="">
            <view class="subtitle" style="margin-top:50rpx;margin-left: 10rpx;">工号：{{USERDATA_TYPE.tuid }}
            </view>
            <view class="subtitle" style="margin-bottom:50rpx;margin-left: 10rpx;">
              学院（教学专业）：{{USERDATA_TYPE.dname+"("+USERDATA_TYPE.dmajor+")"}}
            </view>
          </view>

        </block>


      </block>
      <!--学生-->
      <block v-if="PAGE==3">
        <view class="MID-CONTENT FullHeight" :style="'min-height: calc(100vh - 220rpx - '+statusBarHeight+'px);'">

          <!--未登录-->
          <block v-if="!USERLOGIN || USER_STUDENTID < 0">
            <view class="subtitle" style="width: 700rpx;margin: auto;text-align:left"></view>
            <view class="subtitle" style="margin-top:50rpx;margin-left: 10rpx;">您不是学生！暂无此权限
            </view>
            <view class="subtitle" style="margin-left: 10rpx;">您可切换登录或注册
            </view>
            <view style="margin: 0 ;">
              <button class="BTNline linebtnn" @click="changePage(4)">
                <view class="btnicon iconfont icon-zhanghao">
                </view>登录/注册
              </button>
            </view>
          </block>
          <block v-else>
            <view style="margin: 0 ;">
              <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="transferBalance()">
                <view class="btnicon iconfont icon-zhuanzhang">
                </view>空教室查询
              </button>
              <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="withdrawBalance()">
                <block v-if="LOADINGDETAIL.withdraw">
                  <image src="@/static/images/LOADINGblack.gif" class="loadingBTNicon" mode="aspectFit"
                    style="margin-right: 10rpx;"></image>
                </block>
                <block v-else>
                  <view class="btnicon iconfont icon-wukaqukuan"></view>
                </block>
                选课
              </button>
              <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="chargeBalance()">
                <block v-if="LOADINGDETAIL.charge">
                  <image src="@/static/images/LOADINGblack.gif" class="loadingBTNicon" mode="aspectFit"
                    style="margin-right: 10rpx;"></image>
                </block>
                <block v-else>
                  <view class="btnicon iconfont icon-cunkuan"></view>
                </block>
                成绩查询
              </button>
              <button class="BTNline linebtnn" :disabled="LOADINGSTATUS" @click="chargeBalance(3)">
                <block v-if="LOADINGDETAIL.charge">
                  <image src="@/static/images/LOADINGblack.gif" class="loadingBTNicon" mode="aspectFit"
                    style="margin-right: 10rpx;"></image>
                </block>
                <block v-else>
                  <view class="btnicon iconfont icon-cunkuan"></view>
                </block>
                培养方案
              </button>

            </view>
            <view class="">
              <view class="subtitle" style="margin-top:50rpx;margin-left: 10rpx;">学号：{{USERDATA_TYPE.suid }}
              </view>
              <view class="subtitle" style="margin-top:0rpx;margin-left: 10rpx;">年级：{{USERDATA_TYPE.sgrade }}
              </view>
              <view class="subtitle" style="margin-bottom:50rpx;margin-left: 10rpx;">
                学院（专业）：{{USERDATA_TYPE.dname+"("+USERDATA_TYPE.dmajor+")"}}
              </view>
            </view>

          </block>


        </view>
      </block>


      <!--底部工具栏-->
      <block>
        <view class="navbarback"></view>
        <view class="navigationbar bottom">
          <!--左侧-->
          <view class="navsubbar">
            <block v-if="PAGE != 1 || true">
              <block v-if="true">
                <view v-for="(item,index) in PAGES" @click="changePage(item.id)"
                  :style="'width: '+700/PAGES.length+'rpx;'+(PAGE==item.id?'background-color: var(--color-btn-text);color: var(--color-main) !important;border-radius: 30rpx':'')"
                  style="display: flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
                  <view :style="(PAGE==item.id?'color: var(--color-main) !important':'')" style="margin: 0;"
                    :class="'navicon '+item.icon"></view>
                  <view class="modeText" :style="(PAGE==item.id?'color: var(--color-main) !important':'')"
                    style="margin:0 0 0 0rpx;padding:0;">{{item.text}}</view>
                </view>
              </block>
            </block>
            <!-- <block v-if="PAGE == 1">

              <view @click="changePage(0)" :class="'navicon iconfont icon-shouye'"></view>
            </block> -->
          </view>
          <!--右侧-->
          <view class="navsubbar">
            <!-- <block v-if="PAGE==1">
              <view @click="refleshLiushui()" class="navicon iconfont icon-shuaxin"></view>
            </block> -->
          </view>
        </view>
      </block>

    </view>

  </view>
</template>

<script>
  import {
    PrivatePolicy
  } from "../../common/PrivatePolicy"
  var uf = require('@/common/util.js')
  var that = null
  var app = getApp()
  var g = app.globalData
  var db = require("@/common/DBserver.js")



  var originjson = {
    accounts: {
      val: '{\n "account": "",\n "password": "",\n"admin": 0,\n"uuid": 1,\n"username": ""\n}',
      info: '账号'
    },
    departments: {
      val: '{\n "did": 1,\n "dname": "",\n"dmajor": ""\n}',
      info: '部门'
    },
    courses: {
      val: '{\n "cid": 1,\n "cname": "",\n"crid_id": 1,\n"ctuid_id": 1\n}',
      info: '课程'
    },
    plan: {
      val: '{\n "pid": 1,\n "pcid_id": 1,\n"pdid_id": 1\n}',
      info: '方案'
    },
    rooms: {
      val: '{\n "rid": 1,\n "rtime": 1,\n"rname": "",\n"rbuilding": ""\n}',
      info: '教室'
    },
    scores: {
      val: '{\n "sid": 1,\n "score": 1,\n"scid_id": 1,\n"suid_id": 1\n}',
      info: '选课'
    },
    students: {
      val: '{\n "suid": 1,\n "sgrade": 2021,\n"sdid_id": 1,\n"suuid_id": 1\n}',
      info: '学生'
    },
    teachers: {
      val: '{\n "tuid": 1,\n "tdid_id": 1,\n"tuuid_id": 1\n}',
      info: '教师'
    }
  }

  export default {
    data() {
      return {
        UTILSQL: {
          history: [],
          tools: [{
            info: '联合查询：教室、教师和课程、及教师名',
            sql: 'tool1'
          }, {
            sql: 'tool2',
            info: '分组查询：查询课程的学生总数，按大到小排序'
          }, {
            sql: 'tool3',
            info: '嵌套查询：查询被选了2次以上的课程名'
          }, {
            sql: 'tool4',
            info: '分组查询：所有挂科学生和最低分数'
          }]
        },
        HistoryType: 1,
        qModelist: ["增", "删", "查", "改"],
        qmodelid: 0,
        qmodelpre: {

          from: [{
            val: 'accounts',
            info: '账号'
          }, {
            val: 'departments',
            info: '部门'
          }, {
            val: 'courses',
            info: '课程'
          }, {
            val: 'plan',
            info: '方案'
          }, {
            val: 'rooms',
            info: '教室'
          }, {
            val: 'scores',
            info: '选课'
          }, {
            val: 'students',
            info: '学生'
          }, {
            val: 'teachers',
            info: '教师'
          }],
          select: [{
            val: '*',
            info: '*'
          }],
          where: [],
          groupby: [],
          orderby: [],
          having: [],
          json: [{
            val: '{\n "account": ,\n "password": ,\n"admin": ,\n"uuid": ,\n"username": \n}',
            info: '账号'
          }, {
            val: '{\n "did": ,\n "dname": ,\n"dmajor": \n}',
            info: '部门'
          }, {
            val: '{\n "cid": ,\n "cname": ,\n"crid_id": ,\n"ctuid_id": \n}',
            info: '课程'
          }, {
            val: '{\n "pid": ,\n "pcid_id": ,\n"pdid_id": \n}',
            info: '方案'
          }, {
            val: '{\n "rid": ,\n "rtime": ,\n"rname": ,\n"rbuilding": \n}',
            info: '教室'
          }, {
            val: '{\n "sid": ,\n "score": ,\n"scid_id": ,\n"suid_id": \n}',
            info: '选课'
          }, {
            val: '{\n "suid": ,\n "sgrade": ,\n"sdid_id": ,\n"suuid_id": \n}',
            info: '学生'
          }, {
            val: '{\n "tuid": ,\n "tdid_id": ,\n"tuuid_id": \n}',
            info: '教师'
          }]
        },
        qmodeltype: [
          [{ //增
            info: 'table',
            type: 'from'
          }, {
            info: 'insert',
            type: 'json'
          }],
          [{ //删
            info: 'table',
            type: 'from'
          }, {
            info: 'where',
            type: 'where'
          }],
          [{ //查
            info: 'from',
            type: 'from'
          }, {
            info: 'select',
            type: 'select'
          }, {
            info: 'where',
            type: 'where'
          }, {
            info: 'groupby',
            type: 'groupby'
          }, {
            info: 'having',
            type: 'having'
          }, {
            info: 'orderby',
            type: 'orderby'
          }],
          [{ //改
            info: 'table',
            type: 'from'
          }, {
            info: 'where',
            type: 'where'
          }, {
            info: 'update',
            type: 'json'
          }]
        ],
        qmodelvalue: {
          select: '',
          where: '',
          from: '',
          groupby: '',
          orderby: '',
          having: '',
          json: ''
        },

        SQL: '',
        roomlist: [],
        //主题信息
        USERDATA_TYPE: {},
        USER_STUDENTID: -1,
        USER_TEACHERID: -1,
        USER_ADMIN: false,

        showBanlance: false,
        LOADINGSTATUS: false,
        LOADINGDETAIL: {
          withdraw: false,
          charge: false,
          reflesh: false,
          login: false
        },
        COLORTHEMECOMMON: g.COLORTHEMECOMMON,
        COLORTHEME: g.COLORTHEME,
        THEMEID: g.THEMEID,
        THEMETYPE: g.THEMETYPE,
        THEMELIST: g.THEMELIST,
        VERSION: g.VERSION,
        //页面切换相关信息
        PAGE: 4,
        PAGES: [{
          id: 0,
          text: '管理',
          title: '教务管理',
          icon: 'iconfont icon-shouye'
        }, {
          id: 1,
          text: '教师',
          title: '教师',
          icon: 'iconfont icon-caiwuliushui'
        }, {
          id: 3,
          text: '学生',
          title: '学生',
          icon: 'iconfont icon-qianbao'
        }, {
          id: 4,
          text: '账户',
          title: '账户',
          icon: 'iconfont icon-zhanghao'
        }, {
          id: 2,
          text: '关于',
          title: '关于',
          icon: 'iconfont icon-tishi'
        }],
        MODAL: {
          show: false,
          title: '',
          content: ''
        },
        //等待页面
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
          WAITCANCEL: false,
          WAITEND: false //是否不是人工取消，即计算完成了
        },
        USERDATA: {
          id: 0,
          banlance: 0,
          email: '',
          name: '',

        },
        USERDATA_LOCAL: {},
        LoadingHistory: true,
        HISTORY: [{
          text: "转账给xx",
          amount: -1,
          time: "xxx",
          id: 0
        }, {
          text: "转账给xx",
          amount: 10,
          time: "xxx",
          id: 1
        }, {
          text: "转账给xx",
          amount: -1,
          time: "xxx",
          id: 2
        }],
        //系统与页面相关信息
        value: [0], //日志的开启状态
        scrollTop: 0,
        showLeft: false, //抽屉
        navMenu: false,
        info: "", //日志
        WINTITLE: '',
        statusBarHeight: 0,
        navTopStyle: 'top:0px;',
        navHeightStyle: 'height:0px',

        //用户登录相关信息
        USERLOGIN: false,
        UserEmail: '',
        UserPassword: '',
        popanimationData: null,
        popIsShow: false,
      }
    },
    onShow() {
      console.log(g.MODIFY_STATUS, that.USERLOGIN)
      if (g.MODIFY_STATUS == true) {
        that.USERLOGIN = false;
        g.MODIFY_STATUS = false;
      }
      g.ServerReady(() => {
        that.USERDATA = g.USERDATA
        that.USERDATA_LOCAL = g.USERDATA_LOCAL
        that.USER_STUDENTID = g.USER_STUDENTID
        that.USER_TEACHERID = g.USER_TEACHERID
        that.USERDATA_TYPE = g.USERDATA_TYPE
      })
    },
    onLoad(options) {
      that = this
      uni.getStorage({
        key: 'USERLOGIN',
        success(res) {
          console.log(res)
          that.UserEmail = res.data.email
          that.UserPassword = res.data.pswd
        }
      })
      uni.getStorage({
        key: 'USERDATA_LOCAL',
        success(res) {
          console.log(res)
          g.USERDATA_LOCAL = res.data
          that.USERDATA_LOCAL = g.USERDATA_LOCAL
        }
      })
      that.addinfo("正在初始化")
      var h = uni.getSystemInfoSync().statusBarHeight
      that.$set(that, 'statusBarHeight', h.toString())
      that.$set(that, 'navTopStyle', 'top:' + h + 'px;')
      that.$set(that, 'navHeightStyle', 'height:' + h + 'px;')
      that.HidePop()

    },
    onReady(e) {
      /*
      uni.createSelectorQuery().select("#tmpcanvas").boundingClientRect().exec(function(res) {
        console.log('canvasInfo', JSON.stringify(res[0]))
        that.$set(that, 'canvasShow', false)
        that.$set(that, 'canvasInfo', res[0])
        that.addinfo("初始化完成")
      })*/

    },
    // app端拦截返回事件 ，仅app端生效
    onBackPress() {
      if (that.showLeft) {
        that.$refs.showLeft.close()
        return true
      }
    },
    onPageScroll(top) {
      that.$set(that, 'scrollTop', top.scrollTop);
    },
    methods: {
      /*
      	工具函数
      */
      changeHistoryType() {
        that.HistoryType = (that.HistoryType + 1) % 2
      },
      ShowPop() {
        var animation = uni.createAnimation({
          duration: 500,
        })
        animation.translateY(0).step();
        that.canvasModeId = 0
        that.popanimationData = null;
        that.popIsShow = true;
        that.popanimationData = animation.export();
      },
      HidePop() {
        var animation = uni.createAnimation({
          duration: 300
        })
        that.canvasModeId = 1
        animation.translateY(600).step()
        that.popanimationData = null;
        that.popanimationData = animation.export();
        setTimeout(() => {
          that.popIsShow = false
        }, 200)
      },
      appendstr(type, str) {
        console.log(type, str)
        if (type == 'json') {
          that.qmodelvalue[type] = str;
          return
        }
        if (that.qmodelvalue[type] != '') that.qmodelvalue[type] += "," + str
        else {
          that.qmodelvalue[type] += str
          var obj = originjson[that.qmodelvalue.from]
          if (typeof obj == 'object') {
            var arr = []
            var oa = Object.keys(JSON.parse(obj.val))
            for (var p of oa) {
              arr.push({
                val: p,
                info: p
              })
            }

            that.qmodelpre.select = arr.concat([{
              val: "*",
              info: "*"
            }])
            that.qmodelpre.where = arr
            that.qmodelpre.groupby = arr
            that.qmodelpre.orderby = arr
            that.qmodelpre.having = arr
          }

        }



      },
      setmodelinput(e, type) {
        that.qmodelvalue[type] = e.detail.value
      },
      setqmodelid(index) {
        that.qmodelid = index
      },
      getsql(onlybuild) {

        var deal = (ori) => {
          var obj = {}
          for (var key of Object.keys(ori)) {
            if (ori[key] == "") {
              obj[key] = []
              continue
            }
            if (key == 'orderby') {
              var arr = ori[key].split(","),
                ooo = {}
              for (var p of arr) {
                var l = p.split(" ")
                if (l.length == 1) l.push(0);
                if (!isNaN(Number(l[1]))) l[1] = Number(l[1])
                ooo[l[0]] = l[1]
              }
              obj[key] = ooo
            } else if (key == 'json' && ori[key] != '') {
              obj[key] = JSON.parse(ori[key])
            } else {
              obj[key] = JSON.parse("[\"" + ori[key].split(",").join("\",\"") + "\"]")

            }
          }
          return obj
        }




        if (onlybuild) {
          try {
            var o = deal(that.qmodelvalue)
            console.log(o)
            var sql = db.sql()
            switch (that.qmodelid) {
              case 0:
                sql = sql.table(o.from).insert(o.json)
                break
              case 1:

                sql = sql.table(o.from).delete(o.json).where(o.where)
                break
              case 2:

                sql = sql.table(o.from).select(o.select).where(o.where).group(o.groupby).having(o.having).order(o
                  .orderby)
                break
              case 3:

                sql = sql.table(o.from).update(o.json).where(o.where)
                break

            }

            that.SQL = sql.execstr()
            console.log(that.SQL)
            if (that.SQL) that.UTILSQL.history.push({
              sql: that.SQL,
              info: '来自构建'
            })
          } catch (e) {
            uni.showModal({
              title: '构建失败',
              content: e.message,
              showCancel: false

            })
          }

          return
        }

        db.dbquery({
          sql: that.SQL,
          success(res) {
            uni.showToast({
              title: '成功'
            })
            if (that.SQL) that.UTILSQL.history.push({
              sql: that.SQL,
              info: res.data ? "查询结果共" + res.data.length + "项" : ''
            })
            if (res.data) {
              that.roomlist = res.data


            }
          }
        })
      },
      setSql(e) {
        that.SQL = e.detail.value
      },
      changeBanlance() {
        that.showBanlance = !that.showBanlance;
      },
      startLoad(text) {
        that.LOADINGSTATUS = true;
        that.LOADINGDETAIL[text] = true;
        that.LOADINGTARGET = text;
      },
      endLoad() {
        that.LOADINGSTATUS = false;
        that.LOADINGDETAIL[that.LOADINGTARGET] = false;
        uni.hideToast()
      },
      calculateAmount(num, prefix, hide) {
        var prefix = "";
        if (!that.showBanlance && hide) {
          return {
            h: '***',
            t: '.**'
          }
        }
        if (typeof prefix == 'undefined') prefix = true;
        if (num > 0 && prefix) {
          prefix = '+';
        }
        var obj = Number(num).toFixed(2).split('.');
        console.log(num, obj);
        return {
          h: prefix + obj[0],
          t: '.' + obj[1]
        };
      },
      showPrivacy() {
        var MODAL = this.MODAL
        g.modalSet({
          o: MODAL,
          title: '隐私政策',
          content: PrivatePolicy
        })
      },

      setTheme(THEMEID) {
        g.setTheme(THEMEID)
        g.RefleshGlobalData(that)
      },
      /*
      	页面组件函数
      */
      //添加状态信息
      addinfo(str) {
        that.$set(that, 'info', uf.getTime(false, true) + " " + str + '\n' + that.info)
      },
      //页面导航
      changePage(page0) {
        if (that.LOADINGSTATUS) {
          uni.showToast({
            icon: 'loading',
            title: '请稍后'
          })
          return;
        }
        that.canvasShow = false
        var page = that.page
        for (var p in that.PAGES) {
          var pid = that.PAGES[p].id
          if (pid == page0) {
            page = p
          }
        }
        that.PAGE = page0
        console.log(page, JSON.stringify(that.PAGES[page]))
        that.setData({
          WINTITLE: that.PAGES[page].title
        })
        that.closeDrawer("navMenu")
        /* if (page == 1 && that.USERLOGIN) {
          that.refleshLiushui()
        } */
      },

      //等待页面
      hideWait(end) {
        g.hideWait(that.WAIT, end)
      },
      showWait(title, subtitle, buttontitle, cancelfun, clear, cannotcancal) {
        g.showWait(that.WAIT, title, subtitle, buttontitle, cancelfun, clear, cannotcancal)
      },
      modalSet(o) {
        g.modalSet(o)
      },
      modalHide() {
        g.modalHide(this.MODAL)
      },

      // 打开窗口
      showDrawer(e) {
        that.$refs[e].open()
      },
      // 关闭窗口
      closeDrawer(e) {
        that.$refs[e].close()
      },
      // 抽屉状态发生变化触发
      MenuChange(e) {
        console.log("抽屉导航" + (e ? '打开' : '关闭'));
        that.setData({
          'navMenu': e
        })
      },


      setHistoryToSql(sql) {
        var type = sql.substring(0, 4)
        if (type == "tool") {
          var name = sql.substr(4)
          if (name == '1') { // 查询课程名、课程、教师、教室
            that.qmodelid = 2
            that.qmodelvalue.from = "courses,rooms,teachers,accounts"
            that.qmodelvalue.select = "*"
            that.qmodelvalue.where = "crid_id=rid,ctuid_id=tuid,tuuid_id=uuid"
            that.qmodelvalue.groupby = ""

            that.qmodelvalue.having = ""
            that.qmodelvalue.orderby = ""

          } else if (name == '2') // 查询课程的学生总数，按大到小排序
          {
            that.qmodelid = 2
            that.qmodelvalue.from = "courses,scores"
            that.qmodelvalue.select = "cname,count(*) as stucounts"
            that.qmodelvalue.where = "cid=scid_id"
            that.qmodelvalue.groupby = "cid"
            that.qmodelvalue.orderby = "stucounts 0"


            that.qmodelvalue.having = ""
          } else if (name == '3') { //学生数大于2的课程
            var cc =
              "(SELECT count(*) as ccount, scid_id as ccid FROM database_scores GROUP BY (scid_id) HAVING (ccount>=2) ORDER BY ccount desc) as cc"
            that.SQL = "SELECT cid,cname,ccount FROM database_courses," + cc + " WHERE ( ccid=cid)"
          } else if (name == '4') { //所有挂科的学生及门数
            that.qmodelid = 2
            that.qmodelvalue.from = "scores"
            that.qmodelvalue.select = "sid,count(*) as counts, min(score) as minscore "
            that.qmodelvalue.where = "score<60"
            that.qmodelvalue.groupby = "sid"
            that.qmodelvalue.orderby = "counts 0"
            that.qmodelvalue.having = ""
          }
        } else {
          that.SQL = sql
        }
        that.HidePop()
      },


      /*
      	功能函数
      */
      testRequest() {
        // return
        db.dbInit()
      },
      showOrderInfo(e) {
        console.log(e)
        uni.navigateTo({
          url: './pay/pay?show=' + e
        })
      },

      withdrawBalance() {
        uni.navigateTo({
          url: "/pages/main/choose/choose"
        })
      },
      transferBalance() {
        uni.navigateTo({
          url: "/pages/main/emptyroom/emptyroom"
        })
      },
      chargeBalance(t) {
        if (t == 3) {

          uni.navigateTo({
            url: "/pages/main/courseplan/courseplan"
          })
          return
        } else if (t == 2) {
          //开课
          uni.navigateTo({
            url: "/pages/main/opencourse/opencourse"
          })

        } else if (t == 1) {
          //上分
          uni.navigateTo({
            url: "/pages/main/setscore/setscore"
          })

        } else uni.navigateTo({
          url: "/pages/main/score/score"
        })
      },
      UserRegPre() {
        uni.navigateTo({
          url: '/pages/main/register/register'
        })
      },
      RefleshUserData() {
        that.startLoad("reflesh")
        server.request({
          tipShow: false,
          title: '刷新数据',
          tipOption: {
            WAIT: that.WAIT
          },
          packPublicKey: true,
          urlPath: 'getuserdata',
          data: {
            "id": that.USERDATA.id
          },
          success: (data, cb) => {
            if (data.status) {
              g.USERDATA = JSON.parse(JSON.stringify(data.data))
              that.setData({
                USERDATA: g.USERDATA
              })
              console.log("设置用户数据", JSON.parse(JSON.stringify(data.data)))
              cb(true)
            } else {
              cb(false)
              server.showFail(data.errMsg)
            }
            that.endLoad();
            return true
          },
          fail(data) {
            server.showFail(data.errMsg);
            that.endLoad();

            //that.LoadingHistory=false;
          }
        })
      },
      setAccountInfo() {
        console.log(JSON.parse(JSON.stringify(that.USERDATA)))
        g.USERDATA = that.USERDATA;
        uni.navigateTo({
          url: "/pages/main/modify/modify"
        })
      },
      setPayPswd() {
        uni.navigateTo({
          url: "/pages/main/set_local/set_local"
        })
      },
      QuitLogin() {
        that.USER_STUDENTID = -1
        that.USER_TEACHERID = -1
        that.USER_ADMIN = 0
        g.USER_STUDENTID = -1
        g.USER_TEACHERID = -1
        g.USER_ADMIN = 0
        that.USERLOGIN = false
        g.USERLOGIN = false
      },
      UserLogin(tip) {
        var email = that.UserEmail,
          pswd = that.UserPassword
        if (typeof email != 'string' || email == "") {
          if (tip) server.showFail("请输入账户名", "登录")
          return
        }
        if (typeof pswd != 'string' || pswd == "") {
          if (tip) server.showFail("请输入密码", "登录")
          return
        }
        that.startLoad("login")
        /* db.sql().table(["accounts"]).where({
          account: "123761923691"
        }).update({
          type: 0
        }).exec() */
        /* db.sql().table(["accounts"]).insert({
          //mainid: 9797,
          type: 0,
          account: "123761923691",
          password: "a"
        }).exec() */
        db.sql().select(["*"]).table(["accounts"]).where({
          account: email
        }).exec({
          success(res) {
            if (res.data.length != 1) {
              uni.showModal({
                title: '用户不存在',
                showCancel: false
              })
            } else if (res.data[0].password != pswd) {
              uni.showModal({
                title: '密码错误',
                showCancel: false
              })
            } else {
              that.USERLOGIN = true
              g.USERLOGIN = true
              g.USEREMAIL = email
              g.USERPASSWORD = pswd
              g.USERDATA = JSON.parse(JSON.stringify(res.data[0]))
              that.setData({
                USERDATA: g.USERDATA,
                USER_ADMIN: g.USERDATA.admin
              })
              uni.setStorage({
                data: {
                  'email': email,
                  'pswd': pswd
                },
                key: 'USERLOGIN'
              })
              console.log("设置用户数据", JSON.parse(JSON.stringify(res.data[0])))

            }
            that.endLoad()
          },
          fail(res) {
            that.endLoad()
          }
        })
        return
      },
      PasswordInput(e) {
        var text = e.detail.value
        that.setData({
          'UserPassword': text
        })
      },
      EmailInput(e) {
        var text = e.detail.value
        that.setData({
          'UserEmail': text
        })
      },
    }
  }
</script>

<style>
  page {}



  .subtitle {
    font-size: 40rpx;
  }

  .canvasClass {
    margin-top: 10rpx;
    border: var(--color-border) 2px solid;
  }

  .btnicon {
    font-size: 40rpx;
    margin-right: 20rpx;
  }

  .logoImg {
    border-radius: 30rpx;
    width: 400rpx;
    height: 400rpx;
    margin: 100rpx auto 50rpx auto;
  }

  .imagePreview {
    margin-top: 10rpx;
    width: 700rpx;
    height: 700rpx;
  }

  .tiparea {
    margin-top: 30rpx;
    width: 700rpx;
    display: block;
    align-items: center;
    justify-content: center;
  }

  .tipcard {
    margin: 10rpx auto auto auto;
    padding: 20rpx;
    border: var(--color-border) 0px solid;
    border-radius: 30rpx;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    width: 680rpx;
  }

  .tipcardicon {
    color: var(--color-text);
    width: 50rpx;
    height: 50rpx;
    font-size: 50rpx;
    font-weight: 600;
  }

  .tipcardid {
    margin-left: 5rpx;
    font-size: 35rpx;
    color: black;
    background-color: transparent;
    border-radius: 30rpx;
    width: 50rpx;
    height: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .tipcardtext {
    color: var(--color-text);
    margin-left: 5rpx;
    padding-top: 10rpx;
    font-size: 30rpx;
    max-width: 450rpx;
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .tipcard.err {
    background-image: var(--colorimg-err);
    background-color: var(--color-err);
  }

  .tipcard.warn {
    background-image: var(--colorimg-warn);
    background-color: var(--color-warn);
  }

  .tipcard.info {
    background-image: var(--colorimg-info);
    background-color: var(--color-gray);
  }

  .tipcard.tip {
    //background-image: var(--colorimg-info);
    border: 2px solid var(--color-gray);
    background-color: var(--color-pageback);
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

  .pictextarea {
    margin-top: 20rpx;
  }

  .pictextinput {
    font-size: 35rpx;
    text-align: left;
    padding: 25rpx;
    width: 650rpx;
    border-radius: 30rpx;
    border: 1rpx solid;
    border-color: var(--color-border);
    min-height: 100rpx;
    height: 100rpx;
  }

  .sliderLine {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-between;
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

  .texttip {
    font-size: 30rpx;
    color: var(--color-texttip);
    max-width: 750rpx;
  }

  .infotext-area {
    width: 700rpx;
    display: flex;
    justify-content: left;
    text-align: left;
  }

  .infotext {
    font-size: 30rpx;
    word-wrap: break-word;
  }

  .tipbtnarea {
    margin: 20rpx;
    display: block;
    justify-content: center;
    text-align: center;
  }

  .bubble {
    position: fixed;
    bottom: 120rpx;
    right: 10rpx;
    background: #DDDDDD;
    border-radius: 30rpx;
    padding: 10rpx 40rpx;
  }

  .bubbletext {
    font-size: 30rpx;
    display: flex;
  }

  .kindtitle {
    margin-top: 10rpx;
    font-size: 40rpx;
  }

  .modeText {
    margin-left: 10rpx;
    border-radius: 25rpx;
    color: var(--color-btn-text);
    font-size: 30rpx;
    padding: 8rpx 15rpx;
  }

  .modeText.selected {
    background-color: var(--color-pageback);
    color: var(--color-main);
  }

  .personalBlockText {
    border: 3px solid;
    position: absolute;
    z-index: 300;
    font-size: 40rpx;
    font-weight: 600;
  }

  .personalBlockText.err {
    border-color: rgba(256, 0, 0, 0.4);
    color: rgba(256, 0, 0, 1);
    z-index: 303;
  }

  .personalBlockText.err.selected {
    background-color: rgba(256, 0, 0, 0.4);
    color: rgba(256, 256, 256, 1);
    border-color: rgba(256, 256, 256, 1);
  }

  .personalBlockText.warn {
    z-index: 302;
    border-color: rgba(256, 256, 0, 0.4);
    color: rgba(256, 256, 0, 1);
  }

  .personalBlockText.warn.selected {
    background-color: rgba(256, 256, 0, 0.4);
    color: rgba(256, 256, 256, 0.5);
    border-color: rgba(256, 256, 256, 1);
  }

  .personalBlockText.info {
    z-index: 301;
    border-color: rgba(256, 256, 256, 0.6);
    color: rgba(256, 256, 256, 1);
  }

  .personalBlockText.info.selected {
    background-color: rgba(256, 256, 256, 0.4);
    color: rgba(0, 0, 0, 0.8);
    border-color: rgba(256, 256, 256, 1);
  }

  .personalBlockText.tip {
    z-index: 301;
    border-color: rgba(256, 256, 256, 0.8);
    color: rgba(256, 256, 256, 0.6);
  }

  .personalBlockText.tip.selected {
    background-color: rgba(200, 200, 200, 0.6);
    color: rgba(0, 0, 0, 0.5);
    border-color: rgba(200, 200, 200, 1);
  }

  .text {
    font-size: 30rpx;
    white-space: pre;
  }

  .textcell {
    width: 100%;
    text-align: left;
    font-size: 30rpx;
    height: 310rpx;
    white-space: pre-wrap;
    overflow-y: scroll;
  }

  .textcellarea {
    background-color: var(--color-blk-back);
    margin: 60rpx auto 0 auto;
    width: 580rpx;
    height: 320rpx;
    padding: 40rpx;
    border-radius: 18rpx;
  }

  .infocell {
    margin: 40rpx auto 0 auto;
    width: 600rpx;
    text-align: left;
    font-size: 30rpx;
    border-radius: 20rpx;
    padding: 30rpx;
    display: flex;
    align-items: flex-start;
    background-color: var(--color-blk-back2);
  }

  .infocell-icon {
    margin-left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 50rpx;
    background-color: var(--color-blk-back);
    border-radius: 150rpx;
    width: 75rpx;
    min-width: 75rpx;
    height: 75rpx;
  }

  .infocell-text {
    margin: 0 40rpx 0 40rpx;
    width: 480rpx;
  }

  .addBtn {
    justify-content: space-around;
    background-color: var(--color-main);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 40rpx;
    width: 300rpx;
    height: 300rpx;
    border-radius: 150rpx;
  }

  .addBtnArea {
    margin: 30rpx;
  }

  .UILIST {
    margin-top: 20rpx;
    display: flex;
    flex-direction: row;
    flex-flow: row wrap;

  }

  .UISelectDui {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50rpx;
    height: 50rpx;
    background-color: var(--color-main);
    border-radius: 50rpx;
  }

  .UISelectName {
    margin-left: 20rpx;
    font-size: 32rpx;
  }

  .UIitem {
    display: flex;
    align-items: center;
    padding: 10rpx 20rpx;
    border-radius: 30rpx;
    width: 170rpx;
    margin: 0;
  }

  .toppayicon {
    font-size: 80rpx;
    line-height: 90rpx;
  }

  .toppaybtn {
    display: flex;
    flex-direction: column;
    white-space: pre;
    font-size: 40rpx;
    margin: 15rpx 0;
    width: 320rpx;
    padding: 20rpx 0 5rpx 0;
    justify-content: center;
    align-items: center;

  }

  .toppayarea {
    position: relative;
    left: 0;
    top: 0;
    background-color: var(--color-main);
    width: 754rpx;
    height: auto;
    margin: 0;
    padding: 0;
    justify-content: space-around;
    display: flex;
  }

  .paylisticon {}


  .linebtnn {
    white-space: pre;
    font-size: 40rpx;
    margin: 30rpx auto;
    width: 700rpx
  }

  .pop {
    z-index: 555;
  }

  .pop-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.3);

  }

  .pop-box {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 710rpx;
    padding: 20rpx 20rpx;
    display: block;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 55vh;
    background-color: var(--color-pageback);
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
    border-top: 3px solid var(--color-border);
    margin-bottom: 100rpx;
  }

  .pop-headline {
    display: flex;
    justify-content: space-between;
    font-size: 40rpx;
    align-items: center;
  }
</style>