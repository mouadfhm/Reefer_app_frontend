<template>
  <div class="background">
    <v-card class="pa-4">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>Reefers To Be Loaded List</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>

      <v-col class="col" cols="12">
        <v-btn class="filterButton" @click="applyFilter"><v-icon>mdi-filter</v-icon>Filter</v-btn>
      </v-col>

      <v-data-table :headers="headers" :items="loads" class="table-background elevation-1">
        <template v-slot:item="{ item, index }">
          <tr :class="getRowClass(item)">
            <td v-for="header in headers" :key="header.value">
              <template v-if="header.value === 'reefer.plug_status'">
                <v-icon v-if="item.reefer.plug_status === 'plugged'" color="green" size="x-large"
                  @click="openStatusDialog(item)">mdi-power-plug</v-icon>
                <v-icon v-else-if="item.reefer.plug_status === 'unplugged'" color="red" size="x-large"
                  @click="openStatusDialog(item)">mdi-close</v-icon>
              </template>
              <template v-else>
                {{ getItemValue(item, header.value) }}
              </template>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="plugDialog" max-width="500">
      <v-card class="confirmation">
        <v-card-title>Change Plug Status</v-card-title>
        <v-card-text>
          Do you want to change the status of this load or report an issue?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="changeStatusMethod">Yes</v-btn>
          <v-btn @click="closeDialog">No</v-btn>
          <v-btn @click="openIssueDialog">Repport an issue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="issueDialog" max-width="500">
      <v-card class="confirmation">
        <v-card-title>Report an issue</v-card-title>
        <v-card-text>
          What is the issue?
        </v-card-text>
        <v-card-actions>
          <div class="issuesDiv">
            <v-row class="issuesRow"  v-for="issue in issues" :key="issue.id" cols="12">
              <v-btn class="dialogButton" @click="reportIssueMethod(issue)">{{ issue.name }}</v-btn>
            </v-row>
          <v-btn class="dialogButton cancel" @click="closeIssueDialog">Cancel</v-btn>
          </div> 
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'load',
  data() {
    return {
      vessels: [],
      filter: {
        block: '',
        bay: '',
        row: '',
      },
      headers: [
        { title: 'Ctr ID', value: 'reefer.ctr_id', sortable: true },
        { title: 'ISO', value: 'reefer.ISO', sortable: true },
        { title: 'LOP', value: 'reefer.LOP', sortable: true },
        { title: 'Current LOC', value: 'reefer.current_LOC', sortable: true },
        { title: 'TEMP', value: 'reefer.temperature', sortable: true },
        { title: 'Vessel plan position', value: 'plan_position', sortable: true },
        { title: 'Estimated load time', value: 'estimated_time', sortable: true },
        { title: 'Plug status', value: 'reefer.plug_status', sortable: true },
      ],
      loads: [],
      plugDialog: false,
      issueDialog: false,
      currentItem: null, // State for the current item to change status
      issues: [],
      user:this.$store.state.user,
      data:[]
    };
  },
  computed: {
    ...mapGetters(['getLoads', 'getIssueTypes']),
    filteredVessels() {
      return this.vessels.filter((vessel) => {
        return (
          (!this.filter.block || vessel.block.includes(this.filter.block)) &&
          (!this.filter.bay || vessel.bay.includes(this.filter.bay)) &&
          (!this.filter.row || vessel.row.includes(this.filter.row))
        );
      });
    },
  },
  mounted() {
    this.fetchLoadsMethod();
    this.fetchIssueTypesMethod();
  },
  methods: {
    ...mapActions(['fetchload', 'changeStatus','fetchIssueTypes','addActionHistory']),
    applyFilter() {
      this.$refs.form.validate();
    },
    fetchLoadsMethod() {
      this.fetchload({vessel_id:this.$store.state.vessel.selectedVessel.id}).then(() => {
        this.loads=this.getLoads;
        console.log(this.loads);
    })
    .catch((error) => {
      console.error(error);
    });
    },
    fetchIssueTypesMethod() {
      this.fetchIssueTypes().then(() => {
        this.issues = this.getIssueTypes;
      })
      .catch((error) => {
        console.error(error);
      });
    },
    getRowClass(item) {
      if (item.reefer.action_history && item.reefer.action_history[0]) {
        const createdAt = new Date(item.reefer.action_history[0].created_at);
        const now = new Date();
        const diffHours = (now - createdAt) / 36e5;
        if (diffHours > 2 && item.reefer.plug_status === 'unplugged') {
          return 'red-background';
        }
      }
      return '';
    },
    getItemValue(item, value) {
      const keys = value.split('.');
      return keys.reduce((acc, key) => (acc ? acc[key] : ''), item);
    },
    changeStatusMethod() {
      if (this.currentItem) {
        this.changeStatus(this.currentItem)
        .then(() => {
          if(this.user.currentUser){
            const data = {
                user_id: this.$store.state.user.currentUser.id,
                reefer_id: this.currentItem.id,
              };
            this.addActionHistory(data).then(() => {
              console.log('Action history added');
          })

          }
          console.log(this.currentItem.plug_status);
          this.plugDialog = false;
          this.fetchLoadsMethod();
        });
      }
    },
    openStatusDialog(item) {
      this.currentItem = item.reefer;
      this.plugDialog = true;
      console.log('Opening status dialog for', this.currentItem);
    },
    closeDialog() {
      this.plugDialog = false;
      console.log('Closing dialog');
    },
    openIssueDialog() {
      this.issueDialog = true;
      this.closeDialog()
    },
    closeIssueDialog() {
      this.issueDialog = false;
    }
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
  padding: 5%;
}

.v-card {
  background-color: #E3FEF7;
  color: #003C43;
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

.red-background {
  background-color: rgb(255, 107, 107) !important;
}
.dialogButton {
  background-color: #77B0AA !important;
  color: #E3FEF7 !important;
  border-radius: 8px !important;
  width: 100% !important;
  margin: 7px ;
}
.cancel {
  margin-top: 20px !important;
}
.issuesDiv {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  margin: auto;
  padding: 20px 0px 20px 0px;
  width: fit-content;
}
.issuesRow {
  display: flex !important;
  flex-direction: row !important;
  justify-content: center !important;
  width: 100%;
}
</style>
