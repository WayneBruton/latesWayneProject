<template>
  <v-row justify="center">
    <div v-if="this.$store.state.usersAvailable > 0">
      <v-dialog v-model="dialog" persistent scrollable max-width="800px">
        <template v-slot:activator="{ on }">
          <v-btn rounded color="#010a43" dark v-on="on" @click="uploadData"
            >Create</v-btn
          >
        </template>
        <v-card max-width="90%" max-height="525">
          <v-card-title>
            <span class="headline">Employee Details</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" xs="12" sm="6" md="6">
                  <v-text-field
                    label="First name*"
                    v-model="fname"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6">
                  <v-text-field
                    label="Last name*"
                    v-model="lname"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6">
                  <v-text-field
                    type="email"
                    label="Email*"
                    v-model="userEmail"
                    required
                    @blur="checkUserEmail"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6">
                  <v-text-field
                    label="Job Title*"
                    v-model="jobTitle"
                    required
                    @blur="checkUserEmail"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="9" md="9">
                  <v-checkbox
                    v-model="isAdministrator"
                    :label="
                      `Create as Administrator: ${isAdministrator.toString()}`
                    "
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" xs="12" sm="9" md="9">
                  <v-autocomplete
                    :items="typesOfStaff"
                    label="Staff Type"
                    v-model="staffAffected"
                    item-text="staff_description"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->
            <v-btn color="#010a43" text @click="dialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#010a43" text @click="createUser">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-else>
      <v-dialog v-model="dialog2" persistent max-width="800px">
        <template v-slot:activator="{ on }">
          <v-btn rounded color="red" dark v-on="on">Subscribe</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Maximum Users Created</span>
          </v-card-title>
          <v-card-text>
            <span
              >You have reached the maximum number of users for your
              package.</span
            >
          </v-card-text>
          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->
            <v-btn color="#010a43" text @click="dialog2 = false">Later</v-btn>
            <!-- <v-btn color="#010a43" text @click="dialog2 = false">Okay</v-btn> -->
            <v-spacer></v-spacer>
            <v-btn color="#010a43" text @click="upgrade">Upgrade</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
// import Password from "vue-password-strength-meter";
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "CreateEmployee",
  data() {
    return {
      dialog: false,
      dialog2: false,
      timeOut: 2000,
      value: String,
      snackbar: false,
      snackBarMessage: "Hello, I'm a snackbar",
      fname: "",
      lname: "",
      userEmail: "",
      isAdministrator: false,
      jobTitle: "",
      organisationName: "",
      organisationID: 0,
      typesOfStaff: [],
      staffAffected: []
    };
  },
  components: {},
  methods: {
    upgrade() {
      this.$router.push({ name: "pricing" });
      this.dialog2 = false;
    },
    async checkUserEmail() {
      try {
        if (this.userEmail == null || this.userEmail == "") {
          this.snackBarMessage = "Please Enter Email";
          return (this.snackbar = true);
        }
        let credentials = {
          email: this.userEmail
        };

        let response = await DirectoryService.checkUserEmail(credentials);
        // console.log("RESPONSE", response.data);
        if (response.data.length) {
          this.snackBarMessage = "This email already exists!";
          this.userEmail = "";
          this.snackbar = true;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(31), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    async createUser() {
      try {
        if (
          this.fname === "" ||
          this.lname === "" ||
          this.userEmail === "" ||
          this.jobTitle === "" ||
          this.staffAffected.length === 0
        ) {
          this.snackBarMessage = "All fields must be filled in";
          return (this.snackbar = true);
        } else {
          let userType;
          if (this.isAdministrator) {
            userType = 1;
          } else {
            userType = 2;
          }
          let staffTypeID = this.typesOfStaff.filter(el => {
            return this.staffAffected === el.staff_description;
          });
          let staffType = parseInt(staffTypeID[0].id);
          let credentials = {
            organisationName: this.organisationName,
            organisationID: this.organisationID,
            fname: this.fname,
            lname: this.lname,
            emailUser: this.userEmail,
            password: "#",
            userType: userType,
            staffType: staffType,
            jobTitle: this.jobTitle
          };
          this.dialog = false;
          let response = await DirectoryService.createUser(credentials);
          let details = response.data;
          // console.log(response);
          if (details) {
            this.$emit("employeeSuccess");
            this.snackBarMessage = "Employee successfully created";
            this.snackbar = true;
            this.getCurrentUsage();
          } else if (details === null) {
            this.snackBarMessage = "Duplicate user email address";
            this.snackbar = true;
          } else {
            this.snackBarMessage =
              "There was a network problem, please try again later";
            this.snackbar = true;
          }
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(32), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    async uploadData() {
      try {
        this.scrollToTop();
        // console.log(this.$store.state.usersAvailable)
        this.organisationName = this.$store.state.organisationName;
        this.organisationID = this.$store.state.organisationID;
        let details = {
          organisationName: this.organisationName,
          id: this.organisationID
        };

        // console.log("the details", details);
        let response = await DirectoryService.staffTypes(details);
        // console.log("staff types", response.data);
        let typesOfStaff = response.data.filter(el => {
          return el.staff_description !== "All Staff";
        });
        this.typesOfStaff = typesOfStaff;
      } catch (error) {
        this.snackBarMessage = "Network Error(33), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    }
  },
  mounted() {}
};
</script>

<style>
.country {
  width: 250px;
  border: 1px solid grey;
  padding-left: 4px;
}
.countriesDiv {
  display: flex;
  flex-direction: column;
}
.pword {
  width: 100%;
}
</style>
