<template>
  <div class="folder-container">
    <el-button class="my-action" @click="addNote">Compose</el-button>
    <div class="my-recent" :class="selectedFolderId === '' ? 'my-recent-selected' : 'my-recent-unselected'"
      @click="selectRecent">
      <i class="el-icon-date"></i>Recent Notes
    </div>
    <el-tree class="my-folder" :data="noteFolders" :props="defaultProps" node-key="id" ref="tree"
      default-expand-all highlight-current :expand-on-click-node="false" :render-content="renderContent"
      @node-click="selectFolder" :current-node-key="selectedFolderId">
    </el-tree>
    <div class="my-trash" :class="selectedFolderId === 'mytest-Trash' ? 'my-trash-selected' : 'my-trash-unselected'"
      @click="selectTrash">
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

.my-recent-selected,
.my-trash-selected {
  cursor: pointer;
  background: #20A0FF;
  color: #FFFFFF;
}

.my-recent-unselected:hover,
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
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #20A0FF;
  color: #FFFFFF;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-icon-setting {
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
      selectedFolderId: ''
    }
  },

  mounted () {
    this.loadFolderList()
  },

  methods: {
    addNote () {
      const self = this
      if (self.selectedFolderId === '') self.selectedFolderId = 'mytest-Root'

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
          self.prepareFolderData(response.data)
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load folder list!')
        })
    },

    prepareFolderData (inputData) {
      if (inputData.length === 0) return

      let rootItem = this.noteFolders[0]
      rootItem.children = []

      let itemMap = new Map()
      itemMap.set('mytest-Root', rootItem)

      let maxLevel = 0
      let levelMap = new Map()

      inputData.forEach(item => {
        const curLevel = item.ancestor_ids.length
        maxLevel = Math.max(curLevel, maxLevel)
        itemMap.set(item._id, {
          id: item._id,
          label: item.name,
          ancestor_ids: item.ancestor_ids,
          children: []
        })
        let levelItem = {itemId: item._id, parentId: item.parent_id}
        if (levelMap.has(curLevel)) {
          levelMap.get(curLevel).push(levelItem)
        } else {
          levelMap.set(curLevel, [levelItem])
        }
      })
      // console.log(itemMap)
      // console.log('maxLevel is: ' + maxLevel)
      // console.log(levelMap)

      for (let i = maxLevel; i > 0; i--) {
        if (!levelMap.has(i)) continue
        let levelItems = levelMap.get(i)
        levelItems.forEach(item => {
          if (itemMap.has(item.parentId) && itemMap.has(item.itemId)) {
            itemMap.get(item.parentId).children.push(itemMap.get(item.itemId))
          }
        })
      }
      // console.log(itemMap.get('mytest-Root'))

      this.noteFolders = [itemMap.get('mytest-Root')]
    },

    addFolder (store, data) {
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
            self.selectAndRefresh(self.selectedFolderId, '')
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Add folder failed!')
          })
      })
    },

    deleteFolder (store, data) {
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
            self.selectAndRefresh(self.selectedFolderId, '')
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Delete folder failed!')
          })
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
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Rename folder failed!')
          })
      })
    },

    selectFolder (data) {
      this.selectAndRefresh(data.id, '')
    },

    selectAndRefresh (selectedFolderId, selectedNoteId) {
      this.selectedFolderId = selectedFolderId
      this.$bus.$emit('refreshNoteList', selectedFolderId, selectedNoteId)
    },

    selectRecent () {
      this.selectAndRefresh('', '')
      this.$refs.tree.store.setCurrentNode('')
    },

    selectTrash () {
      this.selectAndRefresh('mytest-Trash', '')
      this.$refs.tree.store.setCurrentNode('')
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

      let enableDeleteFolderAction = (
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner" on-click={ () => this.deleteFolder(store, data) }>
            Delete Folder
          </span>
        </el-dropdown-item>
      )

      let disableDeleteFolderAction = (
        <el-dropdown-item class="my-folder-action-item" disabled>
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
                { data.type === 0 ? '' : (data.children.length > 0 ? disableDeleteFolderAction : enableDeleteFolderAction) }
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
