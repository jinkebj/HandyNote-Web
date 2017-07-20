<template>
  <div class="list-content">
    <div v-for="noteItem in noteItems">
      <router-link :to="{ path: '/notes/' + noteItem._id}">
        <div class="list-item" v-bind:class="$route.params.id === noteItem._id ? 'list-item-selected' : ''">
          <h4 class="list-item-subject">{{noteItem.name}}</h4>
          <p class="list-item-desc">
            {{noteItem.text}}
          </p>
          <h5 class="list-item-name">{{noteItem.updated_at}}</h5>
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
    padding: 0.9em 1em;
    border-bottom: 1px solid #ddd;
}

.list-item:hover {
  cursor: pointer;
}

.list-item-selected {
  background: #eee;
  border-left: 6px solid #1b98f8;
}

.list-item-name,
.list-item-subject {
  margin: 0;
}

.list-item-name {
  text-transform: uppercase;
  color: #999;
}

.list-item-desc {
  font-size: 80%;
  margin: 0.4em 0;
}
</style>

<script>
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
      this.$http.get(this.$baseAPIUrl + '/notes')
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
