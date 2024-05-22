<!-- Layout.vue -->
<template>
    <div>
      
      <router-view />
    </div>
  </template>
  
  <script>
  import TopMenu from '@/components/TopBar.vue'; // Import your top menu component
  
  export default {
    name: 'Layout',
    components: {
      TopMenu,
    },
  };
  </script>
  
