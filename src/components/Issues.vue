<template>
    <div class="background">
        <v-card class="pa-4">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>Reefers Issues List</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>

            <v-col class="col" cols="12">
                <v-btn class="filterButton" @click="filterClick"><v-icon>mdi-filter</v-icon>Filter</v-btn>
            </v-col>
            <v-col class="col" cols="12" v-if="filterClicked">
                <v-text-field v-model="filter.block" label="Block" class="filterInput mr-2"
                    @input="applyFilter"></v-text-field>
                <v-text-field v-model="filter.bay" label="Bay" class="filterInput mr-2"
                    @input="applyFilter"></v-text-field>
                <v-text-field v-model="filter.row" label="Row" class="filterInput mr-2"
                    @input="applyFilter"></v-text-field>
            </v-col>

            <v-data-table :headers="headers" :items="filteredIssues" class="table-background elevation-1">
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
                    Do you want to change the plug status of this reefer or report the issue as fixed?
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="changeStatusMethod">Yes</v-btn>
                    <v-btn @click="closeDialog">No</v-btn>
                    <v-btn @click="openIssueDialog">Issue fixed</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="issueDialog" max-width="500">
            <v-card class="confirmation">
                <v-card-title>Confirm Fixing The Issue</v-card-title>
                <v-card-text>
                    Are you sure this issue is fixed ?
                    <p></p>
                    This action will delete the issue from the list.
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="deleteIssueMethod">Yes</v-btn>
                    <v-btn color="grey" text @click="closeIssueDialog">No</v-btn>
                </v-card-actions>
            </v-card> </v-dialog>

    </div>
</template>

<script>
import discharge from '@/store/discharge';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'issues',
    data() {
        return {
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
                { title: 'Issue', value: 'type', },
                { title: 'Reported at', value: 'created_at', },
                { title: 'Plug status', value: 'reefer.plug_status', sortable: true },
            ],
            plugDialog: false,
            issueDialog: false,
            firstTierDialogGO: false,
            currentItem: null, // State for the current item to change status
            currentIssue: null,
            issues: [],
            user: this.$store.state.user,
            data: [],
            filteredIssues: [],
            filterClicked: false
        };
    },
    computed: {
        ...mapGetters(['getissues']),
    },
    mounted() {
        this.fetchIssueMethod();
    },
    methods: {
        ...mapActions(['fetchIssues',
            'changeStatus',
            'addActionHistory',
            'deleteIssue',
            'issueFixedMail']),
        applyFilter() {
            const { block, bay, row } = this.filter;

            this.filteredIssues = this.issues.filter((issue) => {
                const currentLoc = issue.reefer.current_LOC;
                const blockMatch = block ? currentLoc.includes(`B${block}`) : true;
                const bayMatch = bay ? currentLoc.includes(`b${bay}`) : true;
                const rowMatch = row ? currentLoc.includes(`R${row}`) : true;

                return blockMatch && bayMatch && rowMatch;
            });
        },
        filterClick() {
            this.filterClicked = this.filterClicked ? false : true;
        },
        fetchIssueMethod() {
            this.fetchIssues().then(() => {
                this.issues = this.getissues;
                this.filteredIssues = this.issues;
                this.sortIssues();
                console.log(this.issues);
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
    sortIssues() {
      const now = new Date();
      this.issues.sort((a, b) => {
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
                        this.fetchIssueMethod();
                    });
            }
        },
        deleteIssueMethod() {
            if (this.currentIssue) {
                this.deleteIssue(this.currentIssue)
                    .then(() => {
                        this.issueFixedMail(this.currentIssue);
                        this.issueDialog = false;
                        this.fetchIssueMethod();
                        console.log('Issue deleted');
                    })
            }
        },
        openStatusDialog(item) {
            this.currentIssue = item;
            this.plugDialog = true;
        },
        closeDialog() {
            this.plugDialog = false;
        },
        openIssueDialog() {
            this.issueDialog = true;
            this.closeDialog()
        },
        closeIssueDialog() {
            this.issueDialog = false;
        },
        closefirstTierDialogGO() {
            this.firstTierDialogGO = false;
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