<template>
  <!-- <div>
    <my-header></my-header>
    <router-view></router-view>
  </div> -->
<div class="main-content">


<div class="pure-g">
  <div class="pure-u-1">
    <my-header></my-header>
  </div>
</div>
<div class="pure-g">
    <div class="pure-u-1-5">
      <my-folder></my-folder>
    </div>

    <div class="pure-u-1-5">
      <my-note-list></my-note-list>
    </div>

    <div class="pure-u-3-5">
      <my-note-detail></my-note-detail>
    </div>
</div>

</div>
</template>

<style>
.main-content {
  border-bottom: 1px solid #ddd;
}
/*
 * -- HELPER STYLES --
 * Over-riding some of the .pure-button styles to make my buttons look unique
 */
.primary-button,
.secondary-button {
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border-radius: 20px;
}
.primary-button {
    color: #fff;
    background: #1b98f8;
    margin: 1em 0;
}
.secondary-button {
    background: #fff;
    border: 1px solid #ddd;
    color: #666;
    padding: 0.5em 2em;
    font-size: 80%;
}

</style>

<script>
import MyHeader from './components/Header'
import MyFolder from './components/Folder'
import MyNoteList from './components/NoteList'
import MyNoteDetail from './components/NoteDetail'

export default {
  name: 'app',
  components: {
    MyHeader,
    MyFolder,
    MyNoteList,
    MyNoteDetail
  }
}
</script>
