<template>
    <div class="background">
        <v-card class="pa-4">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>Reefers For Housekeeping List</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>

            <v-col class="col" cols="12">
                <v-btn class="addButton" @click="addHKDialog">
                    <v-icon>mdi-plus</v-icon>Add HouseKeeping
                </v-btn>
                <v-btn class="filterButton" @click="applyFilter">
                    <v-icon>mdi-filter</v-icon>Filter
                </v-btn>
            </v-col>

            <v-data-table :headers="headers" :items="houseKeepings" class="table-background elevation-1">
                <template v-slot:[`column.header`]="{ column }">
                    <span :class="[column.sortable ? 'sortable' : '']">
                        {{ column.text }}
                        <v-icon v-if="column.sortable" class="sortable-icon">mdi-sort</v-icon>
                    </span>
                </template>
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
                        <td class="actions">
                            <v-btn outlined color="primary" @click="editHouseKeepingDialog(item)">
                                <v-icon left>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn outlined color="error" @click="confirmDelete(item)">
                                <v-icon left>mdi-delete</v-icon>
                            </v-btn>
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
                    <v-btn @click="openIssueDialog">Report an issue</v-btn>
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
        <v-dialog v-model="firstTierDialogD" max-width="500">
            <v-card class="confirmation">
                <v-card-title>Report an issue</v-card-title>
                <v-card-text>
                    Do you want to move it to the first tier?
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="sendMail">Yes</v-btn>
                    <v-btn @click="closefirstTierDialogD">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" max-width="500">
            <v-card class="confirmation">
                <v-card-title>Confirm Deletion</v-card-title>
                <v-card-text>
                    Are you sure you want to delete this HouseKeeping?
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="deleteHKConfirmed">Yes</v-btn>
                    <v-btn color="grey" text @click="closeDelDialog">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addDialog" max-width="500">
            <v-card class="add mx-auto pa-12 pb-10" elevation="8" max-width="448" rounded="lg">
                <div class="text-h6 mb-6">Add HouseKeeping</div>

                <v-select label="Reefer ID" prepend-inner-icon="mdi-contain" :items="reefers"
                    v-model="reefer_id" item-title="id" item-value="id"></v-select>

                <v-text-field dense label="Plan Position" prepend-inner-icon="mdi-map-marker-outline"
                    v-model="plan_position"></v-text-field>

                <v-text-field type="date" dense label="HouseKeeping Date" prepend-inner-icon="mdi-calendar-range"
                    v-model="houseKeeping_date"></v-text-field>

                <v-text-field type="time" dense label="HouseKeeping Time"
                    prepend-inner-icon="mdi-clock-time-eight-outline" v-model="houseKeeping_time"></v-text-field>

                <v-btn class="mt-2" color="#77B0AA" block @click="addHouseKeepingMethod">
                    Add HouseKeeping
                </v-btn>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" max-width="500">
            <v-card class="add mx-auto pa-12 pb-10" elevation="8" max-width="448" rounded="lg">
                <div class="text-h6 mb-6">Update HouseKeeping</div>

                <v-select label="Reefer ID" prepend-inner-icon="mdi-contain" :items="reefers"
                    v-model="reefer_id" item-title="id" item-value="id"></v-select>

                <v-text-field dense label="Plan Position" prepend-inner-icon="mdi-map-marker-outline"
                    v-model="plan_position"></v-text-field>

                <v-text-field type="date" dense label="HouseKeeping Date" prepend-inner-icon="mdi-calendar-range"
                    v-model="houseKeeping_date"></v-text-field>

                <v-text-field type="time" dense label="HouseKeeping Time"
                    prepend-inner-icon="mdi-clock-time-eight-outline" v-model="houseKeeping_time"></v-text-field>

                <v-btn class="mt-2" color="#77B0AA" block @click="editHouseKeeping">
                    Update this HouseKeeping
                </v-btn>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'houseKeeping',
    data() {
        return {
            _ids: [],
            filter: {
                block: '',
                bay: '',
                row: '',
                id: '',
                reefer_id: '',
                plan_position: '',
                houseKeeping_time: '',
                houseKeeping_date: '',
            },
            headers: [
                { title: 'Ctr ID', value: 'reefer.ctr_id' },
                { title: 'ISO', value: 'reefer.ISO' },
                { title: 'LOP', value: 'reefer.LOP' },
                { title: 'Current LOC', value: 'reefer.current_LOC' },
                { title: 'TEMP', value: 'reefer.temperature' },
                { title: 'Plan position', value: 'plan_position' },
                { title: 'HouseKeeping time', value: 'HK_time' },
                { title: 'Plug status', value: 'reefer.plug_status', sortable: true, class: 'sortable-header' },
                { title: 'Actions', value: 'actions', sortable: false }
            ],
            houseKeepings: [],
            plugDialog: false,
            issueDialog: false,
            firstTierDialogD: false,
            deleteDialog: false,
            addDialog: false,
            editDialog: false,
            currentItem: null, // State for the current item to change status
            issues: [],
            user: this.$store.state.user,
            data: [],
            reefer_id: null,
            plan_position: '',
            houseKeeping_date: '',
            houseKeeping_time: ''
        };
    },
    computed: {
        ...mapGetters(['getHouseKeeping', 'getIssueTypes', 'getReefers']),
        filteredVessels() {
            return this.vessels.filter((vessel) => {
                return (
                    (!this.filter.block || vessel.block.includes(this.filter.block)) &&
                    (!this.filter.bay || vessel.bay.includes(this.filter.bay)) &&
                    (!this.filter.row || vessel.row.includes(this.filter.row))
                );
            });
        }
    },
    mounted() {
        this.fetchHouseKeepingsMethod();
        this.fetchIssueTypesMethod();
        this.fetchReefersMethod();
    },
    methods: {
        ...mapActions([
            'fetchHouseKeeping',
            'changeStatus',
            'fetchIssueTypes',
            'addActionHistory',
            'repportIssue',
            'deleteHouseKeeping',
            'addHouseKeeping',
            'fetchReefers',
            'updateHouseKeeping'
        ]),
        applyFilter() {
            this.$refs.form.validate();
        },
        fetchHouseKeepingsMethod() {
            this.fetchHouseKeeping()
                .then(() => {
                    this.houseKeepings = this.getHouseKeeping;
                    console.log(this.houseKeepings);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        fetchIssueTypesMethod() {
            this.fetchIssueTypes()
                .then(() => {
                    this.issues = this.getIssueTypes;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        fetchReefersMethod() {
            this.fetchReefers()
                .then(() => {
                    this.reefers = this.getReefers;
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
                        if (this.user.currentUser) {
                            const data = {
                                user_id: this.$store.state.user.currentUser.id,
                                reefer_id: this.currentItem.id
                            };
                            this.addActionHistory(data).then(() => {
                                console.log('Action history added');
                            });
                        }
                        this.plugDialog = false;
                        this.fetchHouseKeepingsMethod();
                    });
            }
        },
        reportIssueMethod(issue) {
            if (this.currentItem) {
                this.data = {
                    reefer_id: this.currentItem.id,
                    type: issue.name
                };
                this.repportIssue(this.data)
                    .then(() => {
                        this.issueDialog = false;
                        this.firstTierDialogD = true;
                        this.fetchHouseKeepingsMethod();
                    });
            }
        },
        addHouseKeepingMethod() {
            this.houseKeeping = {
                reefer_id: this.reefer_id,
                plan_position: this.plan_position,
                HK_time: this.houseKeeping_date + ' ' + this.houseKeeping_time + ':00'
            };
            console.log(this.houseKeeping);
            this.addHouseKeeping(this.houseKeeping)
                .then(() => {
                    this.addDialog = false;
                    this.fetchHouseKeepingsMethod();
                });
        },
        editHouseKeepingDialog(item) {
            this.id = item.id;
            this.reefer_id = item.reefer_id;
            this.plan_position = item.plan_position;
            try{this.houseKeeping_date = item.HK_time.split(' ')[0];}catch(e){console.log(e)}
            try{this.houseKeeping_time = item.HK_time.split(' ')[1];}catch(e){console.log(e)}
            this.editDialog = true;
        },
        editHouseKeeping() {
            this.houseKeeping = {
                id:this.id,
                reefer_id: this.reefer_id,
                plan_position: this.plan_position,
                HK_time: this.houseKeeping_date + ' ' + this.houseKeeping_time + ':00'
            };

            if (this.houseKeeping) {
                this.updateHouseKeeping(this.houseKeeping)
                    .then(() => {
                        this.editDialog = false;
                        this.fetchHouseKeepingsMethod();
                    });
            }
        },
        addHKDialog() {
            this.addDialog = true;
        },
        confirmDelete(item) {
            this.houseKeeping = item;
            this.deleteDialog = true;
        },
        deleteHKConfirmed() {
            if (this.houseKeeping) {
                this.deleteHouseKeeping(this.houseKeeping)
                    .then(() => {
                        this.firstTierDialogD = false;
                        this.fetchHouseKeepingsMethod();
                        this.deleteDialog = false;
                    });
            }
        },
        sendMail() {
            console.log('Sending email');
            this.firstTierDialogD = false;
        },
        openStatusDialog(item) {
            this.currentItem = item.reefer;
            this.plugDialog = true;
        },
        closeDialog() {
            this.plugDialog = false;
        },
        openIssueDialog() {
            this.issueDialog = true;
            this.closeDialog();
        },
        closeIssueDialog() {
            this.issueDialog = false;
        },
        closefirstTierDialogD() {
            this.firstTierDialogD = false;
        },
        closeDelDialog() {
            this.deleteDialog = false;
        }
    }
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
    align-items: center;
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

.v-text-field {
    color: #003C43;
}

.sortable-header {
    cursor: pointer;
}

.sortable-icon {
    margin-left: 5px;
}
</style>
