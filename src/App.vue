<template>
  <v-app >
    <v-main class="app">
      <TopMenu />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  //
  import TopMenu from '@/components/TopBar.vue'; // Import your top menu component
  
  export default {
    components: {
      TopMenu,
    },
  };
</script>
<style scoped>
.app{
  position: relative;
  width: 100vw;
}
</style>
