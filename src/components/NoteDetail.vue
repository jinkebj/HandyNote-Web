<template>
  <div>
    <div class="note-content-header">
      <h1 class="note-content-title">Sample Note</h1>
      <p class="note-content-subtitle">
          From <a>JK</a> at <span>3:56pm, April 3, 2017</span>
      </p>

      <div class="note-content-controls">
        <el-button @click="loadContent">Load Content</el-button>
        <el-button @click="saveContent">Save Content</el-button>
        <el-button @click="addContent">Add Content</el-button>
        <el-button @click="showContent">Print to Console</el-button>
      </div>
    </div>

    <div id="editor"></div>
  </div>
</template>

<style scoped>
#editor {
  min-height: 500px;
  border: 0px;
}
.note-content-header {
    padding: 1em 2em;
}

.note-content-title {
    margin: 0.5em 0 0;
}
.note-content-subtitle {
    font-size: 1em;
    margin: 0;
    font-weight: normal;
}
.note-content-subtitle span {
    color: #999;
}
.note-content-controls {
    margin-top: 2em;
    text-align: right;
}
</style>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { ImageResize } from '../quill_modules/ImageResize'

export default {
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
    },

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
      this.$http.post(this.$baseAPIUrl + '/notes/275532b0-66dd-11e7-9405-9dbbc67dfe64', {
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
      this.$http.get(this.$baseAPIUrl + '/notes/275532b0-66dd-11e7-9405-9dbbc67dfe64')
        .then(function (response) {
          console.log(response)
          self.quill.setContents(response.data.contents)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
