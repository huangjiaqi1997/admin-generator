import { capitalize } from './utils'

export function makeUpJs(config) {
  const {
    header: {
      operations: hOperations,
      fields
    },
    table: {
      operations: tOperations,
      sort,
      tableDataApi
    }
  } = config

  const importList = []
  const componentList = []
  const dataList = []
  const formDataList = []
  const rightButtonList = []
  const rightCheckList = []
  const methodList = []

  hOperations.concat(tOperations).forEach(o => {
    switch (o.type) {
      case 'export':
        importList.push('import exportExcel from \'@/components/until/exportExcel.vue\'')
        componentList.push('exportExcel,')
        rightButtonList.push('export: false,')
        rightCheckList.push(
          'this.buttonRights.export = true' // ************************
          // `this.buttonRights.${el.name} = this.rightButtonCheck('${el.code}')`
        )
        break
      case 'help':
        dataList.push('drawerVisible: false,')
        break
      case 'add':
      case 'edit':
      case 'check':
        importList.push(`import ${capitalize(o.handle)}Dialog from './${capitalize(o.handle)}Dialog.vue'`)
        componentList.push(`${capitalize(o.handle)}Dialog,`)
        dataList.push(`${o.handle}DialogVisible: false,`)
        methodList.push(
          `handle${capitalize(o.handle)}Click(row) {
            this.$refs.${o.handle}Dialog.showDialog(row)
          },`
        )
        rightButtonList.push(`${o.right.name}: false,`)
        rightCheckList.push(
          `this.buttonRights.${o.right.name} = true` // ************************
          // `this.buttonRights.${el.name} = this.rightButtonCheck('${el.code}')`
        )
        break
      case 'confirm':
        methodList.push(
          `handle${capitalize(o.handle)}Click(row) {
            this.$confirm('${o.confirmOpts.text}?', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            })
              .then(() => {
                this.fetchData({
                  url: '${o.confirmOpts.confirmApi}',
                  data: {
                    ${Object.keys(o.confirmOpts.param).map(k => `${k}: row.${o.confirmOpts.param[k]},`).join('\n')}
                  }
                },
                data => {
                  this.$message({ type: 'success', message: data.message })
                })
              })
          },`
        )
        rightButtonList.push(`${o.right.name}: false,`)
        rightCheckList.push(
          `this.buttonRights.${o.right.name} = true` // ************************
          // `this.buttonRights.${el.name} = this.rightButtonCheck('${el.code}')`
        )
        break
      default:
    }
  })

  fields.forEach(f => {
    if (f.tag === 'el-date-picker' && f.type === 'dateRange') {
      formDataList.push(
        `${f.vModel[0]}: ${f.defaultValue[0] || null},
        ${f.vModel[1]}: ${f.defaultValue[1] || null}`
      )
    } else {
      formDataList.push(
        `${f.vModel}: ${JSON.stringify(f.defaultValue) || null},`
      )
    }
  })
  
  return (
    `<script>
    ${importList.join('\n')}
    import pagination from '@/components/until/pagination'
    export default {
      components: {
        ${componentList.join('\n')}
        pagination
      },
      data() {
        return {
          ${dataList.join('\n')}
          formData: {},
          buttonRights: {
            ${rightButtonList.join('\n')}
          },
          tableDataApi: '${tableDataApi}',
          sort: ${JSON.stringify(sort)},
          total: 0,
          page: 0,
          size: 15,
          loading: false,
          tableData: [],
          tableHeight: 0,
          searchParam: {}
        }
      },
      computed: {
        reqOpts() {
          return {
            url: this.tableDataApi,
            data: {
              ...this.searchParam,
              sort: this.sort,
              page: this.page,
              size: this.size
            }
          }
        }
      },
      watch: {
        reqOpts: {
          handler: function() {
            this.loadData()
          },
          deep: true
        }
      },
      created() {
        this.loadData()
        this.loadRight().then(() => {
          this.getbuttonRights()
        })
      },
      updated() {
        this.tableHeight = this.tools.autoHeightTable(this.$refs.searchRow, 141)
      },
      methods: {
        searchData() {
          this.page = 0
          const filteredParam = Object.entries(this.formData).filter(([key, val]) => (val !== null && val !== ''))
          this.searchParam = {
            ...Object.fromEntries(filteredParam)
          }
        },
        loadData() {
          this.loading = true
          this.fetchData(
            this.reqOpts,
            data => {
              this.loading = false
              const { value } = data
              if (value) {
                this.tableData = value.content
                this.total = value.totalElements
              }
            }
          )
        },
        handleGotoPage(page) {
          this.page = page - 1
        },
        handleChangePageSize(size) {
          this.page = 0
          this.size = size
        },
        resetFormData() {
          this.formData = {
            ${formDataList.join('\n')}
          }
        },
        getbuttonRights() {
          ${rightCheckList.join('\n')}
        },
        ${methodList.join('\n')}
      }
    }
    </script>`
  )
}

