<template>
  <div class="background">

    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <div class="text-h6 mb-6">Create New User</div>

      <v-text-field dense label="Matricule" prepend-inner-icon="mdi-account-outline" v-model="matricule"></v-text-field>

      <v-text-field dense label="Email" prepend-inner-icon="mdi-email-outline" v-model="email"></v-text-field>

      <v-text-field dense label="First Name" prepend-inner-icon="mdi-account-outline"
        v-model="firstname"></v-text-field>

      <v-text-field dense label="Last Name" prepend-inner-icon="mdi-account-outline" v-model="lastname"></v-text-field>

      <v-combobox dense label="Fonction" prepend-inner-icon="mdi-account-hard-hat-outline"
        :items="fonctions" v-model="fonction" item-title="name" item-value="id" ></v-combobox>
      
        <v-btn class="mt-2" color="primary" block @click="handleRegister">
        Register
      </v-btn>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" multi-line timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import auth from '@/services/auth';
import axios from '@/services/axios';
import { mapActions } from 'vuex/dist/vuex.cjs.js';

export default {
  name: 'Register',
  name: 'getFonctions',
  data() {
    return {
      fonctions: [],
      matricule: '',
      email: '',
      firstname: '',
      lastname: '',
      fonction: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    };
  },
  mounted() {
    this.fetchFonctions();
  },

  methods: {
    ...mapActions(['registerAction']),
    handleRegister() {
      const user = {
        matricule: this.matricule,
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        fonction_id: this.fonction.id
      };

      this.registerAction(user).then(() => {
        this.snackbarMessage = 'User registered successfully!';
        this.snackbarColor = 'success';
        this.snackbar = true;
      }).catch(error => {
        this.snackbarMessage = 'Error registering user. Please try again.';
        this.snackbarColor = 'error';
        this.snackbar = true;
        console.error('Error registering user:', error);
      });

      // auth.register(user)
      //   .then(response => {
      //     this.snackbarMessage = 'User registered successfully!';
      //     this.snackbarColor = 'success';
      //     this.snackbar = true;
      //   })
      //   .catch(error => {
      //     this.snackbarMessage = 'Error registering user. Please try again.';
      //     this.snackbarColor = 'error';
      //     this.snackbar = true;
      //     console.error('Error registering user:', error);
      //   });
    },
    fetchFonctions() {
      auth.getFonctions()
        .then(({ data: { payload } }) => {
          this.fonctions = payload.map(({ id, name }) => ({ id, name }));
        });
    },

  },
};
</script>

<style scoped>
.text-subtitle-1 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.background {
  background-color: #003C43;
  height: fit-content;
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
  margin-bottom: 0px;
  width: 100%;
}

.v-text-field {
  width: 100%;
  margin-bottom: 0px;
}

.v-btn {
  background-color: #E3FEF7 !important;
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
