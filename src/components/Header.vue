<template>
  <div class="header-container">
    <el-button type="primary" icon="el-icon-menu">
      <span class="header-text-with-icon">Handy Note</span>
    </el-button>

    <el-input class="header-search" placeholder="Global Search" prefix-icon="el-icon-search"
      v-model="searchStr" @keyup.enter.native="startSearch" />

    <div class="header-gap"></div>

    <el-radio-group v-model="viewType" size="small">
      <el-radio-button label="3" :class="viewType === 3 ? 'is-active' : ''">
        <i class="material-icons">view_week</i>
      </el-radio-button>
      <el-radio-button label="2" :class="viewType === 2 ? 'is-active' : ''">
        <i class="material-icons">chrome_reader_mode</i>
      </el-radio-button>
      <el-radio-button label="1" :class="viewType === 1 ? 'is-active' : ''">
        <i class="material-icons">web_asset</i>
      </el-radio-button>
    </el-radio-group>

    <el-dropdown>
      <el-button type="primary">
        <span class="header-text-icon-container">
          <i class="material-icons">account_circle</i>
          <span class="header-text-with-icon">{{loginUser}}</span>
        </span>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner" @click="logout">Log Out</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style>
.header-container .el-radio-button:first-child .el-radio-button__inner {
  border: none;
}

.header-container .el-radio-button__inner {
  background: #20A0FF;
  border: none;
}

.header-container .el-radio-button.is-active .el-radio-button__inner {
  background-color: #1D8CE0;
  border-color: #1D8CE0;
  box-shadow: -1px 0px 0px 0px #1D8CE0;
}
</style>

<style scoped>
.header-container {
  background: #20A0FF;
  width: 100vw;
  height: 50px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
}

.header-search {
  flex: 0 1 300px;
  margin-left: 10px;
}

.header-gap {
  flex: auto;
}

.header-text-icon-container {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
}

.header-text-with-icon {
  margin-left: 5px;
  font-size: 16px;
}

.header-container .el-radio-button .material-icons {
  color: #FFFFFF;
}

.header-container .el-radio-button.is-active .material-icons {
  color: #F7BA2A;
}

.header-container .el-radio-button .material-icons:hover {
  color: #F7BA2A;
}
</style>

<script>
import {getCurUsrId} from '@/util'

export default {
  data () {
    return {
      searchStr: '',
      loginUser: getCurUsrId(),
      viewType: -1 // -1: not initialized, 1: 1 column, 2: 2 columns, 3: 3 columns
    }
  },

  watch: {
    viewType: function (val, oldVal) {
      if (oldVal !== -1 && val !== oldVal) {
        this.$bus.$emit('switchViewType', val)
      }
    }
  },

  mounted () {
    this.initViewType()
  },

  methods: {
    startSearch () {
      if (this.searchStr.length > 0) this.$bus.$emit('selectSearch', this.searchStr)
    },

    initViewType () {
      let sizes = window.localStorage.getItem('hn-pane-sizes')
      if (sizes) {
        sizes = JSON.parse(sizes)
      } else {
        sizes = [12, 20, 68]  // default pane size
      }
      if (sizes[0] < 1 && sizes[1] < 1) {
        this.viewType = 1
      } else if (sizes[0] < 1) {
        this.viewType = 2
      } else {
        this.viewType = 3
      }
    },

    logout () {
      window.localStorage.removeItem('hn-token')
      window.localStorage.removeItem('hn-user')
      this.$router.replace('/login')
    }
  }
}
</script>
