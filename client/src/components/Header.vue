<template>
  <div>
    <v-app-bar app color="#010a43" dark fixed>
      <div class="d-flex align-center home" @click="goHome">
        <v-img
          src="../assets/PerfectStaff.png"
          contain
          alt="Vuetify Logo"
          width="40"
          height="30"
          style="margin-right: 5px; border: 1px solid transparent; border-radius: 70%;"
        />
        <span class="mr-2 headerHome home">PerfectStaff</span>
        <v-btn
          dark
          text
          v-if="
            this.$store.state.isLoggedIn &&
              this.$store.state.isAdministrator &&
              $route.path !== '/'
          "
          ><v-icon>mdi-home</v-icon></v-btn
        >

        <country-flag
          v-if="this.$store.state.isLoggedIn"
          :country="this.$store.state.country"
          size="normal"
        />
      </div>

      <v-spacer></v-spacer>
      <v-btn
        text
        @click="goHome"
        v-if="!this.$store.state.isAdministrator && $route.path !== '/'"
      >
        <!-- <span class="mr-2">Home</span> -->
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-flex row v-if="windowWidth > 768">
        <v-spacer></v-spacer>

        <v-flex
          v-if="
            this.$store.state.isLoggedIn && this.$store.state.isAdministrator
          "
          row
        >
          <div v-for="(item, index) in menuItems" :key="index">
            <v-btn text :to="item.redirect">
              <span class="mr-2">{{ item.name }}</span>
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </div>
        </v-flex>
        <v-spacer></v-spacer>
        <v-btn text @click="logout" v-if="this.$store.state.isLoggedIn">
          <span class="mr-2">Logout</span>
          <v-icon>mdi-logout</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <!-- DROP DOWN MENU HERE -->
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text dark v-on="on">
              More
              <v-icon right class="ml-2">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list width="250">
            <div v-for="(item, index) in menuItemsAlways" :key="index">
              <v-list-item :to="item.redirect">
                <v-list-item-title
                  >{{ item.name }}
                  <v-icon small>{{ item.icon }}</v-icon>
                  <v-divider></v-divider>
                </v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
      </v-flex>
      <v-flex v-else>
        <!-- Here is mobile menu -->
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text dark v-on="on">
              <v-icon right class="ml-2">mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-spacer></v-spacer>
          <v-list :min-width="windowWidth * 1.5" :max-width="windowWidth * 1.5">
            <v-spacer></v-spacer>
            <div
              v-if="
                this.$store.state.isLoggedIn &&
                  this.$store.state.isAdministrator
              "
            >
              <div v-for="(item, index) in menuItems" :key="index">
                <v-list-item :to="item.redirect" color="primary">
                  <v-list-item-title
                    >{{ item.name }}
                    <v-icon small>{{ item.icon }}</v-icon>
                    <v-divider></v-divider>
                  </v-list-item-title>
                </v-list-item>
              </div>
            </div>
            <div v-for="(item, index) in menuItemsAlways" :key="index">
              <v-list-item :to="item.redirect" color="primary">
                <v-list-item-title
                  >{{ item.name }}
                  <v-icon small>{{ item.icon }}</v-icon>
                  <v-divider></v-divider>
                </v-list-item-title>
              </v-list-item>
            </div>
            <div v-if="this.$store.state.isLoggedIn">
              <v-list-item @click="logout" color="primary">
                <v-list-item-title
                  >Logout
                  <v-icon small>mdi-logout</v-icon>
                  <v-divider></v-divider>
                </v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
      </v-flex>
    </v-app-bar>
    <v-alert
      v-if="this.$store.state.hasExpired && this.$store.state.isLoggedIn"
      class="test"
      border="bottom"
      color="pink darken-1"
      dark
      dismissible
      elevation="12"
    >
      <div style="display: flex; justify-content: center; font-weight: bold;">
        Your subscription has expired! To resubscribe go to
        <v-btn
          text
          :to="{ name: 'pricing' }"
          style="padding-bottom: 10px; text-decoration: underline;"
          >Pricing</v-btn
        >
      </div>
    </v-alert>
    <v-row justify="center">
      <v-dialog
        v-if="
          this.$store.state.isLoggedIn &&
            expiryDays < 15 &&
            this.$store.state.isAdministrator
        "
        v-model="dialog"
        persistent
        max-width="450"
      >
        <v-card>
          <v-card-title class="headline"
            >Your subscription expires soon</v-card-title
          >
          <v-card-text>
            <span>
              Your package expires on
              {{ expiryDate | moment("dddd, MMMM Do YYYY") }}
            </span>
          </v-card-text>
          <v-card-text>
            <span> This is in less than {{ expiryDays }} days time. </span>
          </v-card-text>
          <v-card-actions xs12>
            <v-btn color="green darken-1" text @click="dialog = false"
              >Close</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="subscribe"
              >Subscribe</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
