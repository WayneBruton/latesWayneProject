<template>
  <v-row justify="center">
    <div
      v-if="
        this.$store.state.usageAvailable > 0 && !this.$store.state.hasExpired
      "
    >
      <v-dialog v-model="dialog" persistent scrollable max-width="750px">
        <template v-slot:activator="{ on }">
          <v-btn :color="color" dark v-on="on" rounded pr-10 @click="uploadData"
            >Upload</v-btn
          >
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Document Details</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <div class="popup-visible" v-if="!processing">
                <v-row>
                  <v-col cols="12" xs="12" sm="6" md="6">
                    <v-file-input
                      show-size
                      accept="application/pdf"
                      label="File input"
                      v-model="file"
                      @change="size"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="6">
                    <v-text-field
                      label="Name*"
                      v-model="fileName"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="12">
                    <v-textarea
                      label="Description*"
                      v-model="description"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="6">
                    <v-autocomplete
                      :items="typesOfDocument"
                      label="Document type"
                      v-model="documentAffected"
                      item-text="documentType"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="6">
                    <v-autocomplete
                      :items="typesOfStaff"
                      label="Staff Member"
                      v-model="staffAffected"
                      item-text="name"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </div>
              <div class="popup-visible" v-if="processing">
                <v-progress-circular
                  :size="70"
                  :width="7"
                  color="#010a43"
                  indeterminate
                >
                  <small>Loadng</small>
                </v-progress-circular>
                <!-- </v-col> -->
              </div>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->
            <v-btn color="#010a43" text @click="dialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#010a43" text @click="uploadPolicy">upload</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-else>
      <v-dialog v-model="dialog2" persistent max-width="800px">
        <template v-slot:activator="{ on }">
          <v-btn rounded color="red" dark v-on="on">subscribe</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Maximum Filesize Used</span>
          </v-card-title>
          <v-card-text>
            <span
              >You have reached the maximum filesize for your package or your
              subscription has expired.</span
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
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "Register",
  data() {
    return {
      dialog: false,
      dialog2: false,
      file: null,
      documentAffected: [],
      typesOfDocument: [],
      color: "",
      staffAffected: [],
      // staffAffectedByID: [],
      typesOfStaff: [],
      organisationName: "",
      organisationID: "",
      fileName: "",
      description: "",
      snackbar: false,
      snackBarMessage: "Hello, I'm a snackbar",
      processing: false
    };
  },
  components: {},
  async mounted() {
    this.color = "#010a43";
  },
  methods: {
    async uploadPolicy() {
      try {
        if (
          this.file === null ||
          this.fileName === "" ||
          this.organisationName === "" ||
          this.organisationID === "" ||
          this.description === ""
        ) {
          this.snackBarMessage = "All fields must be filled in";
          return (this.snackbar = true);
        } else {
          this.processing = true;
          this.staffAffectedByID = [];
          let documentType = this.typesOfDocument.filter(el => {
            return el.documentType === this.documentAffected;
          });
          let staffAffectedByID = this.typesOfStaff.filter(el => {
            return el.name === this.staffAffected;
          });
          this.staffAffectedByID = staffAffectedByID[0].id;
          let formData = new FormData();
          formData.append("file", this.file);
          formData.append("FileName", this.fileName);
          formData.append("organisationName", this.organisationName);
          formData.append("organisationID", this.organisationID);
          formData.append("description", this.description);
          formData.append("staffID", staffAffectedByID[0].id);
          formData.append("lname", staffAffectedByID[0].lname);
          formData.append("fname", staffAffectedByID[0].fname);
          formData.append("documentType", documentType[0].id);
          let response = await DirectoryService.uploadEmployeefile(formData);
          if (response.data.error) {
            this.snackBarMessage = "Error uploading file";
            this.processing = false;
            return (this.dialog = true);
          }
          this.$emit("EEDocsuccess", staffAffectedByID[0].id);
          this.file = [];
          this.fileName = "";
          this.staffAffectedByID = [];
          this.staffAffected = [];
          this.description = "";
          this.$set(this.file, []);
          this.processing = false;
          this.dialog = false;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(29), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    async uploadData() {
      this.scrollToTop();
      this.organisationName = this.$store.state.organisationName;
      this.organisationID = this.$store.state.organisationID;
      let credentials = {
        id: this.organisationID
      };
      try {
        let response = await DirectoryService.getEmployees(credentials);
        response.data[0].forEach(el => {
          el.name = el.lname + " - " + el.fname;
        });
        this.typesOfStaff = response.data[0];
        this.typesOfDocument = response.data[1];
      } catch (error) {
        this.snackBarMessage = "Network Error(30), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    size() {
      // console.log("Size", this.file.size);
      if (this.file.size > 10000000) {
        this.file = null;
        this.snackBarMessage = "File size cannot exceed 1Mb";
        return (this.snackbar = true);
      }
    },
    upgrade() {
      this.$router.push({ name: "pricing" });
      this.dialog2 = false;
    }
  }
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
