export function makeUpDialogHtml(dialogConfig, type) {
  const {
    submitApi,
    text,
    dialogWidth,
    title,
    fields
  } = dialogConfig

  const formItemList = fields.map(
    f => `<el-form-item label="${f.label}" prop="${f.vModel}">
          ${buildEls[f.tag](f)}
        </el-form-item>`
  )

  return (
    `<template>
      <el-dialog
        title="${title}"
        :visible.sync="dialogVisible"
        width="${dialogWidth}px"
        :close-on-click-modal="false"
        append-to-body
        center
        @close="resetFormData('form')"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          :rules="rules"
        >
          ${formItemList}
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>`
  )
}
