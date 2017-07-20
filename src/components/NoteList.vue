<template>
  <div class="list-content">
    <div v-for="noteItem in noteItems">
      <router-link :to="{ path: '/notes/' + noteItem._id}">
        <div class="list-item" v-bind:class="$route.params.id === noteItem._id ? 'list-item-selected' : ''">
          <h4 class="list-item-subject">{{noteItem.name}}</h4>
          <p class="list-item-desc">
            {{noteItem.text}}
          </p>
          <h5 class="list-item-time">{{noteItem.updated_at | fmtTime}}</h5>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.list-content {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  min-height: 800px;
}

.list-content a {
  text-decoration: none;
  outline: none;
  color: #434343;
}

.list-item {
    padding: 15px 15px;
    border-bottom: 1px solid #ddd;
}

.list-item:hover {
  cursor: pointer;
  background: #F5F5F5;
}

.list-item-selected {
  background: #eee;
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
import {fmtTime} from '@/util'
import Model from '@/models'

export default {
  data () {
    return {
      noteItems: []
    }
  },

  filters: {
    fmtTime
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
        })
    }
  }
}
</script>
