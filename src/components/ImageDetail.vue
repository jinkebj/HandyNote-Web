<template>
  <div class="image-container">
    <div class="image-toolbar">
      <el-button icon="el-icon-view" v-show="editMode" @click="stop"></el-button>
      <el-button icon="el-icon-edit" v-show="!editMode" @click="start"></el-button>

      <el-button-group v-show="editMode">
        <el-button icon="el-icon-plus" @click="zoomIn"></el-button>
        <el-button @click="resetZoom">1 : 1</el-button>
        <el-button icon="el-icon-minus" @click="zoomOut"></el-button>
        <el-button icon="el-icon-refresh" @click="rotateRight"></el-button>
        <el-button icon="el-icon-news" v-show="!isEmbededImg && dragMode!=='crop'" @click="enterCrop"></el-button>
      </el-button-group>

      <el-button-group v-show="dragMode==='crop'">
        <el-button icon="el-icon-circle-close-outline" @click="exitCrop"></el-button>
        <el-button icon="el-icon-check" @click="crop"></el-button>
      </el-button-group>
  </div>
    <div class="image-wrapper">
      <img ref="image" :src="imgSrc">
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
  position: absolute;
  top: 10px;

  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
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
import Model from '@/models'

export default {
  props: ['imgSrc'],

  data () {
    return {
      cropper: null,
      editMode: false,
      dragMode: 'move',
      cropBoxData: null
    }
  },

  computed: {
    isEmbededImg () {
      return this.imgSrc.startsWith('data:image')
    },

    getImgId () {
      let startIndex = this.imgSrc.indexOf('/api/images/') + 12
      let endIndex = this.imgSrc.indexOf('?certId')
      return this.imgSrc.substring(startIndex, endIndex)
    }
  },

  watch: {
    imgSrc: 'changeSrc'
  },

  mounted () {
  },

  methods: {
    changeSrc () {
      this.stop()
    },

    start () {
      this.editMode = true
      if (this.cropper !== null) this.cropper.destroy()

      this.cropper = new Cropper(this.$refs.image, {
        autoCrop: false,
        dragMode: this.dragMode
      })
    },

    stop () {
      this.editMode = false
      this.dragMode = 'move'
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
    },

    enterCrop () {
      this.dragMode = 'crop'
      this.cropper.setDragMode(this.dragMode)
    },

    exitCrop () {
      this.cropper.clear()
      this.dragMode = 'move'
      this.cropper.setDragMode(this.dragMode)
    },

    crop () {
      let self = this
      self.cropBoxData = this.cropper.getCroppedCanvas().toDataURL('image/jpeg')

      Model.updateImage(self.getImgId, {
        data: self.cropBoxData
      })
        .then(function (response) {
          self.$emit('updateImage', self.getImgId)
          self.$message({
            message: 'Image update successfully!',
            type: 'success'
          })
        })
        .catch(function (error) {
          console.log(error)
          self.$message.error('Image update failed!')
        })
    }
  }
}
</script>