export function makeUpDialogJs(dialogConf) {
  let str = ''
  if (dialogConf.type === 'check') {
    const {
      type,
      table: {
        param,
        sort,
        tableDataApi
      }
    } = dialogConf

    const dataList = Object.keys(param).map(p => `${p}: null,`)

    str = (
      `<script>
      import pagination from '@/components/until/pagination'
      export default {
        components: {
          pagination
        },
        data() {
          return {
            dialogVisible: false,
            ${dataList.join('\n')}
            tableDataApi: '${tableDataApi}',
            sort: ${JSON.stringify(sort)},
            total: 0,
            page: 0,
            size: 15,
            loading: false,
            tableData: [],
            tableHeight: 200,
          }
        },
        computed: {
          reqOpts() {
            return {
              url: this.tableDataApi,
              data: {
                ${Object.keys(param).map(p => `${p}: this.${p},`)}
                sort: this.sort,
                page: this.page,
                size: this.size
              }
            }
          }
        },
        watch: {
          reqOpts: {
            handler: function() {
              this.loadData()
            },
            deep: true
          }
        },
        created() {
          this.loadData()
        },
        methods: {
          showDialog(${type === 'add' ? '' : 'row'}) {
            this.dialogVisible = true
            ${type === 'add' ? '' : Object.keys(param).map(k => `this.${k} = row.${param[k]}`)}
          },
          loadData() {
            this.loading = true
            this.fetchData(
              this.reqOpts,
              data => {
                this.loading = false
                const { value } = data
                if (value) {
                  this.tableData = value.content
                  this.total = value.totalElements
                }
              }
            )
          },
          handleGotoPage(page) {
            this.page = page - 1
          },
          handleChangePageSize(size) {
            this.page = 0
            this.size = size
          }
        }
      }
      </script>`
    )
  } else {
    const {
      type,
      form: {
        submitApi,
        param,
        fields
      }
    } = dialogConf
  
    const formDataList = []
    const ruleList = []
    const optionsList = []
    const propsList = []
    const methodList = []
   
    // formData
    // rules
    fields.forEach(f => {
      const {
        vModel,
        rules
      } = f
  
      formDataList.push(`${f.vModel}: null,`)
  
      const ruleObjList = rules.map(r => {
        if (r.pattern) {
          return `{ pattern: ${eval(r.pattern)}, message: '${r.message}', trigger: '${r.trigger}' },`
        }
        return `${JSON.stringify(r)},`
      })
      ruleList.push(
        `${vModel}: [
          ${ruleObjList.join('\n')}
        ],`
      )
    })
  
    str = (
      `<script>
      export default {
        data() {
          return {
            submitApi: '${submitApi}',
            dialogVisible: false,
            formData: {
              ${formDataList.join('\n')}
            },
            rules: {
              ${ruleList.join('\n')}
            }
          }
        },
        methods: {
          showDialog(${type === 'add' ? '' : 'row'}) {
            this.dialogVisible = true
            ${type === 'add' ? '' : Object.keys(param).map(k => `this.formData.${k} = row.${param[k]}`)}
          },
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.fetchData(
                  {
                    url: this.submitApi,
                    data: this.form
                  },
                  data => {
                    this.$message({ type: 'success', message: data.message })
                    this.dialogVisible = false
                    this.$emit('reLoad')
                  }
                )
              }
            })
          },
          resetFormData(formName) {
            this.$refs[formName].resetFields()
          }
        }
      }
      </script>`
    )
  }

  return str
}

// export function makeUpLookDialogJs(dialogConfig) {
//   return (
//     `<script>
//     export default {
//       data() {
//         return {
//           dialogVisible: false,
//         };
//       },
//       methods: {
//         showDialog(row) {
//           this.dialogVisible = true
//         },
//         gotoPage(page) {
//           const gotoPage = this.initPage === 0 ? page - 1 : page;
//           this.selectAddress(gotoPage)
//         },
//         changePageSize(size) {
//           this.protocol.param_base_accountManagement_v1_queryUserIpaddress.data.size = size;
//           this.selectAddress(this.initPage)
//         },
//         selectAddress(page) {
//           const that = this;
//           this.loading = true;
//           if (page !== null) {
//             this.protocol.param_base_accountManagement_v1_queryUserIpaddress.data.page = page;
//           }
//           this.protocol.param_base_accountManagement_v1_queryUserIpaddress.data.size = this.protocol
//             .param_base_accountManagement_v1_queryUserIpaddress.data.size
//             ? this.protocol.param_base_accountManagement_v1_queryUserIpaddress.data.size
//             : 15;
//           // this.protocol.param_base_accountManagement_v1_queryUserIpaddress.data.userId =
//           //     this.userId
//           this.http.post(this.protocol.param_base_accountManagement_v1_queryUserIpaddress).then((res) => {
//             const { code, message, value } = res.data;
//             if (code === "0") {
//               that.tableData = value.content;
//               that.total = value.totalElements;
//               if (page !== null) {
//                 that.page = page;
//               }
//               if (that.tableData.length === 0 && that.page >= 1) {
//                 that.postFn(that.page - 1);
//               }
//             } else {
//               that.$message({ type: "warning", message: message });
//             }
//             this.loading = false;
//           });
//         },
//       },
//     };
//     </script>`
//   )
// }
