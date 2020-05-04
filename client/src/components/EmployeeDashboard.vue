<template>
  <v-container class="temp">
    <div style="display: flex; justify-content: center;">
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br />
    </div>
    <br />
    <div style="display: flex; justify-content: center;">
      <h1>Hello {{ this.$store.state.userName }}</h1>
    </div>
    <!-- <hr> -->
    <!-- food safety audit -->
    <br />
    <div
      style="display: flex; justify-content: space-evenly;"
      class="popup-visible"
    >
      <div class="popup-visible">
        <div class="popup-visibleT">
          <h4>You have read {{ totalPoliciesRead }} policies</h4>
          <v-progress-circular
            :rotate="90"
            :size="100"
            :width="12"
            :value="(totalPoliciesRead / totalPolicies) * 100"
            color="#010a43"
          >
            {{ totalPoliciesRead }} / {{ totalPolicies }}
          </v-progress-circular>
        </div>
      </div>
      <div class="popup-visible">
        <div class="popup-visibleB">
          <h4>You have read {{ totalPersonnelDocumentsRead }} personal docs</h4>
          <v-progress-circular
            :rotate="90"
            :size="100"
            :width="12"
            :value="
              (totalPersonnelDocumentsRead / totalPersonnelDocuments) * 100
            "
            color="#010a43"
          >
            {{ totalPersonnelDocumentsRead }} / {{ totalPersonnelDocuments }}
          </v-progress-circular>
        </div>
      </div>
    </div>
    <br /><br />
    <v-card max-width="800" class="mx-auto">
      <v-toolbar color="#010a43" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title
          >Policies ({{ policyDocuments.length }})</v-toolbar-title
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
        </div>
        <v-list-group
          v-for="item in documentItems"
          :key="item.title"
          prepend-icon="mdi-book-open-page-variant"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.staffType + ' (' + item.count + ')'"
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
            <div class="mainView">
              <div>
                <v-list-item-content>
                  <v-list-item-title
                    prepend-icon="mdi-book-open-page-variant"
                    v-text="subItem.policyName"
                  ></v-list-item-title>
                </v-list-item-content>
              </div>
              <div class="subView2">
                <v-list-item-action>
                  <v-flex>
                    <v-btn
                      :id="subItem.id"
                      text
                      color="#010a43"
                      @click="view($event)"
                      >View</v-btn
                    >
                    <v-btn
                      v-if="subItem.policyRead"
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="#010a43"
                      @click="read"
                      >?
                    </v-btn>
                    <v-btn
                      v-else
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="red"
                      @click="unread"
                      >?
                    </v-btn>
                  </v-flex>
                </v-list-item-action>
              </div>
            </div>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
    <br />
    <br /><br />
    <v-card max-width="800" class="mx-auto">
      <v-toolbar color="#010a43" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title
          >Personnel ({{ personnelDocuments.length }})</v-toolbar-title
        >
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-list rounded>
        <div class="popup-visible" v-if="processing2">
          <v-progress-circular
            :size="70"
            :width="7"
            color="#010a43"
            indeterminate
          ></v-progress-circular>
          <!-- </v-col> -->
        </div>
        <v-list-group
          v-for="item in personnelDocumentItems"
          :key="item.id"
          prepend-icon="mdi-book-open-page-variant"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.documentType + ' (' + item.count + ')'"
                :id="item.id"
              ></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            rounded
            v-for="subItem in item.items"
            :key="subItem.id"
            class="subItems"
            no-action
            prepend-icon="mdi-book-open-page-variant"
          >
            <div class="mainView">
              <div>
                <v-list-item-content>
                  <v-list-item-title
                    prepend-icon="mdi-book-open-page-variant"
                    v-text="subItem.documentNameName"
                  ></v-list-item-title>
                </v-list-item-content>
              </div>
              <div class="subView2">
                <v-list-item-action>
                  <v-flex>
                    <v-btn
                      :id="subItem.id"
                      text
                      color="#010a43"
                      @click="viewPers($event)"
                      >View</v-btn
                    >
                    <v-btn
                      v-if="subItem.readDocument"
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="#010a43"
                      @click="read"
                      >?
                    </v-btn>
                    <v-btn
                      v-else
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="red"
                      @click="unread"
                      >?
                    </v-btn>
                  </v-flex>
                </v-list-item-action>
              </div>
            </div>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <br /><br />
  </v-container>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
