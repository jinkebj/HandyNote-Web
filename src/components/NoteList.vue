<template>
  <div class="list-content">
    <div class="list-count" v-show="listItems.length > 0">
      Count: {{listCount}}
    </div>
    <div v-for="listItem in listItems" :key="listItem._id">
      <div class="list-item" @click="selectItem(listItem)"
        :class="selectedItemId === listItem._id ? 'list-item-selected' : 'list-item-unselected'">
        <h4 class="list-item-subject">
          <i class="list-item-subject-icon material-icons" v-if="listItem.folder_name === undefined">folder</i>
          <span class="list-item-subject-title">{{listItem.name | truncate(50)}}</span>
          <i class="list-item-subject-action list-item-margin material-icons"
            v-if="listItem.deleted === 1" @click="restoreItem(listItem._id)">restore</i>
          <i class="list-item-subject-action material-icons" @click="deleteItem(listItem)">delete</i>
        </h4>
        <p class="list-item-desc">
          {{listItem.digest | truncate(100)}}
        </p>
        <h5 class="list-item-time">{{listItem.updated_at | fmtDate}} {{listItem.folder_name}}</h5>
      </div>
    </div>
    <div id="list-loader">
      <i class="el-icon-loading" v-show="loadMoreFlag"></i>
    </div>
    <div class="list-empty-hint" v-show="listItems.length === 0">
      {{listPanelHint}}
    </div>
  </div>
</template>

<style scoped>
.list-content {
  position: relative; /* needed for perfert-scrollbar */
  height: 100%; /* needed for perfert-scrollbar */
}

.list-content a {
  text-decoration: none;
  outline: none;
  color: #434343;
}

.list-count {
  top: 0;
  position: sticky;
  font-size: 14px;
  padding: 15px 15px;
  border-bottom: 1px solid #ddd;
  background: #F5F5F5;
}

.list-item {
  cursor: pointer;
  padding: 15px 15px;
  border-bottom: 1px solid #ddd;
}

.list-item-unselected:hover {
  background: #F6F7F9;
}

.list-item-selected {
  background: #EAF0FB;
}

.list-item-time,
.list-item-subject {
  margin: 0;
}

.list-item-time {
  color: #999;
}

.list-item-subject {
  min-height: 24px;
  display: flex;
  flex-flow: row;
  align-items: center;
}

.list-item-margin,
.list-item-subject-icon {
  margin-right: 10px;
}

.list-item-subject-title {
  flex: auto;
}

.list-item-subject-action {
  display: none;
}

.list-item:hover .list-item-subject-action {
  display: inline-flex;
}

.material-icons:hover {
  color: #20A0FF;
}

.list-item-desc {
  font-size: 80%;
  margin: 10px 0;
}

