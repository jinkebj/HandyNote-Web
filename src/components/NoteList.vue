<template>
  <div class="list-content">
      <div class="email-item email-item-selected pure-g">
          <div class="pure-u-1">
              <h5 class="email-name">Tilo Mitra</h5>
              <h4 class="email-subject">Hello from Toronto</h4>
              <p class="email-desc">
                  Hey, I just wanted to check in with you from Toronto. I got here earlier today.
              </p>
          </div>
      </div>

      <div class="email-item email-item-unread pure-g">
          <div class="pure-u-1">
              <h5 class="email-name">Eric Ferraiuolo</h5>
              <h4 class="email-subject">Re: Pull Requests</h4>
              <p class="email-desc">
                  Hey, I had some feedback for pull request #51. We should center the menu so it looks better on mobile.
              </p>
          </div>
      </div>

      <div class="email-item pure-g">
          <div class="pure-u-1">
              <h5 class="email-name">YUI Library</h5>
              <h4 class="email-subject">You have 5 bugs assigned to you</h4>
              <p class="email-desc">
                  Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla.
              </p>
          </div>
      </div>
  </div>
</template>

<style scoped>
.list-content {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  min-height: 800px;
}

/* Email Item Styles */
.email-item {
    padding: 0.9em 1em;
    border-bottom: 1px solid #ddd;
}

.email-name,
.email-subject {
  margin: 0;
}
.email-name {
  text-transform: uppercase;
  color: #999;
}
.email-desc {
  font-size: 80%;
  margin: 0.4em 0;
}

.email-item-selected {
  background: #eee;
}
.email-item-unread {
  border-left: 6px solid #1b98f8;
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
