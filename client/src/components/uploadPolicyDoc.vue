<template>
  <v-row justify="center">
    <div
      v-if="
        this.$store.state.usageAvailable > 0 && !this.$store.state.hasExpired
      "
    >
      <v-dialog v-model="dialog" scrollable persistent max-width="750px">
        <template v-slot:activator="{ on }">
          <v-btn :color="color" dark v-on="on" rounded pr-10 @click="loadData"
            >Upload</v-btn
          >
        </template>
        <v-card max-width="90%" max-height="525">
          <v-card-title>
            <span class="headline">Document Details</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <div v-if="!processing">
                <v-row>
                  <v-col cols="12" xs="12" sm="6" md="6">
                    <v-file-input
                      show-size
                      accept="application/pdf"
                      label="File input*"
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
              </div>
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
            <v-btn color="#010a43" text @click="dialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#010a43" text @click="uploadPolicy">Upload</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-else>
      <v-dialog v-model="dialog2" persistent max-width="800px">
        <template v-slot:activator="{ on }">
          <v-btn rounded color="red" dark v-on="on">upgrade</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Maximum Filesize Used</span>
          </v-card-title>
          <v-card-text>
            <span
              >You have reached the maximum filesize for your package or your
              package has expired.</span
            >
          </v-card-text>
          <v-card-actions>
            <v-btn color="#010a43" text @click="dialog2 = false">Later</v-btn>
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
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "Register",
  data() {
    return {
      dialog: false,
      dialog2: false,
      timeOut: 2000,
      file: null,
      color: "",
      staffAffected: [],
      staffAffectedByID: [],
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
          this.staffAffectedByID === [] ||
          this.description === ""
        ) {
          this.snackBarMessage = "All fields must be filled in";
          return (this.snackbar = true);
        } else {
          this.staffAffectedByID = [];
          this.processing = true;

          this.staffAffected.forEach(el => {
            let filtered = this.typesOfStaff.filter(el2 => {
              if (el === el2.staff_description) {
                return el2.id;
              }
            });

            this.staffAffectedByID.push(filtered[0].id);
          });

          if (this.staffAffectedByID.includes(this.typesOfStaff[0].id)) {
            this.staffAffectedByID = [this.typesOfStaff[0].id];
          }
          let formData = new FormData();
          formData.append("file", this.file);
          formData.append("FileName", this.fileName);
          formData.append("organisationName", this.organisationName);
          formData.append("organisationID", this.organisationID);
          formData.append("staffAffected", this.staffAffectedByID);
          formData.append("description", this.description);
          // console.log(formData);
          let response = await DirectoryService.uploadfile(formData);
          // console.log(response.data);
          if (response.data.error) {
            this.snackBarMessage = "Error uploading file";
            this.processing = false;
            return (this.dialog = true);
          }

          this.$emit("success", this.staffAffectedByID);

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
        this.snackBarMessage = "Network Error(21), please try later!";
        this.snackbar = true;
        this.dialog = false;
        this.processing = false;
      }
    },
    async loadData() {
      this.scrollToTop();
      try {
        this.organisationName = this.$store.state.organisationName;
        this.organisationID = this.$store.state.organisationID;
        let credentials = {
          id: this.organisationID
        };
        let response = await DirectoryService.staffTypes(credentials);

        this.typesOfStaff = response.data;
      } catch (error) {
        this.snackBarMessage = "Network Error(22), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    size() {
      if (this.file.size > 2000000) {
        this.file = [];
        this.snackBarMessage = "File size cannot exceed 2Mb";
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
.popup-visible {
  /* position: absolute; */
  display: flex;
  justify-content: center;
  z-index: 10;
}
</style>
