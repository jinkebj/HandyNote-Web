<template>
  <div class="folder-content">
    <el-button @click="addNote">Compose</el-button>
  </div>
</template>

<style scoped>
.folder-content {
  padding: 15px 50px;
}
</style>

<script>
import Model from '@/models'

export default {
  data () {
    return {
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
    }
  }
}
</script>
