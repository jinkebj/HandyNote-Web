<template>
  <div class="folder-container">
    <el-button class="my-action" @click="addNote">Compose</el-button>

    <div class="my-recent" :class="selectedFolderId === recentFolderId ? 'my-recent-selected' : 'my-recent-unselected'"
      @click="selectRecent">
      <i class="el-icon-date"></i>Recent Notes
    </div>

    <div class="my-starred" :class="selectedFolderId === starFolderId ? 'my-starred-selected' : 'my-starred-unselected'"
      @click="selectStarred">
      <i class="el-icon-star-off"></i>Starred Notes
    </div>

    <el-tree class="my-folder" :data="noteFolders" :props="defaultProps" node-key="id" ref="tree"
      default-expand-all highlight-current :expand-on-click-node="false" :render-content="renderContent"
      @node-click="selectFolder" :current-node-key="selectedFolderId">
    </el-tree>

    <div class="my-trash" :class="selectedFolderId === trashFolderId ? 'my-trash-selected' : 'my-trash-unselected'"
      @click="selectTrash">
      <i class="el-icon-delete my-trash-icon"></i>
      <span class="my-trash-name">Trash</span>
      <span class="my-trash-action">
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
        <el-button @click="showMoveToFolderForm = false">Cancel</el-button>
        <el-button type="primary" @click="moveFolder"
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
  display: flex;
  flex-flow: column;
}

.my-folder {
  flex: 1;
  border: none;
  background: #F5F5F5;
  color: #324057;
}

.my-action {
  flex: 0;
  margin: 10px;
}

.my-recent,
.my-starred {
  flex: 0;
  padding: 10px 15px;
}

.my-recent-selected,
.my-starred-selected,
.my-trash-selected {
  cursor: pointer;
  background: #20A0FF;
  color: #FFFFFF;
}

.my-recent-unselected,
.my-starred-unselected,
.my-trash-unselected {
  color: #324057;
}

.my-trash-selected .el-icon-setting {
  color: #FFFFFF;
}

.my-recent-unselected:hover,
.my-starred-unselected:hover,
.my-trash-unselected:hover {
  cursor: pointer;
  background: #E5E9F2;
}

.my-trash {
  flex: 0;
  padding: 10px 15px;

  display: flex;
  flex-flow: row;
}

.my-trash-icon {
  margin: 0;
  padding: 2px 8px 0 0;
}

.my-trash-name {
  flex: 1;
}

.my-trash-action {
  flex: 0 15px;
  align-self: flex-end;
  display: none;
}

.my-trash:hover .my-trash-action {
  display: inline-flex;
}

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
  margin: 0 20px 0 20px;
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
import Model from '@/models'
import {prepareFolderData, getCurUsrRootFolderId, getCurUsrRecentFolderId, getCurUsrStarFolderId, getCurUsrTrashFolderId} from '@/util'

export default {
  data () {
    return {
      rootFolderId: getCurUsrRootFolderId(),
      recentFolderId: getCurUsrRecentFolderId(),
      starFolderId: getCurUsrStarFolderId(),
      trashFolderId: getCurUsrTrashFolderId(),
      noteFolders: [
        {
          type: 0,
          id: getCurUsrRootFolderId(),
          label: 'My Folders',
          ancestor_ids: [],
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      moveToFolders: [],
      showMoveToFolderForm: false,
      selectedMoveToFolderId: '',
      selectedFolderId: getCurUsrRecentFolderId()
    }
  },

  mounted () {
    this.loadFolderList()

    this.$bus.$on('refreshFolderList', (selectedFolderId) => {
      this.selectedFolderId = selectedFolderId
      this.loadFolderList()
    })
  },

  methods: {
    addNote () {
      const self = this
      if (self.selectedFolderId === self.recentFolderId ||
        self.selectedFolderId === self.starFolderId ||
        self.selectedFolderId === self.trashFolderId) {
        self.selectedFolderId = self.rootFolderId
      }

      Model.addNote({
        name: 'No Title',
        folder_id: self.selectedFolderId
      })
        .then(function (response) {
          self.selectAndRefresh(response.data.folder_id, response.data._id)
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
          self.noteFolders = prepareFolderData(self.noteFolders[0], response.data)
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
          parent_id: data.id,
          ancestor_ids: newAncestorIds
        })
          .then(function (response) {
            self.$message({
              message: 'Add folder successfully!',
              type: 'success'
            })
            store.append({ id: response.data._id, label: response.data.name, ancestor_ids: newAncestorIds, children: [] }, data)
            self.selectedFolderId = response.data._id
            self.selectAndRefresh(self.selectedFolderId, '')
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
          self.moveToFolders = prepareFolderData(self.noteFolders[0], response.data)
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
        inputPattern: /[A-Za-z0-9_-]+/,
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

    selectRecent () {
      if (this.selectedFolderId === this.recentFolderId) return

      this.selectAndRefresh(this.recentFolderId, '')
      this.$refs.tree.store.setCurrentNode('')
    },

    selectStarred () {
      if (this.selectedFolderId === this.starFolderId) return

      this.selectAndRefresh(this.starFolderId, '')
      this.$refs.tree.store.setCurrentNode('')
    },

    selectTrash () {
      if (this.selectedFolderId === this.trashFolderId) return

      this.selectAndRefresh(this.trashFolderId, '')
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
