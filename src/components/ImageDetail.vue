<template>
  <div class="image-container">
    <div class="image-toolbar">
      <el-button type="info" v-show="!editMode" @click="start">Edit Mode</el-button>
      <el-button type="info" v-show="editMode" @click="stop">View Mode</el-button>

      <el-button-group class="image-tool-gap" v-show="editMode">
        <el-button icon="el-icon-plus" @click="zoomIn"></el-button>
        <el-button @click="resetZoom">1 : 1</el-button>
        <el-button icon="el-icon-minus" @click="zoomOut"></el-button>
      </el-button-group>

      <el-button-group class="image-tool-gap" v-show="editMode">
        <el-button @click="rotateRight">Rotate</el-button>
        <el-button v-show="isHandyNoteProtocol && dragMode!=='crop'" @click="enterCrop">Crop</el-button>
        <el-button v-show="dragMode==='crop'" @click="exitCrop">Cancel Crop</el-button>
      </el-button-group>

      <el-button type="primary" class="image-tool-gap" v-show="isHandyNoteProtocol && editMode" @click="crop">
        Save
      </el-button>
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

.image-tool-gap {
  margin-left: 10px;
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
    isHandyNoteProtocol () {
      return this.imgSrc.indexOf('/api/images/') >= 0 && this.imgSrc.indexOf('?certId') >= 0
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
      self.$confirm('Update image? This action can NOT be undone!', 'Please Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        self.cropBoxData = this.cropper.getCroppedCanvas().toDataURL('image/jpeg')
        Model.updateImage(self.getImgId, {
          data: self.cropBoxData
        })
          .then(function (response) {
            self.stop()
            self.$emit('updateImage')
            self.$message({
              message: 'Image update successfully!',
              type: 'success'
            })
          })
          .catch(function (error) {
            console.log(error)
            self.$message.error('Image update failed!')
          })
      })
    }
  }
}
</script>
