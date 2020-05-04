<template>
  <v-container class="temp">
    <v-layout text-center wrap>
      <v-flex mb-5 xs12>
        <!-- <h2 class="headline font-weight-bold mb-3">Administrator Dashboard</h2> -->

        <h2>{{ this.$store.state.userName }}</h2>

        <h2>{{ this.$store.state.organisationName }}</h2>
        <br />
        <p style="font-weight: bold;">Desktop app coming soon!</p>
        <div style="display: flex; justify-content: center;">
          <div
            style="background-color: lightgrey; 
                  border: 1px solid, lightgrey; 
                  padding: 10px 15px; 
                  max-width: 250px; 
                  border-radius: 5%; "
          >
            <v-btn
              v-if="osName === 'Windows OS'"
              class="mx-2"
              fab
              dark
              color="#010a43"
              ><v-icon style="color: white;"
                >mdi-microsoft-windows</v-icon
              ></v-btn
            >

            <v-btn
              v-if="osName === 'Linux OS'"
              class="mx-2"
              fab
              dark
              color="#010a43"
              ><v-icon style="color: yellow;">mdi-linux</v-icon></v-btn
            >
            <v-btn
              class="mx-2"
              fab
              dark
              color="#010a43"
              v-if="osName === 'MacOS'"
              ><v-icon large dark style="color: silver;"
                >mdi-apple</v-icon
              ></v-btn
            >
          </div>
        </div>
        <v-expand-transition>
          <v-container v-if="totalUsers > 0">
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12" max-width="800">
                <h4>
                  Total Employees: {{ totalUsers }} out of max
                  {{ usersAllowed }}
                </h4>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <h4>Total Policy documents: {{ totalPolicies }}</h4>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <h4>Total Staff Documents: {{ totalStaffDocs }}</h4>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <h4>
                  Total usage: {{ usageUsed }} Gb out of max
                  {{ usageAllowed }} Gb
                </h4>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12" v-if="!processing">
                <v-btn color="#010a43" dark @click="printGlobalReport">
                  <v-icon left dark>mdi-printer</v-icon>
                  Staff Report</v-btn
                >
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <div class="popup-visible" v-if="processing">
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="#010a43"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-card class="mx-auto" max-width="800" tile>
                  <v-toolbar color="#010a43" dark height="90px">
                    <v-spacer></v-spacer>
                    <div class="mainViewTB">
                      <div>
                        <v-toolbar-title>Internal</v-toolbar-title>
                      </div>
                      <v-spacer></v-spacer>
                      <div class="subView2TB">
                        <v-text-field
                          label="Search"
                          prepend-inner-icon="mdi-magnify"
                          v-model="search"
                        ></v-text-field>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" @click="clearSearch"
                              >mdi-autorenew</v-icon
                            >
                          </template>
                          <span>Clear Search</span>
                        </v-tooltip>
                      </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn text color="white" dark @click="sortPolicies">
                      <v-icon v-if="sorted">mdi-arrow-down</v-icon>
                      <v-icon v-else>mdi-arrow-up</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-list rounded>
                    <v-subheader>STAFF</v-subheader>
                    <v-list-item-group v-model="item" color="#010a43">
                      <v-list-item
                        v-for="(item, i) in policiesFiltered"
                        :key="i"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-settings</v-icon>
                        </v-list-item-icon>
                        <div class="mainView">
                          <div>
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="item.lname + ' ' + item.fname"
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                v-text="
                                  'policies Read: ' +
                                    item.policiesRead +
                                    ' / ' +
                                    item.totalPolicies +
                                    ' - ' +
                                    item.policiesReadPercent +
                                    '%'
                                "
                              ></v-list-item-subtitle>
                              <v-list-item-subtitle
                                v-text="
                                  'Staff Docs Read: ' +
                                    item.staffDocsRead +
                                    ' / ' +
                                    item.staffDocsTotal +
                                    ' - ' +
                                    item.staffDocsReadPercentage +
                                    '%'
                                "
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                          </div>
                          <v-spacer></v-spacer>
                          <div class="subView2">
                            <v-list-item-action>
                              <v-flex>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      class="mobileView"
                                      v-on="on"
                                      icon
                                      dark
                                      large
                                      :color="smsColor"
                                      :id="item.id"
                                      :disabled="disabled"
                                      @click="createSMS($event)"
                                      ><v-icon
                                        >mdi-cellphone-basic</v-icon
                                      ></v-btn
                                    >
                                  </template>
                                  <span>{{ smsHint }}</span>
                                </v-tooltip>

                                <v-tooltip top>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      class="mobileView"
                                      v-on="on"
                                      icon
                                      dark
                                      large
                                      color="grey"
                                      :id="item.id"
                                      @click="individualEmail($event)"
                                      ><v-icon>mdi-email</v-icon></v-btn
                                    >
                                  </template>
                                  <span>email</span>
                                </v-tooltip>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      v-on="on"
                                      v-show="item.totalAllDocsPercent >= 80"
                                      class="printBtn mobileView"
                                      dark
                                      icon
                                      large
                                      color="green"
                                      :id="item.id"
                                      @click="individualReport($event)"
                                      ><v-icon>mdi-printer</v-icon
                                      >{{
                                        item.totalAllDocsPercent + " %"
                                      }}</v-btn
                                    >
                                  </template>
                                  <span>report</span>
                                </v-tooltip>
                                <v-btn
                                  v-show="
                                    item.totalAllDocsPercent > 60 &&
                                      item.totalAllDocsPercent < 80
                                  "
                                  class="printBtn"
                                  dark
                                  icon
                                  large
                                  color="orange"
                                  :id="item.id"
                                  @click="individualReport($event)"
                                  ><v-icon>mdi-printer</v-icon
                                  >{{ item.totalAllDocsPercent + " %" }}</v-btn
                                >
                                <v-btn
                                  v-show="item.totalAllDocsPercent <= 60"
                                  class="printBtn"
                                  dark
                                  icon
                                  large
                                  color="red"
                                  :id="item.id"
                                  @click="individualReport($event)"
                                  ><v-icon>mdi-printer</v-icon
                                  >{{ item.totalAllDocsPercent + " %" }}</v-btn
                                >
                              </v-flex>
                            </v-list-item-action>
                          </div>
                        </div>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-expand-transition>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar" :timeout="timOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      scrollable
      width="600"
      max-width="90%"
      style="margin-right: 10%; margin-bottom: 25px;"
    >
      <v-card style="max-height: 675px; margin-right: 25px;">
        <v-card-title>
          <span class="headline">Edit and change accordingly </span>
        </v-card-title>
        <v-card-text>
          <vue-editor
            v-model="content"
            :editorToolbar="customToolbar"
          ></vue-editor>
        </v-card-text>
        <v-card-actions>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                color="red"
                text
                v-on="on"
                @click="changeMail($event)"
                id="1"
                ><v-icon>mdi-email</v-icon>
              </v-btn>
            </template>
            <span>non-compliant</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                color="green"
                text
                v-on="on"
                @click="changeMail($event)"
                id="2"
                ><v-icon>mdi-email</v-icon></v-btn
              >
            </template>
            <span>compliant</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                color="#010a43"
                text
                v-on="on"
                @click="changeMail($event)"
                id="3"
                ><v-icon>mdi-email-outline</v-icon></v-btn
              >
            </template>
            <span>Blank email</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                color="#010a43"
                text
                v-on="on"
                @click="sendTheEmail($event)"
                :id="individualEmailID"
                ><v-icon>mdi-email-send</v-icon></v-btn
              >
            </template>
            <span>Send</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
      <br /><br />
    </v-dialog>

    <div class="text-center">
      <v-dialog v-model="dialogSMS" width="500">
        <!-- <template v-slot:activator="{ on }">
          <v-btn color="red lighten-2" dark v-on="on">
            Click Me
          </v-btn>
        </template> -->

        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Send SMS - {{ mobileNumber }} - {{ unitsUsed }} units.
          </v-card-title>
          <v-textarea
            style="margin: 15px 15px;;"
            counter="160"
            placeholder="input text message"
            v-model="SMSText"
            flat
            @input="unitsUsing"
          >
          </v-textarea>
          <v-card-text>Units: {{ unitsUsed }}</v-card-text>

          <!-- <v-divider></v-divider> -->

          <v-card-actions>
            <v-btn color="primary" text @click="dialogSMS = false">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn color="primary" text @click="addLink" v-on="on"
                  ><v-icon>mdi-link-variant-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Link</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-btn v-if="SMSText" color="primary" text @click="sendSMS">
              Send
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <br /><br /><br /><br /><br /><br /><b></b>
  </v-container>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