// import moment from "vue-moment";
export default {
  name: "Header",
  data() {
    return {
      expiryDate: Date,
      expiryDays: Number,
      dialog: true,
      menuItems: [
        {
          name: "Policies",
          redirect: { name: "policies" },
          icon: "mdi-file"
        },
        {
          name: "Employees",
          redirect: { name: "employees" },
          icon: "mdi-face"
        },
        // {
        //   name: "External",
        //   redirect: { name: "employees" },
        //   icon: "mdi-account-group"
        // },
        {
          name: "Settings",
          redirect: { name: "settings" },
          icon: "mdi-adjust"
        }
      ],
      menuItemsAlways: [
        {
          name: "About",
          redirect: { name: "about" },
          icon: "mdi-help"
        },
        {
          name: "Pricing",
          redirect: { name: "pricing" },
          icon: "mdi-currency-usd"
        },
        {
          name: "FAQ",
          redirect: { name: "faq" },
          icon: "mdi-account-question"
        },
        {
          name: "Contact",
          redirect: { name: "contact" },
          icon: "mdi-mail"
        },
        {
          name: "Terms",
          redirect: { name: "terms" },
          icon: "mdi-file-document-edit"
        }
      ],
      offset: true,
      windowWidth: 0,
      txt: "",
      iso: "",
      loggedIn: false,

      location: null,
      gettingLocation: false,
      errorStr: ""
    };
  },
  components: {
    // moment
  },
  async beforeMount() {
    if (this.$store.state.isLoggedIn) {
      this.loggedIn = true;
    }
  },
  mounted() {
    this.checkExpiry();
    // console.log("WindowWidth", window.outerWidth);
    // console.log("WindowWidth", window.innerWidth);
    this.windowWidth = window.innerWidth;
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
      // console.log("country", this.$store.state.hasExpired);
    });
    // console.log("country", this.$store.state.country);
    // this.getCountry()
    // this.showPosition();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  watch: {
    // loggedIn: function() {
    //     this.checkExpiry();
    // },
    // iso: function() {
    //   if (!this.$store.state.isLoggedIn) {
    //     // this.showPosition();
    //   } else {
    //     this.iso = this.$store.state.country;
    //   }
    // }
  },
  methods: {
    subscribe() {
      this.$router.push({ name: "pricing" });
      this.dialog = false;
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    goHome() {
      if (this.$router.currentRoute.name !== "home") {
        this.$router.push({ name: "home" });
      }
    },
    logout() {
      let criteria = null;
      this.loggedIn = false;
      this.$store.dispatch("logout", criteria);
      this.goHome();
    },
    showPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          // console.log("LOCATION", this.location);
          this.getCountry();
        });
      } else {
        alert("Sorry, your browser does not support HTML5 geolocation.");
      }
    },
    async getCountry() {
      //CHaNGE THIS IF REGISTERED
      try {
        let credentials = this.location;
        let response = await DirectoryService.getCountry(credentials);

        this.iso = response.data.code;
        let details = {
          country: response.data.code
        };
        this.$store.dispatch("country", details);
      } catch (error) {
        this.snackBarMessage = "Network Error(34), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    logFlag() {
      this.showPosition().then(this.getCountry());
      // .catch(e => console.log(e));
    }
  }
};
</script>

<style>
.headerHome {
  font-size: 150%;
  font-weight: bold;
}
.home:hover {
  cursor: pointer;
}
.test {
  top: 65px;
  /* text-decoration: underline; */
}
.headerBar {
  z-index: 2;
}
</style>
