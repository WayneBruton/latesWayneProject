<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-5 xs12>
        <h2 class="headline font-weight-bold mb-3">Perfect Staff</h2>
        <br />

        <div class="homeScreenBtns">
          <Login
            class="componentBtn"
            @CookieNotAcceptedLogin="cookieForm"
            @offline="offline"
          />
          <PromoVideo
            class="componentBtn"
            @CookieNotAcceptedLogin="cookieForm"
            @offline="offline"
          />

          <Register
            class="componentBtn"
            @CookieNotAcceptedLogin="cookieForm"
            @offline="offline"
          />
        </div>
        <div
          style="display: flex; flex-direction: column; align-items: center;"
        >
          <br /><br />
          <!-- <img src="../assets/stopwatch-3933686_640.jpg" alt="" srcset=""> -->
          <v-img
            src="../assets/PerfectStaff.png"
            aspect-ratio="1.4"
            width="600"
            margin="auto"
            rel="preload"
          ></v-img>
          <!-- <br /><br /> -->
          <!-- <Register @CookieNotAcceptedLogin="cookieForm" @offline="offline" /> -->
        </div>
        <br /><br />
        <v-layout justify-center class="blurb">
          <div>
            <span color="white">
              Perfect Staff allows you to save your policies and staff
              documents. Further more you can monitor that staff are reading and
              acknowledging the fact that they have read and understand the
              documents. It empowers you to then take corrective action when
              needed.
            </span>
            <br /><br />
            <span>
              Try perfect staff at <strong>NO</strong> risk whatsover and trial
              it with up to three employees and 200MB of file storage.
              <strong>No bank details required.</strong> Just click the
              <Register
                @CookieNotAcceptedLogin="cookieForm"
                @offline="offline"
              />
              button and begin. Should you have any questions, just view our
              <v-btn text color="white" :to="{ name: 'faq' }"
                >frequently asked questions(FAQ)</v-btn
              >
              or view our
              <v-btn text color="white" :to="{ name: 'about' }"
                >About page</v-btn
              >
              or drop us an
              <v-btn text color="white" :to="{ name: 'contact' }">email</v-btn>
              via the contact page. We are always here to assist.
            </span>
          </div>
        </v-layout>
      </v-flex>
      <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
        {{ snackBarMessage }}
        <v-btn color="pink" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-layout>
    <!-- <Cookie :v-model="!cookiesAccepted" :dialog="cookiesAccepted"/> -->
    <Cookie
      :dialog="!cookiesAcceptedForm"
      @CloseCookies="cookiesAcceptedForm = true"
      @CookiesAccepted="cookiesAcceptedForm = true"
    />
  </v-container>
</template>

<script>
// import Cookie from "../components/Cookie";
// import Register from "../components/Register";
// import Login from "../components/Login";
// import PromoVideo from "../components/PromoVideo";
export default {
  name: "NotLoggedIn",
  data: () => ({
    cookiesAcceptedForm: false,
    timeOut: 2000,
    snackbar: false,
    snackBarMessage: ""
  }),
  // props: {
  //   dialog: false
  // },
  components: {
    // Register,
    // Login,
    // Cookie,
    // PromoVideo
    Register: () =>
      import(/* webpackChunkName: "RegisterC" */ "../components/Register"),
    Login: () => import(/* webpackChunkName: "Login" */ "../components/Login"),
    Cookie: () =>
      import(/* webpackChunkName: "Cookie" */ "../components/Cookie"),
    PromoVideo: () =>
      import(/* webpackChunkName: "PromoVideo" */ "../components/PromoVideo")
  },
  mounted() {
    // this.checkOnline();
    this.$nextTick(() => {
      if (window.localStorage.getItem("cookie:accepted") === "true") {
        this.cookiesAcceptedForm = true;
      }
    });
    // if (navigator.online) {
    //   console.log("Your connection is back")
    // } else {
    //   console.log("You have lost your internet connection")
    // }
  },
  methods: {
    cookieForm() {
      // console.log("No Cookies Accepted");
      // this.cookiesAccepted = true
      // setTimeout(() => {
      this.cookiesAcceptedForm = false;
      // })
    },
    // checkOnline() {
    //   if (navigator.online) {
    //     console.log("Your connection is back");
    //   } else {
    //     console.log("You have lost your internet connection");
    //   }
    // },
    offline() {
      this.snackBarMessage = "You seem to have lost your internet connection";
      this.snackbar = true;
    }
  }
  // updated() {
  //   this.cookiesAccepted = false
  // },
};
</script>

<style scoped>
.blurb {
  background-color: #010a43;
  padding: 35px;
  color: white;
}
.homeScreenBtns {
  display: flex;
  flex-direction: row;
}
@media only screen and (max-width: 600px) {
  .homeScreenBtns {
    display: flex;
    flex-direction: column;
    margin-bottom: 7px;
  }
  .componentBtn {
    margin-bottom: 25px;
  }
}
</style>
