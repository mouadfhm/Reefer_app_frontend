<template>
  <div class="background">
    <v-container>
      <v-card class="pa-4">
        <v-card-title>
          <v-toolbar flat>
            <v-toolbar-title>Reefers To Be Loaded List</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </v-card-title>

        <v-col class="col" cols="12">
          <v-btn class="button" @click="applyFilter"><v-icon>mdi-filter</v-icon>Filter </v-btn>
        </v-col>

        <v-data-table :headers="headers" :items="loads" class="table-background elevation-1">
          <template v-slot:[`item.reefer.plug_status`]="{ item }">
            <v-icon v-if="item.reefer.plug_status === 'plugged'" color="green" size="x-large">mdi-power-plug</v-icon>
            <v-icon v-else-if="item.reefer.plug_status === 'unplugged'" color="red"  size="x-large">mdi-close</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'VesselTable',
  data() {
    return {
      vessels: [],
      filter: {
        block: '',
        bay: '',
        row: '',
      },
      headers: [
        { title: 'Ctr ID', value: 'reefer.ctr_id' },
        { title: 'ISO', value: 'reefer.ISO' },
        { title: 'LOP', value: 'reefer.LOP' },
        { title: 'Current LOC', value: 'reefer.current_LOC' },
        { title: 'TEMP', value: 'reefer.temperature' },
        { title: 'Vessel plan position', value: 'plan_position' },
        { title: 'Estimated load time', value: 'estimated_time' },
        { title: 'Plug status', value: 'reefer.plug_status' },
      ],
      loads: [],
    };
  },
  computed: {
    ...mapGetters(['getLoads']),
    filteredVessels() {
      return this.vessels.filter(vessel => {
        return (
          (!this.filter.block || vessel.block.includes(this.filter.block)) &&
          (!this.filter.bay || vessel.bay.includes(this.filter.bay)) &&
          (!this.filter.row || vessel.row.includes(this.filter.row))
        );
      });
    },
  },
  mounted() {
    this.fetchLoads();
  },
  methods: {
    ...mapActions(['fetchload']),
    applyFilter() {
      this.$refs.form.validate();
    },
    fetchLoads() {
      this.loads = this.getLoads;
      console.log(this.loads);
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
}

.v-card {
  background-color: #E3FEF7;
  color: #003C43;
  padding: 0px;
  width: 100%;
}

.table-background {
  background-color: #E3FEF7 !important;
  color: #003C43 !important;
}

.v-toolbar {
  text-align: center;
  background-color: #135D66;
  border-radius: 8px;
}

.v-toolbar-title {
  color: #E3FEF7;
}
.button {
  background-color: #77B0AA !important;
  color: #E3FEF7 !important;
}
.col {
  display: flex;
  justify-content: right;
}
</style>
