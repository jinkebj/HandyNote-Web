<template>
  <div class="note-container">
    <div class="note-header">
      <input type="text" class="note-title" v-model="noteName">

      <div class="note-controls">
        <el-button @click="saveNote">Save</el-button>
        <el-button @click="deleteNote">Delete</el-button>
        <el-button @click="addNote">Add</el-button>
      </div>

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

  display: flex;
  flex-flow: row;
}

.note-title {
  border: none;
  outline: none;
  font-size: 150%;

  flex: 1;
}

.note-controls {
  flex: 0 250px;

  display: flex;
  flex-flow: row;
  justify-content: flex-end;
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
      quill: {},
      noteName: 'No title'
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
      const self = this
      Model.addNote({
        name: this.noteName,
        text: this.quill.getText(),
        contents: this.quill.getContents().ops
      })
        .then(function (response) {
          // console.log(response)
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Add note failed!')
        })
    },

    saveNote () {
      const self = this
      Model.updateNote(this.$route.params.id, {
        name: this.noteName,
        text: this.quill.getText(),
        contents: this.quill.getContents().ops
      })
        .then(function (response) {
          self.$message({
            message: 'Save note successfully!',
            type: 'success'
          })
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Save note failed!')
        })
    },

    deleteNote () {
      const self = this
      self.$confirm('You have selected to delete this note, continue?', 'Please Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        Model.deleteNote(self.$route.params.id)
          .then(function (response) {
            self.$message({
              message: 'Delete note successfully!',
              type: 'success'
            })
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Delete note failed!')
          })
      })
    },

    loadContent () {
      const self = this
      Model.getNote(this.$route.params.id)
        .then(function (response) {
          self.noteName = response.data.name
          self.quill.setContents(response.data.contents)
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load note!')
        })
    }
  }
}
</script>
