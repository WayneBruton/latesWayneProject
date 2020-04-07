import DirectoryService from "../services/DirectoryServices";
const MyPlugin = {
  install(Vue) {
    Vue.mixin({
      methods: {
        async getCurrentUsage() {
          let credentials = {
            id: this.$store.state.organisationID
          };
          let response = await DirectoryService.usageThusFar(credentials);
          // console.log(response.data)
          let documentSize = response.data[0][0].documentSize;
          let policySize = response.data[1][0].policySize;
          let userNumber = response.data[2][0].users;
          let packageOn = response.data[3][0].package;
          let packageUsed = response.data[4].filter(el => {
            return el.id === packageOn;
          });
          let usersAllowed = packageUsed[0].users;
          let usageAllowed = packageUsed[0].usageAllowed;
          let usersAvailable = usersAllowed - userNumber;
          let usageAvailable = (
            (usageAllowed * 1000000000 - documentSize - policySize) /
            1000000000
          ).toFixed(2);
          let expiry = Date.parse(response.data[3][0].expiry);
          // console.log("expiry", expiry);
          let today = Date.parse(new Date());
          let hasExpired = false;
          if (expiry <= today) {
            hasExpired = true;
          } else {
            hasExpired = false;
          }
          // console.log(today);
          let criteria = {
            usersAvailable: usersAvailable,
            usageAvailable: usageAvailable,
            hasExpired: hasExpired
          };
          this.$store.dispatch("availableAdditions", criteria);
        }
      }
    });
  }
};

export default MyPlugin;
