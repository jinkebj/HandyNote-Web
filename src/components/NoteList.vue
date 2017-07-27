<template>
  <div class="list-content">
    <div v-for="noteItem in noteItems">
      <a @click="selectedNoteId = noteItem._id">
        <div class="list-item" :class="selectedNoteId === noteItem._id ? 'list-item-selected' : 'list-item-unselected'">
          <h4 class="list-item-subject">{{noteItem.name | truncate(50)}}</h4>
          <p class="list-item-desc">
            {{noteItem.text | truncate(200)}}
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
  padding: 15px 15px;
  border-bottom: 1px solid #ddd;
}

.list-item-unselected:hover {
  cursor: pointer;
  background: #F6F7F9;
}

.list-item-selected {
  background: #EAF0FB;
  border-left: 6px solid #13CE66;
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
      this.$bus.$emit('loadNoteWithId', val)
    }
  },

  mounted () {
    this.loadNoteList()

    this.$bus.$on('refreshNoteList', (selectId) => {
      this.selectedNoteId = selectId
      this.loadNoteList()
    })
  },

  methods: {
    loadNoteList () {
      const self = this
      Model.getNoteList()
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
