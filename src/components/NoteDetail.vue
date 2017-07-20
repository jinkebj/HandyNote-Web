<template>
  <div>
    <div class="note-header">
      <div class="note-title">
        Sample Note
      </div>

      <div class="note-controls">
        <el-button @click="saveContent">Save Content</el-button>
        <el-button @click="addContent">Add Content</el-button>
      </div>

      <div class="clear"></div>
    </div>
    <div id="note-editor"></div>
  </div>
</template>

<style scoped>
#note-editor {
  min-height: 500px;
  border: 0px;
}
.note-header {
  padding: 1em 1em;
}
.note-title {
  float: left;
  font-size: 150%;
  padding-top: 5px;
}
.note-controls {
  float: right;
}
.clear {
  clear: both;
}
</style>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { ImageResize } from '@/quill_modules/ImageResize'

export default {
  data () {
    return {
      quill: {}
    }
  },

  watch: {
    $route: 'loadContent'
  },

  mounted () {
    Quill.register('modules/imageResize', ImageResize)

    this.quill = new Quill(document.getElementById('note-editor'), {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'script': 'sub'}, {'script': 'super'}],
          [{'indent': '-1'}, {'indent': '+1'}],
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

    this.loadContent()
  },

  methods: {
    addContent () {
      this.$http.post(this.$baseAPIUrl + '/notes', {
        name: 'my 3rd note',
        text: this.quill.getText(),
        contents: this.quill.getContents().ops
      })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
    },

    saveContent () {
      this.$http.post(this.$baseAPIUrl + '/notes/' + this.$route.params.id, {
        name: 'my 3rd note',
        text: this.quill.getText(),
        contents: this.quill.getContents().ops
      })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
    },

    loadContent () {
      let self = this
      this.$http.get(this.$baseAPIUrl + '/notes/' + this.$route.params.id)
        .then(function (response) {
          self.quill.setContents(response.data.contents)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
