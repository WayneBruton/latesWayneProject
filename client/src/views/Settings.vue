<template>
  <div class="about temp">
    <br /><br /><br /><br /><br />
    <div style="display: flex; justify-content: center;">
      <h2>{{ this.$store.state.organisationName }}</h2>
      <br />
    </div>
    <div style="display: flex; justify-content: center;">
      <h1>Settings</h1>
    </div>
    <br />
    <v-card class="mx-auto" max-width="800" tile>
      <v-toolbar color="#010a43" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Change Setup</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list rounded>
        <v-subheader>ADJUST</v-subheader>
        <v-list-item-group v-model="item" color="#010a43">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <div class="mainView">
              <div>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.text"
                    style="white-space: normal;"
                  ></v-list-item-title>
                </v-list-item-content>
              </div>
              <v-spacer></v-spacer>
              <div class="subView2">
                <v-list-item-action>
                  <v-btn
                    :id="item.id"
                    rounded
                    pr-10
                    :color="color"
                    dark
                    :to="item.action"
                    >Edit</v-btn
                  >
                </v-list-item-action>
              </div>
            </div>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <br /><br /><br />
  </div>
</template>

<script>
export default {
  name: "settings",
  metaInfo: {
    title: `PerfectStaff - Settings`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {
      color: "",
      item: 0,
      items: [
        {
          id: 1,
          text: "Edit Employees",
          icon: "mdi-account",
          action: { name: "editEmployees" }
        },
        {
          id: 3,
          text: "Edit StaffTypes",
          icon: "mdi-account-plus",
          action: { name: "editStaffTypes" }
        },
        {
          id: 3,
          text: "Edit DocumentTypes",
          icon: "mdi-file",
          action: { name: "editDocumentTypes" }
        },
        {
          id: 4,
          text: "Edit Company Details",
          icon: "mdi-nature-people",
          action: { name: "editcompanydetails" }
        }
        // {
        //   id: 4,
        //   text: "Choose a theme",
        //   icon: "mdi-invert-colors",
        //   action: { name: "editColorTheme" }
        // }
      ]
    };
  },
  beforeMount() {
    this.color = "#010a43";
  }
};
</script>

<style scoped>
.mainView {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.subView2 {
  display: flex;
}
@media only screen and (max-width: 600px) {
  .mainView {
    flex-direction: column;
  }
  .subView2 {
    justify-content: space-evenly;
  }
}
</style>
