/**
 * author: wbx
 * time: 2022-09-10
 */

module.exports = {
  timeFormat(sec) {
    if (typeof sec != 'number') return ''
    var min = Math.floor(sec / 60)
    if (min < 10) min = "0" + min
    sec = sec % 60
    if (sec < 10) sec = "0" + sec
    return min + ':' + sec
  },
  evalSizeStr(size) {
    if (typeof size != 'number') return ''
    var arr = ['B', 'KB', 'MB', 'GB'],
      i = 0
    while (size >= 1024) {
      i++
      size = size / 1024.0
    }
    return size.toFixed(2) + arr[i]
  },
  sort: function (a, tar, hightolow, usinglen, tar2) { //排序大小,tar相同时再按tar2排序
    var i = 0,
      j = 0,
      t = 0;
    if (typeof a != 'object') return a;
    if (a.length == 0) return a;
    if (typeof hightolow !== 'boolean') hightolow = true
    for (i = 0; i < a.length; i++) {
      for (j = 0; j < a.length; j++) {
        if (usinglen) {
          if (hightolow ? (a[i][tar].length > a[j][tar].length) : (a[i][tar].length < a[j][tar].length)) { // 相邻元素两两对比
            t = a[i];
            a[i] = a[j];
            a[j] = t;
          }
        } else if (hightolow ? (a[i][tar] > a[j][tar]) : (a[i][tar] < a[j][tar])) { // 相邻元素两两对比
          t = a[i];
          a[i] = a[j];
          a[j] = t;
        } else if ((a[i][tar] == a[j][tar]) && tar2) {
          if (hightolow ? (a[i][tar2] > a[j][tar2]) : (a[i][tar2] < a[j][tar2])) {
            t = a[i];
            a[i] = a[j];
            a[j] = t;
          }
        }
        ////console.log('i:' + i + ' j:' + j + '  当前数组为：' + a);
      }
    }
    return a;
  },
  showFail(res) {
    uni.hideLoading({
      success: (res) => {},
    })
    uni.showModal({
      title: '错误',
      content: res.errMsg,
      showCancel: false
    })
  },
  /**
   * 转换绝对时间字符串为相对时间文本
   * @param {string} realtime       YYYY-MM-DD HH:MM:SS
   * @param {boolean} showRealtime   相对时间+绝对时间同时返回
   * @param {boolean} vaguetype      模糊相对时间（默认）
   * @param {string} dividechar     两者中间的分隔符
   * @return {string} 相对时间文本
   */
  transTimes(realtime, showRealtime, vaguetype, dividechar) {
    //转换realtime至相对时间，realtime的格式是2021-02-05 19:00
    if (typeof realtime != 'string') {
      return '';
    }

    if (realtime == '') {
      return '';
    }

    if (typeof showRealtime != 'boolean') {
      showRealtime = false;
    }

    if (typeof vaguetype != 'boolean') {
      vaguetype = true;
    }

    if (typeof dividechar != 'string') {
      dividechar = ' ';
    } //var date = realtime.split(" ")[0]

    if (realtime.substr(0, 1) == 'D') {
      realtime = realtime.substr(1);
    }

    var time = realtime.split(' ')[1];
    var timemin = time.split(':')[0] + ':' + time.split(':')[1]; //if (updatetime || nowtime == null) {
    //Time = this.getTime(true, true, false)
    //}
    //var nowdate = Time.split(" ")[1]
    //var nowtime = Time.split(" ")[0]

    var dateBegin = new Date(realtime.replace(/-/g, '/')); //将-转化为/，使用new Date

    var dateEnd = new Date(); //获取当前时间

    var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数

    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数

    var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数

    var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
    //计算相差分钟数

    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数

    var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
    //计算相差秒数

    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数

    var seconds = Math.round(leave3 /
      1000); ////console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
    ////console.log(dateDiff + "时间差的毫秒数", dayDiff + "计算出相差天数", leave1 + "计算天数后剩余的毫秒数", hours + "计算出小时数", minutes + "计算相差分钟数", seconds + "计算相差秒数");
    //return
    //旧算法
    //var nt = nowtime.split(":")

    var t = time.split(':'); //var h0 = Number(nt[0]),

    var h = Number(t[0]);
    /*var m0 = Number(nt[1]),
	    m = Number(t[1])
	   var dt = date.split("-")
	  var dt0 = nowdate.split("-")
	  var y = Number(dt[0]),
	    y0 = Number(dt0[0])
	  var mn = Number(dt[1]),
	    mn0 = Number(dt0[1])
	  var d = Number(dt[2]),
	    d0 = Number(dt0[2])*/

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var dmilisec = today.getTime() - dateBegin.getTime(); //时间差的毫秒数

    var dday = Math.floor(dmilisec / (24 * 3600 * 1000)); //计算出相差天数
    //非模糊模式（聊天

    if (!vaguetype) {
      if (dateDiff < 0) return tmp_showRealtime(showRealtime, realtime, '未来', dividechar);
      else if (dateDiff < 3600 * 1000) {
        //一小时以内
        if (dateDiff < 120 * 1000) {
          return tmp_showRealtime(showRealtime, realtime, '刚刚', dividechar);
        } else {
          return tmp_showRealtime(showRealtime, realtime, minutes + '分钟前', dividechar);
        }
      } else if (dateDiff < 3600 * 1000 * 5) {
        return tmp_showRealtime(showRealtime, realtime, hours + '小时' + minutes + '分钟前', dividechar); //5小时内
      } else if (dday < 2) {
        //48小时内
        var text = '';

        switch (dday) {
          case -1:
            text = '今天';
            break;

          case 0:
            text = '昨天';
            break;

          case 1:
            text = '前天';
            break;
        }

        return tmp_showRealtime(showRealtime, realtime, text + ' ' + timemin, dividechar);
      } else {
        var wday = dateEnd.getDay() || 7; // 周日是0 改成7

        var Mon = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate() + 1 - wday).getTime();
        var lastMon = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate() + 1 - wday - 7)
          .getTime();
        var mitime = dateBegin.getTime();

        if (mitime >= Mon) {
          //这周但超过了2天
          return tmp_showRealtime(showRealtime, realtime, this.getWeekDay(dateBegin.getDay()) + ' ' + timemin,
            dividechar);
        } else if (mitime >= lastMon) {
          return tmp_showRealtime(showRealtime, realtime, '上' + this.getWeekDay(dateBegin.getDay()) + ' ' +
            timemin, dividechar);
        } else {
          return realtime;
        }
      }
      return '错误';
    } //模糊模式

    if (dateDiff < 0) return tmp_showRealtime(showRealtime, realtime, '未来', dividechar);
    else if (dateDiff < 3600 * 1000) {
      //一小时以内
      if (dateDiff < 120 * 1000) {
        return tmp_showRealtime(showRealtime, realtime, '刚刚', dividechar);
      } else {
        return tmp_showRealtime(showRealtime, realtime, minutes + '分钟前', dividechar);
      }
    } else if (dateDiff < 3600 * 1000 * 5) return tmp_showRealtime(showRealtime, realtime, hours + '小时' +
      minutes + '分钟前', dividechar);
    //5小时内
    else if (dday < 2) {
      //48小时内
      var text = '';
      /*var yesterday = (new Date()).setTime(dateEnd.getTime() - 24 * 60 * 60 * 1000);
	    var yesterdaytext = this.formatTime(yesterday).split(" ")[0]
	    yesterday.setHours(0);
	    yesterday.setMinutes(0);
	    yesterday.setSeconds(0);
	    yesterday.setMilliseconds(0);*/

      switch (dday) {
        case -1:
          text = '今天';
          break;

        case 0:
          text = '昨天';
          break;

        case 1:
          text = '前天';
          break;
      }

      return tmp_showRealtime(showRealtime, realtime, text + this.getTimeText(h), dividechar);
    } else {
      var wday = dateEnd.getDay() || 7; // 周日是0 改成7

      var Mon = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate() + 1 - wday).getTime();
      var lastMon = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate() + 1 - wday - 7).getTime();
      var mitime = dateBegin.getTime();

      if (mitime >= Mon) {
        //这周但超过了2天
        return tmp_showRealtime(showRealtime, realtime, this.getWeekDay(dateBegin.getDay()) + this.getTimeText(
          h), dividechar);
      } else if (mitime >= lastMon) {
        return tmp_showRealtime(showRealtime, realtime, '上' + this.getWeekDay(dateBegin.getDay()), dividechar);
      } else {
        return realtime;
      }
    }
  },
  
  /**
   * 获取小时段描述（如：午夜）
   * @param {Number} h 当天的小时数
   * @return {string} 时段描述文本
   */
  getTimeText(h) {
    var text = '';
    if (h >= 0 && h < 2) text = text + '午夜';
    else if (h >= 2 && h < 4) text = text + '凌晨';
    else if (h >= 4 && h < 6) text = text + '黎明';
    else if (h >= 6 && h < 8) text = text + '清晨';
    else if (h >= 8 && h < 11) text = text + '上午';
    else if (h >= 11 && h < 13) text = text + '中午';
    else if (h >= 13 && h < 16) text = text + '下午';
    else if (h >= 16 && h < 19) text = text + '傍晚';
    else if (h >= 19 && h < 22) text = text + '晚上';
    else if (h >= 22 && h < 24) {
      text = text + '深夜';
    }
    return text;
  },
