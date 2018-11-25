<template>
  <div class="folder-container">
    <div class="my-action-container">
      <el-button class="my-action" @click="addNote">Compose</el-button>
    </div>

    <div class="my-folder-common"
      :class="selectedFolderId === searchFolderId ? 'my-folder-common-selected' : 'my-folder-common-unselected'"
      v-show="searchStr !== ''" @click="selectSearch(searchStr)">
      <i class="el-icon-search"></i>Search: {{searchStr}}
    </div>

    <div class="my-folder-common" :class="selectedFolderId === recentFolderId ? 'my-folder-common-selected' : 'my-folder-common-unselected'"
      @click="selectSysFolder(recentFolderId)">
      <i class="el-icon-date"></i>Recent Notes
    </div>

    <div class="my-folder-common" :class="selectedFolderId === starFolderId ? 'my-folder-common-selected' : 'my-folder-common-unselected'"
      @click="selectSysFolder(starFolderId)">
      <i class="el-icon-star-off"></i>Starred Notes
    </div>

    <div class="my-folder-adv" :class="selectedFolderId === attachFolderId ? 'my-folder-adv-selected' : 'my-folder-adv-unselected'"
      @click="selectSysFolder(attachFolderId)">
      <i class="material-icons my-attachment-icon">attachment</i>
      <span class="my-folder-adv-name">Attachments</span>
      <span class="my-folder-adv-action">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-setting el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="my-folder-action-item">
              <span class="my-folder-action-item-inner" @click="emptyTrash">
                Show All Attachment
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>

    <el-tree class="my-folder" :data="noteFolders" :props="defaultProps" node-key="id" ref="tree" :indent="10"
      default-expand-all highlight-current :expand-on-click-node="false" :render-content="renderContent"
      @node-click="selectFolder" @node-expand="updateScrollBar" @node-collapse="updateScrollBar"
      draggable :allow-drop="allowDrop" :allow-drag="allowDrag" @node-drop="handleDrop">
    </el-tree>

    <div class="my-folder-adv" :class="selectedFolderId === trashFolderId ? 'my-folder-adv-selected' : 'my-folder-adv-unselected'"
      @click="selectSysFolder(trashFolderId)">
      <i class="el-icon-delete my-folder-adv-icon"></i>
      <span class="my-folder-adv-name">Trash</span>
      <span class="my-folder-adv-action">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-setting el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="my-folder-action-item">
              <span class="my-folder-action-item-inner" @click="emptyTrash">
                Empty Trash
              </span>
            </el-dropdown-item>
            <el-dropdown-item class="my-folder-action-item">
              <span class="my-folder-action-item-inner" @click="revertTrash">
                Restore All
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>

    <el-dialog class="my-folder-form" title="Please select destination folder:" :visible.sync="showMoveToFolderForm">
      <el-tree :data="moveToFolders" default-expand-all highlight-current :expand-on-click-node="false"
        @node-click="selectMoveToFolder" :current-node-key="selectedMoveToFolderId">
      </el-tree>
      <div slot="footer">
        <el-button size="small" @click="showMoveToFolderForm = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="moveFolder"
          :disabled="selectedMoveToFolderId === ''">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.folder-container {
  font-size: 14px;
  position: relative; /* needed for perfert-scrollbar */
  height: 100%; /* needed for perfert-scrollbar */
}

.my-folder {
  flex: 1;
  border: none;
  background: #F5F5F5;
  color: #324057;
}

.my-action-container {
  top: 0px;
  position: sticky;
  background: #F5F5F5;
  display: flex;
  justify-content: center;
}

.my-action {
  width: 100%;
  margin: 10px 20px;
}

.my-folder-common {
  flex: 0;
  padding: 10px 15px;
}

.my-attachment-icon {
  font-size: 16px;
  margin-right: 8px;
}

.my-folder-common-selected,
.my-folder-adv-selected {
  cursor: pointer;
  background: #20A0FF;
  color: #FFFFFF;
}

