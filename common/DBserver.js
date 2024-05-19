var serverUrl = "http://127.0.0.1:9998/" //"http://127.0.0.1:9998/"
var reqTitle = "加载"
var appName = "database_"

/* db.sql().table(["userinfos"]).where(["mainid=9797"]).update({
          mainid: 9799,
          email: "123761923691213",
          userpassword: "a"
        }).exec()
        db.sql().table(["userinfos"]).insert({
          mainid: 9797,
          email: "123761923691",
          userpassword: "a"
        }).exec()
        db.sql().select(["*"]).table(["userinfos"]).order({
          id: 0
          
        }).exec() */

function showFail(text, title) {
  if (typeof title != "string") title = reqTitle
  uni.hideLoading()
  uni.showModal({
    title: title + '失败',
    content: text,
    showCancel: false
  })
}

function request({
  path,
  data,
  success,
  fail,
  tipShow
}) {
  if (typeof tipShow != 'boolean') tipShow = true
  if (typeof fail != 'function') fail = (res) => {
    console.error(res)
  }
  if (typeof success != 'function') success = (res) => {
    console.log(res)
  }
  uni.request({
    url: serverUrl + path,
    method: "POST",
    header: {
      'content-type': "application/json",
      'Access-Control-Allow-Origin': '*'
    },
    data: data,
    responseType: 'json',
    sslVerify: false,
    firstIpv4: true,
    success: (res) => {
      console.log("收到数据", res)
      if (res.statusCode != 200) {
        if (tipShow) showFail('服务器错误：' + JSON.stringify(res))
        fail({
          status: false,
          errMsg: '服务器内部错误'
        })
        return
      } else if (!res.data.status) {
        if (tipShow) showFail('请求错误：' + res.data.errMsg)
        fail(res.data)
        return
      }
      var data = res.data
      success(data)
    },
    fail: (res) => {
      console.log("请求失败", res)
      var cb = () => {
        if (tipShow) showFail('错误：' + res.errMsg)
      }
      fail(res)
    }
  })
}

function dbquery({
  sql,
  success,
  fail
}) {
  if (typeof fail != 'function') fail = (res) => {
    console.error(res)
  }
  if (typeof success != 'function') success = (res) => {
    console.log(res)
  }
  if (typeof sql == 'object' && sql.class == 'SQLQUERY') sql = sql.exec()
  else if (typeof sql == 'string' && sql != '');
  else {
    fail({
      status: false,
      errMsg: "SQL错误"
    })
    return
  }

  console.warn(sql)
  request({
    path: 'rawdb',
    data: {
      sql: sql
    },
    success: success,
    fail: fail
  })

}

var getData = (data) => {
  if (typeof data == 'number') {
    return data
  } else if (typeof data == 'string') {
    return "'" + data + "'"
  } else if (typeof data == 'object') {
    return "'" + JSON.stringify(data) + "'"
  } else return "NULL"
}

var dealdict = (dict) => {
  if (typeof dict != 'object') return {}
  for (var key in Object.keys(dict)) {
    dict[key] = getData(dict[key])
  }

  return dict
}

