export default {
  /* eslint-disable */
  options: {
    search: true,
    export_: true,
    help: true,
    add: true,
    delete_: true,
    edit: true,
    look: true
  },
  header: {
    operations: [
      { 
        type: "export",
        api: "/tq-admin-querybak/lqsQuery/v1/exportqueryLqsOpenFlow",
        fileName: "开销户流水报表",
        right: {
          name: "export",
          code: "zyq-report-monthly-luqing-open-flow-export"
        }
      },
      {
        type: "help",
        title: "鲁清所开销户流水帮助",
        content: `<div><h3>【功能描述】</h3><p>▶买家账号操作：锁定、解锁、重置密码</p></div>`
      },
      {
        type: "add",
        handle: "add",
        right: {
          code: "zyq-report-monthly-luqing-open-flow-add",
          name: "add"
        },
        btnOpts: {
          type: "primary",
          text: "新增",
          rightName: "add",
          handle: "add",
          noParam: true,
          size: "mini",
          style: "float: right; margin-right: 5px;",
        },
        dialogOpts: {
          title: "新增用户",
          type: "add",
          width: 500,
          form: {
            labelWidth: 80,
            submitApi: "/add",
            param: { phone: "cellphone" },
            fields: [
              {
                tag: "el-input",
                label: "手机号",
                vModel: "cellphone",
                formModel: "form",
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
        vModel: ["startTime", "endTime"],
        defaultValue: [null, null],
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        placeholder: "日期",
        clearable: true,
        span: 8
      }
    ]
  },
  table: {
    operations: [
      {
        type: "confirm",
        handle: "delete",
        right: {
          name: "delete",
          code: "zyq-report-monthly-luqing-open-flow-delete",
        },
        btnOpts: { 
          type: "danger",
          text: "删除",
          rightName: "delete",
          handle: "delete",
          size: "mini",
        },
        confirmOpts: {
          text: "是否删除该用户？",
          confirmApi: "/delete",
          param: {
            id: "userId" 
          }
        }
      },
      {
        type: "edit",
        handle: "edit",
        right: {
          name: "edit",
          code: "zyq-report-monthly-luqing-open-flow-edit",
        },
        btnOpts: {
          type: "primary",
          text: "编辑",
          rightName: "edit",
          handle: "edit",
          size: "mini",
        },
        dialogOpts: {
          title: "编辑用户",
          type: "edit",
          rowProp: true,
          form: {
            labelWidth: 120,
            submitApi: '/edit',
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
                width: "85%",
                clearable: true,
                disable: false,
                rules: [
                  { required: true, message: "请输入手机号", trigger: "blur" },
                  { pattern: "\/^1\\d{10}$\/", message: "请输入正确的手机号", trigger: 'blur' }
                ]
              },
            ]
          },
        }
      },
      {
        type: "check",
        handle: "look",
        right: {
          name: "check",
          code: "zyq-report-monthly-luqing-open-flow-check",
        },
        btnOpts: {
          type: "primary",
          text: "查看",
          rightName: "check",
          handle: "look",
          size: "mini",
        },
        dialogOpts: {
          title: "查看历史",
          type: "check",
          table: {
            param: {
              id: "userId",
            },
            sort: [
              {
                direction: 'DESC',
                property: 'createTime'
              }
            ],
            tableDataApi: "/tq-admin-querybak/lqsQuery/v1/queryLqsOpenFlow",
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
          },
        }
      },
    ],
    sort: [
      {
        direction: 'DESC',
        property: 'createTime'
      }
    ],
    tableDataApi: "/tq-admin-querybak/lqsQuery/v1/queryLqsOpenFlow",
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
        align: 'center'
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
