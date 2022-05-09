<template>
  <el-card>
    <div style="position: absolute; right: 30px; z-index: 1;">
      <el-button icon="el-icon-view" type="text" @click="handleJSONClick">
        查看json
      </el-button>
      <el-button icon="el-icon-download" type="text" @click="download">
        导出vue文件
      </el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="字段信息" name="tab1">
        <el-table ref="infoTable" :data="infoTable" row-key="rowId" border>
          <el-table-column label="序号" type="index" width="50px" />
          <el-table-column label="字段描述" min-width="5%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.label" />
            </template>
          </el-table-column>
          <el-table-column label="字段列名" min-width="5%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.prop" />
            </template>
          </el-table-column>
          <el-table-column label="查询" min-width="2%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isQuery" />
            </template>
          </el-table-column>
          <el-table-column label="插入" min-width="2%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isInsert" />
            </template>
          </el-table-column>
          <el-table-column label="编辑" min-width="2%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="显示类型" min-width="5%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.htmlType">
                <el-option label="文本框" value="el-input" />
                <el-option label="下拉框" value="el-select" />
                <el-option label="日期控件" value="el-date-picker" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" min-width="2%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isRequired" v-show="(scope.row.isInsert || scope.row.isEdit)" />
            </template>
          </el-table-column>
          <el-table-column label="其他配置" width="400px">
            <template slot-scope="scope">
              <div v-if="
                scope.row.htmlType === 'el-input' &&
                (scope.row.isInsert ||
                scope.row.isEdit)"
              >
                <el-input v-model="scope.row.pattern" style="width: 250px" placeholder="正则表达式" />
              </div>
              
              <div v-if="
                scope.row.htmlType === 'el-select' &&
                (scope.row.isQuery ||
                scope.row.isInsert ||
                scope.row.isEdit)"
              >
                <div class="flexDiv" style="width: 100%; flex-wrap: wrap;">
                  <el-tag
                    v-for="(o, i) in scope.row.options"
                    :key="o.label"
                    closable
                    :disable-transitions="false"
                    style="margin: 2.5px;"
                    @close="handleTagRemove(i, scope.$index)"
                  >
                    {{ o.label }}
                  </el-tag>
                  <el-popover
                    placement="top"
                    width="200"
                    trigger="click"
                  >
                    <div>
                      label:
                      <el-input
                        v-model="optLab"
                        class="input-new-tag"
                        size="small"
                        style="margin: 5px 0;"
                      />
                      value:
                      <el-input
                        v-model="optVal"
                        class="input-new-tag"
                        size="small"
                        style="margin: 5px 0;"
                      />
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleOptAdd(scope.$index)"
                      >
                        添加
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      type="primary"
                      size="small"
                      style="margin: 2.5px;"
                    >
                      + New
                    </el-button>
                  </el-popover>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="rowRemove(scope.$index)"
                type="text"
                size="small"
              >
                移除
              </el-button>
              <el-button
                @click.native.prevent="rowInsert(scope.$index)"
                type="text"
                size="small"
              >
                加行
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="其他信息" name="tab2">
        <el-form ref="infoForm" :rules="rules" :model="infoForm" label-width="100px">
          <el-form-item class="f-i" prop="isTable">
            <span slot="label" class="infoTitle">表格</span>
            <!-- <el-checkbox v-model="infoForm.isTable" /> -->
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="tableApi">
                <span slot="label">接口</span>
                <el-input v-model="infoForm.tableApi" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item class="f-i" prop="isInsert">
            <span slot="label" class="infoTitle">插入</span>
            <el-checkbox v-model="infoForm.isInsert" />
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="insertApi">
                <span slot="label">接口</span>
                <el-input v-model="infoForm.insertApi" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="insertCode">
                <span slot="label">权限</span>
                <el-input v-model="infoForm.insertCode" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item class="f-i" prop="isEdit">
            <span slot="label" class="infoTitle">编辑</span>
            <el-checkbox v-model="infoForm.isEdit" />
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="接口" prop="editApi">
                <el-input v-model="infoForm.editApi" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="权限" prop="editCode">
                <el-input v-model="infoForm.editCode" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item class="f-i" prop="isDelete">
            <span slot="label" class="infoTitle">删除</span>
            <el-checkbox v-model="infoForm.isDelete" />
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="接口" prop="deleteApi">
                <el-input v-model="infoForm.deleteApi" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="权限" prop="deleteCode">
                <el-input v-model="infoForm.deleteCode" />
              </el-form-item>
            </el-col>
          </el-row>
        
          <el-form-item class="f-i" prop="isExport">
            <span slot="label" class="infoTitle">导出</span>
            <el-checkbox v-model="infoForm.isExport" />
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="接口" prop="exportApi">
                <el-input v-model="infoForm.exportApi" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="权限" prop="exportCode">
                <el-input v-model="infoForm.exportCode" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文件名" prop="exportFileName">
                <el-input v-model="infoForm.exportFileName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item class="f-i" prop="isHelp">
            <span slot="label" class="infoTitle">帮助</span>
            <el-checkbox v-model="infoForm.isHelp" />
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="标题" prop="helpTitle">
                <el-input v-model="infoForm.helpTitle" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="内容" prop="helpContent">
                <tinymce v-model="infoForm.helpContent" placeholder="请输入内容" :height="500" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- <el-card>
          <el-form ref="infoForm" :model="infoForm" label-width="100px">
            <div class="flexDiv">
              <div class="infoTitle">表格</div>
              <el-row :gutter="10" class="elRow">
                <el-col :span="8">
                  <el-form-item label="API" prop="tableApi">
                    <el-input v-model="infoForm.tableApi"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-divider />

            <div class="flexDiv">
              <div class="infoTitle">插入</div>
              <el-row :gutter="10" class="elRow">
                <el-col :span="8">
                  <el-form-item label="API" prop="insertApi">
                    <el-input v-model="infoForm.insertApi"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权限" prop="insertCode">
                    <el-input v-model="infoForm.insertCode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-divider />

            <div class="flexDiv">
              <div class="infoTitle">编辑</div>
              <el-row :gutter="10" class="elRow">
                <el-col :span="8">
                  <el-form-item label="API" prop="editApi">
                    <el-input v-model="infoForm.editApi"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权限" prop="editCode">
                    <el-input v-model="infoForm.editCode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-divider />
            
            <div class="flexDiv">
              <div class="infoTitle">删除</div>
              <el-row :gutter="10" class="elRow">
                <el-col :span="8">
                  <el-form-item label="API" prop="deleteApi">
                    <el-input v-model="infoForm.deleteApi"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权限" prop="deleteCode">
                    <el-input v-model="infoForm.deleteCode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-divider />

            <div class="flexDiv">
              <div class="infoTitle">导出</div>
              <el-row :gutter="10" class="elRow">
                <el-col :span="8">
                  <el-form-item label="API" prop="exportApi">
                    <el-input v-model="infoForm.exportApi"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权限" prop="exportCode">
                    <el-input v-model="infoForm.exportCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="文件名" prop="exportFileName">
                    <el-input v-model="infoForm.exportFileName"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-divider />

            <div class="flexDiv">
              <div class="infoTitle">帮助</div>
              <div>
                <el-form-item label="标题" prop="helpTitle" style="width: 70%; margin-bottom: 10px">
                  <el-input v-model="infoForm.helpTitle"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="helpContent" style="width: 70%;">
                  <tinymce v-model="infoForm.helpContent" placeholder="请输入内容" :height="500"></tinymce>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-card> -->
      </el-tab-pane>
    </el-tabs>

    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(config)"
    />
  </el-card>
