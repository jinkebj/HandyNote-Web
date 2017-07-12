<template>
  <div>
    <div>
      <button @click="loadContent">Load Content</button>
      <button @click="saveContent">Save Content</button>
      <button @click="addContent">Add Content</button>
      <button @click="showContent">Print to Console</button>
      <p />
    </div>
    <div id="editor"></div>
  </div>
</template>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { ImageResize } from '../quill_modules/ImageResize'

export default {
  name: 'hello',

  data () {
    return {
      quill: {}
    }
  },

  mounted () {
    Quill.register('modules/imageResize', ImageResize)

    this.quill = new Quill(document.getElementById('editor'), {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{'header': 1}, {'header': 2}],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'script': 'sub'}, {'script': 'super'}],
          [{'indent': '-1'}, {'indent': '+1'}],
          [{'direction': 'rtl'}],
          [{'size': ['small', false, 'large', 'huge']}],
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          [{'color': []}, {'background': []}],
          [{'font': []}],
          [{'align': []}],
          ['clean'],
          ['link', 'image', 'video']
        ],
        imageResize: {
          displaySize: true
        }
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    })
  },

  methods: {
    showContent () {
      console.log('quill.getContents() is:' + JSON.stringify(this.quill.getContents()))
      console.log('quill.getText() is:' + JSON.stringify(this.quill.getText()))
    },

    addContent () {
      this.$http.post(this.$baseAPIUrl + '/notes', {
        name: 'my 3rd note',
        text: this.quill.getText(),
        contents: this.quill.getContents().ops
      })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
    },

    saveContent () {
      this.$http.post(this.$baseAPIUrl + '/notes/275532b0-66dd-11e7-9405-9dbbc67dfe64', {
        name: 'my 3rd note',
        text: this.quill.getText(),
        contents: this.quill.getContents().ops
      })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
    },

    loadContent () {
      let self = this
      this.$http.get(this.$baseAPIUrl + '/notes/275532b0-66dd-11e7-9405-9dbbc67dfe64')
        .then(function (response) {
          console.log(response)
          self.quill.setContents(response.data.contents)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#editor {
  height: 800px
}
</style>
