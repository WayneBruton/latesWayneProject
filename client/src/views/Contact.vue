<template>
  <div class="about temp">
    <br /><br /><br /><br /><br /><br />
    <div style="display: flex; justify-content: center;">
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br />
    </div>
    <br /><br />
    <v-row justify="center">
      <v-card elevation="15" width="800" max-width="90%">
        <v-card-title>
          <span class="headline">Contact PerfectStaff</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12" v-if="!isLoggedIn">
                <v-text-field
                  v-model="email"
                  label="email*"
                  type="email"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" xs="12" sm="6" md="6" v-if="!isLoggedIn">
                <v-text-field
                  label="First Name*"
                  v-model="firstName"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6" v-if="!isLoggedIn">
                <v-text-field
                  label="Last Name*"
                  v-model="lastName"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="12">
                <v-text-field
                  label="Subject*"
                  v-model="subject"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-textarea
                  label="Content*"
                  v-model="content"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#010a43" text @click="reset">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="send">Send</v-btn>
        </v-card-actions>
      </v-card>
      <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
        {{ snackBarMessage }}
        <v-btn color="pink" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-row>
    <br /><br /><br /><br />
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "contact",
  metaInfo: {
    title: `PerfectStaff - Contact`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {
      timeOut: 2000,
      subject: "",
      content: "",
      email: "",
      firstName: "",
      lastName: "",
      userID: null,
      isLoggedIn: false,
      snackbar: false,
      snackBarMessage: "Awesome"
    };
  },
  async mounted() {
    try {
      this.isLoggedIn = this.$store.state.isLoggedIn;
      if (this.isLoggedIn) {
        this.userID = this.$store.state.userID;
        let credentials = {
          id: this.userID
        };
        let response = await DirectoryService.getUser(credentials);
        // console.log(response.data)
        this.email = response.data[0].email;
        this.firstName = response.data[0].fname;
        this.lastName = response.data[0].lname;
      }
    } catch (error) {
      this.snackBarMessage = "Network Error(54), please try later!";
      this.snackbar = true;
      // this.dialog = false;
    }
  },
  methods: {
    async send() {
      try {
        if (
          this.subject === "" ||
          this.content === "" ||
          this.email === "" ||
          this.firstName === "" ||
          this.lastName === ""
        ) {
          this.snackBarMessage = "All fields must be filled in.";
          return (this.snackbar = true);
        } else {
          let credentials = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            subject: this.subject,
            message: this.content
          };
          let response = await DirectoryService.contactform(credentials);
          // console.log(response.data);
          if (response.data.error) {
            this.snackBarMessage =
              "There was a problem, please try again later.";
            this.snackbar = true;
          } else {
            this.subject = "";
            this.content = "";
            if (!this.isLoggedIn) {
              this.email = "";
              this.lastName = "";
              this.firstName = "";
            }
            this.snackBarMessage = `${this.firstName}, your message has been sent. We will get back to you.`;
            this.snackbar = true;
          }
          // console.log(credentials)
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(55), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    reset() {
      this.subject = "";
      this.content = "";
      if (!this.isLoggedIn) {
        this.email = "";
        this.lastName = "";
        this.firstName = "";
      }
    }
  }
};
</script>

<style styles>
.temp {
  min-height: 95vh;
}
</style>
