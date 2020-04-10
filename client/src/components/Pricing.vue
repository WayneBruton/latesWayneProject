<template>
  <div class="about">
    <!-- npm run lint -- --fix -->
    <br /><br /><br />
    <v-row>
      <v-col
        cols="12"
        xs="10"
        sm="9"
        md="9"
        lg="6"
        xl="6"
        offset-xs="1"
        offset-md="2"
        offset-sm="2"
        offset-lg="3"
        offset-xl="3"
      >
        <h2>{{ this.$store.state.organisationName }}</h2>
      </v-col>

      <!-- <v-col cols="12" xs="10" sm="8" md="8" lg="9" xl="8"> -->
      <v-col
        cols="12"
        xs="10"
        sm="9"
        md="9"
        lg="6"
        xl="6"
        offset-xs="1"
        offset-md="2"
        offset-sm="2"
        offset-lg="3"
        offset-xl="3"
      >
        <div
          v-if="
            this.$store.state.isLoggedIn &&
              this.$store.state.isAdministrator &&
              (this.$store.state.usersAvailable <= 0 ||
                this.$store.state.usageAvailable <= 0)
          "
        >
          <h1>Upgrade</h1>
          <h4 v-if="iso == 'ZA'">Prices exclude VAT</h4>
        </div>
        <div v-else>
          <h1>Pricing</h1>
          <h4 v-if="iso == 'ZA'">Prices exclude VAT</h4>
          <h5>
            <a @click="terms"
              >By purchasing you agree to the terms and conditions</a
            >
          </h5>
        </div>
        <country-flag
          :country="iso"
          size="normal"
          style="border: 1px solid transparent;"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        v-if="isFetching"
        xs="10"
        sm="9"
        md="9"
        lg="6"
        xl="6"
        offset-xs="1"
        offset-md="2"
        offset-sm="2"
        offset-lg="3"
        offset-xl="3"
      >
        <div style="display: flex; justify-content: center;">
          <v-progress-circular
            :size="70"
            :width="7"
            color="#010a43"
            indeterminate
          >
            <small>Fetching</small>
          </v-progress-circular>
        </div>
      </v-col>
      <v-col
        v-else
        cols="12"
        xs="10"
        sm="9"
        md="9"
        lg="6"
        xl="6"
        offset-xs="1"
        offset-md="2"
        offset-sm="2"
        offset-lg="3"
        offset-xl="3"
      >
        <!-- v-model="selected" -->
        <v-data-table
          v-model="selected"
          @input="showselected"
          :headers="headers"
          :items="desserts"
          :single-select="singleSelect"
          item-key="name"
          :show-select="showSelect"
          class="elevation-2"
        >
        </v-data-table>
      </v-col>
      <v-col
        cols="12"
        xs="10"
        sm="9"
        md="9"
        lg="6"
        xl="6"
        offset-xs="1"
        offset-md="2"
        offset-sm="2"
        offset-lg="3"
        offset-xl="3"
      >
        <div
          v-if="
            this.$store.state.isLoggedIn &&
              this.$store.state.isAdministrator &&
              (this.$store.state.usersAvailable <= 0 ||
                this.$store.state.usageAvailable <= 0)
          "
        >
          <span>{{
            new Date() | moment("add", "0 year, 0 months, 0 weeks, 0 days")
          }}</span>
        </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog v-model="dialog" scrollable persistent max-width="650px">
      <v-card style="height: 600px;">
        <v-card-title class="headline">Subscribe</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <!-- <v-col cols="12" xs="12" sm="12" md="12" justify-center>
                Select your subscription preferences
              </v-col> -->
              <v-col cols="12" xs="12" sm="12" md="12">
                <small
                  v-if="this.country !== 'ZA'"
                  style="color: red; font-weight: bold;"
                  >1 {{ this.countryCurrency }} -
                  {{
                    (this.exchangeRate / this.countryExchangeRate).toFixed(4)
                  }}
                  ZAR</small
                >
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <small
                  >The details of the card holder - Change if needed.</small
                >
              </v-col>

              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="First Name"
                  placeholder="First Name"
                  v-model="name_first"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Last Name"
                  placeholder="Last Name"
                  v-model="name_last"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="email"
                  placeholder="email"
                  v-model="email_address"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="cell number"
                  placeholder="cell number"
                  v-model="cell_number"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-radio-group
                  @change="monthlyAnnual($event)"
                  v-model="radioGroup"
                  class="choice"
                >
                  <v-radio
                    v-for="item in payData"
                    :key="item.id"
                    :label="`${item.type} ${item.payment}`"
                    :value="item.id"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12" v-if="!isAnnual">
                <v-radio-group
                  @change="recurring($event)"
                  v-model="radioGroup1"
                  class="choice"
                >
                  <v-radio
                    v-for="item in payFrequency"
                    :key="item.id"
                    :label="`${item.name} ${item.value}`"
                    :value="item.id"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-checkbox
                  v-model="checked"
                  label="I agree to the terms & conditions"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-btn color="#010a43" text @click="close">Cancel</v-btn>
            <v-spacer></v-spacer>
            <!-- required -->
            <form :action="formAction" method="POST">
              <input type="hidden" name="merchant_id" :value="merchant_id" />
              <input type="hidden" name="merchant_key" :value="merchant_key" />
              <!-- OPTIONAL -->
              <input type="hidden" name="return_url" :value="return_url" />
              <!-- value="https://www.eccentrictoad.com/return" -->

              <input type="hidden" name="cancel_url" :value="cancel_url" />
              <!-- value="https://www.eccentrictoad.com/cancel" -->

              <input type="hidden" name="notify_url" :value="notify_url" />
              <!-- value="https://www.eccentrictoad.com/notify" -->

              <input type="hidden" name="name_first" :value="name_first" />
              <input type="hidden" name="name_last" :value="name_last" />
              <input
                type="hidden"
                name="email_address"
                :value="email_address"
              />
              <input type="hidden" name="cell_number" :value="cell_number" />

              <!-- Optional -->
              <input type="hidden" name="m_payment_id" :value="m_payment_id" />
              <!-- required -->
              <input type="hidden" name="amount" :value="amount" />
              <input type="hidden" name="item_name" :value="item_name" />
              <!-- Optional -->
              <input
                type="hidden"
                name="item_description"
                :value="item_description"
              />
              <!-- <input type="hidden" name="custom_int1" value="2" />
                    <input
                      type="hidden"
                      name="custom_str1"
                      value="Extra order information"
                    /> -->

              <input type="hidden" name="email_confirmation" value="1" />
              <input
                type="hidden"
                name="confirmation_address"
                :value="confirmation_address"
              />

              <!-- <input type="hidden" name="payment_method" value="cc" /> -->
              <!-- 1 for recurring -->
              <div v-if="isRecurring">
                <input type="hidden" name="subscription_type" value="1" />
                <input
                  type="hidden"
                  name="billing_date"
                  :value="billing_date"
                />
                <input
                  type="hidden"
                  name="recurring_amount"
                  :value="recurring_amount"
                />
                <!-- 3 = Monthly 6 = Annual -->
                <input type="hidden" name="frequency" :value="frequency" />
                <!-- 0 = indefinate -->
                <input type="hidden" name="cycles" value="12" />
                <!-- REQUIRED -->
              </div>
              <input type="hidden" name="signature" :value="signature" />
              <!-- A security signature of the transmitted data taking the form of
                    an MD5 hash of the submitted variables. The string from which
                    the hash is created, is the concatenation of the name value
                    pairs of all the non-blank variables with ‘&’ used as a
                    separator eg. name_first=John&name_last=Doe&email_address=…
                    where pairs are listed in the order in which they appear on this
                    page. This hash will be regenerated by the PayFast engine and
                    the values compared to ensure the integrity of the data
                    transfer. -->
              <table v-if="checked">
                <tr>
                  <td colspan="2" align="center">
                    <input
                      class="payNow"
                      type="image"
                      src="https://www.payfast.co.za/images/buttons/dark-small-paynow.png"
                      width="165"
                      height="36"
                      alt="Pay Now"
                      title="Pay Now with PayFast"
                    />
                  </td>
                </tr>
              </table>
            </form>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { currencySymbols, countryCurrency } from "../services/currencies.js";
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "pricingComponent",
  data() {
    return {
      isFetching: false,
      checked: false,
      dialog: false,
      hasExpired: false,
      radioGroup: 1,
      radioGroup1: 1,
      singleSelect: true,
      showSelect: false,
      selected: [],
      initial: [],
      latitude: Number,
      longitude: Number,
      iso: "us",
      headers: [
        {
          text: "Package",
          align: "left",
          sortable: false,
          value: "name"
        },
        {
          text: "Usage (Gb)",
          align: "center",
          value: "usageAllowed"
        },
        {
          text: "Number of Employees",
          align: "center",
          value: "users"
        },
        {
          text: "Monthly Price",
          align: "right",
          value: "monthly",
          width: "150"
        },
        {
          text: "Annual Price",
          align: "right",
          value: "annual",
          width: "150"
        }
      ],
      desserts: [],
      snackBarMessage: "",
      snackbar: false,
      payData: [],
      payFrequency: [],
      isRecurring: false,
      isAnnual: false,
      countryCurrency: "",
      currencySymbol: "",
      exchangeRate: 15, //US exchange rate to ZAR,
      exchangeRatesAll: null,
      country: "", //CLIENT COUNTRY
      countryExchangeRate: 0, //CLIEND CURRENCY - USD

      // FORM DATA
      merchant_id: process.env.VUE_APP_MERCHANTID, //This is the real one
      merchant_key: process.env.VUE_APP_MECHANT_KEY, //THIS IS THE LIVE ONE
      formAction: process.env.VUE_APP_PAYFAST_URL, //LIVE
      passphrase: process.env.VUE_APP_PAYFAST_PASSPHRASE, // LIVE

      // merchant_id: process.env.VUE_APP_MERCHANTID_SANDBOX, //SANDBOX
      // merchant_key: process.env.VUE_APP_MECHANT_KEY_SANDBOX, //SANDBOX
      // formAction: process.env.VUE_APP_PAYFAST_URL_SANDBOX, //SANDBOX
      // passphrase: process.env.VUE_APP_PAYFAST_PASSPHRASE_SANDBOX, // SANDBOX

      return_url: "https://www.perfect-staff.com/pmtsuccess",
      cancel_url: "https://www.perfect-staff.com/pmtcancel",
      notify_url: "https://www.eccentrictoadprocessing.co.za/itnresponse",
      name_first: "Wayne",
      name_last: "Bruton",
      email_address: "waynebruton@gmail.com",
      cell_number: "0740628742",
      m_payment_id: "01AB", //UNIQUIE ID I CHOOSE
      amount: "100.00",
      item_name: "Test Item",
      item_description: "A test product",
      confirmation_address: "waynebruton@icloud.com", //MY ADDRESS
      //RECURRING
      subscription_type: "1", //1 for recurring
      billing_date: "2017-01-01",
      recurring_amount: "100.00",
      frequency: "3", //3 monthly 6 annual
      cycles: "12",
      signature: "",

      isDemo: true
    };
  },
  mounted() {
    // async mounted() {
    // let credentials = {
    //   ohNo: "Amazing"
    // };
    // let response = await DirectoryService.itnresponse(credentials);
    // console.log(response.data);

    this.isFetching = true;
    if (this.$store.state.isLoggedIn && this.$store.state.isAdministrator) {
      this.showSelect = true;
    } else {
      this.showSelect = false;
    }
    if (this.$store.state.country) {
      this.iso = this.$store.state.country;
    } else {
      this.iso = "ZA";
    }
    if (this.$store.state.country !== "ZA") {
      this.getExchange();
    } else {
      this.countryExchangeRate = 1;
      this.exchangeRate = 1;
      this.currencySymbol = "R";
      this.countryCurrency = "ZAR";
      this.refreshData();
    }
  },
  methods: {
    terms() {
      this.$router.push({ name: "terms" });
    },
    async createSignature() {
      try {
        let value;
        if (!this.isRecurring) {
          value = `
         merchant_id=${this.merchant_id}&merchant_key=${this.merchant_key}&return_url=${this.return_url}&cancel_url=${this.cancel_url}&notify_url=${this.notify_url}&name_first=${this.name_first}&name_last=${this.name_last}&email_address=${this.email_address}&cell_number=${this.cell_number}&m_payment_id=${this.m_payment_id}&amount=${this.amount}&item_name=${this.item_name}&item_description=${this.item_description}&email_confirmation=1&confirmation_address=${this.confirmation_address}&passphrase=${this.passphrase}`;
        } else {
          //I AM HERE
          value = `
         merchant_id=${this.merchant_id}&merchant_key=${this.merchant_key}&return_url=${this.return_url}&cancel_url=${this.cancel_url}&notify_url=${this.notify_url}&name_first=${this.name_first}&name_last=${this.name_last}&email_address=${this.email_address}&cell_number=${this.cell_number}&m_payment_id=${this.m_payment_id}&amount=${this.amount}&item_name=${this.item_name}&item_description=${this.item_description}&email_confirmation=1&confirmation_address=${this.confirmation_address}&subscription_type=1&billing_date=${this.billing_date}&recurring_amount=${this.recurring_amount}&frequency=${this.frequency}&cycles=${this.cycles}&passphrase=${this.passphrase}`;
        }

        let credentials = {
          value: value
        };
        let response = await DirectoryService.createSignature(credentials);
        // console.log(response.data.signature);
        this.signature = `${response.data.signature}`;
        // console.log(this.signature);
      } catch (error) {
        // console.log("THERE WAS AN ERROR");
      }
    },
    close() {
      this.selected = this.initial;
      this.dialog = false;
    },
    monthlyAnnual(event) {
      let amt;
      if (event === 1) {
        this.isAnnual = false;
        amt = parseInt(
          this.selected[0].monthly.match(/[0-9]+[.]+[0-9]+[0-9]/g)
        ).toFixed(2);
      } else if (event === 2) {
        this.isAnnual = true;
        amt = parseInt(
          this.selected[0].annual.match(/[0-9]+[.]+[0-9]+[0-9]/g)
        ).toFixed(2);
      }
      // console.log(amt);
      amt = ((amt / this.countryExchangeRate) * this.exchangeRate).toFixed(2);
      this.amount = amt;
      this.recurring_amount = amt;
      this.m_payment_id = `${this.$store.state.organisationID} ${
        this.selected[0].id
      } ${this.isAnnual} ${this.isRecurring} ${(this.amount * 100).toFixed(0)}`;
      // console.log(this.m_payment_id);
      this.createSignature();
    },
    recurring(event) {
      if (event === 1) {
        this.isRecurring = false;
        this.m_payment_id = `${this.$store.state.organisationID} ${
          this.selected[0].id
        } ${this.isAnnual} ${this.isRecurring} ${(this.amount * 100).toFixed(
          0
        )}`;
        // console.log(this.m_payment_id);
      } else if (event === 2) {
        this.isRecurring = true;
        this.m_payment_id = `${this.$store.state.organisationID} ${
          this.selected[0].id
        } ${this.isAnnual} ${this.isRecurring} ${(this.amount * 100).toFixed(
          0
        )}`;
        // console.log(this.m_payment_id);
      }
      this.createSignature();
    },
    async getExchange() {
      try {
        let response = await DirectoryService.exchangeRate();
        this.exchangeRate = response.data.ZAR;
        this.exchangeRatesAll = response.data.ALL;
        this.country = this.$store.state.country;
        // console.log(this.country);
        this.countryCurrency = countryCurrency[this.country];
        // console.log("$$$", this.countryCurrency);
        this.countryExchangeRate = this.exchangeRatesAll[this.countryCurrency];
        // console.log("AAAAA", this.countryExchangeRate);
        // console.log(currencySymbols[this.countryCurrency]);
        if (
          currencySymbols[this.countryCurrency] === undefined ||
          isNaN(this.countryExchangeRate)
        ) {
          this.currencySymbol = currencySymbols.USD.symbol;
          this.countryCurrency = "USD";
          this.countryExchangeRate = this.exchangeRatesAll.USD;
        } else {
          this.currencySymbol = currencySymbols[this.countryCurrency].symbol;
        }
        this.refreshData().then(() => {
          if (this.hasExpired) {
            this.processPmt();
          }
        });
      } catch (error) {
        this.snackBarMessage = "Network Error(52), please try later!";
        this.snackbar = true;
      }
    },
    async refreshData() {
      try {
        let credentials = {
          id: this.$store.state.organisationID
        };
        let response = await DirectoryService.getPackages(credentials);

        if (response.data[2].length === 0) {
          response.data[0].forEach(el => {
            el.name = el.packageName;
            el.monthly = "R " + el.monthly.toFixed(2);
            el.annual = "R " + el.annual.toFixed(2);
          });
        } else {
          if (
            response.data[2][0].country === "ZA" &&
            response.data[2].length !== 0
          ) {
            response.data[0].forEach(el => {
              el.name = el.packageName;
              el.monthly = "R " + el.monthly.toFixed(2);
              el.annual = "R " + el.annual.toFixed(2);
            });
          } else {
            response.data[0].forEach(el => {
              el.name = el.packageName;
              el.monthly = `${this.currencySymbol} ${(
                (el.monthly / this.exchangeRate) *
                this.countryExchangeRate *
                1.125
              ).toFixed(2)}`;
              el.annual = `${this.currencySymbol} ${(
                (el.annual / this.exchangeRate) *
                this.countryExchangeRate *
                1.125
              ).toFixed(2)}`;
            });
          }
        }
        this.desserts = response.data[0];
        if (response.data[1].length !== 0) {
          if (response.data[1][0].package !== null) {
            let filtered = response.data[0].filter(el => {
              return el.id === response.data[1][0].package;
            });
            this.selected = [];
            this.selected.push(filtered[0]);
            this.initial.push(filtered[0]);
            // console.log(Date.parse(response.data[1][0].expiry));
            // console.log(Date.parse(new Date().toString()));
            if (
              Date.parse(response.data[1][0].expiry) <
              Date.parse(new Date().toString())
            ) {
              this.hasExpired = true;
            } else {
              this.hasExpired = false;
            }
          }
        }
        this.isFetching = false;
      } catch (error) {
        this.snackBarMessage = "Network Error(53), please try later!";
        this.snackbar = true;
      }
    },
    processPmt() {
      this.scrollToTop();
      this.payData = [];
      this.payFrequency = [];
      let monthly = {
        id: 1,
        type: "Monthly",
        payment: this.selected[0].monthly
      };
      let annual = {
        id: 2,
        type: "Annual",
        payment: this.selected[0].annual
      };
      let recurringYes = {
        id: 1,
        name: "Recurring Payment",
        value: false
      };
      let recurringNo = {
        id: 2,
        name: "Recurring Payment",
        value: true
      };
      this.payData.push(monthly);
      this.payData.push(annual);
      this.payFrequency.push(recurringYes);
      this.payFrequency.push(recurringNo);
      this.isRecurring = false;
      this.isAnnual = false;
      // console.log(this.selected);

      // console.log(this.m_payment_id);
      this.item_name = `Package Name ${this.selected[0].packageName}`;
      this.item_description = `${this.selected[0].packageName} - users ${this.selected[0].users}`;
      let amt = parseInt(
        this.selected[0].monthly.match(/[0-9]+[.]+[0-9]+[0-9]/g)
      ).toFixed(2);
      // this.amount = "100.00";
      amt = ((amt / this.countryExchangeRate) * this.exchangeRate).toFixed(2);
      this.amount = amt;
      this.m_payment_id = `${this.$store.state.organisationID} ${
        this.selected[0].id
      } ${this.isAnnual} ${this.isRecurring} ${(this.amount * 100).toFixed(0)}`;

      // console.log(this.payData);
      // console.log(this.selected);
      this.recurring_amount = amt;
      let today = new Date();
      let thisMonth;
      let thisDay;
      if (today.getMonth() + 1 < 10) {
        thisMonth = `0${today.getMonth() + 1}`;
      } else {
        thisMonth = `${today.getMonth() + 1}`;
      }
      if (today.getDate() < 10) {
        thisDay = `0${today.getDate()}`;
      } else {
        thisDay = `${today.getDate()}`;
      }
      today = `${today.getFullYear()}-${thisMonth}-${thisDay}`;
      this.billing_date = today;
      this.createSignature();
      this.dialog = true;
    },
    showselected() {
      // this.payData = [];
      // this.payFrequency = [];
      if (!this.selected.every(e => this.initial.includes(e))) {
        if (this.selected[0].id < this.initial[0].id) {
          this.selected = this.initial;
        } else {
          this.processPmt();
        }
      }
    }
  },
  computed: {}
};
</script>

<style scoped>
.choice {
  /* border: 1px solid papayawhip; */
  margin: 2px 2px;
  padding: 3px 2px;
  background-color: rgba(176, 196, 222, 0.5);
  border: 1px solid rgba(176, 196, 222, 0.5);
  border-radius: 5px;
}

.payNow {
  margin-right: 7px;
}
</style>
