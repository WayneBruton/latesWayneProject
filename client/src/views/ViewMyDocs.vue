<template>
  <div class="temp">
    <br /><br /><br /><br />
    <v-layout text-center wrap>
      <v-flex mb-5 xs12>
        <h1>Redirecting</h1>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  data() {
    return {
      id: parseInt(this.$route.params.id),
      org: parseInt(this.$route.params.org)
    };
  },
  async created() {
    let credentials = {
      id: this.id,
      organisation: this.org
    };
    // console.log("ORG",this.org)

    // console.log(credentials);
    let response = await DirectoryService.viewmydocs(credentials);
    this.$store.dispatch("logout");
    // console.log(response.data);
    let details = {
      // userType: response.data[0][0].userType,
      userType: 2,
      userID: response.data[0][0].id,
      lname: response.data[0][0].lname,
      fname: response.data[0][0].fname,
      userIsEmployee: true,
      organisationID: response.data[1][0].id,
      organisationName: response.data[1][0].organisationName,
      country: response.data[1][0].country
    };
    // console.log(details);
    this.$store.dispatch("login", details);
    this.$router.push({ name: "home" });
  }
};
</script>