/**
 * 获取星期文本 0/7均为周日
 * @param {Number} a 
 */
  getWeekDay(a) {
    switch (a) {
      case 0:
        return '周日';

      case 1:
        return '周一';

      case 2:
        return '周二';

      case 3:
        return '周三';

      case 4:
        return '周四';

      case 5:
        return '周五';

      case 6:
        return '周六';

      case 7:
        return '周日';

      default:
        return '';
    }
  },
/**
 * 限制字符串长度
 * @param {string} e 字符串
 * @param {Number} len 长度
 */
  textLen: function(e,len) {
    if (e.length < len) {
      return e;
    } else {
      return e.substr(0, len-3) + '...';
    }
  },
/**
 * 判断对象数组的指定键值是否存在重复
 * @param {Array} list 列表
 * @param {string} nameTarget 指定键值
 * @param {string} newname 新名称
 * @param {string} oldname 旧名称
 */

  listNameVaild(list, nameTarget, newname, oldname) {
    if (newname == '' || newname == undefined) {
      return false;
    }

    var t = list;

    for (var i = 0; i < t.length; i++) {
      if (t[i][nameTarget] == newname) {
        return false;
      }
    }

    for (var i = 0; i < t.length; i++) {
      if (t[i][nameTarget] == newname && t.ui_options[i][nameTarget] != oldname) {
        return false;
      }
    }

    return true;
  },

  formatTime(time) {
    const tmp_dayTime = formatTime(new Date()).split('/').split('-');
    return tmp_dayTime;
  },
