<template>
  <el-card class="cardAll">
    <!-- 筛选条件 -->
    <div ref="searchRow">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-col :xs="12" :sm="6" :md="4" :lg="4" class="searchItem">
            <el-input v-model="searchForm.userCode" placeholder="用户编码" clearable />
          </el-col>
          <el-col :xs="12" :sm="6" :md="4" :lg="4" class="searchItem">
            <el-input v-model="searchForm.cellphone" placeholder="用户账号" clearable />
          </el-col>
          <el-col :xs="12" :sm="6" :md="4" :lg="4" class="searchItem">
            <el-input v-model="searchForm.userName" placeholder="用户名称" clearable />
          </el-col>
          <el-col :xs="12" :sm="6" :md="4" :lg="4" class="searchItem">
            <el-input v-model="searchForm.tradeId" placeholder="资金结算账号" clearable />
          </el-col>
          <el-col :xs="12" :sm="6" :md="4" :lg="4" class="searchItem">
            <el-select v-model="searchForm.userType" placeholder="用户类型" clearable :style="{width: '100%'}">
              <el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :md="4" :lg="4" class="searchItem">
            <el-select v-model="searchForm.openType" placeholder="操作类型" clearable :style="{width: '100%'}">
              <el-option v-for="item in openTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" class="searchItem">
            <div style="display: flex">
              <el-date-picker
                v-model="searchForm.startTime"
                type="date"
                style="margin-right: 10px"
                placeholder="操作开始时间"
                value-format="timestamp"
                clearable
              />
            <!-- </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="4" class="searchItem"> -->
              <el-date-picker
                v-model="searchForm.endTime"
                type="date"
                placeholder="操作结束时间"
                value-format="timestamp"
                clearable
                @change="handleFilterEndTime"
              />
            </div>
          </el-col>
          <el-col :xs="14" :sm="10" :md="7" :lg="7" class="searchItem">
            <el-button type="primary" @click="searchData()">搜索</el-button>
            <el-button @click="resetSearchForm()">重置</el-button>
            <!-- excel导出 -->
            <export-excel
              v-if="rightForm.export"
              class="exportButton"
              :table-ref="$refs.tableData"
              :search-form="searchForm"
              protocol-name="param_tq_admin_querybak_lqsQuery_v1_exportqueryLqsOpenFlow"
              :file-name="'开销户流水报表.xlsx'"
            />
            <!-- 控制显示右侧抽屉 -->
            <el-button icon="el-icon-question" @click="drawer = true">帮助</el-button>
          </el-col>
          <el-button>add</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <el-table
      ref="tableData"
      v-loading="loading"
      :data="tableData"
      border
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" width="65" align="center" />
      <el-table-column label="用户编码" prop="userCode" align="center" />
      <el-table-column label="用户账号" prop="cellphone" align="center" />
      <el-table-column label="用户名称" prop="userName" align="center" />
      <el-table-column label="资金结算账号" prop="tradeId" align="center" />
      <el-table-column label="用户类型" prop="userType" align="center" />
      <el-table-column label="操作类型" prop="openType" align="center" />
      <el-table-column label="操作时间" prop="createTime" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime | dateFormate }}
        </template>
      </el-table-column>
      <!-- <template slot-scope="scope">
          <span v-if="scope.row.type == '0'">提现</span>
          <span v-else-if="scope.row.type == '1'">订单收入</span>
        </template> -->
      <!-- <el-table-column label="操作类型" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.userStatus !== '销户' && rightForm.zhuan"
            type="info"
            size="mini"
            style="background-color: #044078; border-color: #044078"
            @click="resetData1(scope.row)"
          >销户</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 右侧抽屉(帮助) -->
    <el-drawer
      title="鲁清所开销户流水帮助"
      size="50%"
      :visible.sync="drawer"
      :with-header="true"
    >
      <div class="help">
        <h3>【功能描述】</h3>
        <p>
          ▶查询买家信息：登录账号、客户邀请码、所属商家、所属销售商、所属推广员、注册时间、最后登录时间、高级认证申请时间、高级认证通过时间、认证步骤状态、安全监测状态、高级认证地区、高级认证证件号、高级认证状态、账号状态
        </p>
        <p>▶买家账号操作：锁定、解锁、重置密码</p>
        <h3>【功能说明】</h3>
        <p>▶登录账号：买家APP登录的邮箱账号</p>
        <p>
          ▶客户邀请码：每个客户可以直接推荐客户进入商城，客户邀请码为商家两位数字编号加后四位数字和字母随机生成6位邀请码。
        </p>
        <p>▶所属商家：所属商家编号，2位数字</p>
        <p>▶所属销售商：所属销售商编号，3位数字</p>
        <p>
          ▶所属推广员：所属推广员编号，也是推广员邀请码，6位数字，2位商家编号+4位数字；买家可以通过推广员邀请码注册参与，买家也可以通过买家分享的邀请码链接注册参与
        </p>
        <p>▶高级认证：买家提现时高级认证的每一步处理状态</p>
        <p>
          ▶账号状态：正常、禁用2种状态。当买家登录时输入密码错误次数达到上限5次，该账好被禁用登录
        </p>
        <h3>【操作说明】</h3>
        <p>▶锁定：点击“锁定”，该买家账号禁止登录APP</p>
        <p>▶解锁：点击“解锁”，该买家账号恢复登录APP</p>
        <p>
          ▶重置密码：当买家忘记登录密码时，点击“重置密码”对账号进行密码初始化，密码长度为8--20位数字.
        </p>
        <p>
          ▶创建模拟账号：模拟账号是指在测试阶段商家、经销商、代理商根据商家的编号创建的用于测试的账号，这些账号不计入任何的收入或是支出，在后台各个统计表格里都没有显示。在创建时，每个商家只能使用自己下面的邀请码，后台管理员不能创建模拟账号。模拟账号也可以作为给其他客户的演示账号使用。
        </p>
      </div>
    </el-drawer>
    <!-- 分页 -->
    <pagination
      :totals="total"
      :page="page+1"
      :page-size="pageSize"
      @gotoPage="gotoPage"
      @changePageSize="changePageSize"
    />
    <!-- <show-dialog ref="showDialog" @reLoad="postFn" /> -->
  </el-card>
