<template>
  <div>
    <div class="note-empty-hint" v-show="noteId === ''">
      <i class="el-icon-document"></i>&nbsp;&nbsp;No content
    </div>

    <div id="note-container" v-show="noteId !== ''" :class="popupMode ? '' : 'note-container-height'">
      <div class="note-header">
        <input type="text" class="note-title" :readonly="!editMode" v-model="noteItem.name">

        <el-popover
          ref="noteMetaData"
          placement="bottom"
          width="260"
          trigger="click">
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

        <el-popover
          ref="noteAttachment"
          placement="bottom"
          width="360"
          trigger="click">
          <el-upload
            list-type="text"
            :action="getUploadUrl()"
            :multiple=true
            :limit=20
            :file-list="attachmentList"
            :headers="getUploadHeaders()"
            :data="getUploadExtraData()"
            :on-success="handleUploadSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-error="handleUploadError"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed">
            <el-button size="small">Upload File</el-button>
          </el-upload>
        </el-popover>

        <div class="note-controls" v-show="!popupMode">
          <el-button v-show="noteItem.deleted === 0 && !editMode" @click="toggleeditMode">Edit</el-button>
          <el-button v-show="editMode" @click="cancelUpdateNote">Cancel</el-button>
          <el-button v-show="editMode" @click="updateNote">Save</el-button>

          <el-button-group class="note-controls-icon-group">
            <el-button class="note-controls-icon" @click="toggleNoteStar" v-show="noteItem.deleted === 0">
              <i class="material-icons">{{noteItem.starred === 1 ? 'star' : 'star_border'}}</i>
            </el-button>
            <el-button class="note-controls-icon" v-popover:noteMetaData v-show="noteItem.deleted === 0">
              <i class="material-icons">info_outline</i>
            </el-button>
            <el-button class="note-controls-icon" v-popover:noteAttachment v-show="noteItem.deleted === 0">
              <i class="material-icons">attach_file</i>{{attachmentCount > 0 ? attachmentCount : ''}}
            </el-button>
            <el-button class="note-controls-icon" @click="restoreItem" v-show="noteItem.deleted === 1">
              <i class="material-icons">restore</i>
            </el-button>
            <el-button class="note-controls-icon" @click="deleteNote">
              <i class="material-icons">delete</i>
            </el-button>
          </el-button-group>

          <el-dropdown v-show="noteItem.deleted === 0 &&  !editMode">
            <el-button class="note-controls-icon">
              <i class="material-icons">more_vert</i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="my-folder-action-item">
                <span class="my-folder-action-item-inner" @click="popup">Popup</span>
              </el-dropdown-item>
              <el-dropdown-item class="my-folder-action-item">
                <span class="my-folder-action-item-inner" @click="showMoveFolder">Move To</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div id="note-toolbar" v-show="editMode">
        <select class="ql-header">
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option value="6"></option>
          <option selected></option>
        </select>
        <select class="ql-font"></select>
        <select class="ql-size">
          <option value="small"></option>
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>

        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>

        <select class="ql-color"></select>
        <select class="ql-background"></select>

        <select class="ql-align"></select>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>

        <button class="ql-blockquote"></button>
        <button class="ql-code-block"></button>
        <button class="ql-clean"></button>

        <button class="ql-link"></button>
        <button class="ql-image"></button>
      </div>

      <div id="note-editor"></div>
    </div>

    <el-dialog class="my-folder-form" title="Please select destination folder:" :visible.sync="showMoveToFolderForm">
      <el-tree :data="moveToFolders" default-expand-all highlight-current :expand-on-click-node="false"
        @node-click="selectMoveToFolder" :current-node-key="selectedMoveToFolderId">
      </el-tree>
      <div slot="footer">
        <el-button size="small" @click="showMoveToFolderForm = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="moveNote"
          :disabled="selectedMoveToFolderId === '' || selectedMoveToFolderId === noteItem.folder_id">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showImgDetailView" fullscreen>
      <my-image-detail :imgSrc="selectedImgUrl" @updateImage="handleUpdateImage"></my-image-detail>
    </el-dialog>
  </div>
