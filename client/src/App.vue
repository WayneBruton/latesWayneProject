<template class="temp landscape">
  <v-app>
    <Header />
    <v-container fluid style="margin: 0px; padding: 0px; width: 100%">
      <div id="nav">
        <router-view />
      </div>
    </v-container>
    <Footer />
  </v-app>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "App",
  components: {
    Header,
    Footer
  },
  data: () => ({
    //
  })
};
</script>

<style>
.temp {
  min-height: 95vh;
}
</style>
