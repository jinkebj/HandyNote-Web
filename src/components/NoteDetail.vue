<template>
  <div>
    <div class="note-empty-hint" v-show="noteId === ''">
      <i class="el-icon-document"></i>&nbsp;&nbsp;No content
    </div>

    <div class="note-container" v-show="noteId !== ''">
      <div class="note-header">
        <input type="text" class="note-title" v-model="noteName">

        <el-popover
          ref="noteMetaData"
          placement="bottom"
          title="Note Information"
          width="200"
          trigger="click"
          content="This is the detail information of note.">
        </el-popover>

        <div class="note-controls">
          <el-button @click="updateNote">Save</el-button>

          <el-button-group class="note-controls-icon-group">
            <el-tooltip content="Note Infomation" placement="top" effect="light">
              <el-button icon="information" class="note-controls-icon" v-popover:noteMetaData></el-button>
            </el-tooltip>
            <el-tooltip content="Delete" placement="top" effect="light">
              <el-button icon="delete" class="note-controls-icon" @click="deleteNote"></el-button>
            </el-tooltip>
          </el-button-group>

          <el-dropdown trigger="click">
            <el-tooltip content="More Action" placement="top" effect="light">
              <el-button icon="more" class="note-controls-icon"></el-button>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span class="note-controls-text">Move To</span></el-dropdown-item>
              <el-dropdown-item><span class="note-controls-text">Export</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div id="note-editor"></div>
    </div>
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

.note-controls-icon-group {
  padding-left: 10px;
}

.note-controls-icon {
  border: none;
  padding-right: 10px;
  padding-left: 6px;
}

.note-controls-text {
  font-size: 14px;
}

#note-editor {
  border: 0;
  font-size: 16px;
}

.note-empty-hint {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 20px;
}
</style>

<style>
.note-container .ql-toolbar.ql-snow {
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
      if (id === undefined || id.length === 0) {
        this.noteId = ''
        return
      }

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
          self.$bus.$emit('updateNote', response.data)
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
            self.$bus.$emit('deleteNote', response.data._id)
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
