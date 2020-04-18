<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="800px">
      <template v-slot:activator="{ on }">
        <v-btn outlined :color="color" dark v-on="on" @click="checkOnline"
          >Register for Free</v-btn
        >
      </template>
      <v-card max-width="90%" mb20>
        <v-card-title>
          <span class="headline">Organisation Details</span>
        </v-card-title>
        <v-card-title>
          <h6>
            <a @click="terms"
              >By registering you agree to the terms and conditions</a
            >
          </h6>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-text-field
                  label="Organisation Name*"
                  v-model="organisationName"
                  @blur="checkOrgName"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Registration Number"
                  v-model="registrationNumber"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="VAT Number"
                  v-model="VATNumber"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  type="email"
                  label="Organisation Email*"
                  v-model="email"
                  @blur="checkOrgEmail"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <label for="">Contact Number</label>
                <vue-tel-input @onInput="onInput"></vue-tel-input>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12" v-if="phone.number">
                <span v-if="!phone.isValid"
                  >Is a valid number: <strong>{{ phone.isValid }}</strong
                  >,&nbsp;
                </span>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Address*"
                  v-model="address1"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Address*"
                  v-model="address2"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Address*"
                  v-model="address3"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Address"
                  v-model="address3"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="City*"
                  v-model="city"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Zip Code*"
                  v-model="zipCode"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <div class="countriesDiv">
                  <country-select
                    class="country"
                    v-model="countryReside"
                    :country="countryReside"
                    topCountry="ZA"
                  />
                </div>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <div class="countriesDiv">
                  <region-select
                    class="country"
                    v-model="region"
                    :country="countryReside"
                    :region="region"
                  />
                </div>
              </v-col>
              <br /><br /><br />
              <v-col cols="12" xs="12" sm="12" md="12">
                <hr />
                <hr />
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <span>ADMINISTRATOR DETAILS</span>
              </v-col>

              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="First name*"
                  v-model="fname"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Last name*"
                  v-model="lname"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="9" md="9">
                <v-text-field
                  type="email"
                  label="Email*"
                  v-model="userEmail"
                  required
                  @blur="checkUserEmail"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <div class="countriesDiv">
                  <v-row justify="center">
                    <div>
                      <span style="color: red">{{ warning }}</span>
                    </div>
                    <br /><br />
                    <!-- <div v-for="(item, index) in suggestions" :key="index">
                          <span style="color: red">{{ item.suggestion}}</span>
                      </div> -->
                  </v-row>
                  <v-row justify="center">
                    <br />
                    <label for="">Password</label>
                    <password
                      class="pword"
                      v-model="password"
                      :toggle="true"
                      @score="showScore"
                      @feedback="showFeedback"
                    />
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <!-- <v-btn color="blue darken-1" text @click="dialog = false" -->
          <v-btn color="#010a43" text @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="register">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import Password from "vue-password-strength-meter";
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "Register",
  data() {
    return {
      dialog: false,
      timeOut: 2000,
      color: "",
      value: String,
      snackbar: false,
      snackBarMessage: "",
      showStrengthMeter: false,
      organisationName: "",
      registrationNumber: "",
      VATNumber: "",
      email: "",
      address1: "",
      address2: "",
      address3: "",
      countryReside: "",
      // country: null,
      region: "",
      city: "",
      zipCode: "",
      contactNumber: "",
      phone: {
        number: "",
        isValid: false,
        country: undefined
      },
      fname: "",
      lname: "",
      userEmail: "",
      password: "",
      repeatPassword: "",
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      suggestions: [],
      warning: "",
      readyToPost: false,
      score: "",
      suggestion: ""
    };
  },
  components: {
    Password
  },
  mounted() {
    this.color = "#010a43";
  },
  methods: {
    terms() {
      this.$router.push({ name: "terms" });
    },
    onInput({ number, isValid, country }) {
      this.phone.number = number.input;
      this.phone.isValid = isValid;
      this.phone.country = country;
    },
    okayToPost() {
      if (
        this.organisationName === "" ||
        this.email === "" ||
        this.email === "" ||
        this.address1 === "" ||
        this.address2 === "" ||
        this.countryReside === "" ||
        this.region === "" ||
        this.city === "" ||
        this.zipCode === "" ||
        this.phone.number === "" ||
        !this.phone.isValid ||
        this.fname === "" ||
        this.lname === "" ||
        this.userEmail === "" ||
        this.password === ""
      ) {
        this.snackBarMessage = "All fields must be filled in";
        this.readyToPost = false;
        return (this.snackbar = true);
      } else {
        this.readyToPost = true;
      }
    },
    async checkOrgEmail() {
      if (this.email == null || this.email == "") {
        this.snackBarMessage = "Please Enter Email";
        return (this.snackbar = true);
      } else if (!this.reg.test(this.email)) {
        this.email = "";
        this.snackBarMessage = "Please Enter Correct Email";
        return (this.snackbar = true);
      }
      let credentials = {
        email: this.email
      };
      //I AM HERE ######‹‹‹‹‹‹‹‹‹‹‹‹######€€€€€€‹‹‹‹‹‹
      // DOING TRY CATCH BLOCKS
      try {
        let response = await DirectoryService.checkOrgEmail(credentials);
        if (response.data.length) {
          this.snackBarMessage = "This email already exists!";
          this.email = "";
          this.snackbar = true;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(6), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    async checkOrgName() {
      let credentials = {
        name: this.organisationName
      };
      try {
        let response = await DirectoryService.checkOrgName(credentials);

        if (response.data.length) {
          this.snackBarMessage = "Organisation name already exists!";
          this.organisationName = "";
          this.snackbar = true;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(7), please try later!";
        this.snackbar = true;
        this.dialog = false;
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
        if (response.data.length) {
          this.snackBarMessage = "This email already exists!";
          this.userEmail = "";
          this.snackbar = true;
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(8), please try later!";
        this.snackbar = true;
        this.dialog = false;
      }
    },
    showFeedback({ suggestions, warning }) {
      // console.log("🙏", suggestions);
      // console.log("⚠", warning);
      this.suggestion = suggestions;
      this.warning = "";
      this.warning = warning;
    },
    showScore(score) {
      // console.log("💯", score);
      this.score = score;
    },
    async register() {
      this.okayToPost();
      if (this.readyToPost) {
        let credentials = {
          organisationName: this.organisationName,
          registrationNumber: this.registrationNumber,
          VATNumber: this.VATNumber,
          email: this.email,
          address1: this.address1,
          address2: this.address2,
          address3: this.address3,
          country: this.countryReside,
          province: this.region,
          city: this.city,
          zipCode: this.zipCode,
          contactNumber: this.phone.number,
          fname: this.fname,
          lname: this.lname,
          emailUser: this.userEmail,
          password: this.password,
          userType: 1
        };
        try {
          this.$cookies.remove("token");
          this.dialog = false;
          let response = await DirectoryService.register(credentials);
          let details = response.data;
          // console.log(response.data);
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
        } catch (error) {
          this.snackBarMessage = "Network Error(9), please try later!";
          this.snackbar = true;
          this.dialog = false;
        }
      }
    },
    checkCookie() {
      if (window.localStorage.getItem("cookie:accepted") !== "true") {
        this.$emit("CookieNotAcceptedLogin");
        // console.log("No Cookie Accepted Login");
        setTimeout(() => {
          this.dialog = false;
        });
      } else {
        this.dialog = true;
      }
    },
    checkOnline() {
      this.scrollToTop();
      this.checkCookie();
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
