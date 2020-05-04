<template>
  <div class="about temp">
    <br /><br /><br /><br />
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
        <h1>{{ this.$store.state.organisationName }}</h1>
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
            this.$store.state.isLoggedIn && this.$store.state.isAdministrator
          "
        >
          <h1>You have {{ unitsAvailable }} unit/s available</h1>
        </div>

        <country-flag
          :country="iso"
          size="normal"
          style="border: 1px solid transparent;"
        />
        <br /><br />
        <v-btn color="#010a43" dark rounded @click="showPmt = !showPmt"
          >Purchase</v-btn
        >
      </v-col>
    </v-row>
    <div v-if="this.$store.state.country == 'ZA'">
      <div v-if="showPmt">
        <SMSPricing />
      </div>
      <br /><br />
      <!-- <v-card class="mx-auto" max-width="800" tile>
        <v-toolbar color="#010a43" dark>
          <v-spacer></v-spacer>
          <v-toolbar-title>Send SMS's - Coming Soon</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list rounded>
          <v-subheader>REPORTS</v-subheader>
          <v-list-item-group v-model="item" color="#010a43">
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.text"
                  style="white-space: normal;"
                ></v-list-item-title>
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-list-item-action>
                <v-flex>
                  <v-btn text><v-icon>mdi-cellphone-basic</v-icon>Send</v-btn>
                </v-flex>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card> -->
    </div>
    <div v-else :to="this.$router.back()">
      <br /><br /><br /><br />
      <v-flex center>
        <h3>THIS IS ONLY FOR SOUTH AFRICAN ORGANISATIONS AT THIS TIME</h3>
      </v-flex>
    </div>
  </div>
</template>

<script>
// import Pricing from "../components/Pricing";
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "textunits",
  metaInfo: {
    title: `PerfectStaff - Costs`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {
      item: 0,
      iso: "ZA",
      unitsAvailable: 0,
      showPmt: false,
      items: [
        { icon: "mdi-cellphone", text: "All Staff" },
        { icon: "mdi-cellphone", text: "Management" }
      ]
    };
  },
  components: {
    // Pricing
    SMSPricing: () =>
      import(
        /* webpackChunkName: "smspricingComponent" */ "../components/SMSPricing"
      ),
    CountryFlag: () =>
      import(/* webpackChunkName: "CountryFlag" */ "vue-country-flag")
  },
  async mounted() {
    let credentials = {
      organisation: this.$store.state.organisationID
    };
    let response = await DirectoryService.checkUnitsAvailable(credentials);
    // console.log(response.data)
    this.unitsAvailable = response.data[0].unitNumber;
  }
};
</script>

<style scoped></style>
