<template>
  <div class="temp">
    <br /><br /><br /><br /><br />
    <div style="display: flex; justify-content: center;">
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br />
    </div>
    <div style="display: flex; justify-content: center;">
      <h1>Policies</h1>
    </div>
    <br />
    <div
      style="display: flex; justify-content: center;"
      v-if="staffToEmail.length"
    >
      <v-btn color="#010a43" dark @click="emailStaff">
        <!-- @click="printGlobalReport" -->
        <v-icon left dark>mdi-email</v-icon>
        email users</v-btn
      >
    </div>
    <br />
    <v-card class="mx-auto" max-width="800" tile>
      <v-toolbar color="#010a43" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Upload Policies</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list rounded>
        <v-subheader>REPORTS</v-subheader>
        <v-list-item-group v-model="item" color="#010a43">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <v-list-item-action>
              <v-flex>
                <UploadDocument @success="handleSuccess($event)" />
              </v-flex>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <br /><br /><br />
    <!-- <transition name="fade"> -->
    <v-expand-x-transition>
      <v-card max-width="800" class="mx-auto" v-if="documentItems.length">
        <v-toolbar color="#010a43" dark>
          <v-spacer></v-spacer>
          <v-toolbar-title
            >Documents ({{ allDocuments.length }})</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list rounded>
          <div class="popup-visible" v-if="processing">
            <v-progress-circular
              :size="70"
              :width="7"
              color="#010a43"
              indeterminate
            ></v-progress-circular>
            <!-- </v-col> -->
          </div>
          <v-list-group
            v-for="item in documentItems"
            :key="item.title"
            prepend-icon="mdi-book-open-page-variant"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.title + ' (' + item.count + ')'"
                  :id="item.id"
                ></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              rounded
              v-for="subItem in item.items"
              :key="subItem.title"
              class="subItems"
              no-action
              prepend-icon="mdi-book-open-page-variant"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title
                  prepend-icon="mdi-book-open-page-variant"
                  v-text="subItem.policyName"
                ></v-list-item-title>
                <v-list-item-subtitle
                  prepend-icon="mdi-book-open-page-variant"
                  v-text="subItem.description.substring(0, 250) + '...'"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-flex>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        :id="subItem.id"
                        text
                        color="green"
                        @click="view($event)"
                        ><v-icon>mdi-file-find</v-icon></v-btn
                      >
                    </template>
                    <span>View</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        :id="subItem.id"
                        text
                        color="indigo"
                        @click="edit($event)"
                        ><v-icon>mdi-file-edit</v-icon></v-btn
                      >
                    </template>
                    <span>Edit</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        :id="item.id + '-' + subItem.id"
                        :category="item.id"
                        text
                        color="red"
                        @click="remove($event)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </v-flex>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
      <!-- </transition> -->
    </v-expand-x-transition>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-row justify="center">
      <v-dialog v-model="editDialog" persistent max-width="525">
        <v-card>
          <v-card-title>
            <span class="headline">Document Details</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" xs="12" sm="6" md="6">
                  <v-text-field
                    label="Name*"
                    v-model="policyName"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="9" md="9">
                  <v-textarea
                    label="Description*"
                    v-model="description"
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12" xs="12" sm="9" md="9">
                  <v-autocomplete
                    :items="typesOfStaff"
                    label="Staff Affected*"
                    v-model="staffAffected"
                    item-text="staff_description"
                    multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <div class="popup-visible" v-if="processing">
                <v-progress-circular
                  :size="70"
                  :width="7"
                  color="#010a43"
                  indeterminate
                >
                  <small>Uploading</small>
                </v-progress-circular>
              </div>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="editDialog = false"
              >Cancel</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="editPolicy"
              >Update</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="450">
        <v-card>
          <v-card-title class="headline">Delete Policy?</v-card-title>
          <v-card-text
            >Are you sure? This will permanently delete this
            policy!</v-card-text
          >
          <v-card-actions>
            <v-btn color="green darken-1" text @click="dialog = false"
              >Cancel</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deletePolicy"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog1" max-width="450">
        <v-card>
          <v-card-title class="headline">Multi category policy</v-card-title>
          <v-card-text>This policy is in more than one category.</v-card-text>
          <v-card-actions xs12>
            <v-btn color="green darken-1" text @click="removeFromCategory"
              >Remove from Category</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteCompletely"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <br /><br />
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
import UploadDocument from "../components/uploadPolicyDoc";
export default {
  name: "policies",
  metaInfo: {
    title: `PerfectStaff - Policies`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {
      item: 1,
      timeOut: 2000,
      items: [{ text: "Upload Documents", icon: "mdi-file" }],
      allStaff: 0,
      allDocuments: [],
      documentItems: [],
      snackbar: false,
      snackBarMessage: "",
      editDialog: false,
      dialog: false,
      dialog1: false,
      updateCategories: {}, //USE THIS TO AMEND A POLICY CATEGORY
      deletePolicyDetails: {}, //USE THIS TO DELETE A POLICY COMPLETELY,
      processing: false,
      staffToEmail: [],
      // policyToEdit: [],
      typesOfStaff: [],
      staffAffected: [],
      staffAffectedByID: [],
      id: null,
      policyName: null,
      description: null
    };
  },
  components: {
    UploadDocument
  },
  async beforeMount() {
    try {
      if (!this.$store.state.isAdministrator) {
        return this.$router.push({ name: "home" });
      }
      this.refreshData();
    } catch (error) {
      this.snackBarMessage = "Network Error(14), please try later!";
      this.snackbar = true;
      // this.dialog = false;
    }
  },
  methods: {
    async emailStaff() {
      // this.staffToEmail = [2, 3, 8];
      var set = new Set(this.staffToEmail);
      let allStaff = this.documentItems[0].id;
      if (set.has(allStaff)) {
        this.staffToEmail = [];
        this.staffToEmail.push(allStaff);
      } else {
        this.staffToEmail = Array.from(set);
      }
      let credentials = {
        staffTypes: JSON.stringify(this.staffToEmail),
        organisation: this.$store.state.organisationID
      };
      try {
        let response = await DirectoryService.emailPolicies(credentials);
        // console.log(response.data);
        if (!response.data.error) {
          this.snackBarMessage = "emails successfully sent";
          this.snackbar = true;
          this.staffToEmail = [];
        } else {
          this.snackBarMessage = "There was a problem sending emails";
          this.snackbar = true;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(15), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    async refreshData() {
      let credentials = {
        id: this.$store.state.organisationID
      };
      try {
        let response = await DirectoryService.policiesAndStaffTypes(
          credentials
        );
        // console.log("Response Policies", response.data);
        if (response.data.success === false) {
          this.snackBarMessage = "Session has expired, please log on again";
          this.snackbar = true;
          setTimeout(() => {
            this.$store.dispatch("logout");
            return this.$router.push({ name: "home" });
          }, 900);
        } else {
          this.documentItems = response.data[1];
          this.documentItems.forEach(el => {
            el.count = el.items.length;
          });
          this.allDocuments = response.data[0];
          this.allDocuments.forEach(el => {
            el.appliesTo = JSON.parse(el.appliesTo);
          });
          this.allStaff = response.data[1][0].id;
        }
        // console.log(this.documentItems);
        this.getCurrentUsage();
      } catch (error) {
        this.snackBarMessage = "Network Error(16), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    async edit(event) {
      let targetID = parseInt(event.currentTarget.id);
      let credentials = {
        id: targetID,
        organisation: this.$store.state.organisationID
      };
      let response = await DirectoryService.editPolicy(credentials);
      this.typesOfStaff = response.data[1];
      // this.policyToEdit.push(response.data[0][0]);
      response.data[0].forEach(el => {
        this.staffAffectedByID = JSON.parse(el.appliesTo);
        this.id = el.id;
        this.policyName = el.policyName;
        this.description = el.description;
      });
      this.staffAffected = [];
      this.staffAffectedByID.forEach(el => {
        let id = el;
        let staffType = this.typesOfStaff.filter(el2 => {
          return el2.id === id;
        });
        this.staffAffected.push(staffType[0].staff_description);
      });
      this.editDialog = true;
    },
    async editPolicy() {
      this.staffAffectedByID = [];
      this.staffAffected.forEach(el => {
        let staffType = el;
        let affectedStaffTypes = this.typesOfStaff.filter(el => {
          return el.staff_description === staffType;
        });
        this.staffAffectedByID.push(affectedStaffTypes[0].id);
      });
      if (this.staffAffectedByID.includes(this.typesOfStaff[0].id)) {
        this.staffAffectedByID = [];
        this.staffAffectedByID.push(this.typesOfStaff[0].id);
      }
      let credentials = {
        id: this.id,
        policyName: this.policyName,
        description: this.description,
        appliesTo: JSON.stringify(this.staffAffectedByID)
      };
      let response = await DirectoryService.updatePolicy(credentials);
      if (response.status === 200) {
        this.refreshData();
        this.editDialog = false;
      } else {
        this.snackBarMessage =
          "There was an eror updating this policy, plesse try again later.";
        this.snackbar = true;
      }

      // console.log(credentials);
    },
    async view(event) {
      this.processing = true;
      let targetID = parseInt(event.currentTarget.id);
      let filtered = this.allDocuments.filter(el => {
        return el.id === targetID;
      });
      let criteria = {
        documentID: parseInt(targetID),
        documentName: filtered[0].policyName,
        documentURL: `${process.env.VUE_APP_BASEURL}${filtered[0].policyLink}.pdf`,
        URL: `${filtered[0].policyLink}`
      };
      try {
        let response = await DirectoryService.viewDoc(criteria);
        // console.log("THIS is the Data", response.data);
        // console.log("Criteria", criteria);
        if (response.data.download === "Successfull") {
          criteria = {
            documentID: parseInt(targetID),
            documentName: filtered[0].policyName,
            documentURL: response.data.url,
            URL: `response.data.url`
          };
          // console.log("URL", response.data.url);
          this.processing = false;
          this.$store.dispatch("viewdoc", criteria);
          this.$router.push({ name: "viewDoc" });
        }
        // this.$store.dispatch("viewdoc", criteria);
        // this.$router.push({ name: "viewDoc" });
      } catch (error) {
        this.snackBarMessage = "Network Error(17), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    remove(event) {
      this.scrollToTop();
      this.updateCategories = {};
      let targetArray = event.currentTarget.id.split("-");
      let targetID = parseInt(targetArray[1]);
      let categoryID = parseInt(targetArray[0]);
      let filtered = this.allDocuments.filter(el => {
        return el.id === targetID;
      });
      let deletePolicy = {
        id: filtered[0].id,
        policyLink: filtered[0].policyLink
      };
      this.deletePolicyDetails = deletePolicy;
      if (filtered[0].appliesTo.length > 1) {
        let updateCategories = filtered[0].appliesTo.filter(el => {
          return el !== categoryID;
        });
        this.updateCategories = {
          id: targetID,
          appliesTo: updateCategories
        };
        this.dialog1 = true;
      } else {
        this.dialog = true;
      }
    },
    deleteCompletely() {
      this.dialog1 = false;
      this.dialog = true;
    },
    async deletePolicy() {
      try {
        let response = await DirectoryService.deletePolicy(
          this.deletePolicyDetails
        );
        if (response.data) {
          this.snackBarMessage = "Item deleted";
          this.refreshData();
        } else {
          this.snackBarMessage = "Network Error - Please try later";
        }
        this.snackbar = true;
        this.dialog = false;
      } catch (error) {
        this.snackBarMessage = "Network Error(18), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    async removeFromCategory() {
      try {
        let response = await DirectoryService.deletePolicyFromCategory(
          this.updateCategories
        );
        if (response.data) {
          this.snackBarMessage = "Removed from category";
          this.refreshData();
        } else {
          this.snackBarMessage = "Network Error - Please try later";
        }
        this.snackbar = true;
        this.dialog1 = false;
      } catch (error) {
        this.snackBarMessage = "Network Error(19), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    handleSuccess(event) {
      event.forEach(el => {
        this.staffToEmail.push(el);
      });

      // console.log(event);
      // console.log("The Test", this.staffToEmail);
      this.refreshData();
    }
  }
};
</script>

<style>
.subItems:hover {
  background-color: lightcyan;
}
.popup-visible {
  /* position: absolute; */
  display: flex;
  justify-content: center;
  z-index: 10;
}
</style>
