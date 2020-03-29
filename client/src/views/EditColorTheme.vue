<template>
  <div class="about">
    <br /><br /><br /><br /><br />
    <div style="display: flex; justify-content: center;">
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br />
    </div>
    <div style="display: flex; justify-content: center;">
      <h1>Settings</h1>
    </div>
    <br />
    <br /><br />
    <v-card class="mx-auto" max-width="800" tile>
      <v-toolbar color="#010a43" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Edit Color Themes</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list rounded>
        <v-subheader>COLORS</v-subheader>
        <v-list-item-group v-model="item" color="#010a43">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon" :color="item.color"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <v-list-item-action>
              <v-flex>
                <v-btn
                  rounded
                  dark
                  :color="item.color"
                  :id="item.id"
                  @click="edit($event)"
                  >Change</v-btn
                >
              </v-flex>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <br /><br /><br />
    <v-snackbar v-model="snackbar" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "editColorTheme",
  data() {
    return {
      item: 0,
      items: [
        { id: 1, color: "#010a43", name: "default", icon: "mdi-invert-colors" },
        { id: 2, color: "purple", name: "purple", icon: "mdi-invert-colors" },
        { id: 3, color: "orange", name: "orange", icon: "mdi-invert-colors" },
        { id: 4, color: "primary", name: "primary", icon: "mdi-invert-colors" },
        {
          id: 5,
          color: "#F50057",
          name: "pink accent",
          icon: "mdi-invert-colors"
        },
        { id: 6, color: "#1DE9B6", name: "teal", icon: "mdi-invert-colors" },
        {
          id: 7,
          color: "#76FF03",
          name: "light green",
          icon: "mdi-invert-colors"
        },
        { id: 8, color: "#5D4037", name: "brown", icon: "mdi-invert-colors" }
      ],
      organisationID: null,
      snackBarMessage: "",
      snackbar: false
    };
  },
  async mounted() {
    this.organisationID = this.$store.state.organisationID;
    // this.refreshData();
  },
  methods: {
    async edit(event) {
      let targetID = parseInt(event.currentTarget.id);
      // console.log(targetID);
      let filtered = this.items.filter(el => {
        return el.id === targetID;
      });
      // console.log(filtered[0].color);
      let credentials = {
        organisation: this.$store.state.organisationID,
        colorChosen: filtered[0].color
      };
      let response = await DirectoryService.updateTheme(credentials);
      // console.log(response);
      if (response.status === 200) {
        // console.log("All Good!!");
        let criteria = {
          organisationTheme: filtered[0].color
        };
        this.$store.dispatch("changeTheme", criteria);
      }
    }
  }
};
</script>
