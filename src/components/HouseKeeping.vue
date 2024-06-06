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
                <v-btn class="addButton" @click="addHKDialog"
                    v-if="activeUser && activeUser.fonction && activeUser.fonction.name === 'FONC1'">
                    <v-icon>mdi-plus</v-icon>Add HouseKeeping
                </v-btn>
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


            <v-data-table :headers="headers" :items="filteredHouseKeepings" class="table-background elevation-1">
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
                            <template
                                v-else-if="header.value === 'actions' && activeUser && activeUser.fonction && activeUser.fonction.name === 'FONC1'">
                                <v-btn outlined color="primary" @click="editHouseKeepingDialog(item)">
                                    <v-icon left>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn outlined color="error" @click="confirmDelete(item)">
                                    <v-icon left>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <template v-else>
                                {{ getItemValue(item, header.value) }}
                            </template>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <v-btn class="uploadButton" @click="triggerFileUpload">
                <v-icon>mdi-upload</v-icon>Upload HouseKeepings
            </v-btn>
            <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload">

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
        <v-dialog v-model="firstTierDialogH" max-width="500">
            <v-card class="confirmation">
                <v-card-title>Report an issue</v-card-title>
                <v-card-text>
                    Do you want to move it to the first tier?
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="sendMail()">Yes</v-btn>
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

                <v-select label="Reefer ID" prepend-inner-icon="mdi-contain" :items="reefers" v-model="reefer_id"
                    item-title="id" item-value="id"></v-select>

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

                <v-select label="Reefer ID" prepend-inner-icon="mdi-contain" :items="reefers" v-model="reefer_id"
                    item-title="id" item-value="id"></v-select>

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
import * as XLSX from 'xlsx';

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
                activeUser: null

            },
            headers: [
                { title: 'Reefer ID', value: 'reefer.id' },
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
            firstTierDialogH: false,
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
            houseKeeping_time: '',
            filteredHouseKeepings: [],
            filterClicked: false,
            currentIssue: null,


        };
    },
    computed: {
        ...mapGetters(['getHouseKeeping', 'getIssueTypes', 'getReefers', 'getCurrentUser',]),
    },
    mounted() {
        this.fetchHouseKeepingsMethod();
        this.fetchIssueTypesMethod();
        this.fetchReefersMethod();
        this.getActiveUser();
        this.getHeaders();
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
            'updateHouseKeeping',
            'addActionHistoryHouseKeeping',
            'firstTierIssue',
            'houseKeepingMail'
        ]),
        applyFilter() {
            const { block, bay, row } = this.filter;

            this.filteredHouseKeepings = this.houseKeepings.filter((houseKeeping) => {
                const currentLoc = houseKeeping.reefer.current_LOC;
                const blockMatch = block ? currentLoc.includes(`B${block}`) : true;
                const bayMatch = bay ? currentLoc.includes(`b${bay}`) : true;
                const rowMatch = row ? currentLoc.includes(`R${row}`) : true;

                return blockMatch && bayMatch && rowMatch;
            });
        },
        filterClick() {
            this.filterClicked = this.filterClicked ? false : true;
        },
        fetchHouseKeepingsMethod() {
            this.fetchHouseKeeping()
                .then(() => {
                    this.houseKeepings = this.getHouseKeeping;
                    this.filteredHouseKeepings = this.houseKeepings;
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
                this.currentIssue = issue;
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
            this.addHouseKeeping(this.houseKeeping)
                .then((response) => {
                    console.log(response);
                    this.data = {
                        reefer_id: this.reefer_id,
                        user_id: this.activeUser.id,
                        housekeeping_id: response.id,
                        type: 'Add HouseKeeping',
                        plan_position: response.plan_position,
                        HK_time: response.HK_time,
                        action: 'added'

                    }
                    this.houseKeepingMail(this.data).then(() => {
                        console.log('Email sent');
                    })
                    this.addActionHistoryHouseKeeping(this.data).then(() => {
                        console.log('Action history added');

                    })
                    this.addDialog = false;
                    this.fetchHouseKeepingsMethod();
                });
        },
        editHouseKeepingDialog(item) {
            this.id = item.id;
            this.reefer_id = item.reefer_id;
            this.plan_position = item.plan_position;
            try { this.houseKeeping_date = item.HK_time.split(' ')[0]; } catch (e) { console.log(e) }
            try { this.houseKeeping_time = item.HK_time.split(' ')[1]; } catch (e) { console.log(e) }
            this.editDialog = true;
        },
        editHouseKeeping() {
            this.houseKeeping = {
                id: this.id,
                reefer_id: this.reefer_id,
                plan_position: this.plan_position,
                HK_time: this.houseKeeping_date + ' ' + this.houseKeeping_time
            };

            if (this.houseKeeping) {
                this.updateHouseKeeping(this.houseKeeping)
                    .then((response) => {
                        if (response) {
                        this.data = {
                            reefer_id: this.reefer_id,
                            user_id: this.activeUser.id,
                            housekeeping_id: response.id,
                            type: 'Update HouseKeeping',
                            plan_position: response.plan_position,
                            HK_time: response.HK_time,
                            action: 'updated'
                        }
                        this.houseKeepingMail(this.data).then(() => {
                            console.log('Email sent');
                        })
                        this.addActionHistoryHouseKeeping(this.data).then(() => {
                            console.log('Action history added');

                        })
                    }
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
                console.log(this.houseKeeping);
                this.deleteHouseKeeping(this.houseKeeping)
                    .then((response) => {
                        if (response) {
                            this.data = {
                                reefer_id: response.reefer_id,
                                plan_position: response.plan_position,
                                HK_time: response.HK_time,
                                action: 'updated'
                            }
                            this.houseKeepingMail(this.data).then(() => {
                                console.log('Email sent');
                            })
                        }
                        this.firstTierDialogD = false;
                        this.fetchHouseKeepingsMethod();
                        this.deleteDialog = false;
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
            this.firstTierDialogH = false;
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
        },
        getActiveUser() {
            this.activeUser = this.getCurrentUser;
        },
        getHeaders() {
            if (this.activeUser && this.activeUser.fonction && this.activeUser.fonction.name !== 'FONC1') {
                this.headers.pop()
            }
        },
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    this.processExcelData(jsonData);
                };
                reader.readAsArrayBuffer(file);
            }
        },

        convertExcelDate(excelSerialDate) {
            const excelBaseDate = new Date(Date.UTC(1899, 11, 30)); // Excel's base date
            const jsDate = new Date(excelBaseDate.getTime() + excelSerialDate * 86400000); // 86400000 ms per day
            return jsDate;
        },

        formatDateTime(date) {
            const pad = (num) => num.toString().padStart(2, '0');
            const yyyy = date.getUTCFullYear();
            const mm = pad(date.getUTCMonth() + 1);
            const dd = pad(date.getUTCDate());
            const hh = pad(date.getUTCHours());
            const min = pad(date.getUTCMinutes());
            const ss = pad(date.getUTCSeconds());
            return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
        },

        processExcelData(data) {
            const houseKeepings = data.slice(1).map(row => {
                const datePart = this.convertExcelDate(row[2]);
                const timePart = this.convertExcelDate(row[3]);
                const formattedDate = this.formatDateTime(datePart);
                const formattedTime = this.formatDateTime(timePart).split(' ')[1]; // Extract only the time part

                return {
                    reefer_id: row[0],
                    plan_position: row[1],
                    HK_time: `${formattedDate.split(' ')[0]} ${formattedTime}`
                };
            });

            houseKeepings.forEach(houseKeeping => {
                console.log(houseKeeping);
                this.addHouseKeeping(houseKeeping)
                    .then(response => {
                        const actionData = {
                            reefer_id: houseKeeping.reefer_id,
                            user_id: this.activeUser.id,
                            housekeeping_id: response.id,
                            type: 'Add HouseKeeping'
                        };
                        this.addActionHistoryHouseKeeping(actionData).then(() => {
                            console.log('Action history added');
                        });
                    })
                    .catch(error => {
                        console.error('Error adding housekeeping:', error);
                    });
            });

            this.fetchHouseKeepingsMethod();
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

.uploadButton {
    background-color: #77B0AA !important;
    color: #E3FEF7 !important;
    margin-top: 10px;

}
</style>
