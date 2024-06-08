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
        <v-btn class="filterButton" @click="filterClick"><v-icon>mdi-filter</v-icon>Filter</v-btn>
      </v-col>
      <v-col class="col" cols="12" v-if="filterClicked">
        <v-text-field v-model="filter.block" label="Block" class="filterInput mr-2" @input="applyFilter"></v-text-field>
        <v-text-field v-model="filter.bay" label="Bay" class="filterInput mr-2" @input="applyFilter"></v-text-field>
        <v-text-field v-model="filter.row" label="Row" class="filterInput mr-2" @input="applyFilter"></v-text-field>
      </v-col>

      <v-data-table :headers="headers" :items="filteredLoads" class="table-background elevation-1">
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
          Do you want to change the plug status of this reefer or report an issue?
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
            <v-row class="issuesRow" v-for="issue in issues" :key="issue.id" cols="12">
              <v-btn class="dialogButton" @click="reportIssueMethod(issue)">{{ issue.name }}</v-btn>
            </v-row>
            <v-btn class="dialogButton cancel" @click="closeIssueDialog">Cancel</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="firstTierDialogL" max-width="500">
      <v-card class="confirmation">
        <v-card-title>Report an issue</v-card-title>
        <v-card-text>
          Do you want to move it to the first tier?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="sendMail()">Yes</v-btn>
          <v-btn @click="closefirstTierDialogL">No</v-btn>
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
        { title: 'Reefer ID', value: 'reefer.id' },
        { title: 'Ctr ID', value: 'reefer.ctr_id', },
        { title: 'ISO', value: 'reefer.ISO', },
        { title: 'LOP', value: 'reefer.LOP', },
        { title: 'Current LOC', value: 'reefer.current_LOC', },
        { title: 'TEMP', value: 'reefer.temperature', },
        { title: 'Vessel plan position', value: 'plan_position', },
        { title: 'Estimated load time', value: 'estimated_time', },
        { title: 'Plug status', value: 'reefer.plug_status', sortable: true },
      ],
      loads: [],
      plugDialog: false,
      issueDialog: false,
      firstTierDialogL: false,
      currentItem: null, // State for the current item to change status
      currentIssue: null,
      issues: [],
      user: this.$store.state.user,
      data: [],
      filteredLoads: [],
      filterClicked: false
    };
  },
  computed: {
    ...mapGetters(['getLoads', 'getIssueTypes']),
  },
  mounted() {
    this.fetchLoadsMethod();
    this.fetchIssueTypesMethod();
  },
  methods: {
    ...mapActions(['fetchload',
      'changeStatus',
      'fetchIssueTypes',
      'addActionHistory',
      'repportIssue',
      'firstTierIssue']),
    applyFilter() {
      const { block, bay, row } = this.filter;

      this.filteredLoads = this.loads.filter((load) => {
        const currentLoc = load.reefer.current_LOC;
        const blockMatch = block ? currentLoc.includes(`B${block}`) : true;
        const bayMatch = bay ? currentLoc.includes(`b${bay}`) : true;
        const rowMatch = row ? currentLoc.includes(`R${row}`) : true;

        return blockMatch && bayMatch && rowMatch;
      });
    },
    filterClick() {
      this.filterClicked = this.filterClicked ? false : true;
    },
    fetchLoadsMethod() {
      this.fetchload({ vessel_id: this.$store.state.vessel.selectedVessel.id })
        .then(() => {
          this.loads = this.getLoads;
          this.filteredLoads = this.loads; // Initialize filteredLoads with all loads
          this.sortLoads();
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
      const { action_history, plug_status } = item.reefer;
      const unpluggedAction = action_history.find(action => action.type === 'unplug');

      if (unpluggedAction) {
        const createdAt = new Date(unpluggedAction.created_at);
        const now = new Date();
        const diffHours = (now - createdAt) / 36e5;

        if (diffHours > 2 && plug_status === 'unplugged') {
          return 'red-background';
        }
      }
      return '';
    },
    sortLoads() {
      const now = new Date();
      this.loads.sort((a, b) => {
        const aCreatedAt = new Date(a.reefer.action_history[0]?.created_at || 0);
        const bCreatedAt = new Date(b.reefer.action_history[0]?.created_at || 0);
        const aDiffHours = (now - aCreatedAt) / 36e5;
        const bDiffHours = (now - bCreatedAt) / 36e5;

        const aCondition = a.reefer.plug_status === 'unplugged' && aDiffHours > 4;
        const bCondition = b.reefer.plug_status === 'unplugged' && bDiffHours > 4;
        if (aCondition && !bCondition) return -1;
        if (!aCondition && bCondition) return 1;
        return 0;
      });
    },
    getItemValue(item, value) {
      const keys = value.split('.');
      return keys.reduce((acc, key) => (acc ? acc[key] : ''), item);
    },
    changeStatusMethod() {
      if (this.currentItem) {
        this.changeStatus(this.currentItem)
          .then(() => {
            if (this.user.currentUser) {
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
    reportIssueMethod(issue) {
      if (this.currentItem) {
        this.currentIssue = issue;
        this.data = {
          reefer_id: this.currentItem.id,
          type: issue.name
        }
        console.log(this.data);
        this.repportIssue(this.data)
          .then(() => {
            this.issueDialog = false;
            this.firstTierDialogL = true;
            this.fetchLoadsMethod();
            console.log('Issue reported');
          });
      }
    },
    sendMail() {
      this.data = {
        reefer_id: this.currentItem.id,
        type: this.currentIssue.name
      }
      this.firstTierIssue(this.data).then(() => {
        console.log('Mail sent');
      })
      this.firstTierDialogL = false;
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
    },
    closeFirstTierDialogL() {
      this.firstTierDialogL = false;
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

.filterButton {
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
  margin: 7px;
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
