<template>
  <div class="list-content">
    <div v-for="noteItem in noteItems">
      <router-link :to="{ path: '/notes/' + noteItem._id}">
        <div class="list-item" v-bind:class="$route.params.id === noteItem._id ? 'list-item-selected' : 'list-item-unselected'">
          <h4 class="list-item-subject">{{noteItem.name | truncate(50)}}</h4>
          <p class="list-item-desc">
            {{noteItem.text | truncate(200)}}
          </p>
          <h5 class="list-item-time">{{noteItem.updated_at | fmtTime}}</h5>
        </div>
      </router-link>
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
  border-left: 6px solid #1b98f8;
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
      noteItems: []
    }
  },

  mounted () {
    this.loadNoteList()
  },

  methods: {
    loadNoteList () {
      const self = this
      Model.getNoteList()
        .then(function (response) {
          self.noteItems = response.data
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Failed to load note list!')
        })
    }
  }
}
</script>