</template>

<script>
import { saveAs } from 'file-saver'
import { beautifierConf } from '@/utils/index'
import { makeUpPageHtml, makeUpDialogHtml } from '@/components/generator/html'
import { makeUpPageScript, makeUpDialogScript } from '@/components/generator/js'
import loadBeautifier from '@/utils/loadBeautifier'
import { capitalize } from '@/components/generator/utils'
import tinymce from '@/components/tinymce'
import JsonDrawer from './JsonDrawer'
// import config from '@/views/config'

let beautifier
export default {
  components: { tinymce, JsonDrawer },
  data() {
    return {
      optLab: '',
      optVal: '',
      rowIndex: null,
      jsonDrawerVisible: false,
      activeName: 'tab1',
      tableHeight: `${document.documentElement.scrollHeight - 245}px`,
      infoTable: [
        {
          prop: 'cellphone',
          label: '用户账号',
          isInsert: true,
          isEdit: true,
          isQuery: true,
          htmlType: 'el-input',
          isRequired: true,
          pattern: '/^1\\d{10}$/',
          options: []
        },
        {
          prop: 'userType',
          label: '用户类型',
          isInsert: true,
          isEdit: true,
          isQuery: true,
          htmlType: 'el-select',
          isRequired: true,
          pattern: '',
          options: [
            { label: '产业客户法人', value: '产业客户法人' },
            { label: '产业客户自然人', value: '产业客户自然人' },
            { label: '非产业客户', value: '非产业客户' }
          ]
        },
        {
          prop: 'createTime',
          label: '操作时间',
          isInsert: true,
          isEdit: true,
          isQuery: true,
          htmlType: 'el-date-picker',
          isRequired: true,
          pattern: '',
          options: []
        }
      ],
      infoForm: {
        isInsert: false,
        isEdit: false,
        isDelete: false,
        isExport: false,
        isHelp: false,
        tableApi: 'tq-admin-querybak/lqsQuery/v1/queryLqsOpenFlow',
        insertApi: '',
        insertCode: '',
        editApi: '',
        editCode: '',
        deleteApi: '',
        deleteCode: '',
        exportApi: '',
        exportCode: 'zyq-report-monthly-luqing-open-flow-export',
        exportFileName: '',
        helpTitle: '',
        helpContent: ''
      },
      rules: {
        tableApi: [
          { required: true, message: '请输入信息！', trigger: 'blur' }
        ],
        insertApi: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        insertCode: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        editApi: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        editCode: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        deleteApi: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        deleteCode: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        exportApi: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        exportCode: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        exportFileName: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        helpTitle: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ],
        helpContent: [
          { required: false, message: '请输入信息！', trigger: 'blur' }
        ]
      },
      config: {
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
    }
  },
  // computed: {
  //   curRowEdit() {
  //     return (isEdit, rowI) => (this[isEdit] && this.rowIndex === rowI)
  //   }
  // },
  watch: {
    'infoForm.isInsert'(cur, prev) {
      this.rules.insertApi[0].required = cur
      this.rules.insertCode[0].required = cur
    },
    'infoForm.isEdit'(cur, prev) {
      this.rules.editApi[0].required = cur
      this.rules.editCode[0].required = cur
    },
    'infoForm.isDelete'(cur, prev) {
      this.rules.deleteApi[0].required = cur
      this.rules.deleteCode[0].required = cur
    },
    'infoForm.isExport'(cur, prev) {
      this.rules.exportApi[0].required = cur
      this.rules.exportCode[0].required = cur
      this.rules.exportFileName[0].required = cur
    }
    // 'infoForm.isHelp'(cur, prev) {
    //   this.rules.helpTitle[0].required = cur
    //   this.rules.helpContent[0].required = cur
    // }
  },
  methods: {
    rowInsert(rowIndex) {
      this.infoTable.splice(rowIndex + 1, 0, { rowId: new Date().getTime()} )
      this.$set(this.infoTable[rowIndex + 1], 'options', [])
    },
    rowRemove(rowIndex) {
      this.infoTable.splice(rowIndex, 1)
    },
    handleOptAdd(rowIndex) {
      if (this.optLab === '') return
      if (this.optVal === '') return
      const opts = this.infoTable[rowIndex].options
      if (!opts) this.infoTable[rowIndex].options = []
      this.infoTable[rowIndex].options.push({
        label: this.optLab,
        value: this.optVal
      })
      this.optLab = ''
      this.optVal = ''
    },
    handleTagRemove(i, rowIndex) {
      this.infoTable[rowIndex].options.splice(i, 1)
    },
    handleJSONClick() {
      this.makeUpConfig()
      this.jsonDrawerVisible = true
    },
    makeUpConfig() {
      const {
        isInsert,
        isEdit,
        isDelete,
        isExport,
        isHelp,
        tableApi,
        insertApi,
        insertCode,
        editApi,
        editCode,
        deleteApi,
        deleteCode,
        exportApi,
        exportCode,
        exportFileName,
        helpTitle,
        helpContent
      } = this.infoForm

      const hActions = []
      const tActions = []

      const export_ = {
        __type__: "export",
        api: "",
        fileName: "",
        rightname: "export",
        rightCode: ""
      }
      const help = {
        __type__: "help",
        title: "",
        content: ""
      }
      const add = {
        __type__: "add",
        type: "primary",
        text: "新增",
        size: "mini",
        style: "float: right; margin-right: 5px;",
        rightName: "add",
        rightCode: "",
        content: {
          title: "新增",
          dialogWidth: 500,
          labelWidth: 80,
          api: "",
          param: {},
          fields: []
        }
      }
      const confirm = {
        __type__: "confirm",
        type: "danger",
        text: "删除",
        size: "mini",
        rightName: "delete",
        rightCode: "",
        content: {
          text: "确认删除吗？",
          api: "",
          param: {}
        }
      }
      const edit = {
        __type__: "edit",
        type: "primary",
        text: "编辑",
        size: "mini",
        rightName: "edit",
        rightCode: "",
        content: {
          title: "编辑用户",
          dialogWidth: 500,
          labelWidth: 80,
          api: '',
          param: {},
          fields: []
        }
      }
      
      const sfields = []
      const ifields = []
      const efields = []
      const columns = [{ type: 'index', label: '序号', align: "center" }]

      this.infoTable.forEach(col => {
        columns.push({
          label: col.label,
          prop: col.prop,
          align: "center"
        })

        if (col.isQuery) {
          if (col.htmlType === 'el-date-picker') {
            sfields.push({
              tag: col.htmlType,
              type: 'daterange',
              valueFormat: "yyyy-MM-dd",
              startPlaceholder: "开始日期",
              endPlaceholder: "结束日期",
              defaultValue: [],
              vModel: col.prop,
              clearable: true,
              span: 8,
            })
          } else {
            sfields.push({
              tag: col.htmlType,
              placeholder: col.label,
              vModel: col.prop,
              options: col.options,
              clearable: true,
              span: 4,
            })
          }
        }

        if (col.isInsert) {
          const rules = []
          col.isRequired && rules.push({
            required: col.isRequired,
            message: '请填写正确的字段信息',
            trigger: 'blur'
          })
          col.pattern && rules.push({
            pattern: col.pattern,
            message: '请填写正确的字段信息',
            trigger: 'blur'
          })

          ifields.push({
            tag: col.htmlType,
            label: col.label,
            vModel: col.prop,
            placeholder: col.label,
            options: col.options,
            clearable: true,
            rules
          })
        }

        if (col.isEdit) {
          const rules = []
          col.isRequired && rules.push({
            required: col.isRequired,
            message: '请填写正确的字段信息',
            trigger: 'blur'
          })
          col.pattern && rules.push({
            pattern: col.pattern,
            message: '请填写正确的字段信息',
            trigger: 'blur'
          })

          efields.push({
            tag: col.htmlType,
            label: col.label,
            vModel: col.prop,
            placeholder: col.label,
            options: col.options,
            clearable: true,
            rules
          })
        }
      })
      if (efields.length > 0) {
        columns.push({
          label: "操作",
          align: "center"
        })
      }

      export_.api = exportApi
      export_.rightCode = exportCode
      export_.fileName = exportFileName
      help.title = helpTitle
      help.content = helpContent
      add.content.api = insertApi
      add.rightCode = insertCode
      add.content.fields = ifields
      confirm.content.api = deleteApi
      confirm.rightCode = deleteCode
      edit.content.api = editApi
      edit.rightCode = editCode
      edit.content.fields = efields

      isExport && hActions.push(export_)
      isHelp && hActions.push(help)
      isInsert && hActions.push(add)
      isEdit && tActions.push(edit)
      isDelete && tActions.push(confirm)

      this.config = {
        header: {
          actions: hActions,
          fields: sfields,
          gutter: 10
        },
        table: {
          actions: tActions,
          columns: columns,
          api: tableApi,
          sort: [{ direction: 'DESC', property: 'createTime' }]
        }
      }

      console.log(JSON.parse(JSON.stringify(this.config)))
    },
    submitForm() {
      // if(this.infoTable.some(col => !col.htmlType)) {
      //   return this.$message({
      //     message: '请将表格显示类型填写完整',
      //     type: 'warning'
      //   })
      // }

      this.$refs.infoForm.validate((valid) => {
        if (valid) {
          this.makeUpConfig()
          const exports = this.generate()

          Object.keys(exports).forEach(e => {
            const blob = new Blob([exports[e]], { type: 'text/plain;charset=utf-8' })
            saveAs(blob, `${e}.vue`)
          })
        } else {
          this.$message({
            message: '请将表单填写完整',
            type: 'warning'
          });
          console.log('error submit!!');
          return false;
        }
      });
    },
    download(data) {
      this.submitForm()
    },
    generate() {
      const exports = {}

      const js = makeUpPageScript(this.config)
      const html = makeUpPageHtml(this.config)
      exports.index = beautifier.html(html + js, beautifierConf.html)

      const headerActions = this.config.header?.actions || []
      const tableActions = this.config.table.actions || []

      headerActions.concat(tableActions).forEach(a => {
        const { __type__, content } = a
        if (__type__ === 'edit' || __type__ === 'add' || __type__ === 'look') {
          const dialogHtml = makeUpDialogHtml(content, __type__)
          const dialogJs = makeUpDialogScript(content, __type__)
          exports[`${capitalize(__type__)}Dialog`] = beautifier.html(dialogHtml + dialogJs, beautifierConf.html)
        }
      })

      return exports

      // const css = cssStyle(makeUpCss(this.formData))
      // return beautifier.html(html + js, beautifierConf.html)
      // return beautifier.html(dialogHtml + dialogJs, beautifierConf.html)
    }
  },
  mounted() {
    loadBeautifier(btf => {
      beautifier = btf
    })
  }
}
</script>

<style lang="scss" scoped>
.flexDiv {
  display: flex;
  align-items: center;
}
.el-form-item {
  /* margin-bottom: 15px; */
}
.elRow {
  flex-grow: 1;
}
.infoTitle {
  font-weight: 700;
  /* margin-top: 7px;
  margin-left: 20px; */
}
.f-i {
  margin-top: 10px;
  margin-bottom: 0;
  div {
    font-size: 20px;
  }
}
</style>