import { VueEditor } from "vue2-editor";
export default {
  name: "AdministratorDashboard",
  data: () => ({
    dialog: false,
    dialogSMS: false,
    timOut: 2000,
    osName: "",
    content: "<h1>Some initial content</h1>",
    positiveContent: "",
    negativeContent: "",
    blankContent: "",
    customToolbar: [
      [
        {
          header: [false, 1, 2, 3, 4, 5, 6]
        }
      ],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [
        {
          color: []
        },
        {
          background: []
        }
      ]
    ],
    individualEmailID: 999,

    totalUsers: 0,
    totalPolicies: 0,
    totalStaffDocs: 0,
    usageAllowed: 0,
    usersAllowed: 0,
    usageUsed: 0,
    policies: [],
    staffDocs: [],
    item: 0,
    sorted: true,
    snackbar: false,
    snackBarMessage: "",
    search: "",
    processing: false,
    unitsAvailable: 0,
    smsHint: "Coming Soon",
    smsColor: "indigo",
    country: "za",
    disabled: false,

    mobileNumber: "",
    SMSText: "",
    unitsUsed: 0,
    smsUser: 0
  }),
  components: {
    VueEditor
    // VueEditor: () =>
    //   import(
    //     /* webpackChunkName: "VueEditor" */ "vue2-editor"
    //   )
  },
  async mounted() {
    if (navigator.appVersion.indexOf("Win") != -1) this.osName = "Windows OS";
    if (navigator.appVersion.indexOf("Mac") != -1) this.osName = "MacOS";
    if (navigator.appVersion.indexOf("Linux") != -1) this.osName = "Linux OS";
    // console.log(this.$store.state.country);
    if (this.$store.state.country == "ZA") {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
    this.country = this.$store.state.country;
    let credentials = {
      organisation: this.$store.state.organisationID
    };
    let response = await DirectoryService.checkUnitsAvailable(credentials);
    // this.unitsAvailable = 10
    this.unitsAvailable = response.data[0].unitNumber;
    if (this.unitsAvailable === 0) {
      this.smsHint = "Purchase Units";
      this.smsColor = "orange";
    } else {
      this.unitsAvailable = response.data[0].unitNumber;
      this.smsColor = "indigo";
      this.smsHint = "Text";
    }
  },
  async beforeMount() {
    let credentials = {
      id: this.$store.state.organisationID
    };
    // console.log(this.$store.state.userName)
    // console.log(this.$store.state.organisationID)
    try {
      if (this.$store.state.isProducedReport) {
        let rep = this.$store.state.documentURL.split("/");
        rep = `${rep[rep.length - 2]}/${rep[rep.length - 1]}`;
        let reportCredentials = {
          rep: rep
        };
        let criteria = {
          documentURL: "",
          URL: ``,
          documentName: "",
          isProducedReport: false
        };
        this.$store.dispatch("viewReport", criteria);
        await DirectoryService.removeReport(reportCredentials);
      }
      let response = await DirectoryService.getOrganisationStatistics(
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
        let personalDocSize = response.data[2].reduce((prev, curr) => {
          return prev + curr.documentSize;
        }, 0);
        let policyDocSize = response.data[5].reduce((prev, curr) => {
          return prev + curr.policySize;
        }, 0);
        this.usageUsed = (
          (personalDocSize + policyDocSize) /
          107374182
        ).toFixed(2);
        this.usageAllowed = response.data[6][0].usageAllowed.toFixed(2);
        this.usersAllowed = response.data[6][0].users;
        this.totalUsers = response.data[0][0].users;
        this.totalPolicies = response.data[1][0].policies;
        this.totalStaffDocs = response.data[2].length;
        this.staffDocs = response.data[2];
        response.data[5].forEach(el => {
          el.appliesTo = JSON.parse(el.appliesTo);
        });
        let allStaff = response.data[3][0].id;
        let filtered = response.data[5].filter(el => {
          return el.appliesTo.includes(allStaff);
        });
        let allStaffCount = filtered.length;
        response.data[4].forEach(el => {
          let includes = el.staffType;
          let filtered = response.data[5].filter(el => {
            return el.appliesTo.includes(includes);
          });
          el.totalPolicies = filtered.length + allStaffCount;
          if (isNaN(Math.round((el.policiesRead / el.totalPolicies) * 100))) {
            el.policiesReadPercent = 0;
          } else {
            el.policiesReadPercent = Math.round(
              (el.policiesRead / el.totalPolicies) * 100
            );
          }
        });
        this.policies = response.data[4];
        this.policies.forEach(el => {
          let id = el.id;
          let filtered = this.staffDocs.filter(el2 => {
            return el2.users === id;
          });
          el.staffDocsTotal = filtered.length;
          let filtered2 = filtered.filter(el3 => {
            return el3.readDocument === 1;
          });
          el.staffDocsRead = filtered2.length;
          el.staffDocsReadPercentage = Math.round(
            (el.staffDocsRead / el.staffDocsTotal) * 100
          );
          if (isNaN(el.staffDocsReadPercentage)) {
            el.staffDocsReadPercentage = 0;
          }
          el.totalAllDocsPercent = Math.round(
            ((el.policiesRead + el.staffDocsRead) /
              (el.totalPolicies + el.staffDocsTotal)) *
              100
          );
        });
        this.policies.sort((a, b) =>
          a.totalAllDocsPercent < b.totalAllDocsPercent ? 1 : -1
        );
        this.getCurrentUsage();
      }
    } catch (error) {
      this.snackBarMessage = "Network Error(10), please try later!";
      this.snackbar = true;
      // this.dialog = false;
    }
  },
  computed: {
    policiesFiltered() {
      if (this.search === "") {
        return this.policies;
      } else {
        return this.policies.filter(policy => {
          return (
            !this.search ||
            policy.lname.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            policy.fname.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      }
    }
  },
  methods: {
    unitsUsing() {
      let unitsUsed = Math.ceil(this.SMSText.length / 160);
      this.unitsUsed = unitsUsed;
    },
    addLink() {
      let org = this.$store.state.organisationID;
      let user = this.smsUser;
      this.SMSText = `${this.SMSText} https://www.perfect-staff.com/viewmydocs/${org}/${user}`;
    },
    async sendSMS() {
      let credentials = {
        mobile: this.mobileNumber,
        message: this.SMSText
      };
      let response = await DirectoryService.individualsms(credentials);
      // console.log(response);
      if (response.status === 200) {
        let newCredentials = {
          organisation: this.$store.state.organisationID
        };
        await DirectoryService.useUnits(newCredentials);
        // let response2 = await DirectoryService.useUnits(newCredentials)
        // console.log("Response2", response2)
        this.snackBarMessage = "Text Sent";
        this.snackbar = true;
        this.dialogSMS = false;
      } else {
        this.snackBarMessage = "There was an error";
        this.snackbar = true;
      }
    },
    async createSMS(event) {
      let targetID = parseInt(event.currentTarget.id);
      this.smsUser = targetID;
      // console.log("current Target", targetID)
      let credentials = {
        id: targetID
      };
      let response = await DirectoryService.getUserMobile(credentials);
      // console.log(response.data[0].mobileNumber);
      if (response.data[0].mobileNumber !== null) {
        this.mobileNumber = response.data[0].mobileNumber;
        this.SMSText = "";
        this.dialogSMS = true;
        // I AM HERE
      } else {
        this.snackBarMessage = "No mobile number for this user found";
        this.snackbar = true;
      }

      // I AM HERE
    },
    clearSearch() {
      this.search = "";
    },
    sortPolicies() {
      if (this.sorted) {
        this.policies.sort((a, b) =>
          a.totalAllDocsPercent > b.totalAllDocsPercent ? 1 : -1
        );
        this.sorted = !this.sorted;
      } else {
        this.policies.sort((a, b) =>
          a.totalAllDocsPercent < b.totalAllDocsPercent ? 1 : -1
        );
        this.sorted = !this.sorted;
      }
    },
    async printGlobalReport() {
      try {
        this.processing = true;
        let credentials = this.policies;
        let response = await DirectoryService.printGlobalReport(credentials);
        let criteria = {
          documentURL: response.data.url,
          URL: `response.data.url`,
          documentName: "Global Adherance Report",
          isProducedReport: true
        };

        this.$store.dispatch("viewReport", criteria);
        this.processing = false;
        this.$router.push({ name: "viewDoc" });
      } catch (error) {
        this.snackBarMessage = "Network Error(13), please try later!";
        this.snackbar = true;
      }
    },
    async individualReport(event) {
      try {
        this.processing = true;
        let targetID = parseInt(event.currentTarget.id);
        let filtered = this.policies.filter(el => {
          return el.id === targetID;
        });
        // console.log("TESTING", filtered[0]);
        // console.log(targetID);
        let credentials = {
          id: targetID,
          organisation: this.$store.state.organisationID,
          name: `${filtered[0].fname} ${filtered[0].lname}`,
          staffType: filtered[0].staffType
        };
        let response = await DirectoryService.printIndividualReport(
          credentials
        );

        let criteria = {
          documentURL: response.data.url,
          URL: `response.data.url`,
          documentName: "Individual Report",
          isProducedReport: true
        };

        this.$store.dispatch("viewReport", criteria);
        this.processing = false;
        this.$router.push({ name: "viewDoc" });
        // console.log("I will print this itinerent twats report!");
      } catch (error) {
        this.snackBarMessage = "Network Error(12), please try later!";
        this.snackbar = true;
      }
    },
    individualEmail(event) {
      try {
        this.scrollToTop();
        let targetID = parseInt(event.currentTarget.id);
        this.individualEmailID = targetID;
        let filtered = this.policies.filter(el => {
          return el.id === targetID;
        });
        let credentials = filtered[0];
        credentials.organisation = this.$store.state.organisationID;
        // console.log(credentials);
        // console.log(credentials.totalPolicies);
        let negativeContent = `<h3>Your policy statistics</h3><br /><p><br />Dear ${credentials.fname},</p><p>These are your stats:</p><br /><p><strong>Policies</strong></p><li>Total Policies: ${credentials.totalPolicies}.</li><li>Policies read by you: ${credentials.policiesRead}.</li><li>Percentage of Policies read by you: <strong>${credentials.policiesReadPercent} %.</strong></li><p><strong>Staff Documents</strong></p><li>Total Staff Documents: ${credentials.staffDocsTotal}.</li><li>Staff Documents read by you: ${credentials.staffDocsRead}.</li><li>Percentage of Staff Documents read by you: <strong>${credentials.staffDocsReadPercentage} %.</strong></li><h4>Total percentage of all documents and policies read is: <strong>${credentials.totalAllDocsPercent} %</strong>.</h4><p>Please be aware that reading and <strong>acknowledging</strong> of all documents is policy.</p><p style="color: red;"><strong>Failure to comply/correct the situation can result in disciplinary action.</strong></p><p>Logon to   <a href="https://www.perfect-staff.com/viewmydocs/${this.$store.state.organisationID}/${targetID}">Perfect Staff</a> to view your docs and take corrective action.</p><br /><span>Perfect Staff Admin</span>`;
        let positiveContent = `<h3>Your policy statistics</h3><br /><p><br />Dear ${credentials.fname},</p><p>These are your stats:</p><br /><p><strong>Policies</strong></p><li>Total Policies: ${credentials.totalPolicies}.</li><li>Policies read by you: ${credentials.policiesRead}.</li><li>Percentage of Policies read by you: <strong>${credentials.policiesReadPercent} %.</strong></li><p><strong>Staff Documents</strong></p><li>Total Staff Documents: ${credentials.staffDocsTotal}.</li><li>Staff Documents read by you: ${credentials.staffDocsRead}.</li><li>Percentage of Staff Documents read by you: <strong>${credentials.staffDocsReadPercentage} %.</strong></li><h4>Total percentage of all documents and policies read is: <strong>${credentials.totalAllDocsPercent} %</strong>.</h4><p>Please be aware that reading and <strong>acknowledging</strong> of all documents is policy.</p><p style="color: green;"><strong>You have done exceptionaly well, keep up the great work.</strong></p><p>Logon to   <a href="https://www.perfect-staff.com/viewmydocs/${this.$store.state.organisationID}/${targetID}">Perfect Staff</a> to view your docs and take corrective action.</p><br /><span>Perfect Staff Admin</span>`;
        let blankContent = `Dear ${credentials.fname},`;
        this.positiveContent = positiveContent;
        this.blankContent = blankContent;
        this.negativeContent = negativeContent.trim();
        this.content = this.negativeContent;
        this.dialog = true;
      } catch (e) {
        // console.log(e);
        this.snackBarMessage =
          "There is a network problem(11), please try later!";
        this.snackbar = true;
      }
    },
    async sendTheEmail(event) {
      try {
        let targetID = parseInt(event.currentTarget.id);
        // console.log(targetID);
        let credentials = {
          id: targetID,
          organisation: this.$store.state.organisationID,
          content: this.content
        };
        let response = await DirectoryService.emailIndividual(credentials);
        // console.log(response.data);
        if (!response.data.error) {
          this.snackBarMessage = "Email sent successfully";
          this.snackbar = true;
          this.dialog = false;
        } else {
          this.snackBarMessage = "Email not sent, please try again later";
          this.snackbar = true;
          this.dialog = false;
        }
      } catch (e) {
        // console.log(e);
        this.snackBarMessage =
          "There is a network problem(11), please try later!";
        this.snackbar = true;
      }
    },
    changeMail(event) {
      let targetID = parseInt(event.currentTarget.id);
      if (targetID === 1) {
        this.content = this.negativeContent;
      } else if (targetID === 2) {
        this.content = this.positiveContent;
      } else if (targetID === 3) {
        this.content = this.blankContent;
      }
    }
  }
};
</script>

<style scoped>
.printBtn {
  margin-left: 10px;
}
.mainView {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.subView2 {
  display: flex;
  flex-wrap: nowrap;
}
.mainViewTB {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.subView2TB {
  display: flex;
}
@media only screen and (max-width: 600px) {
  .mainView {
    flex-direction: column;
  }
  .subView2 {
    justify-content: space-evenly;
  }
  .mainViewTB {
    flex-direction: column;
    /* align-content: center; */
    align-items: center;
    justify-content: space-evenly;
  }
  .subView2TB {
    /* align-items: center; */

    /* justify-content: space-evenly; */
  }
  .mobileView {
    /* margin: 0 0; */
    /* width: 25%; */
  }
}
</style>
