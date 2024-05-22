<template>
  <div class="background">
    <v-img class="mx-auto my-6" max-width="228"
      src="C:\Users\fahim\OneDrive\Documents\laravel\CarDealer_front-end\src\assets\logo-white.svg"></v-img>

    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field density="compact" placeholder="Matricule" prepend-inner-icon="mdi-account-outline"
        variant="outlined" v-model="matricule"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password

      </div>

      <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
        density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible" v-model="password"></v-text-field>

      <v-card class="mb-12" color="surface-variant" variant="tonal">
      </v-card>

      <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="handleLogin"
        @keydown.enter="handleLogin">
        Log In
      </v-btn>

      <v-card-text class="text-center">
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackbarColor" multi-line timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<style scoped>
.background {
  background-color: #003C43;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.v-card {
  background-color: #135D66;
  color: #E3FEF7;
  border-radius: 8px;
  margin-bottom: 30px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.v-text-field {
  width: 100%;
  margin-bottom: 16px;
}

.v-btn {
  background-color: #E3FEF7;
  color: #135D66 !important;
  width: 100%;
}

.v-img {
  margin-bottom: 30px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
<script>
import axios from '@/services/axios';
import { mapActions } from 'vuex';
export default {
  name: 'Login',
  data: () => ({
    visible: false,
    matricule: '',
    password: '',
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',

  }),
  methods: {
    ...mapActions(["LoginAction"]

    ),
    handleLogin() {
      const user = {
        matricule: this.matricule,
        password: this.password,
      };

      this.LoginAction(user)
        .then(response => {
          // Handle successful login
          console.log(response);
          // const token = response.data.payload.token;
          // localStorage.setItem('token', token);
          // console.log(localStorage.getItem('token'));

          // Navigate to ShowUsers page after successful login
          this.$router.push('/home');
        })
        .catch(error => {
          this.snackbarMessage = 'Invalid credentials. Please try again.';
          this.snackbarColor = 'error';
          this.snackbar = true;

          // Handle login error
          console.error(error);
        });
    },

  },
};
</script>