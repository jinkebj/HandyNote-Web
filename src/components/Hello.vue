<template>
  <div>
    <div>
      <button @click="showContent">Show Content in Console</button><p />
    </div>
    <div id="editor"></div>
  </div>
</template>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { ImageResize } from '../quill_modules/ImageResize'

export default {
  name: 'hello',

  data () {
    return {
      quill: {}
    }
  },

  mounted () {
    Quill.register('modules/imageResize', ImageResize)

    this.quill = new Quill(document.getElementById('editor'), {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{'header': 1}, {'header': 2}],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'script': 'sub'}, {'script': 'super'}],
          [{'indent': '-1'}, {'indent': '+1'}],
          [{'direction': 'rtl'}],
          [{'size': ['small', false, 'large', 'huge']}],
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          [{'color': []}, {'background': []}],
          [{'font': []}],
          [{'align': []}],
          ['clean'],
          ['link', 'image', 'video']
        ],
        imageResize: {
          displaySize: true
        }
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    })
  },

  methods: {
    showContent () {
      console.log('quill.getContents() is:' + JSON.stringify(this.quill.getContents()))
      console.log('quill.getText() is:' + JSON.stringify(this.quill.getText()))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#editor {
  height: 800px
}
</style>