/**
 * 获取当前时刻时间文本
 * @param {boolean} date 
 * @param {boolean} time
 * @param {boolean} src 替换:为-
 */
  getTime(date, time, src) {
    //src是是否返回地址格式（没有:）
    if (typeof date == 'undefined') {
      date = true;
    }

    if (typeof time == 'undefined') {
      time = true;
    }

    if (typeof src == 'undefined') {
      src = false;
    }

    const tmp_dayTime = formatTime(new Date());

    if (date && !time) {
      return tmp_dayTime.split(' ')[0].split('/').join('-');
    }

    if (!date && time) {
      if (!src) {
        return tmp_dayTime.split(' ')[1];
      } else {
        return tmp_dayTime.split(' ')[1].split(':').join('-');
      }
    }

    if (date && time) {
      if (!src) {
        return tmp_dayTime.split(' ')[0].split('/').join('-') + ' ' + tmp_dayTime.split(' ')[1];
      } else {
        return tmp_dayTime.split(' ')[0].split('/').join('-') + '-' + tmp_dayTime.split(' ')[1].split(':').join(
          '-');
      }
    }
  },

/**
 * 时间限制
 * @param {string} taskid 任务ID
 * @param {number} timelimit 时间限制
 * @param {boolean} showTip 显示提示
 */
  isTimeLimit(taskid, timelimit, showTip) {
    if (typeof timelimit != 'number') {
      timelimit = 10;
    }

    if (typeof tmp_PullDownLimitTime[taskid] != 'number') {
      tmp_PullDownLimitTime[taskid] = 0;
    }

    var time = new Date().getTime();

    if (time - tmp_PullDownLimitTime[taskid] < timelimit * 1000) {
      uni.stopPullDownRefresh({
        success: (res) => {}
      });

      if (showTip) {
        uni.showModal({
          showCancel: false,
          title: '时间限制',
          content: showTip + '，请' + (timelimit - (time - tmp_PullDownLimitTime[taskid]) / 1000 + 1).toFixed(0) +
            '秒后再试'
        });
      }

      return false;
    } else {
      tmp_PullDownLimitTime[taskid] = time;
      return true;
    }
  },

  backCycle: function(num, cycle) {
    let index = num % cycle;

    if (index < 0) {
      index += cycle;
    }

    return index;
  },

  numberFixed: function(num = 0, count = 3) {
    const power = Math.pow(10, count);
    return Math.floor(num * power) / power;
  },
