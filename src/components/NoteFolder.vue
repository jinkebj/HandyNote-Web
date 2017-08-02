<template>
  <div class="folder-container">
    <el-button class="my-action" @click="addNote">Compose</el-button>
    <div class="my-recent"><i class="el-icon-date"></i>Recent Notes</div>
    <el-tree class="my-folder" :data="noteFolders" :props="defaultProps" node-key="id" default-expand-all highlight-current
      :expand-on-click-node="false" :render-content="renderContent" @node-click="handleNodeClick">
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
            <el-dropdown-item class="my-folder-action-item">Empty Trash</el-dropdown-item>
            <el-dropdown-item class="my-folder-action-item">Restore All</el-dropdown-item>
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
          label: 'My Folders',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
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

    handleNodeClick (data) {
      console.log(data)
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
                  <el-dropdown-item class="my-folder-action-item">New Sub Folder</el-dropdown-item>
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
                  <el-dropdown-item class="my-folder-action-item">New Sub Folder</el-dropdown-item>
                  <el-dropdown-item class="my-folder-action-item">Rename</el-dropdown-item>
                  <el-dropdown-item class="my-folder-action-item">Delete Folder</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>)
      }
    }

  }
}
</script>
