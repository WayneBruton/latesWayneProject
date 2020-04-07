<template>
  <div class="about">
    <br /><br /><br />
    <br /><br />
    <div
      class="btnHolderOuter"
      v-if="!this.$store.state.isAdministrator && !checkbox"
    >
      <v-checkbox
        v-model="checkbox"
        :label="`I have read and understand the attached document`"
        @change="underStood"
      ></v-checkbox>
    </div>
    <v-flex class="mx-auto" xs="12" sm="6" md="6">
      <div class="btnHolderOuter">
        <div class="btnHolderinner">
          <v-btn text style="height: 30px;" @click="back">back</v-btn>
          <!-- <div v-if="numPages > 1"> -->
          <div v-show="numPages > 1">
            <vue-numeric-input
              style="height: 30x;"
              v-model.number="page"
              :min="1"
              :max="numPages"
              :step="1"
              size="95px"
              controls-type="plusminus"
            ></vue-numeric-input>
            <span style="height: 30px;" v-if="this.windowWidth > 768">
              of {{ numPages }}
            </span>
          </div>
          <v-btn
            v-if="this.windowWidth > 768"
            text
            style="margin-left: 3px;height: 30px;"
            @click="rotate += 90"
            >&#x27F3;</v-btn
          >
          <v-btn
            text
            style="height: 30px;"
            @click="rotate -= 90"
            v-if="this.windowWidth > 768"
            >&#x27F2;</v-btn
          >
          <v-btn text style="height: 30px;" @click="$refs.pdf.print()"
            >print</v-btn
          >
        </div>

        <div
          v-if="loadedRatio >= 0 && loadedRatio < 1"
          style="background-color: green; color: white; text-align: center"
          :style="{ width: loadedRatio * 100 + '%' }"
        >
          {{ Math.floor(loadedRatio * 100) }}%
        </div>
      </div>
      <v-progress-linear
        v-if="loading"
        indeterminate
        height="10"
        color="#010a43"
        style="position: absolute; width: 75%; left: 12.5%; margin-bottom: 10px;"
      ></v-progress-linear>
    </v-flex>
    <v-card class="mx-auto" max-width="1500" outlined style="margin-top: 10px;">
      <v-list-item>
        <br />
        <v-list-item-content>
          <div class="overline mb-4">{{ organisationName }}</div>
          <v-list-item-title class="headline mb-1">{{
            docName
          }}</v-list-item-title>
          <div
            v-if="loadedRatio > 0 && loadedRatio < 1"
            style="background-color: green; color: white; text-align: center"
            :style="{ width: loadedRatio * 100 + '%' }"
          >
            {{ Math.floor(loadedRatio * 100) }}%
          </div>
          <pdf
            class="pdfDoc"
            v-if="show"
            ref="pdf"
            style="border: 1px solid transparent"
            :src="src"
            :page="page"
            :rotate="rotate"
            @progress="loadedRatio = $event"
            @num-pages="numPages = $event"
            @link-clicked="page = $event"
          ></pdf>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import VueNumericInput from "vue-numeric-input";
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "viewDoc",
  metaInfo: {
    title: `PerfectStaff - View`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  components: {
    pdf,
    VueNumericInput
  },
  data() {
    return {
      show: true,
      checkbox: true,
      progress: true,
      readyToUpdate: false,
      src: "",
      page: 1,
      numPages: 0,
      url: "",
      rotate: 0,
      loadedRatio: 0,
      docName: "This is a policy",
      organisationName: "Palm Garden Retreat",
      windowWidth: 0,
      error: "",
      loading: false
    };
  },
  beforeMount() {
    this.docName = this.$store.state.documentName;
    this.organisationName = this.$store.state.organisationName;
    this.url = this.$store.state.documentURL;
    this.loading = true;
    if (!this.$store.state.isLoggedIn) {
      this.$router.push({ name: "home" });
    }
    this.checkbox = this.$store.state.documentRead;
    if (!this.checkbox) {
      this.readyToUpdate = true;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    // await DirectoryService.removeDoc({ url: this.url });
    // console.log(response);
  },

  mounted() {
    this.windowWidth = window.innerWidth;
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    let url = this.url;
    this.src = pdf.createLoadingTask(url);
    this.src.then(pdf => {
      this.numPages = pdf.numPages;
      this.loading = false;
    });
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    back() {
      this.$router.back();
    },
    async underStood() {
      try {
        if (
          !this.$store.state.documentRead &&
          this.checkbox &&
          this.readyToUpdate
        ) {
          // console.log("Hello");
          let credentials = {
            documentType: this.$store.state.documentType,
            documentID: this.$store.state.documentID,
            userID: this.$store.state.userID,
            organisationID: this.$store.state.organisationID
          };
          let response = await DirectoryService.postpolicyRead(credentials);
          if (response.data === true) {
            // console.log("DONE!!!!");
            this.readyToUpdate = false;
          }
          // this.$router.back();
        } else {
          // console.log("TEst Failed");
          this.back();
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(58), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    }
  }
  // error: function(err) {
  //   // console.log(err);
  //   this.back()

  // }
};
</script>

<style scoped>
.pdfDoc {
  display: inline-block;
  width: 100%;
}
.btnHolderOuter {
  display: flex;
  justify-content: center;
}
.btnHolderinner {
  width: 50%;
  display: flex;
  justify-content: space-around;
}
.v-progress-circular {
  margin: 1rem;
}
</style>

<style scoped>
@media screen and (max-width: 768px) {
  /* .btnHolderinner {
    width: 75%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items:stretch;
    height: 550px;
  } */
}
</style>