/**
 * 颜色模式转换
 * @param {"RGB"|"HSL"} towhat
 * @param {{Y,U,V}|{R,G,B}} c
 */
  colorTran(towhat, c) {
    //第一个为RGB或HSL，第二个参数输入{Y,U,V} 或{R,G,B}
    if (towhat != 'RGB') {
      const _R = c.R / 255;

      const _G = c.G / 255;

      const _B = c.B / 255;

      const Cmax = Math.max(_R, _G, _B);
      const Cmin = Math.min(_R, _G, _B);
      const V = Cmax - Cmin;
      let H = 0;

      if (V === 0) {
        H = 0;
      } else if (Cmax === _R) {
        H = 60 * (((_G - _B) / V) % 6);
      } else if (Cmax === _G) {
        H = 60 * ((_B - _R) / V + 2);
      } else if (Cmax === _B) {
        H = 60 * ((_R - _G) / V + 4);
      }

      H = Math.floor(this.backCycle(H, 360));
      const L = this.numberFixed((Cmax + Cmin) / 2);
      const S = V === 0 ? 0 : this.numberFixed(V / (1 - Math.abs(2 * L - 1)));
      return {
        Y: H,
        U: S * 360,
        V: L * 360
      };
    } else {
      var H = c.Y;
      var S = c.U / 360;
      var L = c.V / 360;
      const C = (1 - Math.abs(2 * L - 1)) * S;
      const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
      const m = L - C / 2;
      const vRGB = [];

      if (H >= 0 && H < 60) {
        vRGB.push(C, X, 0);
      } else if (H >= 60 && H < 120) {
        vRGB.push(X, C, 0);
      } else if (H >= 120 && H < 180) {
        vRGB.push(0, C, X);
      } else if (H >= 180 && H < 240) {
        vRGB.push(0, X, C);
      } else if (H >= 240 && H < 300) {
        vRGB.push(X, 0, C);
      } else if (H >= 300 && H <= 360) {
        vRGB.push(C, 0, X);
      }

      const [vR, vG, vB] = vRGB;
      const R = 255 * (vR + m);
      const G = 255 * (vG + m);
      const B = 255 * (vB + m);
      return {
        R: R,
        G: G,
        B: B
      };
    }
  },
/**
 * 颜色文本和RGB集合互相转换
 * @param {"string"|"obj"} towhat 
 * @param {string|{R,G,B}} color
 */
  colorString(towhat, color) {
    //把#aaaaaa换成RGB集合
    var a = ['R', 'G', 'B'];

    if (towhat == 'string') {
      var colors = '#';

      for (var i = 0; i < 3; i++) {
        var t = parseInt(color[a[i]], 10).toString(16);

        if (t.length == 1) {
          t = '0' + t;
        }

        colors = colors + t;
      }

      return colors;
    } else {
      var m = {
        R: 0,
        G: 0,
        B: 0
      };

      for (var i = 0; i < 3; i++) {
        m[a[i]] = parseInt(color.substring(2 * i + 1, 2 * i + 3),
          16); ////console.log(m,color.substring(2 * i + 1, 2 * i + 3))
      } ////console.log(m)

      return m;
    }
  },

/**
 * 带透明度的颜色文本，仅可用于CSS
 * @param {string} colortext
 * @param {number} alpha
 */
  colorAlpha(colortext,alpha) {
    var t = this.colorString('obj', colortext);
    return 'rgba(' + t.R + ',' + t.G + ',' + t.B + ',' + alpha + ')';
  },

  touchStartPoint: [0, 0],

  // 触摸开始坐标 (屏幕左上角为坐标系原点, 向右为x轴, 向下为y轴)
  touchEndPoint: [0, 0],

  // 触摸结束坐标 (屏幕左上角为坐标系原点, 向右为x轴, 向下为y轴)
  touchStartTime: 0,

  // 触摸开始时间
  touchEndTime: 0,

  // 触摸结束时间
  lastTapTime: 0,

  // 最后一次单击事件点击发生时间
  lastTapTimeoutFunc: null,

  // 单击事件点击后要触发的函数
  JudgeDoubleTap(obj) {
    let {
      e,
      bindtap,
      binddoubletap
    } = obj; //let diffTouch = this.touchEndTime - this.touchStartTime;

    let curTime = e.timeStamp;
    let lastTime = this.lastTapDiffTime;
    this.lastTapDiffTime = curTime; //两次点击间隔小于300ms, 认为是双击

    let diff = curTime - lastTime;

    if (diff < 300) {
      ////console.log("double tap")
      clearTimeout(this.lastTapTimeoutFunc); // 成功触发双击事件时，取消单击事件的执行

      if (typeof binddoubletap == 'function') {
        binddoubletap(e);
      }
    } else {
      // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
      this.lastTapTimeoutFunc = setTimeout(() => {
        if (typeof bindtap == 'function') {
          bindtap(e);
        }
      }, 300);
    }
  },
}

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(
    ':');
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 2000; //这是设置的时间间隔
  }

  let _lastTime = null; // 返回新的函数

  return function() {
    let _nowTime = +new Date();

    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments); //将this和参数传给原函数

      _lastTime = _nowTime;
    }
  };
}

function tmp_showRealtime(show, real, trans, dividechar) {
  if (typeof dividechar != 'string') {
    dividechar = ' ';
  }

  if (show) {
    return trans + dividechar + real;
  } else {
    return trans;
  }
}
