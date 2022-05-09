<template>
  <div class="container">
    <el-button icon="el-icon-download" type="text" @click="download">
      导出vue文件
    </el-button>
    <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
      复制代码
    </el-button>
    <input id="copyNode" type="hidden">
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import { beautifierConf } from '@/utils/index'
import { makeUpHtml, makeUpDialogHtml } from '@/components/generator-v/html'
import { makeUpJs, makeUpDialogJs } from '@/components/generator-v/js'
// import { makeUpCss } from '@/components/generator/css'
import loadBeautifier from '@/utils/loadBeautifier'
import config from '@/views/config'
import { capitalize } from '@/components/generator-v/utils'

let beautifier

export default {
  data() {
    return {
      formData: {}
    }
  },
  mounted() {
    loadBeautifier(btf => {
      beautifier = btf
    })
    const clipboard = new ClipboardJS('#copyNode', {
      text: trigger => {
        const codeStr = this.generate()
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return codeStr
      }
    })
    clipboard.on('error', e => {
      this.$message.error('代码复制失败')
    })
  },
  methods: {
    download(data) {
      // const codeStr = this.generate()
      // const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      // saveAs(blob, data.fileName)
      const exports = this.generate()
      Object.keys(exports).forEach(e => {
        const blob = new Blob([exports[e]], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, `${e}.vue`)
      })
    },
    copy(data) {
      document.getElementById('copyNode').click()
    },
    generate() {
      this.formData = config
      const exports = {}
      const js = makeUpJs(this.formData)
      const html = makeUpHtml(this.formData)
      exports.index = beautifier.html(html + js, beautifierConf.html)

      const { header: {
        operations: hOperations
      },
      table: {
        operations: tOperations
      } } = this.formData

      hOperations.concat(tOperations).forEach(o => {
        const { type, dialogOpts } = o
        if (type === 'edit' || type === 'add' || type === 'check') {
          const dHtml = makeUpDialogHtml(dialogOpts)
          const dJs = makeUpDialogJs(dialogOpts)
          exports[`${capitalize(o.type)}Dialog`] = beautifier.html(dHtml + dJs, beautifierConf.html)
        }
      })

      return exports

      // const css = cssStyle(makeUpCss(this.formData))
      // return beautifier.html(html + js, beautifierConf.html)
      // return beautifier.html(dialogHtml + dialogJs, beautifierConf.html)
    }
  }
}
</script>

<style lang='scss'>
@import '@/styles/home';
</style>
