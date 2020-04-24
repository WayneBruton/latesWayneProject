<template>
  <div class="about temp">
    <br /><br /><br /><br /><br />
    <div style="display: flex; justify-content: center;">
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br />
    </div>
    <div style="display: flex; justify-content: center;">
      <h1>Settings</h1>
    </div>
    <br />
    <v-card class="mx-auto" max-width="800" tile>
      <v-toolbar color="#010a43" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Employee</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list rounded>
        <v-subheader>Add</v-subheader>
        <v-list-item-group v-model="item" color="#010a43">
          <v-list-item v-for="(item, i) in items2" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <v-list-item-action>
              <v-flex>
                <!-- <UploadDocument
                  v-if="item.text === 'Upload Documents'"
                  @EEDocsuccess="handleSuccess($event)"
                /> -->
                <!-- <div v-if="this.$store.state.usersAvailable"> -->
                <CreateEmployee
                  v-if="item.text === 'Add Employee'"
                  @employeeSuccess="handleSuccessEE"
                />
                <!-- </div> -->
              </v-flex>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <br /><br /><br />
    <v-expand-x-transition>
      <v-card class="mx-auto" max-width="800" tile v-if="items.length">
        <v-toolbar color="#010a43" dark height="90px">
          <v-spacer></v-spacer>
          <v-toolbar-title>Employees ({{ items.length }})</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="search"
          ></v-text-field>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="clearSearch">mdi-autorenew</v-icon>
            </template>
            <span>Clear Search</span>
          </v-tooltip>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list rounded>
          <v-subheader>EDIT</v-subheader>
          <v-list-item-group v-model="item" color="#010a43">
            <v-list-item v-for="(item, i) in itemsFiltered" :key="i">
              <v-list-item-icon>
                <v-icon
                  v-text="item.icon"
                  v-if="item.userType === 1"
                  style="color: red;"
                ></v-icon>
                <v-icon v-text="item.icon" v-else></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.lname + ' ' + item.fname"
                ></v-list-item-title>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-action>
                <v-flex>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        text
                        color="#010a43"
                        :id="item.id"
                        @click="edit($event)"
                        ><v-icon>mdi-account-edit</v-icon></v-btn
                      >
                    </template>
                    <span>Edit</span>
                  </v-tooltip>
                  <v-btn
                    text
                    :id="item.id"
                    v-if="item.canDelete === true"
                    @click="deleteItem($event)"
                    style="color: red; font-weight: bold;"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                  <v-btn
                    text
                    :id="item.id"
                    v-if="item.canDelete === false"
                    @click="dialog1 = true"
                    style="color: green; font-weight: bold;"
                    ><v-icon>mdi-help-box</v-icon></v-btn
                  >
                </v-flex>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-expand-x-transition>
    <br /><br /><br />

    <v-dialog v-model="dialog" scrollable persistent max-width="800px">
      <v-card max-width="90%" max-height="525px">
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
                  v-model="email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-flex row>
                  <!-- @onSelect="onSelect" -->
                  <vue-country-code
                    :preferredCountries="['za', 'us', 'gb']"
                    style="border-style: none; margin-right: 5px;"
                    v-model="dialingCode"
                  >
                  </vue-country-code>
                  <v-text-field
                    v-mask="'(###) ###-####'"
                    label="mobile*"
                    v-model="mobile"
                    required
                    @change="finaliseMobile"
                  ></v-text-field>
                </v-flex>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="JobTitle*"
                  v-model="jobTitle"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-autocomplete
                  :items="staffTypes"
                  label="Staff Type"
                  v-model="staffTypeChosen"
                  item-text="staff_description"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6" v-if="!hideCheckbox">
                <v-checkbox
                  v-model="checkbox"
                  :label="`Is Administrator: ${checkbox.toString()}`"
                  @change="checkAdmin"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <v-btn color="#010a43" text @click="cancelUpdate">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="updateStaffMember">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog1" persistent max-width="450">
      <v-card>
        <v-card-title class="headline"
          >Why can't I delete this user?</v-card-title
        >
        <v-card-text
          >This user is either an Administrator or has documents in her/his
          name(or both).</v-card-text
        >
        <v-card-text>First delete the documents.</v-card-text>
        <v-card-text
          >Ensure the user is no longer an administrator.</v-card-text
        >
        <v-card-text>Then delete the user.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="dialog1 = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="center">
      <v-dialog v-model="dialog2" persistent max-width="450">
        <v-card>
          <v-card-title class="headline">Delete Employee?</v-card-title>
          <v-card-text
            >Are you sure? This will permanently delete this
            Employee!</v-card-text
          >
          <v-card-actions>
            <v-btn color="#010a43" text @click="dialog2 = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#010a43" text @click="deleteItemFinal">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
