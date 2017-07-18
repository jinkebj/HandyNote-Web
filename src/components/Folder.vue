<template>
  <div>
    <div>
        <button class="primary-button pure-button">Compose</button>

        <div class="pure-menu">
            <ul class="pure-menu-list">
                <li class="pure-menu-item"><a href="#" class="pure-menu-link">Inbox <span class="email-count">(2)</span></a></li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link">Important</a></li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link">Sent</a></li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link">Drafts</a></li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link">Trash</a></li>
                <li class="pure-menu-heading">Labels</li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link"><span class="email-label-personal"></span>Personal</a></li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link"><span class="email-label-work"></span>Work</a></li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link"><span class="email-label-travel"></span>Travel</a></li>
            </ul>
        </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * -- EMAIL STYLES --
 * Styles relevant to the email messages, labels, counts, and more.
 */
.email-count {
    color: rgb(75, 113, 151);
}

.email-label-personal,
.email-label-work,
.email-label-travel {
    width: 15px;
    height: 15px;
    display: inline-block;
    margin-right: 0.5em;
    border-radius: 3px;
}
.email-label-personal {
    background: #ffc94c;
}
.email-label-work {
    background: #41ccb4;
}
.email-label-travel {
    background: #40c365;
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
