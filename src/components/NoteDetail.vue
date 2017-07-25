<template>
  <div class="note-container">
    <div class="note-header">
      <div class="note-title">
        Sample Note
      </div>

      <div class="note-controls">
        <el-button @click="saveNote">Save</el-button>
        <el-button @click="deleteNote">Delete</el-button>
        <el-button @click="addNote">Add</el-button>
      </div>

      <div class="clear"></div>
    </div>
    <div id="note-editor"></div>
  </div>
</template>

<style scoped>
.note-container {
  height: calc(100vh - 160px);
}

.note-header {
  padding: 15px 15px;
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

#note-editor {
  border: 0;
  font-size: 18px;
}
</style>

<script>
import Model from '@/models'
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

    this.quill = new Quill('#note-editor', {
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
    addNote () {
      Model.addNote({
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

    saveNote () {
      Model.updateNote(this.$route.params.id, {
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

    deleteNote () {
      Model.deleteNote(this.$route.params.id)
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    loadContent () {
      let self = this
      Model.getNote(this.$route.params.id)
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
