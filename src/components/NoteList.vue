<template>
  <div class="list-content">
    <div v-for="noteItem in noteItems">
      <a @click="selectedNoteId = noteItem._id">
        <div class="list-item" :class="selectedNoteId === noteItem._id ? 'list-item-selected' : 'list-item-unselected'">
          <h4 class="list-item-subject">{{noteItem.name | truncate(50)}}</h4>
          <p class="list-item-desc">
            {{noteItem.digest | truncate(100)}}
          </p>
          <h5 class="list-item-time">{{noteItem.updated_at | fmtTime}}</h5>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.list-content a {
  text-decoration: none;
  outline: none;
  color: #434343;
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
  /*border-left: 6px solid #13CE66;*/
}

.list-item-time,
.list-item-subject {
  margin: 0;
}

.list-item-time {
  color: #999;
}

.list-item-desc {
  font-size: 80%;
  margin: 5px 0;
}
</style>

<script>
import Model from '@/models'

export default {
  data () {
    return {
      noteItems: [],
      selectedNoteId: ''
    }
  },

  watch: {
    selectedNoteId: function (val, oldVal) {
      if (val === undefined || val.length === 0 || val === oldVal) return
      this.$bus.$emit('loadNoteWithId', val)
    }
  },

  mounted () {
    this.loadNoteList()

    this.$bus.$on('refreshNoteList', (selectedFolderId, selectedNoteId) => {
      this.selectedNoteId = selectedNoteId
      if (selectedFolderId === '') {
        this.loadNoteList()
      } else {
        this.loadNoteList({ folder_id: selectedFolderId })
      }
    })

    this.$bus.$on('updateNote', (noteData) => {
      for (let i = 0; i < this.noteItems.length; i++) {
        if (this.noteItems[i]._id === noteData._id) {
          this.noteItems.splice(i, 1)
          this.noteItems.unshift({
            _id: noteData._id,
            name: noteData.name,
            digest: noteData.digest,
            updated_at: noteData.updated_at
          })
          break
        }
      }
    })

    this.$bus.$on('deleteNote', (noteId) => {
      for (let i = 0; i < this.noteItems.length; i++) {
        if (this.noteItems[i]._id === noteId) {
          this.noteItems.splice(i, 1)
          break
        }
      }
      if (this.noteItems.length > 0) {
        this.selectedNoteId = this.noteItems[0]._id
      } else {
        this.selectedNoteId = ''
      }
    })
  },

  methods: {
    loadNoteList (params) {
      const self = this
      Model.getNoteList(params)
        .then(function (response) {
          self.noteItems = response.data
          if (self.selectedNoteId === '' && self.noteItems.length > 0) self.selectedNoteId = self.noteItems[0]._id
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load note list!')
        })
    }
  }
}
</script>
