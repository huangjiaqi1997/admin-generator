export default {
  /* eslint-disable */
  header: {
    actions: [
      {
        __type__: "export",
        api: "/tq-admin-querybak/lqsQuery/v1/exportqueryLqsOpenFlow",
        fileName: "开销户流水报表",
        rightname: "export",
        rightCode: "zyq-report-monthly-luqing-open-flow-export"
      },
      {
        __type__: "help",
        title: "鲁清所开销户流水帮助",
        content: "<div><h3>【功能描述】</h3><p>▶买家账号操作：锁定、解锁、重置密码</p></div>"
      },
      {
        __type__: "add",
        type: "primary",
        text: "新增",
        size: "mini",
        style: "float: right; margin-right: 5px;",
        rightCode: "zyq-report-monthly-luqing-open-flow-add",
        rightName: "add",
        content: {
          title: "新增用户",
          dialogWidth: 400,
          labelWidth: 80,
          api: "/add",
          param: { phone: "cellphone" },
          fields: [
            {
              tag: "el-input",
              label: "手机号",
              vModel: "cellphone",
              placeholder: "请输入手机号",
              clearable: true,
              disable: false,
              rules: [
                { required: true, message: "请输入手机号", trigger: "blur" },
                { pattern: "\/^1\\d{10}$\/", message: "请输入正确的手机号", trigger: 'blur' }
              ]
            }
          ]
        }
      }
    ],
    gutter: 10,
    fields: [
      {
        tag: "el-input",
        placeholder: "用户编码",
        vModel: "userCode",
        clearable: true,
        span: 4
      },
      {
        tag: "el-input",
        placeholder: "用户账号",
        vModel: "cellphone",
        clearable: true,
        span: 4
      },
      {
        tag: "el-input",
        placeholder: "用户名称",
        vModel: "userName",
        clearable: true,
        span: 4
      },
      {
        tag: "el-input",
        placeholder: "资金结算账号",
        vModel: "tradeId",
        clearable: true,
        span: 4
      },
      {
        tag: "el-select",
        vModel: "userType",
        span: 4,
        placeholder: "用户类型",
        clearable: true,
        options: [{
          label: "产业客户法人",
          value: "产业客户法人"
        },{
          label: "产业客户自然人",
          value: "产业客户自然人"
        },{
          label: '非产业客户',
          value: '非产业客户'
        }]
      },
      {
        tag: "el-select",
        vModel: "openType",
        placeholder: "操作类型",
        clearable: true,
        span: 4,
        options: [{
          label: '开户',
          value: 0
        },
        {
          label: '销户',
          value: 1
        }]
      },
      {
        tag: "el-date-picker",
        type: "dateRange",
        valueFormat: "yyyy-MM-dd",
        format: "yyyy-MM-dd",
        vModel: "createTime",
        defaultValue: [],
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        placeholder: "日期",
        clearable: true,
        span: 8
      }
    ]
  },
  table: {
    actions: [
      {
        __type__: "confirm",
        type: "danger",
        text: "删除",
        size: "mini",
        rightName: "delete",
        rightCode: "zyq-report-monthly-luqing-open-flow-delete",
        content: {
          text: "是否删除该用户？",
          api: "/delete",
          param: { id: "userId" }
        }
      },
      {
        __type__: "edit",
        type: "primary",
        text: "编辑",
        size: "mini",
        rightName: "edit",
        rightCode: "zyq-report-monthly-luqing-open-flow-edit",
        content: {
          title: "编辑用户",
          dialogWidth: 400,
          labelWidth: 80,
          api: '/edit',
          param: {
            id: "userId",
            cellphone: "cellphone"
          },
          fields: [
            {
              tag: "el-input",
              label: "手机号",
              vModel: "cellphone",
              placeholder: "请输入手机号",
              clearable: true,
              disable: false,
              rules: [
                { required: true, message: "请输入手机号", trigger: "blur" },
                { pattern: "\/^1\\d{10}$\/", message: "请输入正确的手机号", trigger: 'blur' }
              ]
            }
          ]
        }
      },
      {
        __type__: "look",
        type: "primary",
        text: "查看",
        size: "mini",
        rightName: "look",
        rightCode: "zyq-report-monthly-luqing-open-flow-look",
        content: {
          __type__: "table",
          title: "查看历史",
          dialogWidth: 800,
          tableHeight: 300,
          param: { id: "userId" },
          api: "/tq-admin-querybak/lqsQuery/v1/queryLqsOpenFlow",
          sort: [{ direction: 'DESC', property: 'createTime' }],
          columns: [
            {
              type: "index",
              label: "序号",
              align: 'center',
              width: 65
            },
            {
              label: "用户编码",
              prop: "userCode",
              align: 'center'
            },
            {
              label: "用户账号",
              prop: "cellphone",
              align: 'center'
            },
            {
              label: "用户名称",
              prop: "userName",
              align: 'center'
            }
          ]
        } 
      },
    ],
    api: "/tq-admin-querybak/lqsQuery/v1/queryLqsOpenFlow",
    sort: [{ direction: 'DESC', property: 'createTime' }],
    columns: [
      {
        type: "index",
        label: "序号",
        align: 'center',
        width: 65
      },
      {
        label: "用户编码",
        prop: "userCode",
        align: 'center'
      },
      {
        label: "用户账号",
        prop: "cellphone",
        align: 'center'
      },
      {
        label: "用户名称",
        prop: "userName",
        align: 'center'
      },
      {
        label: "资金结算账号",
        prop: "tradeId",
        align: 'center',
        showOverflowTooltip: true
      },
      {
        label: "用户类型",
        prop: "userType",
        align: 'center'
      },
      {
        label: "操作类型",
        prop: "openType",
        align: 'center',
      },
      {
        label: "操作时间",
        prop: "createTime",
        align: 'center'
      },
      {
        label: "操作",
        width: "200",
        align: "center",
        fixed: "right"
      }
    ]
  }
}