.my-folder-common-unselected,
.my-folder-adv-unselected {
  color: #324057;
}

.my-folder-adv-selected .el-icon-setting {
  color: #FFFFFF;
}

.my-folder-common-unselected:hover,
.my-folder-adv-unselected:hover {
  cursor: pointer;
  background: #E5E9F2;
}

.my-folder-adv {
  flex: 0;
  padding: 10px 15px;

  display: flex;
  flex-flow: row;
}

.my-folder-adv-icon {
  margin: 0;
  padding: 0 8px 0 0;
}

.my-folder-adv-name {
  flex: 1;
}

.my-folder-adv-action {
  flex: 0 15px;
  align-self: flex-end;
  display: none;
}

.my-folder-adv:hover .my-folder-adv-action {
  display: inline-flex;
}

.folder-container .el-icon-search,
.folder-container .el-icon-date,
.folder-container .el-icon-star-off,
.folder-container .el-icon-delete2 {
  margin-right: 10px;
}
</style>

<style>
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #20A0FF;
  color: #FFFFFF;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-icon-setting {
  color: #FFFFFF;
}

.el-tree-node .is-drop-inner > .el-tree-node__content {
  background-color: #E6A23C;
  color: #FFFFFF;
}

.folder-container .el-tree-node__content {
  padding: 5px 0 5px 0;
  display: flex;
  flex-flow: row;
}

.folder-container .el-tree-node__content:hover {
  background: #E5E9F2;
}

.my-folder-item {
  flex: 1;

  display: flex;
  flex-flow: row;
}

.my-folder-name {
  flex: 1;
}

.my-folder-action {
  flex: 0 15px;
  align-self: flex-end;
  margin-right: 15px;
  display: none;
}

