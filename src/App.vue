<template>
  <div class="container">
    <div class="header">
      <my-header></my-header>
    </div>

    <div class="content auto-overflow">
      <div class="note-folder auto-overflow">
        <my-note-folder></my-note-folder>
      </div>
      <div class="note-list auto-overflow">
        <my-note-list></my-note-list>
      </div>
      <div class="note-detail hide-overflow">
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
</style>

<style scoped>
.container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  justify-content: flex-start; /* align items in Main Axis */
  align-items: stretch; /* align items in Cross Axis */
  align-content: stretch; /* Extra space in Cross Axis */
}

.header {
  flex: 0 50px;
  background: #398DEE;
}

.content {
  flex: 1; /* same as flex: 1 1 auto; */

  display: flex;
  flex-flow: row;

  justify-content: flex-start; /* align items in Main Axis */
  align-items: stretch; /* align items in Cross Axis */
  align-content: stretch; /* Extra space in Cross Axis */
}

.note-folder {
  flex: 3;
  background: #F5F5F5;
}

.note-list {
  flex: 4;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.note-detail {
  flex: 17;
}

.auto-overflow {
  overflow: auto; /* Needed for when the area gets squished too far and there is content that can't be displayed */
}
.hide-overflow {
  overflow: hidden;
}
</style>

<script>
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
  }
}
</script>