import CreateEmployee from "../components//CreateEmployee";
export default {
  name: "editEmployees",
  metaInfo: {
    title: `PerfectStaff - Edit`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {
      dialog: false,
      dialog1: false,
      dialog2: false,
      timeOut: 2000,
      item: 0,

      items: [],
      items2: [
        {
          text: "Add Employee",
          icon: "mdi-account-plus",
          component: '<UploadDocument @success="handleSuccess" />'
        }
      ],
      staffTypeChosen: "",
      staffTypes: null,
      snackbar: false,
      snackBarMessage: "",
      organisationID: null,
      hideCheckbox: false,
      administatorsCount: 0,
      userID: null,
      email: "",
      lname: "",
      fname: "",
      userType: null,
      checkbox: false,
      staffType: null,
      jobTitle: "",
      search: "",
      mobile: null,
      dialingCode: 27,
      mobileNumber: null
    };
  },
  components: {
    CreateEmployee
  },
  computed: {
    itemsFiltered() {
      if (this.search === "") {
        return this.items;
      } else {
        return this.items.filter(employee => {
          return (
            !this.search ||
            employee.lname.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            employee.fname.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      }
    }
  },
  async mounted() {
    this.organisationID = this.$store.state.organisationID;
    this.refreshData();
  },
  methods: {
    finaliseMobile() {
      let str = parseInt(
        this.mobile
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "")
      );
      this.mobileNumber = "+" + this.dialingCode + str;
    },
    async refreshData() {
      try {
        let credentials = {
          id: this.organisationID
        };
        let response = await DirectoryService.getEmployeesToEdit(credentials);
        if (response.data.success === false) {
          this.snackBarMessage = "Session has expired, please log on again";
          this.snackbar = true;
          setTimeout(() => {
            this.$store.dispatch("logout");
            return this.$router.push({ name: "home" });
          }, 900);
        }
        if (response.data === false) {
          this.snackBarMessage =
            "Error with connection, please try again later.";
          return (this.snackbar = true);
        }
        response.data[0].forEach(el => {
          el.icon = "mdi-account-edit";
        });
        this.items = response.data[0];
        this.staffTypes = response.data[1].filter(el => {
          return el.staff_description != "All Staff";
        });
        let adminCount = this.items.reduce((total, amount) => {
          if (amount.userType === 1) {
            total += 1;
          }
          return total;
        }, 0);
        this.administatorsCount = adminCount;
        this.items.forEach(el => {
          let id = el.id;
          let filtered = response.data[2].filter(el2 => {
            return el2.users === id;
          });
          if (filtered.length) {
            el.canDelete = false;
          } else {
            el.canDelete = true;
          }
        });
        this.items.forEach(el => {
          if (el.userType == 1) {
            el.canDelete = false;
          }
        });
        this.getCurrentUsage();
      } catch (error) {
        this.snackBarMessage = "Network Error(36), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    clearSearch() {
      this.search = "";
    },
    handleSuccessEE() {
      this.refreshData();
      this.snackBarMessage = "Succesfully created!!";
      this.snackbar = true;
    },
    async edit(event) {
      try {
        this.scrollToTop();
        let targetID = event.currentTarget.id;
        // console.log("Staff ID", targetID);
        let credentials = {
          id: parseInt(targetID)
        };
        let response = await DirectoryService.getEmployeeToEdit(credentials);
        // console.log("EE to edit", response.data);
        this.email = response.data[0].email;
        this.lname = response.data[0].lname;
        this.fname = response.data[0].fname;
        this.mobileNumber = response.data[0].mobileNumber;
        this.userType = parseInt(response.data[0].userType);
        this.userID = parseInt(response.data[0].id);
        this.jobTitle = response.data[0].jobTitle;
        if (response.data[0].mobileNumber != null) {
          let numberStr = response.data[0].mobileNumber.replace("+", "");
          this.dialingCode = parseInt(numberStr.substring(0, 2));
          let len = numberStr.length;
          this.mobile = "0" + numberStr.substring(2, len);
        } else {
          this.dialingCode = 27;
          this.mobile = null;
        }
        let staffTypeChosen = this.staffTypes.filter(el => {
          return el.id == parseInt(response.data[0].staffType);
        });
        if (this.userType === 1) {
          this.checkbox = true;
        } else {
          this.checkbox = false;
        }
        // console.log(staffTypeChosen);
        this.staffTypeChosen = staffTypeChosen[0].staff_description;
        this.dialog = true;
      } catch (error) {
        this.snackBarMessage = "Network Error(37), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    checkAdmin() {
      if (this.checkbox) {
        this.administatorsCount += 1;
        this.userType = 1;
      } else {
        this.administatorsCount -= 1;
        this.userType = 2;
      }
      this.correctAdmin();
    },
    correctAdmin() {
      if (parseInt(this.administatorsCount) < 1) {
        this.checkbox = true;
        // console.log("Checkbox Value", this.checkbox);
        // this.checkbox = true;
        this.hideCheckbox = true;
        this.snackBarMessage = "You must have at least one administrator";
        this.administatorsCount = 1;
        this.userType = 1;
        this.snackbar = true;
      }
    },
    getStaffType() {
      let filtered = this.staffTypes.filter(el => {
        return el.staff_description === this.staffTypeChosen;
      });
      this.staffType = filtered[0].id;
    },
    async updateStaffMember() {
      try {
        this.getStaffType();
        let credentials = {
          id: this.userID,
          lname: this.lname,
          fname: this.fname,
          email: this.email,
          userType: this.userType,
          staffType: this.staffType,
          jobTitle: this.jobTitle,
          mobileNumber: this.mobileNumber
        };
        let response = await DirectoryService.editEmployee(credentials);
        if (response.data === false) {
          this.snackBarMessage = "Connection Error, Please try again";
          this.snackbar = true;
        } else {
          this.snackBarMessage = "User updated succesfully.";
          this.snackbar = true;
          this.refreshData();
          this.hideCheckbox = false;
          this.dialog = false;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(38), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    cancelUpdate() {
      this.hideCheckbox = false;
      this.dialog = false;
    },
    deleteItem(event) {
      let targetID = event.currentTarget.id;
      this.userID = targetID;
      this.dialog2 = true;
    },
    async deleteItemFinal() {
      try {
        let credentials = {
          id: this.userID
        };
        let response = await DirectoryService.deleteEmployee(credentials);
        if (response.data === false) {
          this.snackBarMessage = "Connection Error, Please try again";
          this.snackbar = true;
        } else {
          this.snackBarMessage = "User deleted succesfully.";
          this.snackbar = true;
          this.refreshData();
          this.dialog2 = false;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(39), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    }
  }
};
</script>
