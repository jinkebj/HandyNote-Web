<template>
  <div class="email-content">
      <div class="email-content-header pure-g">
          <div class="pure-u-1-2">
              <h1 class="email-content-title">Hello from Toronto</h1>
              <p class="email-content-subtitle">
                  From <a>Tilo Mitra</a> at <span>3:56pm, April 3, 2012</span>
              </p>
          </div>

          <div class="email-content-controls pure-u-1-2">
              <button class="secondary-button pure-button">Reply</button>
              <button class="secondary-button pure-button">Forward</button>
              <button class="secondary-button pure-button">Move to</button>
          </div>
      </div>

      <div class="email-content-body">
          <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing
elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
ut aliquip ex ea commodo consequat.
          </p>
          <p>
              Duis aute irure dolor in reprehenderit in voluptate
velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint
occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.
          </p>
          <p>
              Aliquam ac feugiat dolor. Proin mattis massa sit
amet enim iaculis tincidunt. Mauris tempor mi vitae sem aliquet
pharetra. Fusce in dui purus, nec malesuada mauris. Curabitur ornare
arcu quis mi blandit laoreet. Vivamus imperdiet fermentum mauris, ac
posuere urna tempor at. Duis pellentesque justo ac sapien aliquet
egestas. Morbi enim mi, porta eget ullamcorper at, pharetra id lorem.
          </p>
          <p>
              Donec sagittis dolor ut quam pharetra pretium varius
in nibh. Suspendisse potenti. Donec imperdiet, velit vel adipiscing
bibendum, leo eros tristique augue, eu rutrum lacus sapien vel quam. Nam
orci arcu, luctus quis vestibulum ut, ullamcorper ut enim. Morbi semper
erat quis orci aliquet condimentum. Nam interdum mauris sed massa
dignissim rhoncus.
          </p>
          <p>
              Regards,<br>
              Tilo
          </p>
      </div>
  </div>
</template>

<style scoped>
/* Email Content Styles */
.email-content-header, .email-content-body, .email-content-footer {
    padding: 1em 2em;
}
.email-content-header {
    border-bottom: 1px solid #ddd;
}
.email-content-title {
    margin: 0.5em 0 0;
}
.email-content-subtitle {
    font-size: 1em;
    margin: 0;
    font-weight: normal;
}
    .email-content-subtitle span {
        color: #999;
    }
.email-content-controls {
    margin-top: 2em;
    text-align: right;
}
.email-content-controls .secondary-button {
    margin-bottom: 0.3em;
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
