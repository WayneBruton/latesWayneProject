<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="#010a43">
          <v-btn icon dark @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>Cookies</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="accept">Accept</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-flex mb-5 xs12>
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="12">
                  <!-- <v-text-area disabled outlined placeholder="Testing" justify="center"><span>Testing</span></v-text-area> -->
                  <h2 class="CookieHeader">Cookie Policy</h2>
                  <br /><br />
                  <span class="cookieText"
                    >This website uses 🍪 to ensure you get the best experience
                    on our website.</span
                  ><br />
                  <span class="cookieText"
                    >In order to use this website you need to accept
                    cookies.</span
                  ><br />
                  <span class="cookieText"
                    >We do not take any personal information whatsoever, it is
                    simply about improving your user experience.</span
                  ><br />
                  <span class="cookieText"
                    >Please feel free to view our cookie policy.
                    <v-btn text :to="{ name: 'privacypolicy' }"
                      >Privacy policy</v-btn
                    ></span
                  >
                </v-col>
              </v-row>
            </v-flex>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "cookie",
  props: {
    dialog: Boolean
  },
  data() {
    return {
      // dialogChange: false
    };
  },
  methods: {
    closeForm() {
      this.$emit("CloseCookies");
      // this.dialog
    },
    accept() {
      // window.localStorage.removeItem('cookie:accepted')
      window.localStorage.setItem("cookie:accepted", "true");
      console.log(
        "This is local Storage",
        window.localStorage.getItem("cookie:accepted")
      );
      // this.dialogChange = true
      this.$emit("CookiesAccepted");
      // this.dialog = false
    }
  }
};
</script>

<style scoped>
.CookieHeader {
  color: black;
}
.cookieText {
  color: black;
  font-size: 120%;
}
</style>
