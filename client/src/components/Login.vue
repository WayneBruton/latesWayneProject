<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="800px">
      <template v-slot:activator="{ on }">
        <v-btn
          width="165"
          :color="color"
          outlined
          dark
          v-on="on"
          @click="checkOnline"
          >Login</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-col cols="12" xs="12" sm="9" md="9">
              <v-text-field
                type="email"
                label="Email*"
                v-model="userEmail"
                required
                @blur="checkUserEmail"
              ></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="9" md="9" v-if="showAutocomplete">
              <v-autocomplete
                text
                :items="organisations"
                label="Organisation"
                v-model="organisationAffected"
                item-text="organisationName"
                @change="chooseOrganisation"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" xs="12" sm="9" md="9" v-if="!firstLogin">
              <v-text-field
                type="password"
                label="password*"
                v-model="password"
                required
                @focus="showReset"
              ></v-text-field>
            </v-col>

            <v-col cols="12" xs="12" sm="9" md="9" v-if="showCheckbox">
              <small
                >Do NOT log in as Administrator if you want to view your own
                documents.</small
              >
              <v-checkbox
                v-model="checkbox"
                :label="`Log in as Administrator: ${checkbox.toString()}`"
                @change="loginAs"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" xs="12" sm="12" md="12" v-if="firstLogin">
              <div class="countriesDiv">
                <v-col cols="12" xs="12" sm="9" md="9">
                  <v-text-field
                    label="OTP*"
                    v-model="userOTP"
                    required
                    @blur="checkOTP"
                  ></v-text-field>
                </v-col>
                <v-row justify="center">
                  <div>
                    <span style="color: red">{{ warning }}</span>
                  </div>
                  <br /><br />
                </v-row>
                <v-row
                  justify="center"
                  v-if="(systemOTP != null) & (systemOTP == userOTP)"
                >
                  <br />
                  <label for="">Create Password</label>
                  <password
                    class="pword"
                    v-model="password"
                    :toggle="true"
                    @feedback="showFeedback"
                  />
                </v-row>
              </div>
            </v-col>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#010a43" text @click="resetPassword" v-if="showResetBtn"
            >Reset Password</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
