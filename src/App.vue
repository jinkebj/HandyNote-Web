<template>
  <router-view></router-view>
</template>

<style>
html, body {
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

/*  style scrollbar for chrome */
::-webkit-scrollbar {
  width: 8px;
  background-color: rgba(0, 0, 0, 0, 0.09);
}

::-webkit-scrollbar:hover {
  border-left: 1px solid #ddd;
}

::-webkit-scrollbar-thumb:vertical {
  background: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 100px;
  border-radius: 100px;
}

::-webkit-scrollbar-thumb:vertical:hover {
  background: rgba(0, 0, 0, 0.35);
  -webkit-border-radius: 100px;
  border-radius: 100px;
}
</style>

<script>
  export default {
    name: 'app'
  }
</script>