class SQLQUERY {
  SQLQUERY() {
    this.class = "SQLQUERY"
    this.type = ""
    this.selectdata = []
    this.fromdata = []
    this.wheredata = []
    //this.wherearr = []
    this.groupbydata = []
    this.orderbydata = {}
    this.havingdata = []


    this.insertdata = {}
  }
  delete(data) {
    this.type = "DELETE"
    if (typeof data == "object") {
      return this.where(data)

    }
    return this
  }
  update(data) {
    this.type = "UPDATE"
    this.insertdata = data
    return this
  }
  insert(data) {
    this.type = "INSERT"
    this.insertdata = data
    return this
  }
  select(arr) {
    this.selectdata = arr
    this.type = "SELECT"
    return this
  }
  where(arr) {
    var arr2 = []
    if (typeof arr.length == 'undefined') {
      for (var key of Object.keys(arr)) {
        arr2.push(key + "=" + getData(arr[key]))
      }
      arr = arr2
    }
    this.wheredata = arr
    return this
  }
  table(arr) {
    this.fromdata = arr
    return this
  }
  group(arr) {
    this.groupbydata = arr
    return this
  }
  order(obj) {
    this.orderbydata = obj
    return this
  }
  having(arr) {
    this.havingdata = arr
    return this
  }
  execstr(tablename) {
    var str = ""

    var failret = () => {
      console.warn(JSON.stringify(this))
      return str
    }
    if (this.type == 'DELETE') {
      if (typeof this.fromdata == 'object' && Object.keys(this.fromdata).length != 0);
      else return failret()
      for (var i of Object.keys(this.fromdata)) {
        this.fromdata[i] = appName + this.fromdata[i]
      }
      str += "DELETE FROM " + this.fromdata.join(",")
      if (typeof this.wheredata == 'object' && Object.keys(this.wheredata).length != 0) {
        str += " WHERE ( " + this.wheredata.join(" and ") + " )"
      }
      return str;
    } else if (this.type == 'UPDATE') {
      if (typeof this.insertdata == 'object' && Object.keys(this.insertdata).length != 0);
      else return failret()
      if (typeof this.fromdata == 'object' && Object.keys(this.fromdata).length != 0);
      else return failret()
      for (var i of Object.keys(this.fromdata)) {
        this.fromdata[i] = appName + this.fromdata[i]
      }
      var str2 = "",
        arr2 = []
      if (this.insertdata.length) {
        arr2 = this.insertdata
      } else {
        var keys = Object.keys(this.insertdata)
        for (var key of keys) {

          arr2.push(key + "=" + getData(this.insertdata[key]))
        }
      }

      str2 = arr2.join(",")
      str = "UPDATE " + this.fromdata.join(",") + " SET " + str2

      if (typeof this.wheredata == 'object' && Object.keys(this.wheredata).length != 0) {
        str += " WHERE ( " + this.wheredata.join(" and ") + " )"
      } //else return failret()

      return str
    } else if (this.type == "INSERT") {
      if (typeof this.insertdata == 'object' && Object.keys(this.insertdata).length != 0);
      else return failret()
      if (typeof this.fromdata == 'object' && Object.keys(this.fromdata).length != 0);
      else return failret()
      for (var i of Object.keys(this.fromdata)) {
        this.fromdata[i] = appName + this.fromdata[i]
      }
      var keys = Object.keys(this.insertdata)
      var str2 = " VALUES (",
        arr2 = []
      for (var key of keys) {
        arr2.push(getData(this.insertdata[key]))
      }
      str2 += arr2.join(",") + ")"
      str = "INSERT INTO " + this.fromdata.join(",") + "(" + keys.join(",") + ")" + str2
      return str

    } else if (this.type == "SELECT") {
      if (typeof this.selectdata == 'object' && Object.keys(this.selectdata).length != 0);
      else return failret()
      if (typeof this.fromdata == 'object' && Object.keys(this.fromdata).length != 0);
      else return failret()
      for (var i of Object.keys(this.fromdata)) {
        this.fromdata[i] = appName + this.fromdata[i]
      }
      str += "SELECT " + this.selectdata.join(",") + " FROM " + this.fromdata.join(",")

      //var arrw = []
      if (typeof this.wheredata == 'object' && Object.keys(this.wheredata).length != 0) {
        //arrw.push()
        str += " WHERE ( " + this.wheredata.join(" and ") + " )"
      }
      //else return failret()
      /* if(typeof this.wherearr == 'object' && Object.keys(this.wherearr).length != 0) {
        
      } else return str */



      if (typeof this.groupbydata == 'object' && Object.keys(this.groupbydata).length != 0) {
        str += " GROUP BY (" + this.groupbydata.join(",") + ")"
      } //else return failret()
      if (typeof this.havingdata == 'object' && Object.keys(this.havingdata).length != 0) {
        str += " HAVING (" + this.havingdata.join(",") + ")"
      } //else return failret()
      //console.log(str)
      if (typeof this.orderbydata == 'object' && Object.keys(this.orderbydata).length != 0) {
        var oarr = []
        for (var key of Object.keys(this.orderbydata)) {
          if (this.orderbydata[key]) this.orderbydata[key] = "asc"
          else this.orderbydata[key] = "desc"
          oarr.push(key + " " + this.orderbydata[key])
        }
        str += " ORDER BY " + oarr.join(",") + ""
      } //else return failret()

      if (typeof tablename == 'string') str = "( " + str + " ) AS " + tablename
      return str;
    }
    return failret()
  }
  exec(o1bj) {
    if (typeof o1bj == 'undefined') o1bj = {}
    let {
      success,
      fail
    } = o1bj
    dbquery({
      sql: this.execstr(),
      success,
      fail
    })
  }
}


