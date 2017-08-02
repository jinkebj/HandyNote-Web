<template>
  <div class="folder-container">
    <el-button class="my-action" @click="addNote">Compose</el-button>
    <div class="my-recent"><i class="el-icon-date"></i>Recent Notes</div>
    <el-tree class="my-folder" :data="noteFolders" :props="defaultProps" node-key="id" default-expand-all highlight-current
      :expand-on-click-node="false" :render-content="renderContent" @node-click="selectFolder" :current-node-key="selectedFolderId">
    </el-tree>
    <div class="my-trash">
      <i class="el-icon-delete2"></i>
      <span class="my-trash-name">Trash</span>
      <span class="my-trash-action">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-setting el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="my-folder-action-item">
              <span class="my-folder-action-item-inner">
                Empty Trash
              </span>
            </el-dropdown-item>
            <el-dropdown-item class="my-folder-action-item">
              <span class="my-folder-action-item-inner">
                Restore All
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
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

.my-recent {
  flex: 0;
  padding: 10px 15px;
}

.my-recent:hover,
.my-trash:hover {
  cursor: pointer;
  background: #E5E9F2;
}

.my-trash {
  flex: 0;
  padding: 10px 15px;

  display: flex;
  flex-flow: row;
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
.folder-container .el-icon-delete2 {
  margin-right: 10px;
}
</style>

<style>
.el-tree--highlight-current .el-tree-node .is-current > .el-tree-node__content {
  background-color: #20A0FF;
  color: #FFFFFF;
}

.el-tree--highlight-current .el-tree-node .is-current > .el-tree-node__content .el-icon-setting {
  color: #FFFFFF;
}

.folder-container .el-tree-node__content {
  display: flex;
  flex-flow: row;
}

.folder-container .el-tree-node__expand-icon {
  margin-top: 12px;
  flex: 0;
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

.el-tree--highlight-current .el-tree-node .is-current > .el-tree-node__content .my-folder-action {
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
</style>

<script>
import Model from '@/models'

export default {
  data () {
    return {
      noteFolders: [
        {
          type: 0,
          id: 'mytest-Root',
          label: 'My Folders',
          ancestor_ids: [],
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedFolderId: 'mytest-Root'
    }
  },

  mounted () {
    this.loadFolderList()
  },

  methods: {
    addNote () {
      const self = this
      Model.addNote({
        name: 'No Title'
      })
        .then(function (response) {
          self.$bus.$emit('refreshNoteList', response.data._id)
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
          self.prepareFolderData(response.data)
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load folder list!')
        })
    },

    prepareFolderData (inputData) {
      if (inputData.length === 0) return
      let outputData = {}
      outputData.id = inputData[0]._id
      outputData.label = inputData[0].name
      outputData.ancestor_ids = inputData[0].ancestor_ids
      this.noteFolders[0].children.push(outputData)
    },

    addFolder (store, data) {
      console.log('Add folder: ' + JSON.stringify(data))

      const self = this
      self.$prompt('Please input folder name', 'New Sub Folder', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputPattern: /[A-Za-z0-9_-]+/,
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
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Add folder failed!')
          })
      })
    },

    deleteFolder (store, data) {
      console.log('Delete folder: ' + JSON.stringify(data))

      const self = this
      self.$confirm('You have selected to delete this folder, all related subfolder will be deleted too, this action can NOT be undone, continue?', 'Please Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        Model.deleteFolder(data.id)
          .then(function (response) {
            self.$message({
              message: 'Delete folder successfully!',
              type: 'success'
            })
            store.remove(data)
            self.selectedFolderId = data.ancestor_ids[data.ancestor_ids.length - 1]
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Delete folder failed!')
          })
      })
    },

    renameFolder (store, data) {
      console.log('Rename folder: ' + JSON.stringify(data))

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
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Rename folder failed!')
          })
      })
    },

    selectFolder (data) {
      console.log('Select folder: ' + JSON.stringify(data))
    },

    renderContent (h, { node, data, store }) {
      if (data.type === 0) {
        return (
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
                  <el-dropdown-item class="my-folder-action-item">
                    <span class="my-folder-action-item-inner" on-click={ () => this.addFolder(store, data) }>
                      New Sub Folder
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>)
      } else {
        return (
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
                  <el-dropdown-item class="my-folder-action-item">
                    <span class="my-folder-action-item-inner" on-click={ () => this.addFolder(store, data) }>
                      New Sub Folder
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item class="my-folder-action-item">
                    <span class="my-folder-action-item-inner" on-click={ () => this.renameFolder(store, data) }>
                      Rename
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item class="my-folder-action-item">
                    <span class="my-folder-action-item-inner" on-click={ () => this.deleteFolder(store, data) }>
                      Delete Folder
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>)
      }
    }

  }
}
</script>
