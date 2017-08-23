<template>
  <div class="container">
    <div class="header">
      <el-button type="primary" icon="menu" @click="toggleNoteFolder"></el-button>
      <my-header></my-header>
    </div>

    <div class="content">
      <div class="note-folder">
        <my-note-folder></my-note-folder>
      </div>
      <div class="note-list">
        <my-note-list></my-note-list>
      </div>
      <div class="note-detail">
        <!-- <router-view></router-view> -->
        <my-note-detail></my-note-detail>
      </div>
    </div>
  </div>
</template>

<style>
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.gutter:hover {
  cursor: col-resize;
}

.gutter.gutter-horizontal {
  background-image:  url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}
</style>

<style scoped>
.container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-flow: column;

  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
}

.header {
  flex: 0 50px;
  background: #20A0FF;
}

.header .el-button {
  width: 50px;
  height: 50px;
}

.content {
  flex: 1; /* same as flex: 1 1 auto; */
  overflow: auto; /* Needed for when the area gets squished too far and there is content that can't be displayed */

  display: flex;
  flex-flow: row;

  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
}

.note-folder {
  background: #F5F5F5;
  overflow: hidden;
}

.note-list {
  overflow: hidden;
}

.note-list:hover,
.note-folder:hover {
  overflow: auto;
}

.note-detail {
  overflow: hidden;
}
</style>

<script>
import Split from 'split.js'
import MyHeader from '@/components/Header'
import MyNoteFolder from '@/components/NoteFolder'
import MyNoteList from '@/components/NoteList'
import MyNoteDetail from '@/components/NoteDetail'

export default {
  name: 'app',

  components: {
    MyHeader,
    MyNoteFolder,
    MyNoteList,
    MyNoteDetail
  },

  data () {
    return {
      split: {}
    }
  },

  mounted () {
    let self = this

    this.split = Split(['.note-folder', '.note-list', '.note-detail'], {
      sizes: self.getPaneSize(),
      minSize: [150, 200, 400],
      gutterSize: 6,
      elementStyle: function (dimension, size, gutterSize) {
        return {
          'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)'
        }
      },
      gutterStyle: function (dimension, gutterSize) {
        return {
          'flex-basis': gutterSize + 'px'
        }
      },
      onDragEnd: function () {
        window.localStorage.setItem('hn-pane-sizes', JSON.stringify(self.split.getSizes()))
      }
    })
  },

  methods: {
    getPaneSize () {
      let sizes = window.localStorage.getItem('hn-pane-sizes')
      if (sizes) {
        sizes = JSON.parse(sizes)
      } else {
        sizes = [12, 16, 72]  // default pane size
      }

      return sizes
    },

    toggleNoteFolder () {
      let sizes = this.split.getSizes()
      if (sizes[0] < 1) {
        this.split.setSizes(this.getPaneSize())
      } else {
        this.split.collapse(0)
      }

      console.log(this.split.getSizes())
    }
  }
}
</script>
