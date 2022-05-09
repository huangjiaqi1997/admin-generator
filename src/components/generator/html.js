import { capitalize } from './utils'

// 表单输入、按钮
const buildEls = {
  buildTagAttr(f) {
    return {
      tag: f.tag,
      type: f.type ? `type="${f.type}"` : '',
      vModel: f.vModel ? `v-model="formData.${f.vModel}"` : '',
      placeholder: f.placeholder ? `placeholder="${f.placeholder}"` : '',
      clearable: f.clearable ? 'clearable' : '',
      disabled: f.disabled ? 'disabled' : '',
      size: f.size ? `size="${f.size}"` : ''
    }
  },

  'el-button': f => {
    const { type, size, disabled } = buildEls.buildTagAttr(f)
    const vIf = f.rightName ? `v-if="buttonRights.${f.rightName}"` : ''
    const style = f.style ? `style="${f.style}"` : ''
    const rowParam = f.__type__ === 'add'
      ? ''
      : 'scope.row'
    const handle = `@click="handle${capitalize(f.__type__)}Click(${rowParam})"`

    return (
      `<el-button
        ${vIf}
        ${type}
        ${size}
        ${style}
        ${handle}
        ${disabled}
      >
        ${f.text}
      </el-button>`
    )
  },

  'el-input': f => {
    const {
      tag,
      type,
      vModel,
      placeholder,
      clearable,
      disabled
    } = buildEls.buildTagAttr(f)
    
    return (
      `<${tag}
        ${type}
        ${vModel}
        ${placeholder}
        ${clearable}
        ${disabled}
      />`
    )
  },

  'el-select': f => {
    const {
      tag,
      vModel,
      disabled,
      clearable,
      placeholder
    } = buildEls.buildTagAttr(f)
    
    const optionList = f.options.map(o => `<el-option label="${o.label}" value="${o.value}" />`)

    return (
      `<${tag}
        ${vModel}
        ${disabled}
        ${clearable}
        ${placeholder}
      >
        \n${optionList.join('\n')}\n
      </${tag}>`
    )
  },

  'el-date-picker': f => {
    const {
      tag,
      disabled,
      clearable,
      placeholder,
      type
    } = buildEls.buildTagAttr(f)

    const startPlaceholder = f['start-placeholder']
      ? `start-placeholder="${f['start-placeholder']}"`
      : 'start-placeholder="请选择开始日期"'
    const endPlaceholder = f['end-placeholder']
      ? `end-placeholder="${f['end-placeholder']}"`
      : 'end-placeholder="请选择结束日期"'
    const format = f.format
      ? `format="${f.format}"`
      : 'format="yyyy-MM-dd"'
    const valueFormat = f['value-format']
      ? `value-format="${f['value-format']}"`
      : 'value-format="yyyy-MM-dd"'
    return (
      `<${tag}
        ${format}
        ${startPlaceholder}
        ${endPlaceholder}
        ${valueFormat}
        ${disabled}
        ${clearable}
        v-model="${f.vModel}Range"
        ${type}
        unlink-panels
        range-separator="至"
        @change="([st, et]) => {formData.start${capitalize(f.vModel)} = st; formData.end${capitalize(f.vModel)} = et}"
        :default-time="['00:00:00', '23:59:59']" />`
    )
    // let str = ''
    // if (f.type === 'daterange') {
    //   str = (
    //     `<div style="display: flex;">
    //       <${tag}
    //         v-model="formData.${f.vModel[0]}"
    //         type="date"
    //         style="margin-right: 10px"
    //         placeholder="${f.startPlaceholder}"
    //         ${format}
    //         ${valueFormat}
    //         ${clearable}
    //       />
    //       <${tag}
    //         v-model="formData.${f.vModel[1]}"
    //         type="date"
    //         placeholder="${f.endPlaceholder}"
    //         ${format}
    //         ${valueFormat}
    //         ${clearable}
    //       />
    //     </div>`
    //   )
    // } else {
    //   str = `<${tag}
    //     ${type}
    //     ${vModel}
    //     ${format}
    //     ${valueFormat}
    //     ${placeholder}
    //     ${startPlaceholder}
    //     ${endPlaceholder}
    //     ${clearable}
    //   />`
    // }
    // return str
    // return (
    //   `<${tag}
    //     ${vModel}
    //     ${disabled}
    //     ${clearable}
    //     ${placeholder}
    //     ${startPlaceholder}
    //     ${endPlaceholder}
    //     ${type}
    //     ${format}
    //     ${valueFormat}
    //   />`
    // )
  }
}

