<template>
  <div class="background">
    <v-container>
      <!-- Buttons -->
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-btn class="buttons" block @click="Vessels_Button">
            Vessels
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn class="buttons" block @click="Housekeeping_Button">
            Housekeeping
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn class="buttons" block @click="Gate_Button">
            Gate In/Out
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn class="buttons" block @click="Users_Button">
            Users
          </v-btn>
        </v-col>
      </v-row>

      <!-- Spacer to push logout link to the bottom -->
      <v-spacer></v-spacer>

      <!-- Logout Link -->
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-btn text @click="logout" class="logout-link">
            Logout
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ButtonPage',
  methods: {
    ...mapActions(['logoutAction']),
    Vessels_Button() {
      // Handle Button 1 click
      this.$router.push('/vessels');
    },
    Housekeeping_Button() {
      // Handle Button 2 click
      console.log('Button 2 clicked');
    },
    Gate_Button() {
      // Handle Button 3 click
      console.log('Button 3 clicked');
    },
    Users_Button() {
      // Handle Button 4 click
      console.log('Button 4 clicked');
      this.$router.push('/users');

    },
    logout() {
      this.logoutAction().then(() => {
        console.log('Logout successful');
        this.$router.push('/login');
      });
    }
  }
};
</script>

<style>
.background {
  height: 90vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #003C43;
}

.v-container {
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: 50%;
}

.v-row {
  margin-top: 10px;
}

.buttons {
  width: 100%;
  padding: 20px;
  border-radius: 10px !important;
  text-align: center;
  background-color: #E3FEF7 !important;
  color: #003C43 !important;
}

.logout-link {
  color: #E3FEF7 !important;
  text-decoration: underline ;
  background: none;
  box-shadow: none;
}
</style>
