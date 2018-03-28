<template>
  <div class="image-container">
    <el-button-group class="image-toolbar">
      <el-button icon="el-icon-plus" @click="zoomIn"></el-button>
      <el-button @click="resetZoom">1 : 1</el-button>
      <el-button icon="el-icon-minus" @click="zoomOut"></el-button>
      <el-button icon="el-icon-refresh" @click="rotateRight"></el-button>
    </el-button-group>
    <div class="image-wrapper">
      <img ref="image" :src="src" @load="start">
    </div>
  </div>
</template>

<style scoped>
.image-container {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.image-toolbar {
  margin-bottom: 18px;
  z-index: 2015;
}

.image-wrapper {
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  & > img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  props: ['src'],

  data () {
    return {
      cropper: null
    }
  },

  mounted () {
  },

  methods: {
    start () {
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
