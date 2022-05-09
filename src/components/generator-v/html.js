import { capitalize } from './utils'

/**
 * element-ui表单输入组件
 * el-input
 * el-select
 * el-date-picker
 */
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
    const handle = f.handle ? `@click="handle${capitalize(f.handle)}Click(${f.noParam ? '' : 'scope.row'})"` : ''
    const style = f.style ? `style="${f.style}"` : ''

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
      vModel,
      disabled,
      clearable,
      placeholder,
      type
    } = buildEls.buildTagAttr(f)

    const startPlaceholder = f['start-placeholder']
      ? `start-placeholder="${f['start-placeholder']}"`
      : ''
    const endPlaceholder = f['end-placeholder']
      ? `end-placeholder="${f['end-placeholder']}"`
      : ''
    const format = f.format
      ? `format="${f.format}"`
      : 'format="yyyy-MM-dd"'
    const valueFormat = f['value-format']
      ? `value-format="${f['value-format']}"`
      : 'value-format="yyyy-MM-dd"'
    let str = ''
    if (f.type === 'dateRange') {
      str = (
        `<div style="display: flex;">
          <${tag}
            v-model="formData.${f.vModel[0]}"
            type="date"
            style="margin-right: 10px"
            placeholder="${f.startPlaceholder}"
            ${format}
            ${valueFormat}
            ${clearable}
          />
          <${tag}
            v-model="formData.${f.vModel[1]}"
            type="date"
            placeholder="${f.endPlaceholder}"
            ${format}
            ${valueFormat}
            ${clearable}
          />
        </div>`
      )
    } else {
      str = `<${tag}
        ${type}
        ${vModel}
        ${format}
        ${valueFormat}
        ${placeholder}
        ${startPlaceholder}
        ${endPlaceholder}
        ${clearable}
      />`
    }
    return str
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

/**
 * element-ui 表格组件（带分页）
 * table配置写死
 */
function buildTable(tableConfig) {
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
  const {
    operations: tOperations,
    columns
  } = tableConfig

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

    if (col.label === '操作' && tOperations.length) {
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
          \n${tOperations.map(o => buildOperations(o)).join('\n')}\n
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
  return (
    `<div>
      <el-table
        ref="tableData"
        v-loading="loading"
        :data="tableData"
        :height="tableHeight"
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

function buildOperations(operation) {
  switch (operation.type) {
    case 'export':
      return (
        `<export-excel
          v-if="buttonRights.export"
          class="exportButton"
          :table-ref="$refs.tableData"
          :search-form="searchParam"
          protocol-url="${operation.api}"
          :file-name="'${operation.fileName}.xlsx'"
        />`
      )
    case 'help':
      return '<el-button icon="el-icon-question" @click="drawerVisible = true">帮助</el-button>'
    case 'confirm':
    case 'add':
    case 'edit':
    case 'check':
      return buildEls['el-button'](operation.btnOpts)
    default:
      return ''
  }
}

function buildForm(formConf) {
  const { labelWidth, fields } = formConf

  function elFormItemWrapper(f) {
    return (
      `<el-form-item label="${f.label}" prop="${f.vModel}">
        ${buildEls[f.tag](f)}
      </el-form-item>`
    )
  }

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
/**
 *  el-col 布局组件
 */
function elColWrapper(el, span) {
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
/**
 * el-row 布局组件
 */
function elRowWrapper(col, gutter) {
  return (
    `<el-row ref="searchRow" :gutter="${gutter}">
      ${col}
    </el-row>`
  )
}

export function makeUpHtml(config) {
  const {
    options,
    header: {
      operations: hOperations,
      gutter,
      fields
    },
    table
  } = config

  /**
   * header
   */
  const searchColList = fields.map(f => {
    const { tag, span } = f
    return elColWrapper(buildEls[tag](f), span)
  })

  const headerBtnList = []
  fields.length && headerBtnList.push(
    `<el-button type="primary" style="margin-left: 5px;" @click="searchData()">搜索</el-button>
    <el-button @click="resetFormData()">重置</el-button>`
  )
  hOperations.forEach(o => {
    headerBtnList.push(buildOperations(o))
  })
 
  const headerHtml = elRowWrapper(
    `${searchColList.join('\n')}
    <div class="searchItem">${headerBtnList.join('\n')}</div>`,
    gutter
  )

  /**
   * table和分页
   */
  const tableHtml = buildTable(table)

  /**
   * 隐藏的组件
   */
  const hiddenCompHtml = hOperations.concat(table.operations).map(o => {
    switch (o.type) {
      case 'help':
        return (
          `<el-drawer
            title="${o.title}"
            size="50%"
            :visible.sync="drawerVisible"
            :with-header="true"
          >
            ${o.content}
          </el-drawer>`
        )
      case 'add':
      case 'edit':
      case 'check':
        return `<${capitalize(o.handle)}Dialog ref="${o.handle}Dialog" @reLoad="loadData" />`
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
/**
 * el-dialog wrapper
 */
function elDialogWrapper(content, opts) {
  const {
    type,
    title,
    width
  } = opts
  return (
    `<el-dialog
      title="${title}"
      :visible.sync="dialogVisible"
      width="${width}px"
      :close-on-click-modal="false"
      append-to-body
      center
      ${type === 'check' ? '' : '@close="resetFormData(\'form\')"'}
    >
      ${content}
    </el-dialog>`
  )
}

export function makeUpDialogHtml(dialogOpts) {
  const {
    type
  } = dialogOpts

  let contentHtml = ''
  if (type === 'check') {
    contentHtml = buildTable(dialogOpts.table)
  } else {
    contentHtml = buildForm(dialogOpts.form)
  }
   
  const dialogHtml = elDialogWrapper(contentHtml, dialogOpts)

  return (
    `<template>
      ${dialogHtml}
    </template>`
  )
}
