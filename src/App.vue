<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    if (this.$route.path === '/') {
      this.$router.push('/home');
    }
  }
}
</script>
