<template>
  <div>
    <el-row>
      <el-col :span="24">
        <my-header></my-header>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="3">
        <my-folder></my-folder>
      </el-col>

      <el-col :span="4">
        <my-note-list></my-note-list>
      </el-col>

      <el-col :span="17">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<style>
/*** base style apply to whole app ***/
body {
  font-family: sans-serif;
  margin: 0px;
  border-bottom: 1px solid #ddd;
}
</style>

<script>
import MyHeader from '@/components/Header'
import MyFolder from '@/components/Folder'
import MyNoteList from '@/components/NoteList'

export default {
  name: 'app',
  components: {
    MyHeader,
    MyFolder,
    MyNoteList
  }
}
</script>
