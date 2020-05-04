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
    <v-card class="mx-auto" width="800" max-width="90%" tile>
      <v-toolbar color="#010a43" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Add Document Types</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list rounded>
        <v-subheader>Add</v-subheader>
        <v-list-item-group color="#010a43">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-settings</v-icon>
            </v-list-item-icon>
            <div class="mainView">
              <div>
                <v-list-item-content>
                  <v-list-item-title style="white-space: normal;"
                    >Add Document Type</v-list-item-title
                  >
                </v-list-item-content>
              </div>
              <v-spacer></v-spacer>
              <div class="subView2">
                <v-list-item-action>
                  <v-flex>
                    <v-btn text color="#010a43" @click="dialog3 = true"
                      >Add</v-btn
                    >
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
        class="mx-auto"
        width="800"
        max-width="90%"
        tile
        v-if="items.length"
      >
        <v-toolbar color="#010a43" dark>
          <v-spacer></v-spacer>
          <v-toolbar-title>Document Types</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list rounded>
          <v-subheader>EDIT</v-subheader>
          <v-list-item-group v-model="item" color="#010a43">
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-list-item-icon>
                <v-icon
                  v-text="item.icon"
                  v-if="i === 0"
                  style="color: red;"
                ></v-icon>
                <v-icon v-text="item.icon" v-else></v-icon>
              </v-list-item-icon>
              <div class="mainView">
                <div>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.documentType"
                      style="white-space: normal;"
                    ></v-list-item-title>
                  </v-list-item-content>
                </div>
                <v-spacer></v-spacer>
                <div class="subView2">
                  <v-list-item-action>
                    <v-flex>
                      <v-btn
                        text
                        :id="item.id"
                        v-if="item.canDelete === true"
                        @click="deleteItem($event)"
                        style="color: red; font-weight: bold; margin: 0px 0px;"
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
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            text
                            color="#010a43"
                            :id="item.id"
                            @click="edit($event)"
                            ><v-icon>mdi-folder-edit</v-icon></v-btn
                          >
                        </template>
                        <span>Edit</span>
                      </v-tooltip>
                    </v-flex>
                  </v-list-item-action>
                </div>
              </div>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-expand-x-transition>
    <br /><br /><br />
    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card max-width="90%">
        <v-card-title>
          <span class="headline">Document Type Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Document Type"
                  v-model="documentType"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <v-btn color="#010a43" text @click="cancelUpdate">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="updateStaffType">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog3" persistent max-width="800px">
      <v-card max-width="90%">
        <v-card-title>
          <span class="headline">Document Type Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Document Type"
                  v-model="documentType"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <v-btn color="#010a43" text @click="dialog3 = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="addDocumentType">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog1" persistent max-width="450">
      <v-card max-width="90%">
        <v-card-title class="headline"
          >Why can't I delete this Document Type?</v-card-title
        >
        <v-card-text
          >This Document type is either your base type (red icon) or there are
          documents in this category.</v-card-text
        >
        <v-card-text>First delete the documents.</v-card-text>
        <v-card-text>Then delete the category.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="dialog1 = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-dialog v-model="dialog2" persistent max-width="450">
        <v-card max-width="90%">
          <v-card-title class="headline">Delete Document Type?</v-card-title>
          <v-card-text
            >Are you sure? This will permanently delete this Document
            Type?</v-card-text
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
export default {
  name: "editStaffTypes",
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
      dialog3: false,
      timeOut: 2000,
      item: 0,
      items: [],
      documentType: "",
      documentTypeID: "",
      snackBarMessage: "",
      snackbar: false
    };
  },
  async mounted() {
    this.organisationID = this.$store.state.organisationID;
    this.refreshData();
  },
  methods: {
    async refreshData() {
      try {
        let credentials = {
          id: this.organisationID
        };
        let response = await DirectoryService.getDocumentTypes(credentials);
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
        // console.log(response.data)
        response.data.forEach((el, index) => {
          el.icon = "mdi-settings";
          if (el.count > 0 || index === 0) {
            el.canDelete = false;
          } else {
            el.canDelete = true;
          }
        });
        this.items = response.data;
      } catch (error) {
        this.snackBarMessage = "Network Error(45), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    edit(event) {
      this.scrollToTop();
      let targetID = parseInt(event.currentTarget.id);
      let documentType = this.items.filter(el => {
        return el.id === targetID;
      });
      this.documentType = documentType[0].documentType;
      this.documentTypeID = targetID;
      this.dialog = true;
    },
    async updateStaffType() {
      try {
        let credentials = {
          id: this.documentTypeID,
          documentType: this.documentType
        };
        let response = await DirectoryService.editDocumentType(credentials);
        if (response.data === false) {
          this.snackBarMessage = "Connection Error, Please try again";
          this.snackbar = true;
        } else {
          this.snackBarMessage = "User updated succesfully.";
          this.snackbar = true;
          this.refreshData();
          this.dialog = false;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(46), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    cancelUpdate() {
      this.dialog = false;
    },
    async addDocumentType() {
      try {
        if (this.documentType === "") {
          this.snackBarMessage = "You must fill in the field";
          return (this.snackbar = true);
        }
        let credentials = {
          documentType: this.documentType,
          organisation: this.organisationID
        };
        let response = await DirectoryService.addDocumentType(credentials);
        // console.log(response.data);
        if (response.data === false) {
          this.snackBarMessage = "Connection Error, Please try again";
          this.snackbar = true;
        } else {
          this.snackBarMessage = "Document Type added succesfully.";
          this.snackbar = true;
          this.refreshData();
        }
        this.dialog3 = false;
      } catch (error) {
        this.snackBarMessage = "Network Error(47), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    deleteItem(event) {
      this.scrollToTop();
      let targetID = event.currentTarget.id;
      this.documentTypeID = targetID;
      this.dialog2 = true;
    },
    async deleteItemFinal() {
      try {
        let credentials = {
          id: this.documentTypeID
        };
        let response = await DirectoryService.deleteDocumentType(credentials);
        if (response.data === false) {
          this.snackBarMessage = "Connection Error, Please try again";
          this.snackbar = true;
        } else {
          this.snackBarMessage = "Document Type deleted succesfully.";
          this.snackbar = true;
          this.refreshData();
          this.dialog2 = false;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(48), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    }
  }
};
</script>

<style scoped>
.mainView {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.subView2 {
  display: flex;
}
@media only screen and (max-width: 600px) {
  .mainView {
    flex-direction: column;
  }
  .subView2 {
    justify-content: space-evenly;
  }
}
</style>
