<template>
  <div class="home">
    <br /><br /><br />
    <NotLoggedIn v-if="!this.$store.state.isLoggedIn" />
    <AdministratorDashboard
      v-if="this.$store.state.isLoggedIn && this.$store.state.isAdministrator"
    />
    <!-- @CookieNotAcceptedLogin="test" -->
    <EmployeeDashboard
      v-if="
        this.$store.state.isLoggedIn &&
          !this.$store.state.isAdministrator &&
          this.$store.state.userIsEmployee
      "
    />
  </div>
</template>

<script>
// window.localStorage.getItem('cookie:accepted')
// window.localStorage.removeItem('cookie:accepted')

import NotLoggedIn from "../components/NotLoggedIn";
import AdministratorDashboard from "../components/AdministratorDashboard";
import EmployeeDashboard from "../components/EmployeeDashboard";
export default {
  name: "home",
  metaInfo: {
    title: `PerfectStaff - Home`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {
      cookiesAccepted: false
    };
  },
  components: {
    NotLoggedIn,
    AdministratorDashboard,
    EmployeeDashboard

    // CookieLaw
    // Cookie
  },
  // mounted() {
  //   // console.log(process.env.VUE_APP_TEST);
  //   this.$nextTick(() => {
  //         if (window.localStorage.getItem('cookie:accepted') === "true") {
  //       this.cookiesAccepted = true
  //   }
  //     });

  // },
  methods: {}
};
</script>

<style scoped>
.cookieAccept {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  background-color: green;
  color: white;
  font-weight: bold;
}
</style>