</template>

<style>
#note-container .ql-snow .ql-editor pre.ql-syntax { /* to avoid black background of code block*/
  background-color: rgb(240, 240, 240);
  color: #171313;
}
.el-dialog.is-fullscreen {
  background-color: rgba(255, 255, 255, 0.8)
}
.el-dialog__headerbtn .el-dialog__close {
  font-size: 22px;
  font-weight: 800;
  color: #607d8b;
}
</style>

<style scoped>
.note-container-height {
  height: calc(100vh - 110px);
}

.note-header {
  padding: 5px 15px;
  border-bottom: 1px solid #ddd;

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
  flex: 0 360px;

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

#note-toolbar {
  border-top: none;
  border-left: none;
  border-right: none;
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

<script>
import Model from '@/models'
import {HANDYNOTE_PROTOCOL, getFolderRootItem, prepareFolderData, getResizedImgData, loadContentWithDelta} from '@/util'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { ImageHandler } from '@/quill_modules/ImageHandler'
import '@/quill_modules/quill.table.css'
import TableHandler from '@/quill_modules/TableHandler'
import MyImageDetail from '@/components/ImageDetail'

export default {
  props: ['id'],

  components: {
    MyImageDetail
  },

  data () {
    return {
      editMode: false,
      quill: {},
      noteId: '',
      popupMode: this.id !== undefined, // popup page for read only and print
      noteItem: {name: ''},
      originNoteName: '',
      folderRoot: getFolderRootItem(),
      moveToFolders: [],
      showMoveToFolderForm: false,
      selectedMoveToFolderId: '',
      showImgDetailView: false,
      selectedImgUrl: '',
      attachmentList: [],
      attachmentCount: 0
    }
  },

  mounted () {
    Quill.register('modules/imageHandler', ImageHandler)
    Quill.register('modules/tableHandler', TableHandler)

    this.quill = new Quill('#note-editor', {
      readOnly: true,
      modules: {
        toolbar: '#note-toolbar',
        // [
        //   [{'header': [1, 2, 3, 4, 5, 6, false]}, {'font': []}, {'size': ['small', false, 'large', 'huge']}],
        //   ['bold', 'italic', 'underline', 'strike'],
        //   [{'color': []}, {'background': []}],
        //   [{'align': []}, {'indent': '-1'}, {'indent': '+1'}, {'list': 'ordered'}, {'list': 'bullet'}],
        //   [{'script': 'sub'}, {'script': 'super'}],
        //   ['blockquote', 'code-block', 'clean'],
        //   / ['video'],
        //   ['link', 'image']
        // ],
        clipboard: {
          matchers: [
            ['TD, TH', function (node, delta) {
              delta.insert('\n', { td: true })
              delta.insert({ tdbr: true })
              return delta
            }],
            ['TR', function (node, delta) {
              delta.insert({ trbr: true })
              return delta
            }]
          ]
        },
        syntax: {
          highlight: text => hljs.highlightAuto(text).value
        },
        imageHandler: {
          eventBus: this.$bus
        }
      },
      theme: 'snow'
    })

    this.$bus.$on('loadNoteWithId', (id) => {
      // for folder or invalid note id, display empty hint
      if (id === undefined || id.length === 0) {
        this.noteId = ''
        return
      }

      this.noteId = id
      this.noteItem.name = 'loading...'
      this.quill.setText('loading...')

      if (this.editMode === true) this.toggleeditMode()
      this.loadNote()
    })

    this.$bus.$on('showImgDetail', (url) => {
      this.selectedImgUrl = url
      this.showImgDetailView = true
    })

    if (this.popupMode) {
      this.noteId = this.id
      this.loadNote()
    }
  },

  methods: {
    getUploadUrl () {
      return Model.getBaseAttachUrl()
    },

    getUploadHeaders () {
      return {
        'X-Auth-Token': window.localStorage.getItem('hn-token')
      }
    },

    getUploadExtraData () {
      return {
        note_id: this.noteId
      }
    },

    handleRemove (file, fileList) {
      let self = this
      const attachmentId = file._id || file.response._id
      Model.deleteAttachment(attachmentId)
        .then(function (response) {
          self.attachmentCount = fileList.length
          self.$message({
            message: 'Delete attachment successfully!',
            type: 'success'
          })
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Delete attachment failed!')
        })
    },

    handleUploadSuccess (response, file, fileList) {
      this.attachmentCount = fileList.length
    },

    handleUploadError (err, file, fileList) {
      this.$message.warning('Upload file failed! ' + err)
    },

    handlePreview (file) {
      const attachmentId = file._id || file.response._id
      window.location.href = Model.getBaseAttachUrl() + '/' + attachmentId + '?certId=' + window.localStorage.getItem('hn-token')
    },

    handleExceed (files, fileList) {
      this.$message.warning('Reach max file limit!')
    },

    // beforeUpload (file) {
    //   const isLt16M = file.size / 1024 / 1024 < 16
    //   if (!isLt16M) {
    //     this.$message.error('Exceed max file size limit 16MB!')
    //   }
    //   return isLt16M
    // },

    beforeRemove (file, fileList) {
      return this.$confirm(`Delete ${file.name}? This action can NOT be undone!`, 'Please Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
    },

    toggleeditMode () {
      this.editMode = !this.editMode
      this.quill.enable(this.editMode)

      // adjust note-container height
      if (this.editMode === true) {
        window.document.getElementById('note-container').style.height = 'calc(100vh - 160px)'
      } else {
        window.document.getElementById('note-container').style.height = 'calc(100vh - 110px)'
      }
    },

    async updateNote () {
      const loading = this.$loading({
        lock: true,
        text: 'Saving...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const self = this
      let contentsJson = await this.handleImgResize(this.quill.getContents().ops)

      Model.updateNote(self.noteId, {
        name: this.noteItem.name,
        text: this.quill.getText(),
        contents: contentsJson
      })
        .then(function (response) {
          let contentsJson = (typeof response.data.contents === 'object' ? response.data.contents
            : JSON.parse(response.data.contents))

          // make sure UI rendering threads catch up
          setTimeout(function () {
            loadContentWithDelta(self.quill, self.handleImgUrl(contentsJson))
          }, 0)

          self.noteItem = response.data
          loading.close()
          self.$bus.$emit('updateNote', response.data)
          self.$message({
            message: 'Save note successfully!',
            type: 'success'
          })
          self.toggleeditMode()
        })
        .catch(function (error) {
          console.log(error)
          loading.close()
          self.$message.error('Save note failed!')
        })
    },

    cancelUpdateNote () {
      const self = this
      if (self.originNoteName !== self.noteItem.name ||
        JSON.stringify(self.quill.getContents().ops) !== JSON.stringify(self.noteItem.contents)) {
        self.$confirm('Discard current change?', 'Please Confirm', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          self.noteItem.name = self.originNoteName
          // make sure UI rendering threads catch up
          setTimeout(function () {
            loadContentWithDelta(self.quill, self.noteItem.contents)
          }, 0)
          self.toggleeditMode()
        })
      } else {
        self.toggleeditMode()
      }
    },

    deleteNote () {
      const self = this
      if (self.noteItem.deleted === 0) {
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
      } else {
        self.$confirm('Permanently delete this item? This action can NOT be undone!', 'Please Confirm', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          Model.deleteTrash(self.noteId)
            .then(function (response) {
              self.$bus.$emit('deleteNote', response.data._id)
              self.$message({
                message: 'Permanently delete item successfully!',
                type: 'success'
              })
            })
            .catch(function (error) {
              console.log(error)
              self.$message.error('Delete item failed!')
            })
        })
      }
    },

    restoreItem () {
      const self = this
      Model.restoreTrash(self.noteId)
        .then(function (response) {
          self.$bus.$emit('deleteNote', response.data._id)
          if (response.data.type === 'folder') self.$bus.$emit('refreshFolderList', self.trashFolderId)
          self.$message({
            message: 'Restore item successfully!',
            type: 'success'
          })
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Restore item failed!')
        })
    },

    loadNote () {
      const self = this
      Model.getNote(self.noteId)
        .then(function (response) {
          self.originNoteName = response.data.name
          self.noteItem = response.data

          let contentsJson = (typeof response.data.contents === 'object' ? response.data.contents
            : JSON.parse(response.data.contents))
          // load content by page per need
          loadContentWithDelta(self.quill, self.handleImgUrl(contentsJson))

          // go to edit mode if the note is newly created
          if (response.data.contents.length === 0 && response.data.deleted === 0) {
            self.editMode = true
            self.quill.enable(self.editMode)
          }
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load note!')
        })
      self.loadAttachmentList()
    },

    loadAttachmentList () {
      const self = this
      Model.getAttachmentList({note_id: self.noteId})
        .then(function (response) {
          self.attachmentList = response.data
          self.attachmentCount = self.attachmentList.length
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load attachment list!')
        })
    },

    handleImgUrl (contentsJson) {
      for (let i = 0; i < contentsJson.length; i++) {
        let op = contentsJson[i]
        if (op.insert !== undefined &&
          typeof op.insert === 'object' &&
          op.insert.image !== undefined &&
          typeof op.insert.image === 'string' &&
          op.insert.image.startsWith(HANDYNOTE_PROTOCOL)) {
          op.insert.image = op.insert.image.replace(HANDYNOTE_PROTOCOL, '')
          op.insert.image = Model.getBaseImgUrl() + '/' + op.insert.image +
            '?certId=' + window.localStorage.getItem('hn-token') +
            // to force browser reload image when note got updated
            '&time=' + this.noteItem.updated_at
        }
      }
      return contentsJson
    },

    async handleImgResize (contentsJson) {
      let retJson = []
      for (let i = 0; i < contentsJson.length; i++) {
        let op = contentsJson[i]
        if (op.insert !== undefined &&
          typeof op.insert === 'object' &&
          op.insert.image !== undefined &&
          typeof op.insert.image === 'string') {
          if (op.insert.image.startsWith('data:image')) {
            retJson.push({insert: {image: await getResizedImgData(op.insert.image)}})
          } else if (op.insert.image.startsWith(Model.getBaseImgUrl() + '/')) {
            let newImgUrl = op.insert.image.replace(Model.getBaseImgUrl() + '/', '')
            let endIndex = newImgUrl.indexOf('?certId')
            if (endIndex > 0) newImgUrl = newImgUrl.substring(0, endIndex)
            retJson.push({insert: {image: HANDYNOTE_PROTOCOL + newImgUrl}})
          } else {
            retJson.push(op)
          }
        } else {
          retJson.push(op)
        }
      }
      return retJson
    },

    showMoveFolder () {
      const self = this
      self.selectedMoveToFolderId = ''
      Model.getFolderList()
        .then(function (response) {
          self.moveToFolders = prepareFolderData(response.data)
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
    },

    toggleNoteStar () {
      const self = this
      let starValue = (self.noteItem.starred === 1 ? 0 : 1)
      let hint = (starValue === 1 ? 'Star' : 'Unstar')
      Model.updateNote(self.noteId, {
        starred: starValue
      })
        .then(function (response) {
          self.$message({
            message: hint + ' note successfully!',
            type: 'success'
          })
          self.noteItem.starred = starValue

          if (starValue !== 1) {
            self.$bus.$emit('deleteNote', response.data._id) // remove note from star list
          }
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error(hint + ' note failed!')
        })
    },

    handleUpdateImage () {
      this.noteItem.name = 'loading...'
      this.quill.setText('loading...')
      this.loadNote()
      this.showImgDetailView = false
    },

    popup () {
      window.open('./#/notes/' + this.noteId, '_blank')
    }
  }
}
</script>
