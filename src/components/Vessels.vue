<template>
  <div class="background">
      <v-row v-for="vessel in vessels" :key="vessel.id" cols="12" md="4">
        <v-card class="vessel-box">
          <div>
            <v-card-title>Vessel {{ vessel.id }}</v-card-title>
          </div>
          <div>
            <v-card-subtitle>ETA: {{ vessel.eta }}</v-card-subtitle>
            <v-card-subtitle>ETD: {{ vessel.etd }}</v-card-subtitle>
          </div>

          <v-card-actions class="btns">
            <div @click="load(vessel)" class="btn">
              <v-btn>Load</v-btn>
            </div>
            <div @click="discharge(vessel)" class="btn">
              <v-btn>Discharge</v-btn>
            </div>
          </v-card-actions>

        </v-card>
      </v-row>
  </div>
</template>

<script>
import load from '@/store/load';
import axios from 'axios';
import { mapGetters, mapActions } from "vuex";


export default {
  name: 'Vessels',
  data() {
    return {
      vessels: [],
      loads: [],
    };
  },
  computed: {
    ...mapGetters(["getVessels", "getLoads"]),
  },
  mounted() {
    this.fetchVesselsMethode();
  },

  methods: {
    ...mapActions(["fetchVessels",'fetchload','selectVessel']),
    fetchVesselsMethode() {
      this.fetchVessels()
        .then(() => {
          this.vessels = this.getVessels;
        })
        .catch(error => {
          console.error('Error fetching vessels:', error);
        });
    },
    load(vessel) {
      this.selectVessel(vessel).then(() => {
        this.$router.push(`/load`);
      });
    },
    discharge(vessel) {
      this.selectVessel(vessel).then(() => {
        this.$router.push(`/discharge`);
      });
    },
  },
};

</script>

<style scoped>
.background {
  background-color: #003C43;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3%;

}


.vessel-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #E3FEF7;
  color: #003C43;
  border-radius: 8px;
  padding: 10px 7% 10px 7%;
  margin-bottom: 20px;
  text-align: center;
  width: fit-content;

}

.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  gap: 1rem;


}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  cursor: pointer;
  padding: 2px !important;
  border-radius: 10px !important;
  text-align: center;
  background-color: #135D66 !important;
  color: #E3FEF7 !important;
}

.v-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
