<template>
  <div class="image-container">
    <div class="image-toolbar">
      <el-button type="info" v-show="!editMode" @click="start">Edit</el-button>

      <el-button-group class="image-tool-gap" v-show="editMode">
        <el-button size="mini" @click="rotateLeft"><i class="material-icons">rotate_left</i></el-button>
        <el-button size="mini" @click="rotateRight"><i class="material-icons">rotate_right</i></el-button>
        <el-button size="mini" v-show="isHandyNoteProtocol && dragMode!=='crop'" @click="enterCrop">
          <i class="material-icons">crop</i>
        </el-button>
        <el-button size="mini" v-show="dragMode==='crop'" @click="exitCrop">
          <i class="material-icons">highlight_off</i>
        </el-button>
      </el-button-group>

      <el-slider ref="slider" class="image-tool-slider" v-show="editMode" v-model="zoomFactor" :step="10"
        :min="20" :max="500" :format-tooltip="formatTooltip" @change="zoomChange($event)"></el-slider>

      <el-button type="info" class="image-tool-gap" v-show="editMode" @click="stop">Cancel</el-button>
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

.image-tool-slider {
  width: 200px;
  margin: 0 10px 0 20px;
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
      cropBoxData: null,
      zoomChecker: null,
      zoomFactor: 100
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
    let self = this
    self.zoomChecker = function (event) {
      if (event.detail.ratio > 5 || event.detail.ratio < 0.2) {
        event.preventDefault() // Prevent zoom in / zoom out
      } else {
        self.zoomFactor = event.detail.ratio * 100
      }
    }
  },

  methods: {
    formatTooltip (val) {
      return (val || 100).toFixed(0) + '%'
    },

    changeSrc () {
      this.stop()
    },

    start () {
      this.editMode = true
      if (this.cropper !== null) this.cropper.destroy()

      this.$refs.image.addEventListener('zoom', this.zoomChecker)
      this.zoomFactor = 100

      this.cropper = new Cropper(this.$refs.image, {
        autoCrop: false,
        dragMode: this.dragMode,
        toggleDragModeOnDblclick: false
      })
    },

    stop () {
      this.editMode = false
      this.dragMode = 'move'
      if (this.cropper !== null) this.cropper.destroy()
      this.$refs.image.removeEventListener('zoom', this.zoomChecker)
    },

    zoomChange (newValue) {
      this.cropper.zoomTo(newValue / 100)
    },

    rotateLeft () {
      this.cropper.rotate(-90)
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
