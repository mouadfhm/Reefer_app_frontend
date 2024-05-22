<template>
    <div class="container">
      <v-container>
        <!-- Buttons -->
        <v-row>
          <v-col cols="12" md="6">
            <v-btn block color="primary" @click="button1Action">
              Button 1
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn block color="secondary" @click="button2Action">
              Button 2
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn block color="success" @click="button3Action">
              Button 3
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn block color="error" @click="button4Action">
              Button 4
            </v-btn>
          </v-col>
        </v-row>
  
        <!-- Spacer to push logout link to the bottom -->
        <v-spacer></v-spacer>
  
        <!-- Logout Link -->
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <v-btn text color="error" @click="logout">
              Logout
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ButtonPage',
    methods: {
      button1Action() {
        // Handle Button 1 click
        console.log('Button 1 clicked');
      },
      button2Action() {
        // Handle Button 2 click
        console.log('Button 2 clicked');
      },
      button3Action() {
        // Handle Button 3 click
        console.log('Button 3 clicked');
      },
      button4Action() {
        // Handle Button 4 click
        console.log('Button 4 clicked');
      },
      logout() {
        // Handle logout
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-between;
    padding: 20px;
  }
  
  .v-row {
    margin-top: 10px;
  }
  
  .v-btn {
    margin-bottom: 10px;
  }
  </style>
  