<template>
  <div class="div">

    <v-card class="pa-4">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>Users List</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>
      <!-- Users table -->
      <v-col class="col" cols="12">
        <v-btn class="addButton" @click="addUser"><v-icon>mdi-plus</v-icon>Add User</v-btn>
      </v-col>

      <v-data-table :headers="headers" :items="users" class="table-background">
        <template v-slot:item.actions="{ item }">
          <v-btn outlined color="primary" @click="editUser(item)">
            <v-icon left>mdi-pencil</v-icon>
          </v-btn>
          <v-btn outlined color="error" @click="confirmDeleteUser(item)">
            <v-icon left>mdi-delete</v-icon>
          </v-btn>
          <v-btn outlined color="info" @click="passwordReset(item)">
            <v-icon left>mdi-lock</v-icon>
          </v-btn>

        </template>

      </v-data-table>


      <!-- Snackbar for user deletion success -->
      <v-snackbar v-model="snackbar1" color="success" timeout="3000">
        User deleted successfully!
      </v-snackbar>
      <v-snackbar v-model="snackbar2" color="success" timeout="3000">
        Password reset successfully!
      </v-snackbar>
    </v-card>

    <!-- Dialog for confirmation before deleting user -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="confirmation">
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this user?
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="deleteUserConfirmed">Yes</v-btn>
          <v-btn color="grey" text @click="closeDialog">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="500">
      <v-card class="edit mx-auto pa-12 pb-10" elevation="8" max-width="448" rounded="lg">
        <div class="text-h6 mb-6">Modify User</div>

        <v-text-field dense label="Matricule" prepend-inner-icon="mdi-account-outline"
          v-model="userToEdit.matricule"></v-text-field>

        <v-text-field dense label="Email" prepend-inner-icon="mdi-email-outline"
          v-model="userToEdit.email"></v-text-field>

        <v-text-field dense label="First Name" prepend-inner-icon="mdi-account-outline"
          v-model="userToEdit.firstname"></v-text-field>

        <v-text-field dense label="Last Name" prepend-inner-icon="mdi-account-outline"
          v-model="userToEdit.lastname"></v-text-field>

        <v-select dense label="Fonction" prepend-inner-icon="mdi-account-hard-hat-outline" :items="fonctions"
          v-model="userToEdit.fonction_id" item-title="name" item-value="id"></v-select>

        <v-btn class="mt-2" color="#77B0AA" block @click="handleModification">
          Update User
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'Users',
  data() {
    return {
      users: [],
      snackbar1: false,
      snackbar2: false,
      dialog: false,
      userToDelete: null,
      editDialog: false,
      userToEdit: null,
      headers: [
        { title: 'Matricule', value: 'matricule', sortable: true },
        { title: 'Name', value: 'name', sortable: true },
        { title: 'Email', value: 'email', sortable: true },
        { title: 'Role', value: 'role', sortable: true },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser", "getUsers", "getFonctions"]),
  },
  mounted() {
    this.fetchUsersMethod();
    this.fetchFonctionsMethod();
  },
  methods: {
    ...mapActions([
      "updateAction",
      "fetchUsers",
      "deleteAction",
      "passwordResetAction",
      "fetchFonctions",
    ]),
    fetchUsersMethod() {
      const currentUser = this.getCurrentUser;
      console.log('Current user:', currentUser);
      this.fetchUsers()
        .then(() => {
          this.users = this.getUsers.map(user => ({
            ...user,
            name: `${user.firstname} ${user.lastname}`,
            role: user.fonction.name,
          }));
          this.users = this.users.filter(user => user.id !== currentUser.id);
        })

        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },
    fetchFonctionsMethod() {
      this.fetchFonctions()
        .then(() => {
          this.fonctions = this.getFonctions;
        })
        .catch(error => {
          console.error('Error fetching fonctions:', error);
        });
    },
    confirmDeleteUser(user) {
      this.userToDelete = user;
      this.dialog = true; // Show deletion confirmation dialog
    },
    deleteUserConfirmed() {
      if (this.userToDelete) {
        this.deleteAction(this.userToDelete)
          .then(() => {
            this.snackbar1 = true; // Show success message
            this.users = this.users.filter(u => u.id !== this.userToDelete.id);
            console.log('User deleted:', this.userToDelete);
            this.userToDelete = null;
            this.fetchUsersMethod();
          })
          .catch(error => {
            console.error('Error deleting user:', error);
          });
        this.dialog = false; // Close deletion confirmation dialog
      }
    },
    closeDialog() {
      this.dialog = false; // Close deletion confirmation dialog
    },
    passwordReset(user) {
      this.passwordResetAction(user)
        .then(() => {
          this.snackbar2 = true; // Show success message
          console.log('Password reset for user:', user);
          this.fetchUsersMethod();
        })
        .catch(error => {
          console.error('Error resetting password:', error);
        })
    },
    editUser(user) {
      this.editDialog = true;
      this.userToEdit = {
        id: user.id,
        matricule: user.matricule,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        fonction_id: user.fonction_id
      }

    },
    handleModification() {
      this.editDialog = false;
      this.updateAction(this.userToEdit).then(() => {
        this.fetchUsersMethod();
      })
    },
    addUser() {
      this.$router.push('users/create');
    }
  },
};
</script>

<style>
.v-card {
  background-color: #E3FEF7;
  width: 100%;
}

.v-btn {
  margin-right: 8px;
  border-radius: 28px !important;
}

.div {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #003C43;
  padding: 5%;

}

.table-background {
  background-color: #E3FEF7 !important;
  color: #003C43 !important;

}

.confirmation {
  color: #E3FEF7 !important;
  background-color: #135D66 !important;

}


.edit {
  background-color: #135D66;
  color: #E3FEF7;
  border-radius: 8px;
  margin-bottom: 0px;
  width: 100%;
}

.v-toolbar {
  text-align: center;
  background-color: #135D66;
  border-radius: 8px;
}

.v-toolbar-title {
  color: #E3FEF7;
}
.addButton {
  background-color: #77B0AA !important;
  color: #E3FEF7 !important;
}

</style>
