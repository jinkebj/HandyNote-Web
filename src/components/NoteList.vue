<template>
  <div class="list-content">
    <div class="list-item list-item-selected">
      <h5 class="list-item-name">Tilo Mitra</h5>
      <h4 class="list-item-subject">Hello from Toronto</h4>
      <p class="list-item-desc">
        Hey, I just wanted to check in with you from Toronto. I got here earlier today.
      </p>
    </div>

    <div class="list-item list-item-unread">
      <h5 class="list-item-name">Eric Ferraiuolo</h5>
      <h4 class="list-item-subject">Re: Pull Requests</h4>
      <p class="list-item-desc">
        Hey, I had some feedback for pull request #51. We should center the menu so it looks better on mobile.
      </p>
    </div>

    <div class="list-item">
      <h5 class="list-item-name">YUI Library</h5>
      <h4 class="list-item-subject">You have 5 bugs assigned to you</h4>
      <p class="list-item-desc">
        Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla.
      </p>
    </div>
  </div>
</template>

<style scoped>
.list-content {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  min-height: 800px;
}

.list-item {
    padding: 0.9em 1em;
    border-bottom: 1px solid #ddd;
}

.list-item-selected {
  background: #eee;
}
.list-item-unread {
  border-left: 6px solid #1b98f8;
}

.list-item-name,
.list-item-subject {
  margin: 0;
}
.list-item-name {
  text-transform: uppercase;
  color: #999;
}
.list-item-desc {
  font-size: 80%;
  margin: 0.4em 0;
}
</style>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
