<template>
  <div class="note-container">
    <div class="note-header">
      <input type="text" class="note-title" v-model="noteName">

      <div class="note-controls">
        <el-button @click="updateNote">Save</el-button>
        <el-button @click="deleteNote">Delete</el-button>
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
  font-size: 16px;
}
</style>

<style>
.ql-toolbar.ql-snow {
  border-left: none;
  border-right: none;
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
      noteName: '',
      noteId: ''
    }
  },

  mounted () {
    Quill.register('modules/imageResize', ImageResize)

    this.quill = new Quill('#note-editor', {
      modules: {
        toolbar: [
          [{'header': [1, 2, 3, 4, 5, 6, false]}, {'font': []}, {'size': ['small', false, 'large', 'huge']}],
          ['bold', 'italic', 'underline', 'strike'],
          [{'color': []}, {'background': []}],
          [{'align': []}, {'indent': '-1'}, {'indent': '+1'}, {'list': 'ordered'}, {'list': 'bullet'}],
          // [{'script': 'sub'}, {'script': 'super'}],
          ['blockquote', 'code-block', 'clean'],
          // ['video'],
          ['link', 'image']
        ],
        imageResize: {
          displaySize: true
        }
      },
      theme: 'snow'
    })

    this.$bus.$on('loadNoteWithId', (id) => {
      if (id === undefined || id.length === 0) return

      this.noteId = id
      this.quill.setText('loading...')
      this.loadNote()
    })
  },

  methods: {
    updateNote () {
      const self = this
      Model.updateNote(self.noteId, {
        name: this.noteName,
        text: this.quill.getText(),
        contents: this.quill.getContents().ops
      })
        .then(function (response) {
          self.$bus.$emit('refreshNoteList', response.data.folder_id, response.data._id)
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
        Model.deleteNote(self.noteId)
          .then(function (response) {
            self.$bus.$emit('refreshNoteList', response.data.folder_id, '')
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

    loadNote () {
      const self = this
      Model.getNote(self.noteId)
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
