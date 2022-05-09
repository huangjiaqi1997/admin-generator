import { capitalize } from './utils'

export function makeUpPageScript(config) {
  const {
    header: {
      actions: hActions = [],
      fields = []
    } = {},
    table: {
      actions: tActions = [],
      sort,
      api
    }
  } = config

  const importList = []
  const componentList = []
  const dataList = []
  const formDataList = []
  const rightButtonList = []
  const rightCheckList = []
  const methodList = []
  const createdList = []

  // 定义data.formData
  fields.forEach(f => {
    if (f.tag === 'el-date-picker' && f.type === 'daterange') {
      formDataList.push(
        `start${capitalize(f.vModel)}: ${f.defaultValue[0] || null},
        end${capitalize(f.vModel)}: ${f.defaultValue[1] || null},`
      )
      dataList.push(
        `${f.vModel}Range: ${JSON.stringify(f.defaultValue)},`
      )
    } else {
      formDataList.push(
        `${f.vModel}: ${JSON.stringify(f.defaultValue) || null},`
      )
    }
  })

  // 遍历所有的操作，组成import、components、data.rightButtons
  hActions.concat(tActions).forEach(a => {
    switch (a.__type__) {
      case 'export':
        importList.push('import exportExcel from \'@/components/until/exportExcel.vue\'')
        componentList.push('exportExcel,')
        rightButtonList.push('export: false,')
        rightCheckList.push(`export: '${a.rightCode}',`)
        break
      case 'help':
        dataList.push('drawerVisible: false,')
        break
      case 'add':
      case 'edit':
      case 'look':
        importList.push(`import ${capitalize(a.__type__)}Dialog from './${capitalize(a.__type__)}Dialog.vue'`)
        componentList.push(`${capitalize(a.__type__)}Dialog,`)
        methodList.push(
          `handle${capitalize(a.__type__)}Click(row) {
            this.$refs.${a.__type__}Dialog.showDialog(row)
          },`
        )
        rightButtonList.push(`${a.rightName}: false,`)
        rightCheckList.push(`${a.rightName}: '${a.rightCode}',`)
        break
      case 'confirm':
        // ${Object.keys(a.content.param).map(k => `${k}: row.${a.content.param[k]},`).join('\n')}
        methodList.push(
          `handle${capitalize(a.__type__)}Click(row) {
            this.$confirm('${a.content.text}', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              this.fetchData(
                {
                  url: '${a.content.api}',
                  data: {
                    id: row.id
                  }
                },
                data => {
                  this.$message({ type: 'success', message: data.message })
                })
            })
          },`
        )
        rightButtonList.push(`${a.rightName}: false,`)
        rightCheckList.push(`${a.rightName}: '${a.rightCode}',`)
        break
      default:
    }
  })

  // 页面有无筛选，有就把筛选相关的属性方法push进去
  if (fields.length) {
    dataList.push(
      `formData: {
        ${formDataList.join('\n')}
      },
      searchParam: {},`
    )
    methodList.push(
      `searchData() {
        this.page = 0
        const filteredParam = Object.entries(this.formData).filter(([key, val]) => (val !== null && val !== ''))
        this.searchParam = {
          ...Object.fromEntries(filteredParam)
        }
      },
      resetFormData() {
        this.formData = {}
      },`
    )
  }

  // 页面有无权限操作，有就把操作相关的属性方法push进去
  if (rightButtonList.length) {
    dataList.push(
      `buttonRights: {
        ${rightButtonList.join('\n')}
      },`
    )
    createdList.push(
      `this.loadRight({
        ${rightCheckList.join('\n')}
      })`
    )
    // methodList.push(
    //   `getbuttonRights() {
    //     ${rightCheckList.join('\n')}
    //   },`
    // )
  }

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
          api: '${api}',
          sort: ${JSON.stringify(sort)},
          total: 0,
          page: 0,
          size: 15,
          loading: false,
          tableData: [],
          tableHeight: 0
        }
      },
      computed: {
        reqOpts() {
          return {
            url: this.api,
            data: {
              ${fields.length ? '...this.searchParam,' : ''}
              sort: this.sort,
              page: this.page,
              size: this.size
            }
          }
        }
      },
      watch: {
        reqOpts: {
          handler: 'loadData',
          deep: true
        }
      },
      created() {
        ${createdList.join('\n')}
        this.loadData()
      },
      updated() {
        this.tableHeight = this.tools.autoHeightTable(this.$refs.searchRow, 143)
      },
      methods: {
        ${methodList.join('\n')}
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
}

export function makeUpDialogScript(content, __type__) {
  let str = ''

  // 如果弹窗是查看，且内容是表格
  // 和page的script大部分基本一样
  if (content.__type__ === 'table') {
    const { param, sort, api } = content

    // data中定义通过row传递的参数
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
            ${dataList.join('\n')}
            dialogVisible: false,
            api: '${api}',
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
              url: this.api,
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
            handler: 'loadData',
            deep: true
          }
        },
        created() {
          this.loadData()
        },
        methods: {
          showDialog(row) {
            this.dialogVisible = true
            ${Object.keys(param).map(k => `this.${k} = row.${param[k]}`)}
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
    // 如果是新增和编辑弹窗，内容是表单
    const { api, param, fields } = content
  
    // 定义 data.formData和 data.rules
    const dataList = []
    const formDataList = []
    const ruleList = []
    fields.forEach(f => {
      if (f.tag === 'el-date-picker' && f.type === 'daterange') {
        formDataList.push(
          `start${capitalize(f.vModel)}: ${f.defaultValue[0] || null},
          end${capitalize(f.vModel)}: ${f.defaultValue[1] || null},`
        )
        dataList.push(
          `${f.vModel}Range: ${JSON.stringify(f.defaultValue)},`
        )
      } else {
        formDataList.push(
          `${f.vModel}: ${JSON.stringify(f.defaultValue) || null},`
        )
      }

      const { vModel, rules = [] } = f
  
      const ruleObjList = rules.map(rule => {
        // const ruleObjJSON = JSON.stringify(r)
        const keyValList = Object.keys(rule).map(k => {
          if (k === 'pattern') {
            return `pattern: ${eval(rule[k])},`
          }
          return `${k}: '${rule[k]}',`
        })
        return `{ ${keyValList.join('\n')} },`
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
            ${dataList.join('\n')}
            api: '${api}',
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
          showDialog(${__type__ === 'add' ? '' : 'row'}) {
            this.dialogVisible = true
            ${__type__ === 'add' ? '' : fields.map(f => `this.formData.${f.vModel} = row.${f.vModel}`).join('\n')}
          },
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.fetchData(
                  {
                    url: this.api,
                    data: this.formData
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
