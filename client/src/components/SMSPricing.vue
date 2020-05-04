<template>
  <div>
    <v-flex
      center
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
          <div
            v-if="
              this.$store.state.isLoggedIn && this.$store.state.isAdministrator
            "
          >
            <h1>SMS Pricing</h1>
            <h4 v-if="iso == 'ZA'">Prices exclude VAT</h4>
            <h5>
              <a @click="terms"
                >By purchasing you agree to the terms and conditions</a
              >
            </h5>
            <h6 style="color: red;">
              Purchased SMS may take 24 hours to reflect!
            </h6>
          </div>
          <!-- <country-flag
          :country="iso"
          size="normal"
          style="border: 1px solid transparent;"
        /> -->
        </v-col>
      </v-row>
    </v-flex>

    <v-row>
      <v-col
        cols="12"
        xs="10"
        sm="9"
        md="6"
        lg="6"
        xl="6"
        offset-xs="1"
        offset-md="2"
        offset-sm="2"
        offset-lg="3"
        offset-xl="3"
      >
        <v-data-table
          search=""
          :items-per-page="itemsperpage"
          v-model="selected"
          @input="showselected"
          :headers="headers"
          :items="desserts"
          :single-select="singleSelect"
          item-key="id"
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
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog v-model="dialog" scrollable persistent max-width="650px">
      <v-card style="height: 600px;" max-width="90%" class="rounded-card">
        <v-card-title class="headline">Subscribe</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12">
                <small
                  >The details of the card holder - Change if needed.</small
                >
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <h6>Purchased SMS may take 24 hours to reflect!</h6>
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
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Credits"
                  placeholder="Credits"
                  v-model="credits"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6">
                <v-text-field
                  label="Price"
                  placeholder="Price"
                  v-model="price"
                  readonly
                >
                </v-text-field>
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
            <form :action="formAction" method="POST">
              <input type="hidden" name="merchant_id" :value="merchant_id" />
              <input type="hidden" name="merchant_key" :value="merchant_key" />

              <input type="hidden" name="return_url" :value="return_url" />

              <input type="hidden" name="cancel_url" :value="cancel_url" />

              <input type="hidden" name="notify_url" :value="notify_url" />

              <input type="hidden" name="name_first" :value="name_first" />
              <input type="hidden" name="name_last" :value="name_last" />
              <input
                type="hidden"
                name="email_address"
                :value="email_address"
              />
              <input type="hidden" name="cell_number" :value="cell_number" />

              <input type="hidden" name="m_payment_id" :value="m_payment_id" />

              <input type="hidden" name="amount" :value="amount" />
              <input type="hidden" name="item_name" :value="item_name" />

              <input
                type="hidden"
                name="item_description"
                :value="item_description"
              />

              <input type="hidden" name="email_confirmation" value="1" />
              <input
                type="hidden"
                name="confirmation_address"
                :value="confirmation_address"
              />

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

                <input type="hidden" name="frequency" :value="frequency" />

                <input type="hidden" name="cycles" value="12" />
              </div>
              <input type="hidden" name="signature" :value="signature" />

              <table v-if="checked">
                <tr>
                  <td colspan="2" align="center">
                    <input
                      style="margin-right: 15px;"
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
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "smspricingComponent",
  data() {
    return {
      timeOut: 2000,
      checked: false,
      dialog: false,
      hasExpired: false,
      radioGroup: 1,
      radioGroup1: 1,
      singleSelect: true,
      showSelect: false,
      selected: [],
      initial: [],
      iso: "za",
      headers: [
        {
          text: "Credits",
          align: "right",
          sortable: false,
          value: "credits"
        },
        {
          text: "Price (R)",
          align: "right",
          value: "price"
        }
      ],
      desserts: [
        {
          id: 1,
          credits: "200",
          price: "95.84"
        },
        {
          id: 2,
          credits: "500",
          price: "226.96"
        },
        {
          id: 3,
          credits: "1,000",
          price: "428.74"
        },
        {
          id: 4,
          credits: "2,000",
          price: "807.01"
        },
        {
          id: 5,
          credits: "3,000",
          price: "1,172.70"
        },
        {
          id: 6,
          credits: "5,000",
          price: "1,891.45"
        },
        {
          id: 7,
          credits: "10,000",
          price: "3,530.7"
        },
        {
          id: 8,
          credits: "20,000",
          price: "6,557.01"
        },
        {
          id: 9,
          credits: "30,000",
          price: "9,457.24"
        },
        {
          id: 10,
          credits: "50,000",
          price: "15,131.96"
        }
      ],
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

      return_url: "https://www.perfect-staff.com/pmtsuccessSMS",
      cancel_url: "https://www.perfect-staff.com/pmtcancelSMS",
      notify_url: "https://www.eccentrictoadprocessing.co.za/itnresponseSMS",
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
      credits: 0,
      price: 0,

      isDemo: true,
      itemsperpage: 5
    };
  },
  components: {
    // CountryFlag: () =>
    //   import(/* webpackChunkName: "CountryFlag" */ "vue-country-flag"),
  },
  mounted() {
    if (this.$store.state.isLoggedIn && this.$store.state.isAdministrator) {
      this.showSelect = true;
    } else {
      this.showSelect = false;
    }
    this.iso = "ZA";
  },
  methods: {
    refreshData() {},
    terms() {
      this.$router.push({ name: "terms" });
    },
    async createSignature() {
      try {
        let value = `
         merchant_id=${this.merchant_id}&merchant_key=${this.merchant_key}&return_url=${this.return_url}&cancel_url=${this.cancel_url}&notify_url=${this.notify_url}&name_first=${this.name_first}&name_last=${this.name_last}&email_address=${this.email_address}&cell_number=${this.cell_number}&m_payment_id=${this.m_payment_id}&amount=${this.amount}&item_name=${this.item_name}&item_description=${this.item_description}&email_confirmation=1&confirmation_address=${this.confirmation_address}&passphrase=${this.passphrase}`;

        let credentials = {
          value: value
        };
        let response = await DirectoryService.createSignature(credentials);
        this.signature = `${response.data.signature}`;
      } catch (error) {
        // console.log("THERE WAS AN ERROR");
      }
    },
    close() {
      this.selected = [];
      this.dialog = false;
    },
    showselected() {
      //   console.log(this.selected);
      if (this.selected.length > 0) {
        this.credits = this.selected[0].credits;
        this.price = this.selected[0].price;
        let amt = this.price;
        let credits = this.credits.replace(/,/, "");
        this.amount = amt.replace(/,/g, "");
        this.item_name = `${credits} Units`;
        this.item_description = `${credits} Units`;
        this.m_payment_id = `${this.$store.state.organisationID} ${credits}`;
        this.dialog = true;
      } else {
        this.credits = 0;
        this.price = 0;
      }
    }
  },
  computed: {}
};
</script>

<style scoped>
.rounded-card {
  border-radius: 50px;
}
</style>
