<template>
  <div>
    <v-app-bar app color="#010a43" dark>
      <div class="d-flex align-center home" @click="goHome">
        <v-img
          src="../assets/logo.svg"
          contain
          alt="Vuetify Logo"
          width="30"
          height="30"
          style="margin-right: 5px; border: 1px solid white; border-radius: 7%;"
        />
        <span class="mr-2 headerHome home">PerfectStaff</span>
        <v-spacer></v-spacer>

        <!-- <country-flag :country="iso" size="normal" v-if="iso" /> -->
      </div>
      <!-- <v-spacer></v-spacer> -->
      <country-flag
        v-if="this.$store.state.isLoggedIn"
        :country="this.$store.state.country"
        size="normal"
      />
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
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "Header",
  data() {
    return {
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
        }
      ],
      offset: true,
      windowWidth: 0,
      txt: "",
      iso: "",

      location: null,
      gettingLocation: false,
      errorStr: ""
    };
  },
  beforeMount() {
    if (!this.$store.state.isLoggedIn) {
      this.showPosition();
      // this.logFlag()
    }
  },
  mounted() {
    // console.log("WindowWidth", window.outerWidth);
    // console.log("WindowWidth", window.innerWidth);
    this.windowWidth = window.innerWidth;
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
      // console.log("country", this.$store.state.country);
    });
    // console.log("country", this.$store.state.country);
    // this.getCountry()
    // this.showPosition();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  watch: {
    // iso: function() {
    //   if (!this.$store.state.isLoggedIn) {
    //     // this.showPosition();
    //   } else {
    //     this.iso = this.$store.state.country;
    //   }
    // }
  },
  methods: {
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
      this.showPosition()
        .then(this.getCountry())
        .catch(e => console.log(e));
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
</style>