// 表格、分页
function buildTable(config) {
  function buildColAttr(col) {
    return {
      type: col.type ? `type="${col.type}"` : '',
      label: col.label ? `label="${col.label}"` : '',
      prop: col.prop ? `prop="${col.prop}"` : '',
      width: col.width ? `width="${col.width}"` : '',
      align: col.align ? `align="${col.align}"` : 'align="center"',
      fixed: col.fixed ? `fixed="${col.fixed}"` : '',
      sortable: col.sortable ? `sortable="${col.sortable}"` : '',
      showOverflowTooltip: col.showOverflowTooltip ? 'show-overflow-tooltip' : ''
    }
  }
  const { actions, columns, tableHeight } = config

  const tableColList = columns.map(col => {
    const {
      type,
      label,
      prop,
      width,
      align,
      fixed,
      showOverflowTooltip
    } = buildColAttr(col)

    let str

    if (col.label === '操作' && actions.length) {
      str = (
        `<el-table-column
          ${type}
          ${label} 
          ${prop}
          ${width}
          ${fixed}
          ${align}
          ${showOverflowTooltip}
        >\n<template slot-scope="scope">
          \n${actions.map(a => buildActions(a)).join('\n')}\n
        </template>\n</el-table-column>`
      )
    } else if (col.label.indexOf('时间') !== -1) {
      str = (
        `<el-table-column
          ${type}
          ${label} 
          ${prop}
          ${width}
          ${fixed}
          ${align}
          ${showOverflowTooltip}
        >\n<template slot-scope="scope">
          {{ scope.row.${col.prop} | dateFormate }}
        </template>\n</el-table-column>`
      )
    } else {
      str = (
        `<el-table-column
          ${type}
          ${label}
          ${prop}
          ${align}
          ${width}
          ${fixed}
          ${showOverflowTooltip}
        />`
      )
    }

    return str
  })

  // table配置写死
  const height = tableHeight ? `height="${tableHeight}px"` : ':height="tableHeight"'
  return (
    `<div>
      <el-table
        ref="tableData"
        v-loading="loading"
        :data="tableData"
        ${height}
        border
      >
        ${tableColList.join('\n')}
      </el-table>
      <pagination
        :totals="total"
        :page="page+1"
        :page-size="size"
        @gotoPage="handleGotoPage"
        @changePageSize="handleChangePageSize"
      />
    </div>`
  )
}

// 生成操作按钮
function buildActions(action) {
  switch (action.__type__) {
    case 'export':
      return (
        `<export-excel
          v-if="buttonRights.export"
          class="exportButton"
          :table-ref="$refs.tableData"
          :search-form="searchParam"
          protocol-url="${action.api}"
          :file-name="'${action.fileName}.xlsx'"
        />`
      )
    case 'help':
      return '<el-button icon="el-icon-question" @click="drawerVisible = true">帮助</el-button>'
    case 'confirm':
    case 'add':
    case 'edit':
    case 'look':
      return buildEls['el-button'](action)
    default:
      return ''
  }
}

// 表单
function buildForm(content) {
  function elFormItemWrapper(f) {
    return (
      `<el-form-item label="${f.label}" prop="${f.vModel}">
        ${buildEls[f.tag](f)}
      </el-form-item>`
    )
  }

  const { labelWidth, fields } = content

  const formItemList = fields.map(f => elFormItemWrapper(f))
  formItemList.push(
    `<el-form-item>
      <el-button type="primary" @click="submitForm('form')">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </el-form-item>`
  )
  return (
    `<el-form
       ref="form"
      :model="formData"
      label-width="${labelWidth}px"
      :rules="rules"
    >
      ${formItemList.join('\n')}
    </el-form>`)
}

function colWrapper(el, span) {
  return (
    `<el-col
      :xs="${span * 3}"
      :sm="${span * (3 / 2)}"
      :md="${span}"
      :lg="${span}"
      class="searchItem"
    >
      ${el}
    </el-col>`
  )
}

function rowWrapper(col, gutter) {
  return (
    `<el-row ref="searchRow" :gutter="${gutter}">
      ${col}
    </el-row>`
  )
}

function dialogWrapper(contentHtml, content) {
  const {
    title,
    dialogWidth,
    fields
  } = content

  const close = fields ? '@close="resetFormData(\'form\')"' : ''
  return (
    `<el-dialog
      title="${title}"
      :visible.sync="dialogVisible"
      width="${dialogWidth}px"
      :close-on-click-modal="false"
      append-to-body
      center
      ${close}
    >
      ${contentHtml}
    </el-dialog>`
  )
}

// 生成 index.vue的html
export function makeUpPageHtml(config) {
  const {
    header: {
      actions = [],
      gutter,
      fields = []
    } = {},
    table
  } = config

  // 筛选 和 头部的button
  const searchColList = fields.map(f => {
    const { tag, span } = f
    return colWrapper(buildEls[tag](f), span)
  })

  const headerBtnList = []
  fields.length && headerBtnList.push(
    `<el-button type="primary" style="margin-left: 5px;" @click="searchData()">搜索</el-button>
    <el-button @click="resetFormData()">重置</el-button>`
  )
  actions.forEach(a => {
    headerBtnList.push(buildActions(a))
  })
 
  const headerHtml = (actions.length === 0 && fields.length === 0)
    ? ''
    : rowWrapper(
      `${searchColList.join('\n')}
      <div class="searchItem">${headerBtnList.join('\n')}</div>`,
      gutter
    )

  // table和分页
  const tableHtml = buildTable(table)

  // 隐藏的组件
  const hiddenCompHtml = actions.concat(table.actions || []).map(a => {
    switch (a.__type__) {
      case 'help':
        return (
          `<el-drawer
            title="${a.title}"
            size="50%"
            :visible.sync="drawerVisible"
            :with-header="true"
          >
            ${a.content}
          </el-drawer>`
        )
      case 'add':
      case 'edit':
      case 'look':
        return `<${capitalize(a.__type__)}Dialog ref="${a.__type__}Dialog" @reLoad="loadData" />`
      default:
        return ''
    }
  }).join('\n')

  return (
    `<template>
      <el-card>
        ${headerHtml}
        ${tableHtml}
        ${hiddenCompHtml}
      </el-card>
    </template>`
  )
}

export function makeUpDialogHtml(content, __type__) {
  let contentHtml = ''

  if (__type__ === 'look') {
    if (content.__type__ === 'table') {
      contentHtml = buildTable(content)
    }
  } else {
    contentHtml = buildForm(content)
  }

  const dialogHtml = dialogWrapper(contentHtml, content)

  return (
    `<template>
      ${dialogHtml}
    </template>`
  )
}
