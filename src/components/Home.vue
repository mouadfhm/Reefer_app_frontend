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
        <v-col cols="12" md="6"  v-if="activeUser && activeUser.fonction && activeUser.fonction.name === 'FONC1'">
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
    <v-dialog v-model="gateDialog" max-width="500">
            <v-card class="gate_card">
                <v-card-title>Gate IN/OUT</v-card-title>
                <!-- <v-card-text>
                    Are you sure you want to delete this HouseKeeping?
                </v-card-text> -->
                <v-card-actions class="gate">
                    <v-btn class="gate_buttons" @click="gateIn">Gate IN</v-btn>
                    <P class="gate_text"  > OR </P>
                    <v-btn class="gate_buttons" @click="gateOut">Gate OUT</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ButtonPage',
  data() {
    return {
      gateDialog: false,
      activeUser: null
    };
  },
  computed: {
    ...mapGetters(['getCurrentUser']),
  },
  mounted() {
    this.getActiveUser();
  },
  methods: {
    ...mapActions(['logoutAction']),
    Vessels_Button() {
      // Handle Button 1 click
      this.$router.push('/vessels');
    },
    Housekeeping_Button() {
      this.$router.push('/housekeeping');
    },
    Gate_Button() {
      this.gateDialog = true;
    },
    gateIn() {
      this.$router.push('/gatein');
    },
    gateOut() {
      this.$router.push('/gateout');
    },
    Users_Button() {
      this.$router.push('/users');

    },
    logout() {
      this.logoutAction().then(() => {
        console.log('Logout successful');
        this.$router.push('/login');
      });
    },
    getActiveUser() {
      this.activeUser = this.getCurrentUser;
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
.gate{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 7% 10px 7%; 
}
.gate_buttons{
  margin: 10px;
  border-radius: 10px !important;
  text-align: center;
  background-color: #E3FEF7 !important;
  color: #003C43 !important;
  width: 100px;
  padding: 10px 70px 10px 70px;  
}
.gate_card{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #135D66;
  border-radius: 8px;
  padding: 10px 7% 10px 7%;
  margin-bottom: 20px;
  text-align: center;
  color: #E3FEF7 !important;
}
.gate_text{
  margin: 20px;
}
</style>
