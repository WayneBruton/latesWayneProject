<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="800px">
      <template v-slot:activator="{ on }">
        <v-btn
          width="165"
          color="#010a43"
          outlined
          text
          dark
          v-on="on"
          @click="run"
          >Watch Video</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">How it works</span>
        </v-card-title>
        <v-card-text>
          <v-col cols="12" xs="12" sm="10" md="10" offset-md="1" offset-sm="1">
            <youtube
              :video-id="videoId"
              :fitParent="true"
              ref="youtube"
            ></youtube>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// import VueYouTubeEmbed from "vue-youtube-embed";

export default {
  name: "Register",
  data() {
    return {
      dialog: false,
      videoId: "21ZBJMfKtaY"
    };
  },
  components: {},
  mounted() {},
  methods: {
    run() {
      this.dialog = true;
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    }
  }
};
</script>

<style>
.v-dialog {
  position: absolute;
  top: 55px;
  /* top: auto; */
  /* top:unset; */
}
</style>