module.exports = {
  init(serverurl) {
    serverUrl = serverurl
  },
  sql() {
    return new SQLQUERY()
  },
  dbquery({
    sql,
    success,
    fail
  }) {
    dbquery({
      sql,
      success,
      fail
    })
  },
  request({
    path,
    data,
    success,
    fail,
    tipShow
  }) {
    request({
      path,
      data,
      success,
      fail,
      tipShow
    })
  },
  dbInit() {
    var db = this

    //var dataarr = []
    for (var i of [1, 2, 3, 4, 5]) {
      db.sql().table(["accounts"]).insert({
        username: "小" + i,
        account: i.toString(),
        password: i.toString(),
        admin: i == 1 ? 1 : 0,
      }).exec()
    }
    var courses = ["微积分", "大学计算机基础", "高级程序设计", "数据结构与算法"]
    var dearr = {
      "计算学部": ["信息安全", "人工智能", "计算机科学与技术"],
      "电气学院": ["电子信息", "通信工程"],
      "航天学院": ["自动化", "飞行器设计"]
    }
    setTimeout(() => {
      for (var key of Object.keys(dearr)) {
        for (var major of dearr[key]) {
          db.sql().table(["departments"]).insert({
            dname: key,
            dmajor: major
          }).exec()
        }
      }
    }, 1500)

    setTimeout(() => {
      for (var i of [4, 5]) {
        db.sql().table(["teachers"]).insert({
          tdid_id: i - 3,
          tuuid_id: i
        }).exec()
      }

      for (var i of [2, 3]) {
        db.sql().table(["students"]).insert({
          sdid_id: i - 1,
          suuid_id: i,
          sgrade: i - 1
        }).exec()
      }

      for (var time of [1, 2, 3, 4])
        for (var build of ["正心", "格物"])
          for (var i of [101, 102]) {
            db.sql().table(["rooms"]).insert({
              rtime: time,
              rname: i,
              rbuilding: build
            }).exec()
          }
    }, 3000)

    setTimeout(() => {
      for (var i in courses) {
        var course = courses[i]
        db.sql().table(["courses"]).insert({
          cname: course,
          crid_id: Number(i) + 1,
          ctuid_id: i % 2 + 1,
        }).exec()
      }

    }, 4500)

    setTimeout(() => {
      for (var did of [1, 2, 3, 4, 5, 6, 7])
        for (var cid in courses) {
          db.sql().table(["plan"]).insert({
            pdid_id: did,
            pcid_id: 1 + Number(cid)
          }).exec()
        }
    }, 5500)

    setTimeout(() => {
      db.sql().table(["courses"]).insert({
        cname: "物理学",
        crid_id: 5,
        ctuid_id: 1,
      }).exec()
      db.sql().table(["courses"]).insert({
        cname: "心理学",
        crid_id: 6,
        ctuid_id: 1,
      }).exec()
      db.sql().table(["courses"]).insert({
        cname: "哲学",
        crid_id: 7,
        ctuid_id: 2,
      }).exec()
    }, 6000)

    setTimeout(() => {
      db.sql().table(["plan"]).insert({
        pdid_id: 2,
        pcid_id: 5
      }).exec()
      db.sql().table(["plan"]).insert({
        pdid_id: 3,
        pcid_id: 6
      }).exec()
      db.sql().table(["plan"]).insert({
        pdid_id: 4,
        pcid_id: 7
      }).exec()
    }, 7000)
  }
}