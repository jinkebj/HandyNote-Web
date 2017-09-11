<template>
  <div class="header-container">
    <el-button type="primary" icon="menu">
      <span class="header-text-with-icon">Handy Note</span>
    </el-button>

    <el-input class="header-search" placeholder="Global Search" icon="search">
    </el-input>

    <div class="header-gap"></div>

    <el-dropdown>
      <el-button type="primary">
        <!-- <i class="material-icons">account_circle</i> -->
        <span class="header-text-with-icon">jinkebj</span>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner">Log Out</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dropdown>
      <el-button type="primary"><i class="material-icons">view_quilt</i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner">3 Column <i class="header-text-with-icon el-icon-check"></i></span>
        </el-dropdown-item>
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner">2 Column</span>
        </el-dropdown-item>
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner">1 Column</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dropdown>
      <el-button type="primary"><i class="material-icons">language</i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner">Automatic <i class="header-text-with-icon el-icon-check"></i></span>
        </el-dropdown-item>
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner">English</span>
        </el-dropdown-item>
        <el-dropdown-item class="my-folder-action-item">
          <span class="my-folder-action-item-inner">Chinese</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

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
  flex: 0 1 200px;
  margin-left: 10px;
}

.header-gap {
  flex: auto;
}

.header-text-with-icon {
  margin-left: 5px;
  font-size: 16px;
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
