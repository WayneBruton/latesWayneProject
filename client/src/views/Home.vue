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
    NotLoggedIn: () =>
      import(/* webpackChunkName: "NotLoggedIn" */ "../components/NotLoggedIn"),
    AdministratorDashboard: () =>
      import(
        /* webpackChunkName: "AdministratorDashboard" */ "../components/AdministratorDashboard"
      ),
    EmployeeDashboard: () =>
      import(
        /* webpackChunkName: "EmployeeDashboard" */ "../components/EmployeeDashboard"
      )
  },
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
