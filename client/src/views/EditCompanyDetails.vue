<template>
  <div class="about temp">
    <br /><br /><br /><br /><br /><br />
    <div style="display: flex; justify-content: center;">
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br />
    </div>
    <br /><br />
    <v-row justify="center">
      <v-card elevation="15" max-width="90%">
        <v-card-title>
          <span class="headline">Organisation Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-text-field
                  label="Organisation Name*"
                  v-model="organisationName"
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
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <label for="">Contact Number</label>
                <vue-tel-input
                  v-model="phone.number"
                  @onInput="onInput"
                ></vue-tel-input>
                <span v-if="!phone.isValid" style="color: red;"
                  ><strong>This is not a valid number</strong>,&nbsp;
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
                    v-model="country"
                    :country="country"
                    topCountry="ZA"
                  />
                </div>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <div class="countriesDiv">
                  <region-select
                    class="country"
                    v-model="region"
                    :country="country"
                    :region="region"
                  />
                </div>
              </v-col>
              <br /><br /><br />
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#010a43" text @click="resetForm">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="upDate">Update</v-btn>
        </v-card-actions>
      </v-card>
      <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
        {{ snackBarMessage }}
        <v-btn color="pink" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-row>
    <br /><br /><br />
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "editcompanydetails",
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
      timeOut: 2000,
      organisationID: null,
      value: String,
      snackbar: false,
      snackBarMessage: "Hello, I'm a snackbar",
      showStrengthMeter: false,
      resetFields: [],
      organisationName: "",
      registrationNumber: "",
      VATNumber: "",
      email: "",
      address1: "",
      address2: "",
      address3: "",
      country: "",
      region: "",
      city: "",
      phone: {
        number: "",
        isValid: false,
        country: undefined
      },
      zipCode: "",
      contactNumber: ""
    };
  },
  beforeMount() {
    this.refreshData();
  },
  methods: {
    onInput({ number, isValid, country }) {
      this.phone.number = number.input;
      this.phone.isValid = isValid;
      this.phone.country = country;
      // console.log(country.name);
    },
    async refreshData() {
      try {
        this.organisationID = this.$store.state.organisationID;
        let credentials = {
          id: this.organisationID
        };
        let response = await DirectoryService.getOrganisationDetails(
          credentials
        );

        this.organisationName = response.data[0].organisationName;
        this.registrationNumber = response.data[0].registrationNumber;
        this.VATNumber = response.data[0].VATNumber;
        this.email = response.data[0].email;
        this.address1 = response.data[0].address1;
        this.address2 = response.data[0].address2;
        this.address3 = response.data[0].address3;
        this.country = response.data[0].country;
        this.region = response.data[0].province;
        this.city = response.data[0].city;
        this.zipCode = response.data[0].zipCode;
        this.phone.number = response.data[0].contactNumber;
        this.phone.isValid = true;
        this.resetFields.push(response.data[0]);
      } catch (error) {
        this.snackBarMessage = "Network Error(49), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    resetForm() {
      // console.log(this.resetFields[0]);
      this.organisationName = this.resetFields[0].organisationName;
      this.registrationNumber = this.resetFields[0].registrationNumber;
      this.VATNumber = this.resetFields[0].VATNumber;
      this.email = this.resetFields[0].email;
      this.address1 = this.resetFields[0].address1;
      this.address2 = this.resetFields[0].address2;
      this.address3 = this.resetFields[0].address3;
      this.country = this.resetFields[0].country;
      this.region = this.resetFields[0].province;
      this.city = this.resetFields[0].city;
      this.zipCode = this.resetFields[0].zipCode;
      this.phone.number = this.resetFields[0].contactNumber;
      this.phone.isValid = true;
    },
    async upDate() {
      try {
        if (
          this.organisationName === "" ||
          this.email === "" ||
          this.address1 === "" ||
          this.country === "" ||
          this.region === "" ||
          this.city === "" ||
          this.zipCode === "" ||
          !this.phone.isValid ||
          this.phone.number === ""
        ) {
          this.snackBarMessage =
            "Please ensure all relevent fields are completed";
          this.snackbar = true;
        } else {
          let credentials = {
            id: this.organisationID,
            organisationName: this.organisationName,
            registrationNumber: this.registrationNumber,
            VATNumber: this.VATNumber,
            email: this.email,
            address1: this.address1,
            address2: this.address2,
            address3: this.address3,
            country: this.country,
            province: this.region,
            city: this.city,
            zipCode: this.zipCode,
            contactNumber: this.phone.number
          };
          let response = await DirectoryService.updateOrganisationDetails(
            credentials
          );
          // console.log(response.data);
          if (response.data) {
            this.resetFields = [];
            this.resetFields.push(credentials);
            this.snackBarMessage = "Company details successfully updated.";
            let details = {
              organisationName: this.organisationName,
              country: this.country
            };
            this.$store.dispatch("updateOrganisationName", details);
            return (this.snackbar = true);
          } else {
            this.snackBarMessage = "Could not update at this time";
            return (this.snackbar = true);
          }
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(51), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    }
  }
};
</script>
