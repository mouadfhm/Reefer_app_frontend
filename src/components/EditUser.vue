<template>
  <div class="background">

    <v-card class="mx-auto pa-12 pb-10" elevation="8" max-width="448" rounded="lg">
      <div class="text-h6 mb-6">Modify User</div>

      <v-text-field dense label="Matricule" prepend-inner-icon="mdi-account-outline" v-model="matricule"></v-text-field>

      <v-text-field dense label="Email" prepend-inner-icon="mdi-email-outline" v-model="email"></v-text-field>

      <v-text-field dense label="First Name" prepend-inner-icon="mdi-account-outline"
        v-model="firstname"></v-text-field>

      <v-text-field dense label="Last Name" prepend-inner-icon="mdi-account-outline" v-model="lastname"></v-text-field>

      <v-combobox dense label="Fonction" prepend-inner-icon="mdi-account-hard-hat-outline"
        :items="fonctions" v-model="fonction" item-title="name" item-value="id" ></v-combobox>

      <v-btn class="mt-2" color="primary" block @click="handleModification">
        Update User
      </v-btn>
    </v-card>

    <v-snackbar v-model="snackbar" color="success" top> 
      {{ feedbackMessage }}
      <v-btn text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import auth from '@/services/auth';
import axios from 'axios';

export default {
  name: 'getFonctions',
  data() {
    return {
      fonctions: [],
      matricule: '',
      email: '',
      firstname: '',
      lastname: '',
      fonction: '',
      feedbackMessage: '',
      snackbar: false,
    };
  },
  mounted() {
    this.fetchFonctions();
  },

  methods: {
    handleModification() {
      const user = {
        id: this.$route.params.id,
        matricule: this.matricule,
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        fonction_id: this.fonction.id
      };
      auth.modifyUser(user)
        .then(response => {
          this.feedbackMessage = 'User modified successfully.';
          this.snackbar = true;
          console.log(response.data);
        })
        .catch(error => {
          this.feedbackMessage = 'Failed to modify user. Please try again.';
          this.snackbar = true;
          console.error(error);
        });
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
.text-h6 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

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
