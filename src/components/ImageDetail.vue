<template>
  <div class="image-container">
    <el-button-group class="image-toolbar">
      <el-button icon="el-icon-view" v-show="editMode" @click="stop"></el-button>
      <el-button icon="el-icon-edit" v-show="!editMode" @click="start"></el-button>
      <el-button icon="el-icon-plus" v-show="editMode" @click="zoomIn"></el-button>
      <el-button @click="resetZoom" v-show="editMode">1 : 1</el-button>
      <el-button icon="el-icon-minus" v-show="editMode" @click="zoomOut"></el-button>
      <el-button icon="el-icon-refresh" v-show="editMode" @click="rotateRight"></el-button>
    </el-button-group>
    <div class="image-wrapper">
      <img ref="image" :src="src">
    </div>
  </div>
</template>

<style>

</style>

<style scoped>
.image-container {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.image-toolbar {
  position: absolute;
  top: 10px;
}

.image-wrapper {
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper > img {
  max-height: 100%;
  max-width: 100%;
}
</style>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  props: ['src'],

  data () {
    return {
      cropper: null,
      editMode: false
    }
  },

  watch: {
    src: 'stop'
  },

  mounted () {
  },

  methods: {
    start () {
      this.editMode = true
      if (this.cropper !== null) this.cropper.destroy()

      this.cropper = new Cropper(this.$refs.image, {
        autoCrop: false,
        dragMode: 'move',
        ready: () => {
        },
        crop: ({detail}) => {
        }
      })
    },

    stop () {
      this.editMode = false
      if (this.cropper !== null) this.cropper.destroy()
    },

    zoomIn () {
      this.cropper.zoom(0.1)
    },

    zoomOut () {
      this.cropper.zoom(-0.1)
    },

    resetZoom () {
      this.cropper.zoomTo(1)
    },

    rotateRight () {
      this.cropper.rotate(90)
    }
  }
}
</script>
