<template>
  <div class="temp">
    <br /><br /><br /><br /><br />
    <div style="display: flex; justify-content: center;">
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br />
    </div>
    <div style="display: flex; justify-content: center;">
      <h1>Employees</h1>
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
        <v-toolbar-title>Employee</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list rounded>
        <v-subheader>ADD / UPLOAD</v-subheader>
        <v-list-item-group v-model="item" color="#010a43">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <div class="mainView">
              <div>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.text"
                    style="white-space: normal;"
                  ></v-list-item-title>
                </v-list-item-content>
              </div>
              <v-spacer></v-spacer>
              <div class="subView2">
                <v-list-item-action>
                  <v-flex>
                    <UploadDocument
                      v-if="item.text === 'Upload Documents'"
                      @EEDocsuccess="handleSuccess($event)"
                    />
                    <!-- <div v-if="this.$store.state.usersAvailable"> -->
                    <CreateEmployee
                      v-if="item.text === 'Add Employee'"
                      @employeeSuccess="handleSuccessEE"
                    />
                    <!-- </div> -->
                  </v-flex>
                </v-list-item-action>
              </div>
            </div>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <br /><br /><br />
    <v-expand-x-transition>
      <v-card
        max-width="800"
        class="mx-auto"
        v-if="documentItemsFiltered.length"
      >
        <v-toolbar color="#010a43" dark height="90px">
          <!-- <v-spacer></v-spacer> -->
          <div class="mainViewTB">
            <div>
              <v-toolbar-title
                >Employee Documents ({{ allDocuments.length }})</v-toolbar-title
              >
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
                  <v-icon v-on="on" @click="clearSearch">mdi-autorenew</v-icon>
                </template>
                <span>Clear Search</span>
              </v-tooltip>
              <v-spacer></v-spacer>
            </div>
          </div>
        </v-toolbar>

        <v-list rounded>
          <v-list-group
            v-for="item in documentItemsFiltered"
            :key="item.id"
            prepend-icon="mdi-book-open-page-variant"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title
                  v-text="
                    item.lname + ' - ' + item.fname + ' (' + item.count + ')'
                  "
                  :id="item.id"
                  style="white-space: normal;"
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
              two-line
            >
              <div class="mainView">
                <div>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="subItem.documentNameName"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="'Type: ' + subItem.documentTypeDesc"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </div>
                <div class="subView2">
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
                </div>
              </div>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-expand-x-transition>
    <br /><br /><br />
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="450">
        <v-card>
          <v-card-title class="headline">Delete Document?</v-card-title>
          <v-card-text
            >Are you sure? This will permanently delete this
            Document!</v-card-text
          >
          <v-card-actions>
            <v-btn color="#010a43" text @click="dialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#010a43" text @click="deleteDocument">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <br /><br /><br /><br /><br />
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "employees",
  metaInfo: {
    title: `PerfectStaff - Employees`,
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
      items: [
        {
          text: "Upload Documents",
          icon: "mdi-file",
          component: '<UploadDocument @success="handleSuccess" />'
        },
        {
          text: "Add Employee",
          icon: "mdi-account-plus",
          component: '<UploadDocument @success="handleSuccess" />'
        }
      ],
      allStaff: 0,
      allDocuments: [],
      documentItems: [],
      snackbar: false,
      snackBarMessage: "",
      dialog: false,
      updateCategories: {}, //USE THIS TO AMEND A POLICY CATEGORY
      deleteDocumentDetails: {}, //USE THIS TO DELETE A POLICY COMPLETELY
      search: "",
      staffToEmail: []
    };
  },
  components: {
    UploadDocument: () =>
      import(
        /* webpackChunkName: "UploadDocument" */ "../components/uploadEmployeeDoc"
      ),
    CreateEmployee: () =>
      import(
        /* webpackChunkName: "CreateEmployee" */ "../components//CreateEmployee"
      )
  },
  computed: {
    documentItemsFiltered() {
      if (this.search === "") {
        return this.documentItems;
      } else {
        return this.documentItems.filter(policy => {
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
  async beforeMount() {
    try {
      if (!this.$store.state.isAdministrator) {
        return this.$router.push({ name: "home" });
      }
      this.allDocuments = this.$store.state.employees_allDocuments;
      this.documentItems = this.$store.state.employees_documentItems;
      this.refreshData();
    } catch (error) {
      this.snackBarMessage = "Network Error(23), please try later!";
      this.snackbar = true;
      // this.dialog = false;
    }
  },
  methods: {
    async emailStaff() {
      try {
        var set = new Set(this.staffToEmail);
        this.staffToEmail = Array.from(set);
        this.staffToEmail.sort();
        let credentials = {
          staffTypes: JSON.stringify(this.staffToEmail)
        };
        let response = await DirectoryService.emailDocuments(credentials);
        if (!response.data.error) {
          this.snackBarMessage = "emails successfully sent";
          this.snackbar = true;
          this.staffToEmail = [];
        } else {
          this.snackBarMessage = "There was a problem sending emails";
          this.snackbar = true;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(24), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    clearSearch() {
      this.search = "";
    },
    async refreshData() {
      let credentials = {
        id: this.$store.state.organisationID
      };
      try {
        let response = await DirectoryService.getEmployeesDocumentTypesAndDocuments(
          credentials
        );
        if (response.data.success === false) {
          this.snackBarMessage = "Session has expired, please log on again";
          this.snackbar = true;
          setTimeout(() => {
            this.$store.dispatch("logout");
            return this.$router.push({ name: "home" });
          }, 900);
        } else {
          let allDocuments = response.data[1];
          let allDocumentsString = JSON.stringify(allDocuments);
          if (allDocumentsString !== JSON.stringify(this.allDocuments)) {
            // console.log("Different");
            this.allDocuments = allDocuments;
            this.$store.dispatch("employeesAllDocuments", allDocuments);
          }
          // this.allDocuments = response.data[1];
          // this.documentItems = [];
          let documentItems = [];
          response.data[0].forEach(el => {
            let id = el.id;
            let input = {
              id: id,
              lname: el.lname,
              fname: el.fname,
              items: []
            };
            let filtered = response.data[1].filter(el => {
              return el.users === id;
            });
            filtered.forEach(el => {
              input.items.push(el);
            });
            // this.documentItems.push(input);
            documentItems.push(input);
          });
          // this.documentItems.forEach((el) => {
          documentItems.forEach(el => {
            el.count = el.items.length;
          });
          if (
            JSON.stringify(documentItems) !== JSON.stringify(this.documentItems)
          ) {
            console.log("Different");
            this.documentItems = documentItems;
            this.$store.dispatch("employeesDocumentItems", documentItems);
          }
        }
        this.getCurrentUsage();
      } catch (error) {
        this.snackBarMessage = "Network Error(25), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    async view(event) {
      try {
        let targetID = parseInt(event.currentTarget.id);
        let filtered = this.allDocuments.filter(el => {
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
            documentID: parseInt(targetID),
            documentName: filtered[0].documentNameName,
            documentURL: response.data.url,
            URL: `response.data.url`
          };
          this.$store.dispatch("viewdoc", criteria);
          this.$router.push({ name: "viewDoc" });
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(26), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    remove(event) {
      this.scrollToTop();
      let targetArray = event.currentTarget.id.split("-");
      let targetID = parseInt(targetArray[1]);
      let filtered = this.allDocuments.filter(el => {
        return el.id === targetID;
      });
      let deleteDocument = {
        id: filtered[0].id,
        DocumentLink: filtered[0].documentLinkLink
      };
      this.deleteDocumentDetails = deleteDocument;
      this.dialog = true;
    },
    handleSuccessEE() {
      this.refreshData();
      this.snackBarMessage = "Succesfully created!!";
      this.snackbar = true;
    },
    handleSuccess(event) {
      this.staffToEmail.push(event);
      this.refreshData();
      this.snackBarMessage = "Succesfully created!!";
      this.snackbar = true;
    },
    async deleteDocument() {
      try {
        let response = await DirectoryService.deleteDocument(
          this.deleteDocumentDetails
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
        this.snackBarMessage = "Network Error(27), please try later!";
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
.mainView {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.subView2 {
  display: flex;
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
    align-items: center;

    justify-content: space-evenly;
  }
}
</style>
