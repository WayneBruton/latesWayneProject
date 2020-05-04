<template class="temp">
  <div class="temp">
    <br /><br /><br /><br /><br />

    <v-flex xs12 md8 sm8 lg8 xl8 offset-md2 offset-xl2 offset-sm2 offset-lg2>
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br /><br />
      <v-card elevation="15" color="pink">
        <v-card-title style="color: white;">
          <span class="headline">Payment Cancelled</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row style="color: white;">
              <p>You payment was cancelled.</p>
              <b />
              <p>You will get redirected to the sms pricing page</p>
            </v-row>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" @click="returnHome"
            ><v-icon>mdi-account-cash</v-icon></v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-flex>
    <br /><br />
  </div>
</template>

<script>
export default {
  name: "pmtcancelSMS",
  data() {
    return {};
  },
  async mounted() {
    setTimeout(() => {
      this.returnHome();
    }, 3000);
  },
  methods: {
    returnHome() {
      this.$router.push({ name: "textunits" });
    }
  }
};
</script>

<style styles>
.temp {
  min-height: 95vh;
}
</style>