// import Cookie from "../components/Cookie"
import Password from "vue-password-strength-meter";
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "Register",
  data() {
    return {
      dialog: false,
      value: String,
      color: "",
      snackbar: false,
      checkbox: false,
      showCheckbox: false,
      showAutocomplete: false,
      organisations: [],
      organisationAffected: [],
      snackBarMessage: "Hello, I'm a snackbar",
      showStrengthMeter: false,
      canLoginIn: false,
      moreThanOneOrganisation: [],
      userEmail: "",
      // userEmail: "hazelcox@icloud.com",
      password: "",
      organisationID: null,
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      suggestions: [],
      warning: "",
      firstLogin: false,
      userType: 1,
      userOTP: null,
      systemOTP: null,
      showResetBtn: false
      // cookiesAccepted: false
    };
  },
  components: {
    Password
  },
  mounted() {
    this.color = "#010a43";
    this.$nextTick(() => {
      if (window.localStorage.getItem("cookie:accepted") !== "true") {
        this.$emit("CookieNotAcceptedLogin");
        this.dialog = false;
      }
    });
  },
  methods: {
    showReset() {
      this.showResetBtn = true;
    },
    async resetPassword() {
      if (this.userEmail === "" || this.organisationID === null) {
        this.userEmail = "";
        this.snackBarMessage = "Please enter email before pressing reset";
        this.snackbar = true;
      } else {
        try {
          this.firstLogin = true;
          let responseOTP = await DirectoryService.createOTP({
            id: this.organisationID,
            email: this.userEmail
          });
          // console.log("Response", responseOTP.data);
          this.systemOTP = responseOTP.data.OTP;
          // console.log(this.systemOTP);
        } catch (e) {
          this.snackBarMessage = "Connection error (1), Please try later";
          this.snackbar = true;
        }
      }
    },
    async chooseOrganisation() {
      let filtered = this.organisations.filter(el => {
        return el.organisationName === this.organisationAffected;
      });
      this.organisationID = filtered[0].organisation;
      this.userType = filtered[0].userType;
      if (this.userType === 1) {
        this.showCheckbox = true;
        this.checkbox = true;
      }
      if (filtered[0].firstLogin === 0) {
        this.firstLogin = false;
      } else {
        this.firstLogin = true;
        if (this.userEmail === "" || this.organisationID === null) {
          this.userEmail = "";
          this.snackBarMessage = "Please enter email before pressing reset";
          this.snackbar = true;
        } else {
          try {
            let responseOTP = await DirectoryService.createOTP({
              id: this.organisationID,
              email: this.userEmail
            });
            this.systemOTP = responseOTP.data.OTP;
            // console.log(this.systemOTP);
            this.snackBarMessage = "A One Time Pin (OTP) has been sent to you";
            this.snackbar = true;
          } catch (e) {
            this.snackBarMessage = "Network Error(2), Please try again later!";
            this.snackbar = true;
            this.dialog = false;
          }
        } //
      }
    },
    async checkUserEmail() {
      if (this.userEmail == null || this.userEmail == "") {
        this.snackBarMessage = "Please Enter Email";
        return (this.snackbar = true);
      } else if (!this.reg.test(this.userEmail)) {
        this.userEmail = "";
        this.snackBarMessage = "Please Enter Correct Email";
        return (this.snackbar = true);
      }
      let credentials = {
        email: this.userEmail
      };
      try {
        let response = await DirectoryService.checkUserEmail(credentials);
        if (!response.data.length) {
          this.snackBarMessage = "This email does not exist!";
          this.userEmail = "";
          return (this.snackbar = true);
        } else if (response.data.length > 1) {
          this.organisations = response.data;
          this.showAutocomplete = true;
        } else {
          this.organisationID = response.data[0].organisation;
          this.userType = response.data[0].userType;
          if (this.userType === 1) {
            this.showCheckbox = true;
            this.checkbox = true;
          }
          this.userType = response.data[0].userType;
          if (response.data[0].firstLogin === 0) {
            this.firstLogin = false;
          } else {
            this.firstLogin = true;
            if (this.userEmail === "" || this.organisationID === null) {
              this.userEmail = "";
              this.snackBarMessage = "Please enter email before pressing reset";
              this.snackbar = true;
            } else {
              let responseOTP = await DirectoryService.createOTP({
                id: this.organisationID,
                email: this.userEmail
              });
              this.systemOTP = responseOTP.data.OTP;
              // console.log(this.systemOTP);
              this.snackBarMessage =
                "A One Time Pin (OTP) has been sent to you";
              this.snackbar = true;
            }
          }
        }
      } catch (e) {
        this.snackBarMessage = "Network Error(3), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    loginAs() {
      if (this.checkbox === true) {
        this.userType = 1;
      } else {
        this.userType = 2;
      }
    },
    showFeedback({ warning }) {
      this.warning = "";
      this.warning = warning;
    },
    loginCheck() {
      if (
        this.organisationID === null ||
        this.email === "" ||
        this.password === ""
      ) {
        this.snackBarMessage = "All details need to be filled in";
        this.canLoginIn = false;
        this.snackbar = true;
      } else {
        this.canLoginIn = true;
      }
    },
    async normalLogin() {
      this.loginCheck();
      if (this.canLoginIn) {
        let credentials = {
          id: this.organisationID,
          password: this.password,
          email: this.userEmail
        };
        try {
          let response = await DirectoryService.login(credentials);
          // console.log(response)
          if (response.data.error) {
            this.snackBarMessage = response.data.error;
            this.dialog = false;
            return (this.snackbar = true);
          }
          let details = {
            organisationName: response.data.organisationName,
            organisationID: response.data.organisationID,
            country: response.data.country,
            fname: response.data.user.fname,
            lname: response.data.user.lname,
            userType: this.userType,
            userID: response.data.user.id
          };
          // console.log(response.data.country);
          this.$cookies.remove("token");
          let user = { token: response.data.token };
          this.$cookies.set(
            "token",
            user,
            60 * 60 * 24,
            null,
            null,
            false,
            "None"
          );

          this.$store.dispatch("login", details);
        } catch (e) {
          this.snackBarMessage = "Network problem(4). Please try again later";
          this.snackbar = true;
          this.dialog = false;
        }
      }
    },
    async firstTimeLogon() {
      this.loginCheck();
      if (this.canLoginIn) {
        let credentials = {
          id: this.organisationID,
          password: this.password,
          email: this.userEmail
        };
        try {
          let response = await DirectoryService.firstLogin(credentials);
          if (response.data.error) {
            this.snackBarMessage = response.data.error;
            this.dialog = false;
            return (this.snackbar = true);
          }
          let details = {
            organisationName: response.data.organisationName,
            organisationID: response.data.organisationID,
            country: response.data.country,
            fname: response.data.user.fname,
            lname: response.data.user.lname,
            userType: this.userType,
            userID: response.data.user.id
          };
          this.$cookies.remove("token");
          let user = { token: response.data.token };
          this.$cookies.set("token", user, 60 * 60 * 24);
          this.$store.dispatch("login", details);
        } catch (e) {
          this.snackBarMessage = "Network problem(5). Please try again later";
          this.snackbar = true;
          this.dialog = false;
        }
      }
    },
    login() {
      if (!this.firstLogin) {
        this.normalLogin();
      } else {
        this.firstTimeLogon();
      }
    },
    checkOTP() {
      if (this.userOTP != this.systemOTP) {
        this.userOTP = null;
        this.snackBarMessage = "OTP is incorrect";
        this.snackbar = true;
      }
    },
    checkCookie() {
      if (window.localStorage.getItem("cookie:accepted") !== "true") {
        this.$emit("CookieNotAcceptedLogin");
        setTimeout(() => {
          this.dialog = false;
        });
      } else {
        this.dialog = true;
      }
    },
    checkOnline() {
      this.checkCookie();
      this.scrollToTop();
    }
    // scrollToTop() {
    //   window.scrollTo(0, 0);
    // },
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