// import UploadDocument from "../components/uploadPolicyDoc";
export default {
  name: "employeeDashboard",
  data() {
    return {
      timeOut: 2000,
      item: 1,
      items: [{ text: "Upload Documents", icon: "mdi-file" }],
      allStaff: 0,
      policyDocuments: [],
      personnelDocuments: [],
      documentItems: [],
      personnelDocumentItems: [],
      snackbar: false,
      snackBarMessage: "",
      totalPolicies: 0,
      totalPoliciesRead: 0,
      totalPersonnelDocuments: 0,
      totalPersonnelDocumentsRead: 0,
      processing: false,
      processing2: false
    };
  },
  components: {},
  async beforeMount() {
    if (
      !this.$store.state.isAdministrator &&
      this.$router.currentRoute.name !== "home"
    ) {
      return this.$router.push({ name: "home" });
    }
    this.refreshData();
  },
  methods: {
    async refreshData() {
      // I AM HERE
      let credentials = {
        id: this.$store.state.userID,
        organisation: this.$store.state.organisationID
      };
      console.log(credentials);
      let response = await DirectoryService.getEmployeeDocuments(credentials);
      // console.log(response.data)
      if (response.data.success === false) {
        this.snackBarMessage = "Session has expired, please log on again";
        this.snackbar = true;
        setTimeout(() => {
          this.$store.dispatch("logout");
          return this.$router.push({ name: "home" });
        }, 900);
      } else {
        this.policyDocuments = response.data.policies;
        // console.log("Staff Documents:", response.data.Policies)
        this.personnelDocuments = response.data.staffDocuments;
        response.data.policies.forEach(el => {
          el.appliesTo = JSON.parse(el.appliesTo);
        });
        let newDocumentItems = [];
        let documentItems = response.data.staffTypes;
        documentItems.forEach(el => {
          let id = el.id;
          let dataToInsert = {
            id: el.id,
            staffType: el.staff_description,
            items: []
          };
          let filtered = response.data.policies.filter(el => {
            return el.appliesTo.includes(id);
          });
          filtered.forEach(el => {
            let id = el.id;
            let filtered2 = response.data.policiesRead.filter(el2 => {
              return el2.policyRead === id;
            });
            if (filtered2.length) {
              el.policyRead = true;
            } else {
              el.policyRead = false;
            }
            dataToInsert.items.push(el);
          });
          newDocumentItems.push(dataToInsert);
        });
        newDocumentItems.forEach(el => {
          el.count = el.items.length;
        });
        this.documentItems = newDocumentItems;

        this.policyDocuments.forEach(el => {
          let id = el.id;
          let filtered2 = response.data.policiesRead.filter(el2 => {
            return el2.policyRead === id;
          });
          if (filtered2.length) {
            el.policyRead = true;
          } else {
            el.policyRead = false;
          }
        });
        this.totalPolicies = this.policyDocuments.length;
        this.totalPoliciesRead = response.data.policiesRead.length;
        this.personnelDocumentItems = [];
        response.data.documentTypes.forEach(el => {
          let typeID = el.id;
          let criteria = {
            id: typeID,
            documentType: el.documentType,
            items: []
          };
          let filtered = this.personnelDocuments.filter(el2 => {
            return el2.typeId === typeID;
          });
          filtered.forEach(el => {
            criteria.items.push(el);
          });
          this.personnelDocumentItems.push(criteria);
        });
        this.personnelDocumentItems.forEach(el => {
          el.count = el.items.length;
        });
        this.totalPersonnelDocuments = this.personnelDocuments.length;
        let totalPersonnelDocumentsRead = this.personnelDocuments.reduce(
          (total, obj) => {
            return total + obj.readDocument;
          },
          0
        );
        this.totalPersonnelDocumentsRead = totalPersonnelDocumentsRead;
      }
    },
    async view(event) {
      this.processing = true;
      let targetID = parseInt(event.currentTarget.id);
      let filtered = this.policyDocuments.filter(el => {
        return el.id === targetID;
      });
      let criteria = {
        documentID: parseInt(targetID),
        documentName: filtered[0].policyName,
        documentURL: `${process.env.VUE_APP_BASEURL}${filtered[0].policyLink}.pdf`,
        URL: `${filtered[0].policyLink}.pdf`
      };

      let response = await DirectoryService.viewDoc(criteria);
      if (response.data.download === "Successfull") {
        criteria = {
          id: parseInt(targetID),
          policyRead: filtered[0].policyRead,
          documentType: "Policy",
          documentName: filtered[0].policyName,
          documentURL: response.data.url,
          URL: `response.data.url`
        };
        this.processing = false;
        this.$store.dispatch("viewdoc", criteria);
        this.$router.push({ name: "viewDoc" });
      }
    },
    async viewPers(event) {
      this.processing2 = true;
      let targetID = parseInt(event.currentTarget.id);
      let filtered = this.personnelDocuments.filter(el => {
        return el.id === targetID;
      });
      let criteria = {
        documentID: parseInt(targetID),
        documentName: filtered[0].documentNameName,
        documentURL: `${process.env.VUE_APP_BASEURL}${filtered[0].documentLinkLink}.pdf`,
        URL: `${filtered[0].documentLinkLink}.pdf`
      };

      let response = await DirectoryService.viewDoc(criteria);
      if (response.data.download === "Successfull") {
        criteria = {
          id: parseInt(targetID),
          policyRead: filtered[0].readDocument,
          documentType: "StaffDocument",
          documentName: filtered[0].documentNameName,
          documentURL: response.data.url,
          URL: `response.data.url`
        };
        this.processing = false;
        this.$store.dispatch("viewdoc", criteria);
        this.$router.push({ name: "viewDoc" });
      }
    },
    read() {
      this.snackBarMessage = "You have read this policy";
      this.snackbar = true;
    },
    unread() {
      this.snackBarMessage = "You have not read this policy";
      this.snackbar = true;
    }
  }
};
</script>

<style>
.subItems:hover {
  /* background-color: lightcyan; */
}
.popup-visible {
  /* position: absolute; */
  display: flex;
  justify-content: center;
  z-index: 10;
}
.v-progress-circular {
  margin: 1rem;
  /* background-color: red; */
}
.popup-visibleT {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 25px;
}

.popup-visibleB {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 25px;
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

@media only screen and (max-width: 600px) {
  .mainView {
    flex-direction: column;
  }
  .subView2 {
    justify-content: space-evenly;
  }
  .popup-visible {
    /* position: absolute; */
    /* display: flex; */
    flex-direction: column;
    /* justify-content: center; */
    /* z-index: 10; */
  }

  .popup-visibleT {
    /* display: flex; */
    flex-direction: column;
    align-items: center;
    align-content: center;
    margin-left: 0px;
  }
  .popup-visibleB {
    /* display: flex; */
    flex-direction: column;
    align-items: center;
    align-content: center;
    margin-right: 0px;
  }
}
</style>
