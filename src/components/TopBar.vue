<template>
  <div class="background">
    <v-app-bar  app floating color="#135D66" dark >
      <!-- Return button on the left -->
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

     

      <!-- Title in the center -->
      <v-toolbar-title class="text-h6">{{ pageTitle }}</v-toolbar-title>



      <!-- Notification button on the right -->
      <v-btn icon @click="showNotifications">
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-app-bar>

  </div>
</template>

<script>
export default {
  name: 'FloatingAppBar',
  data() {
    return {
      pageTitle: '',
    };
  },
  watch: {
    $route(to) {
      this.pageTitle = to.meta.title || 'REEFER APP';
    },
  },
  mounted() {
    this.pageTitle = this.$route.meta.title || 'REEFER APP';
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    showNotifications() {
      alert('Notifications clicked!');
    },
  },
};
</script>

<style>
.v-app-bar {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
}

.v-toolbar-title {
  text-align: center;
  color: #E3FEF7;
}
.background {
  position: absolute;
}
</style>