.list-empty-hint {
  height: calc(100vh - 160px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 20px;
}

#list-loader .el-icon-loading {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
</style>

<script>
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import PerfectScrollbar from 'perfect-scrollbar'
import ScrollMagic from 'scrollmagic'
import Model from '@/models'
import {getCurUsrSearchFolderId, getCurUsrRecentFolderId, getCurUsrStarFolderId, getCurUsrTrashFolderId} from '@/util'

export default {
  data () {
    return {
      limit: 20,
      skip: 0,
      loadMoreFlag: false,
      listCount: 0,
      listPanelHint: 'No notes',
      trashFolderId: getCurUsrTrashFolderId(),
      listItems: [],
      selectedFolderId: getCurUsrRecentFolderId(),
      selectedItemId: '',
      selectedItemType: 0, // 0: note, 1: folder
      searchStr: '',
      scrollBar: {},
      scrollContainer: {}
    }
  },

  watch: {
    selectedItemId: function (val, oldVal) {
      if (val === oldVal) return
      if (this.selectedItemType === 0) {
        this.$bus.$emit('loadNoteWithId', val)
      } else {
        this.$bus.$emit('loadNoteWithId', '')
      }
    }
  },

  mounted () {
    let self = this

    // init perfect-scrollbar
    self.scrollContainer = document.querySelector('.list-content')
    self.scrollBar = new PerfectScrollbar(self.scrollContainer, {
      suppressScrollX: true
    })

    // init ScrollMagic
    let controller = new ScrollMagic.Controller()
    new ScrollMagic.Scene({triggerElement: '#list-loader', triggerHook: 'onEnter'})
      .addTo(controller)
      .on('enter', function (e) {
        if (!self.loadMoreFlag && self.skip > 0 && self.listCount > self.skip) {
          self.loadMoreFlag = true
          self.loadNoteList(self.skip)
        }
      })

    this.$bus.$on('refreshNoteList', (selectedFolderId, selectedNoteId) => {
      this.skip = 0
      this.selectedItemType = 0
      this.selectedItemId = selectedNoteId
      this.selectedFolderId = selectedFolderId

      if (selectedFolderId === this.trashFolderId) {
        this.loadTrash()
      } else {
        this.loadNoteList(0)
      }
    })

    this.$bus.$on('updateNote', (noteData) => {
      for (let i = 0; i < this.listItems.length; i++) {
        if (this.listItems[i]._id === noteData._id) {
          delete noteData.contents
          let itemData = JSON.parse(JSON.stringify(noteData)) // deep copy
          this.listItems.splice(i, 1)
          this.listItems.unshift(itemData)
          break
        }
      }
    })

    this.$bus.$on('deleteNote', (noteId) => {
      for (let i = 0; i < this.listItems.length; i++) {
        if (this.listItems[i]._id === noteId) {
          this.listItems.splice(i, 1)
          this.listCount--
          break
        }
      }
      if (this.listItems.length > 0) {
        this.selectItem(this.listItems[0])
      } else {
        this.selectedItemId = ''
      }
    })

    this.$bus.$on('searchNote', (searchStr) => {
      this.skip = 0
      this.selectedItemId = ''
      this.selectedFolderId = getCurUsrSearchFolderId()
      this.searchStr = searchStr
      this.loadNoteList(0)
    })

    this.loadNoteList(0)
  },

  methods: {
    selectItem (listItem) {
      this.selectedItemId = listItem._id
      this.selectedItemType = (listItem.folder_name === undefined ? 1 : 0)
    },

    loadNoteList (skip) {
      const self = this
      let params = {}
      self.listPanelHint = 'Loading...'

      if (self.selectedFolderId === getCurUsrStarFolderId()) {
        params.starred = 1
      } else if (self.selectedFolderId === getCurUsrSearchFolderId()) {
        params.search = self.searchStr
      } else if (self.selectedFolderId !== getCurUsrRecentFolderId() && self.selectedFolderId !== undefined) {
        params.folder_id = self.selectedFolderId
      }

      // only load notes statistics info when switch list
      if (skip === 0) {
        let statisticsParams = JSON.parse(JSON.stringify(params)) // deep copy
        Model.getNoteStatistics(statisticsParams)
          .then(function (ret) {
            self.listCount = ret.data.count
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Failed to load note statistics info!')
          })
      }

      params.skip = skip
      params.limit = self.limit
      Model.getNoteList(params)
        .then(function (response) {
          self.listPanelHint = 'No notes'

          if (skip === 0) {
            self.scrollContainer.scrollTop = 0
            self.listItems = response.data
          } else {
            self.listItems.push(...response.data)
          }

          self.skip = self.listItems.length
          self.loadMoreFlag = false

          if (skip === 0 && self.selectedItemId === '' && self.listItems.length > 0) {
            self.selectItem(self.listItems[0])
          }

          setTimeout(function () {
            self.scrollBar.update()
          }, 100)
        })
        .catch(function (error) {
          self.listPanelHint = 'No notes'
          console.log(error)
          self.$message.error('Failed to load note list!')
        })
    },

    loadTrash () {
      const self = this
      Model.getTrash()
        .then(function (response) {
          self.scrollContainer.scrollTop = 0
          self.listItems = response.data
          self.listCount = self.listItems.length
          self.selectedItemId === ''
          if (self.listItems.length > 0) {
            self.selectItem(self.listItems[0])
          }

          setTimeout(function () {
            self.scrollBar.update()
          }, 100)
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load trash list!')
        })
    },

    deleteItem (listItem) {
      const self = this
      if (listItem.deleted === 0) {
        self.$confirm('Move this note to trash?', 'Please Confirm', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          Model.deleteNote(listItem._id)
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
          Model.deleteTrash(listItem._id)
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

    restoreItem (itemId) {
      const self = this
      Model.restoreTrash(itemId)
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
    }
  }
}
</script>
