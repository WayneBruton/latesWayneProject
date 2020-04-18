<template class="temp landscape">
  <v-app>
    <Header />
    <v-container fluid style="margin: 0px; padding: 0px; width: 100%">
      <div id="nav">
        <transition name="slide-fade" mode="out-in">
          <router-view />
        </transition>
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
.fade-enter {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease-out;
}
.fade-leave-to {
  opacity: 0;
}
.slide-fade-enter {
  opacity: 0;
  transform: translateX(25px);
}
.slide-fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-25px);
}
.slide-up-enter {
  transform: translateY(25px);
}
.slide-up-enter-active {
  transition: transforml 0.8s ease;
}
</style>
