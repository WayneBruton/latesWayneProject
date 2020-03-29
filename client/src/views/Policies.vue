<template>
  <div>
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

    <v-card max-width="800" class="mx-auto">
      <v-toolbar color="#010a43" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Documents ({{ allDocuments.length }})</v-toolbar-title>
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
          >
            <v-list-item-content>
              <v-list-item-title
                prepend-icon="mdi-book-open-page-variant"
                v-text="subItem.PolicyName"
              ></v-list-item-title>
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
                      ><v-icon>mdi-file</v-icon></v-btn
                    >
                  </template>
                  <span>View</span>
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
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
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
  data() {
    return {
      item: 1,
      items: [{ text: "Upload Documents", icon: "mdi-file" }],
      allStaff: 0,
      allDocuments: [],
      documentItems: [],
      snackbar: false,
      snackBarMessage: "",
      dialog: false,
      dialog1: false,
      updateCategories: {}, //USE THIS TO AMEND A POLICY CATEGORY
      deletePolicyDetails: {}, //USE THIS TO DELETE A POLICY COMPLETELY,
      processing: false,
      staffToEmail: []
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
        console.log(response.data);
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
        // console.log(response.data);
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
            el.AppliesTo = JSON.parse(el.AppliesTo);
          });
          this.allStaff = response.data[1][0].id;
        }
        this.getCurrentUsage();
      } catch (error) {
        this.snackBarMessage = "Network Error(16), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    async view(event) {
      this.processing = true;
      let targetID = parseInt(event.currentTarget.id);
      let filtered = this.allDocuments.filter(el => {
        return el.id === targetID;
      });
      let criteria = {
        documentID: parseInt(targetID),
        documentName: filtered[0].PolicyName,
        documentURL: `${process.env.VUE_APP_BASEURL}${filtered[0].PolicyLink}.pdf`,
        URL: `${filtered[0].PolicyLink}`
      };
      try {
        let response = await DirectoryService.viewDoc(criteria);
        // console.log("THIS is the Data", response.data);
        // console.log("Criteria", criteria);
        if (response.data.download === "Successfull") {
          criteria = {
            documentID: parseInt(targetID),
            documentName: filtered[0].PolicyName,
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
      this.updateCategories = {};
      let targetArray = event.currentTarget.id.split("-");
      let targetID = parseInt(targetArray[1]);
      let categoryID = parseInt(targetArray[0]);
      let filtered = this.allDocuments.filter(el => {
        return el.id === targetID;
      });
      let deletePolicy = {
        id: filtered[0].id,
        PolicyLink: filtered[0].PolicyLink
      };
      this.deletePolicyDetails = deletePolicy;
      if (filtered[0].AppliesTo.length > 1) {
        let updateCategories = filtered[0].AppliesTo.filter(el => {
          return el !== categoryID;
        });
        this.updateCategories = {
          id: targetID,
          AppliesTo: updateCategories
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
    },
    async getCurrentUsage() {
      try {
        let credentials = {
          id: this.$store.state.organisationID
        };
        let response = await DirectoryService.usageThusFar(credentials);
        let documentSize = response.data[0][0].documentSize;
        let policySize = response.data[1][0].policySize;
        let userNumber = response.data[2][0].users;
        let packageOn = response.data[3][0].package;
        let packageUsed = response.data[4].filter(el => {
          return el.id === packageOn;
        });
        let usersAllowed = packageUsed[0].users;
        let usageAllowed = packageUsed[0].usageAllowed;
        let usersAvailable = usersAllowed - userNumber;
        let usageAvailable = (
          (usageAllowed * 1000000000 - documentSize - policySize) /
          1000000000
        ).toFixed(2);
        let criteria = {
          usersAvailable: usersAvailable,
          usageAvailable: usageAvailable
        };
        this.$store.dispatch("availableAdditions", criteria);
      } catch (error) {
        this.snackBarMessage = "Network Error(20), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
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