</template>

<script>
// import showDialog from './viewInformation'
import pagination from '@/components/until/pagination'
import exportExcel from '@/components/until/exportExcel.vue'
export default {
  components: {
    pagination,
    // showDialog,
    exportExcel
  },
  data() {
    return {
      value1: null,
      rightForm: { // 页面中的按钮权限
        export: false
      },
      drawer: false, // 是否显示抽屉
      total: 1, // 数据总条数
      page: 0, // 当前页
      pageSize: this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.size // 每页显示多少条数据
        ? this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.size : 15,
      loading: false,
      searchForm: { // 筛选条件
        endTime: null,
        startTime: null,
        userCode: null,
        cellphone: null,
        userName: null,
        tradeId: null,
        userType: null,
        openType: null,
        sort: [
          {
            direction: 'DESC', // "//DESC或ASC",
            property: 'createTime' // "//排序属性"
          }
        ]
      },
      // dialogVisible: false,
      tableData: [],
      tableHeight: window.innerHeight - 245,
      userTypeOptions: [{ // 筛选条件options
        'label': '产业客户法人',
        'value': '产业客户法人'
      },
      {
        'label': '产业客户自然人',
        'value': '产业客户自然人'
      },
      {
        'label': '非产业客户',
        'value': '非产业客户'
      }],
      openTypeOptions: [{ // 筛选条件options
        'label': '开户',
        'value': '开户'
      },
      {
        'label': '销户',
        'value': '销户'
      }]
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 将选择结束时间的DatePicker的时间格式变为某日23:59:59, 默认为00:00:00, 选择后触发
    handleFilterEndTime(time) {
      if (time === null) return
      this.searchForm.endTime = time + 86400000 - 1000
    },
    loadData() {
      // 设置请求参数
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data = {
        page: 0,
        size: this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.size
          ? this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.size
          : 15,
        sort: [
          {
            direction: 'DESC', // "//DESC或ASC",
            property: 'createTime' // "//排序属性"
          }
        ]
        // endTime: this.dataFormat.formatDate.format(new Date(this.beginTimeT).getTime()),
        // beginTime: this.dataFormat.formatDate.format(new Date(this.beginTimeT).getTime() - 3600 * 1000 * 24 * 7)
      }
      // 调用请求数据函数, 参数为page
      this.postFn(0)
    },
    // 筛选条件搜索
    searchData() {
      if ((this.searchForm.startTime > this.searchForm.endTime) ||
      (this.searchForm.startTime === null && this.searchForm.endTime > 0)) {
        return this.$message({ type: 'warning', message: '请选择正确的时间范围' })
      }
      // if (this.maxTime - new Date(this.searchForm.endTime).getTime() >= 0 && new Date(this.searchForm.endTime).getTime() >= new Date(this.searchForm.beginTime).getTime() && new Date(this.searchForm.beginTime).getTime() - this.minTime >= 0) {
      // 设置请求数据接口所带的参数为筛选条件的参数
      // console.log(Object.keys(this.searchForm))
      // Object.keys(this.searchForm).forEach(function(key) {
      //   // 如果是""(clear之后), 转换成null
      //   if (this.searchForm[key] === '') {
      //     this.searchForm[key] === null
      //   }
      // })
      // this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data = {
      //   ...this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data,
      //   ...this.searchForm
      // }
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.startTime = this.searchForm
        .startTime
        ? this.searchForm.startTime
        : null
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.endTime = this.searchForm
        .endTime
        ? this.searchForm.endTime
        : null
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.userCode = this.searchForm
        .userCode
        ? this.searchForm.userCode
        : null
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.userName = this.searchForm
        .userName
        ? this.searchForm.userName
        : null
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.cellphone = this.searchForm
        .cellphone
        ? this.searchForm.cellphone
        : null
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.tradeId = this.searchForm
        .tradeId
        ? this.searchForm.tradeId
        : null
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.userType = this.searchForm
        .userType
        ? this.searchForm.userType
        : null
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.openType = this.searchForm
        .openType
        ? this.searchForm.openType
        : null
      this.postFn(0)
      // } else {
      //   this.$message({ type: 'warning', message: '请输入正确的时间范围(最多可搜索一个月的数据，开始时间需小于结束时间) ' })
      // }
    },
    // 调用全局的rightButtonCheck，检查按钮权限
    getButtonRight() {
      this.rightForm.export = this.rightButtonCheck('zyq-report-monthly-luqing-open-flow-export')
    },
    // 请求数据
    postFn(page) {
      this.loading = true
      if (page !== null) {
        this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.page = page
      }
      // 调用全局http对象的post方法，发送请求
      this.http.post(this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow).then(res => {
        const { code, message, value } = res.data
        if (code === '0') {
          // 设置 tableData total 和 page
          this.tableData = value.content
          this.total = value.totalElements
          if (page !== null) this.page = page
          // 如果请求到的数据是空的, 请求前一页的数据
          if (this.tableData.length === 0 && this.page >= 2) this.postFn(this.page - 1)
          this.loading = false
        } else {
          this.$message({ type: 'warning', message: message })
          this.loading = false
        }
      })
    },
    gotoPage(page) {
      this.postFn(page - 1)
    },
    // viewInformation(row) {
    //   this.$refs.showDialog.showDialog(row)
    // },
    changePageSize(size) {
      this.protocol.param_tq_admin_querybak_lqsQuery_v1_queryLqsOpenFlow.data.size = size
      this.postFn(0)
    },
    resetSearchForm() {
      this.searchForm = {
        endTime: null,
        startTime: null,
        userCode: null,
        cellphone: null,
        userName: null,
        tradeId: null,
        userType: null,
        openType: null,
        sort: [
          {
            direction: 'DESC', // "//DESC或ASC",
            property: 'createTime' // "//排序属性"
          }
        ]
      }
      // this.maxTime = new Date(this.searchForm.beginTime).getTime() + 3600 * 1000 * 24 * 30
      // this.minTime = new Date(this.searchForm.endTime).getTime() - 3600 * 1000 * 24 * 30
    }
    // dateFormat: function(row, column) {
    //   var date = row[column.property]
    //   if (date === undefined || date === null) {
    //     return '-'
    //   } else {
    //     return this.format(date)
    //   }
    // }
    // add0(m) {
    //   return m < 10 ? '0' + m : m
    // },
    // format(shijianchuo) {
    //   // shijianchuo是整数，否则要parseInt转换
    //   var time = new Date(shijianchuo)
    //   var y = time.getFullYear()
    //   var m = time.getMonth() + 1
    //   var d = time.getDate()
    //   var h = time.getHours()
    //   var mm = time.getMinutes()
    //   var s = time.getSeconds()
    //   return (
    //     y +
    //     '-' +
    //     this.add0(m) +
    //     '-' +
    //     this.add0(d) +
    //     ' ' +
    //     this.add0(h) +
    //     ':' +
    //     this.add0(mm) +
    //     ':' +
    //     this.add0(s)
    //   )
    // }
  }
}
</script>
<style scoped>
</style>
<style lang="scss">
#tableCSS {
  .el-loading-mask {
    z-index: 999;
  }
}
.el-table .cell {
  white-space: pre-line !important;
}
</style>
