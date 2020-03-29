<template>
  <div class="about temp">
    <br /><br /><br /><br />
    <v-flex
      wrap
      xs12
      md8
      sm8
      lg8
      xl8
      offset-md2
      offset-xl2
      offset-sm2
      offset-lg2
      justify="center"
    >
      <v-row justify="center">
        <h1>Frequently asked questions</h1>
      </v-row>
    </v-flex>
    <br /><br /><br />
    <v-flex xs12 md8 sm8 lg8 xl8 offset-md2 offset-xl2 offset-sm2 offset-lg2>
      <v-row justify="center">
        <v-expansion-panels popout dark>
          <v-expansion-panel
            v-for="(item, i) in items"
            :key="i"
            color="#010a43"
          >
            <v-expansion-panel-header color="#010a43" class="header">{{
              item.title
            }}</v-expansion-panel-header>
            <v-expansion-panel-content dark color="primary">
              {{ item.explanation }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels popout dark>
          <v-expansion-panel
            v-for="(item, i) in itemsGeneral"
            :key="i"
            color="#010a43"
          >
            <v-expansion-panel-header color="#010a43" class="header">{{
              item.title
            }}</v-expansion-panel-header>
            <v-expansion-panel-content color="lightgray">
              {{ item.explanation }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels popout dark>
          <v-expansion-panel
            v-for="(item, i) in itemsStranger"
            :key="i"
            color="primary"
          >
            <v-expansion-panel-header color="#010a43" class="header">{{
              item.title
            }}</v-expansion-panel-header>
            <v-expansion-panel-content color="lightgray">
              {{ item.explanation }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-flex>
    <br /><br /><br />
  </div>
</template>

<script>
export default {
  name: "faq",
  data() {
    return {
      color: "",
      items: [
        {
          title: "How do I upload a policy",
          explanation: `On the policy page, simply click the upload button in the "Upload Policies" section, then simply navigate to the file you wish to upload, fill in "All" the fields and click upload.`
        },
        {
          title: "How do I delete a policy",
          explanation: `Navigate to the policy section on the Policies page, there is a red "trash" icon, click this and follow the prompts.`
        },
        {
          title: "How do I add / remove or edit policy document categories?",
          explanation: `Go to settings. click edit where it says "Edit Staff Types" Here you can add, edit and delete.`
        },
        {
          title: "How do I upload an Employee Document?",
          explanation: `Go to the employees page, click upload, navigate to the file you wish to upload, fill in the fields and click upload.`
        },
        {
          title: "How do I create an Employee?",
          explanation: `Go to the employees page, click add employee, fill in the fields and click add.`
        },
        {
          title: "How do I edit or delete an Employee?",
          explanation: `Go to settings. click edit where it says "Edit Employees" Here you can add, edit and delete.`
        },
        {
          title: "How do I add / remove or Edit employee document types?",
          explanation: `Go to settings. click edit where it says "Edit Document types" Here you can add, edit and delete.`
        },
        {
          title:
            "I have used up my maximum in employee numbers or disk space allowed?",
          explanation: `The system blocks what you have reached a maximum on. If employees, then you cannot add more, similarly with documents (policies or staff documents). 
          You can delete files if that is where the maximum has been reached or in the case of employees / users - delete some there too. Or you can upgrade to a package that suitsyour needs.`
        },
        // {
        //   title: "Where are my confidential documents stored?",
        //   explanation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        //     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        //     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        //     aliquip ex ea commodo consequat.`
        // },
        {
          title: "Is it safe to pay online?",
          explanation: `Yes, PerfectStaff uses Payfast as a payment gateway.`
        },
        {
          title: "Do I get a discount for an annual payment?",
          explanation: `Our prices are on the pricing page, annual payments are cheaper.`
        },
        {
          title: "Can I set up a recurring payment?",
          explanation: `Yes, when you subscribe to a package you have that option. If you have already signed up but did not choose recurring you will have to manually pay each month. Should you wish to change this then contact us via the contact page.`
        },
        {
          title: "I am an NPO or NGO, do I get a special rate?",
          explanation: `If you are a registered NGO, you can contact us in that regard.`
        }
      ],
      itemsGeneral: [
        // {
        //   title: "Why must I acknowledge I have read a policy?",
        //   explanation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        //     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        //     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        //     aliquip ex ea commodo consequat.`
        // },
        // {
        //   title: "What if I dont understand a policy?",
        //   explanation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        //     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        //     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        //     aliquip ex ea commodo consequat.`
        // }
      ],
      itemsStranger: [
        // {
        //   title: "How do I signup",
        //   explanation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        //     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        //     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        //     aliquip ex ea commodo consequat.`
        // },
        // {
        //   title: "What is your pricing like?",
        //   explanation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        //     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        //     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        //     aliquip ex ea commodo consequat.`
        // },
        // {
        //   title: "Can I try for free?",
        //   explanation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        //     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        //     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        //     aliquip ex ea commodo consequat.`
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
.header {
  font-size: 105%;
}
</style>
