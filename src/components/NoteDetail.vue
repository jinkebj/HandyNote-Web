<template>
  <div>
    <div class="note-empty-hint" v-show="noteId === ''">
      <i class="el-icon-document"></i>&nbsp;&nbsp;No content
    </div>

    <div class="note-container" v-show="noteId !== ''">
      <div class="note-header">
        <input type="text" class="note-title" v-model="noteItem.name">

        <el-popover
          ref="noteMetaData"
          placement="bottom"
          width="260"
          trigger="hover">
          <el-row>
            <el-col :span="12"><div class="note-meta-info">Name:</div></el-col>
            <el-col :span="12"><div class="note-meta-info">{{noteItem.name}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="note-meta-info">Created Time:</div></el-col>
            <el-col :span="12"><div class="note-meta-info">{{noteItem.created_at | fmtDateTime}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="note-meta-info">Updated Time:</div></el-col>
            <el-col :span="12"><div class="note-meta-info">{{noteItem.updated_at | fmtDateTime}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="note-meta-info">Folder:</div></el-col>
            <el-col :span="12"><div class="note-meta-info">{{noteItem.folder_name}}</div></el-col>
          </el-row>
        </el-popover>

        <div class="note-controls">
          <el-button @click="updateNote">Save</el-button>

          <el-button-group class="note-controls-icon-group">
            <el-button class="note-controls-icon" v-popover:noteMetaData>
              <i class="material-icons">info_outline</i>
            </el-button>
            <el-button class="note-controls-icon" @click="deleteNote">
              <i class="material-icons">delete</i>
            </el-button>
          </el-button-group>

          <el-dropdown>
            <el-button class="note-controls-icon">
              <i class="material-icons">more_vert</i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="my-folder-action-item">
                <span class="my-folder-action-item-inner" @click="showMoveFolder">Move To</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div id="note-editor"></div>
    </div>
    <el-dialog class="my-folder-form" title="Please select destination folder:" :visible.sync="showMoveToFolderForm">
      <el-tree :data="moveToFolders" default-expand-all highlight-current :expand-on-click-node="false"
        @node-click="selectMoveToFolder" :current-node-key="selectedMoveToFolderId">
      </el-tree>
      <div slot="footer">
        <el-button @click="showMoveToFolderForm = false">Cancel</el-button>
        <el-button type="primary" @click="moveNote"
          :disabled="selectedMoveToFolderId === '' || selectedMoveToFolderId === noteItem.folder_id">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.note-container {
  height: calc(100vh - 160px);
}

.note-header {
  padding: 5px 15px;

  display: flex;
  flex-flow: row;
}

.note-title {
  border: none;
  outline: none;
  font-size: 150%;

  flex: 1;
}

.note-meta-info {
  padding: 5px;
  font-size: 13px;
}

.note-controls {
  flex: 0 250px;

  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
}

.note-controls-icon-group {
  padding-left: 10px;
}

.note-controls-icon {
  border: none;
  padding-right: 10px;
  padding-left: 6px;
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
import {prepareFolderData} from '@/util'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { ImageResize } from '@/quill_modules/ImageResize'

export default {
  data () {
    return {
      quill: {},
      noteId: '',
      noteItem: {name: ''},
      folderRoot: {
        type: 0,
        id: 'mytest-Root',
        label: 'My Folders',
        ancestor_ids: [],
        children: []
      },
      moveToFolders: [],
      showMoveToFolderForm: false,
      selectedMoveToFolderId: ''
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
        name: this.noteItem.name,
        text: this.quill.getText(),
        contents: this.quill.getContents().ops
      })
        .then(function (response) {
          self.noteItem = response.data
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
      self.$confirm('Move this note to trash?', 'Please Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        Model.deleteNote(self.noteId)
          .then(function (response) {
            self.$bus.$emit('deleteNote', response.data._id)
            self.$message({
              message: 'Move note to trash successfully!',
              type: 'success'
            })
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Move note to trash failed!')
          })
      })
    },

    loadNote () {
      const self = this
      Model.getNote(self.noteId)
        .then(function (response) {
          self.noteItem = response.data
          self.quill.setContents(response.data.contents)
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load note!')
        })
    },

    showMoveFolder () {
      const self = this
      self.selectedMoveToFolderId = ''
      Model.getFolderList()
        .then(function (response) {
          self.moveToFolders = prepareFolderData(self.folderRoot, response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      self.showMoveToFolderForm = true
    },

    selectMoveToFolder (data) {
      this.selectedMoveToFolderId = data.id
    },

    moveNote () {
      const self = this
      if (self.noteItem.folder_id === self.selectedMoveToFolderId) {
        self.showMoveToFolderForm = false
        return
      }

      Model.updateNote(self.noteId, {
        folder_id: self.selectedMoveToFolderId
      })
        .then(function (response) {
          self.$message({
            message: 'Move note successfully!',
            type: 'success'
          })
          self.showMoveToFolderForm = false
          self.$bus.$emit('deleteNote', self.noteId)
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Move note failed!')
        })
    }
  }
}
</script>