.el-tree-node__content:hover .my-folder-action {
  display: inline-flex;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .my-folder-action {
  display: inline-flex;
}

.my-folder-action-item {
  font-size: 14px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row;
}

.my-folder-action-item-inner {
  flex: 1;
  padding: 0px 10px;
}

.my-folder-form .el-dialog {
  width: 30%;
}

.my-folder-form .el-dialog__body {
  padding: 10px;
  margin: 5px 20px 5px 20px;
  border: 1px solid #ddd;
}

.my-folder-form .el-tree-node__content {
  padding: 5px 0 5px 0;
}

.my-folder-form .el-tree-node__content:hover {
  background: #E5E9F2;
}
</style>

<script>
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import PerfectScrollbar from 'perfect-scrollbar'
import Model from '@/models'
import {getFolderRootItem, prepareFolderData, getCurUsrRootFolderId, getCurUsrSearchFolderId, getCurUsrRecentFolderId,
  getCurUsrStarFolderId, getCurUsrAttachFolderId, getCurUsrTrashFolderId} from '@/util'

export default {
  data () {
    return {
      rootFolderId: getCurUsrRootFolderId(),
      searchFolderId: getCurUsrSearchFolderId(),
      recentFolderId: getCurUsrRecentFolderId(),
      starFolderId: getCurUsrStarFolderId(),
      attachFolderId: getCurUsrAttachFolderId(),
      trashFolderId: getCurUsrTrashFolderId(),
      noteFolders: [getFolderRootItem()],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      moveToFolders: [],
      showMoveToFolderForm: false,
      selectedMoveToFolderId: '',
      selectedFolderId: getCurUsrRecentFolderId(),
      searchStr: '',
      scrollBar: {}
    }
  },

  mounted () {
    // init perfect-scrollbar
    this.scrollBar = new PerfectScrollbar(document.querySelector('.folder-container'), {
      suppressScrollX: true
    })

    this.loadFolderList()

    this.$bus.$on('refreshFolderList', (selectedFolderId) => {
      this.selectedFolderId = selectedFolderId
      this.loadFolderList()
    })

    this.$bus.$on('selectSearch', (searchStr) => {
      this.selectSearch(searchStr)
    })
  },

  methods: {
    addNote () {
      const self = this
      if (self.selectedFolderId === self.recentFolderId ||
        self.selectedFolderId === self.starFolderId ||
        self.selectedFolderId === self.attachFolderId ||
        self.selectedFolderId === self.trashFolderId) {
        self.selectedFolderId = self.rootFolderId
      }

      Model.addNote({
        name: 'No Title',
        folder_id: self.selectedFolderId
      })
        .then(function (response) {
          self.selectAndRefresh(response.data.folder_id, response.data._id)
          self.$refs.tree.setCurrentKey(response.data.folder_id)
          self.$message({
            message: 'Add note successfully!',
            type: 'success'
          })
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Add note failed!')
        })
    },

    loadFolderList () {
      const self = this
      Model.getFolderList()
        .then(function (response) {
          self.noteFolders = prepareFolderData(response.data)
          setTimeout(function () {
            self.scrollBar.update()
          }, 100)
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load folder list!')
        })
    },

    addFolder (store, data) {
      const self = this
      self.$prompt('Please input folder name', 'New Sub Folder', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputPattern: /^(?!\s*$).+/,
        inputErrorMessage: 'Invalid name!'
      }).then(({ value }) => {
        let newAncestorIds = data.ancestor_ids.concat([data.id])
        Model.addFolder({
          name: value,
          parent_id: data.id
        })
          .then(function (response) {
            self.$message({
              message: 'Add folder successfully!',
              type: 'success'
            })
            store.append({ id: response.data._id, label: response.data.name, ancestor_ids: newAncestorIds, children: [] }, data)
            self.selectedFolderId = response.data._id
            self.selectAndRefresh(self.selectedFolderId, '')
            self.$refs.tree.setCurrentKey(self.selectedFolderId)
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Add folder failed!')
          })
      }).catch(() => {
      })
    },

    deleteFolder (store, data) {
      const self = this
      self.$confirm('All notes and subfolder under this folder will be moved to trash, continue?', 'Please Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        Model.deleteFolder(data.id)
          .then(function (response) {
            self.$message({
              message: 'Move folder to trash successfully!',
              type: 'success'
            })
            store.remove(data)
            self.selectedFolderId = data.ancestor_ids[data.ancestor_ids.length - 1]
            self.selectAndRefresh(self.selectedFolderId, '')
            self.$refs.tree.setCurrentKey(self.selectedFolderId)
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Move folder to trash failed!')
          })
      }).catch(() => {
      })
    },

    showMoveFolder (store, data) {
      const self = this
      self.selectedMoveToFolderId = ''
      Model.getFolderList({exclude_id: data.id})
        .then(function (response) {
          self.moveToFolders = prepareFolderData(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      self.showMoveToFolderForm = true
    },

    moveFolder () {
      const self = this
      Model.updateFolder(self.selectedFolderId, {
        parent_id: self.selectedMoveToFolderId
      })
        .then(function (response) {
          self.$message({
            message: 'Move folder successfully!',
            type: 'success'
          })
          self.showMoveToFolderForm = false
          self.loadFolderList()
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Move folder failed!')
        })
    },

    renameFolder (store, data) {
      const self = this
      self.$prompt('Please input folder name', 'Rename Folder', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputPattern: /^(?!\s*$).+/,
        inputErrorMessage: 'Invalid name!'
      }).then(({ value }) => {
        Model.updateFolder(data.id, {
          name: value
        })
          .then(function (response) {
            self.$message({
              message: 'Rename folder successfully!',
              type: 'success'
            })
            store.getNode(data).data.label = value
            self.selectAndRefresh(self.selectedFolderId, '')
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Rename folder failed!')
          })
      }).catch(() => {
      })
    },

    selectFolder (data) {
      if (this.selectedFolderId !== data.id) this.selectAndRefresh(data.id, '')
    },

    selectMoveToFolder (data) {
      this.selectedMoveToFolderId = data.id
    },

    selectAndRefresh (selectedFolderId, selectedNoteId) {
      this.selectedFolderId = selectedFolderId
      this.$bus.$emit('refreshNoteList', selectedFolderId, selectedNoteId)
    },

    selectSearch (searchStr) {
      this.searchStr = searchStr
      this.selectedFolderId = this.searchFolderId
      this.$refs.tree.store.setCurrentNode('')
      this.$bus.$emit('searchNote', searchStr)
    },

    selectSysFolder (folderId) {
      if (this.selectedFolderId === folderId) return

      this.selectAndRefresh(folderId, '')
      this.$refs.tree.store.setCurrentNode('')
    },

    emptyTrash () {
      const self = this
      self.$confirm('Permanently delete all items in trash? This action can NOT be undone!', 'Please Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        Model.emptyTrash()
          .then(function (response) {
            self.$message({
              message: 'Empty trash successfully!',
              type: 'success'
            })
            self.selectAndRefresh(self.selectedFolderId, '')
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Empty trash failed!')
          })
      })
    },

    revertTrash () {
      const self = this
      self.$confirm('Restore all items in trash?', 'Please Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        Model.revertTrash()
          .then(function (response) {
            self.$message({
              message: 'Restore trash successfully!',
              type: 'success'
            })
            self.selectAndRefresh(self.selectedFolderId, '')
            self.loadFolderList()
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Restore trash failed!')
          })
      })
    },

    updateScrollBar () {
      let self = this
      setTimeout(function () {
        self.scrollBar.update()
      }, 500)
    },

    allowDrag (draggingNode) {
      return draggingNode.data.id !== this.rootFolderId
    },

    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.id === this.rootFolderId) {
        return type === 'inner'
      } else {
        return true
      }
    },

    handleDrop (draggingNode, dropNode, dropType, ev) {
      const self = this

      // check if folder parent changed
      let draggingNodeParentBefore = draggingNode.data.ancestor_ids[draggingNode.data.ancestor_ids.length - 1]
      let draggingNodeParentAfter = dropNode.data.ancestor_ids[dropNode.data.ancestor_ids.length - 1]
      if (dropType === 'inner') {
        draggingNodeParentAfter = dropNode.data.id
      }

      if (draggingNodeParentBefore !== draggingNodeParentAfter) {
        Model.updateFolder(draggingNode.data.id, {
          parent_id: draggingNodeParentAfter
        })
          .then(function (response) {
            console.log('Move folder successfully!')
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Move folder failed!')
          })
      }

      // get all folder ids in display order
      self.$refs.tree.setChecked(self.rootFolderId, true, true)
      const folderIds = self.$refs.tree.getCheckedKeys()
      folderIds.shift() // remove user root folder from array

      Model.orderFolder(folderIds)
        .then(function (response) {
          self.$message({
            message: 'Order folder successfully!',
            type: 'success'
          })
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Order folder failed!')
        })
    },

    renderContent (h, { node, data, store }) {
      let addFolderAction = (
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner" on-click={ () => this.addFolder(store, data) }>
            New Sub Folder
          </span>
        </el-dropdown-item>
      )

      let renameFolderAction = (
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner" on-click={ () => this.renameFolder(store, data) }>
            Rename
          </span>
        </el-dropdown-item>
      )

      let moveFolderAction = (
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner" on-click={ () => this.showMoveFolder(store, data) }>
            Move To
          </span>
        </el-dropdown-item>
      )

      let deleteFolderAction = (
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner" on-click={ () => this.deleteFolder(store, data) }>
            Delete Folder
          </span>
        </el-dropdown-item>
      )

      let ret = (
        <span class="my-folder-item">
          <span class="my-folder-name">
            <span>{node.label}</span>
          </span>
          <span class="my-folder-action">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-setting el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                { addFolderAction }
                { data.type === 0 ? '' : renameFolderAction }
                { data.type === 0 ? '' : moveFolderAction }
                { data.type === 0 ? '' : deleteFolderAction }
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      )

      return ret
    }

  }
}
</script>
