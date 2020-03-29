<template>
  <div class="about">
    <br /><br />
    <v-container>
      <v-layout wrap>
        <v-flex mb-5 xs12 md8 offset-md2>
          <br />
          <v-flex justify-center mb-2 mt-5 xs12>
            <h1>About PerfectStaff</h1>
          </v-flex>
          <!-- <br>
          <v-btn @click="back" color="#010a43" dark>Back</v-btn> -->
          <br /><br />
          <h3>Introduction</h3>
          <br />
          <p>
            PerfectStaff is a dynamic online method to ensure that your Standard
            Operating Procedures(SOP's) are read and acknowledged by your staff,
            contractors or any relevent individuals that deal with you and/or
            your organisation.
          </p>
          <p>
            With more and more organisations allowing their staff to work
            remotely or outsourcing functions, you <strong>need</strong> a
            system that your staff, clients, contractors are made aware of how
            you expect them to operate and what your policies and procedures are
            in that regard.
            <!-- <a @click="goto">Hello</a> -->
          </p>
          <h3>How it works</h3>
          <br />
          <p>
            Once you <em>register</em> you can then add policies (SOP's) and
            employees. You can also load personal personnel documents for a
            specific employee, user or contractor. The concerned employee /
            contractor etc then receives an email informing them that there are
            documents on the system that they are required to read and
            acknowledge. On the administators dashboard you can monitor
            compliance in this regard and take whatever necessary action you
            deem fit or that the organisation deems fit.
          </p>
          <p>
            The number of documents or the number of employees / users you can
            load is entirely dependent on the <a @click="goto">package</a>

            that you have subscribed to. The initial <em>free</em> package
            allows you to <em>"test drive"</em> the system with up three users /
            employees and 200Mb worth of cumulative document size. Thereafter
            you will need to subscribe to a
            <a @click="goto"><em>"Paid Package"</em></a> suitable to your needs.
            In effect you can:
          </p>
          <ul>
            <li>
              Load Policies (SOP's) as well as personal personnel documents on
              the system
            </li>
            <li>Create users / employees on the system</li>
            <li>
              Monitor compliance in regards to your policies and take corrective
              action
            </li>
          </ul>
          <ul>
            <li>Print reports, global and individual</li>
            <li>
              Email reminders to itinirent staff / contractors
            </li>
            <li>
              Delete policies and personnel documents
            </li>
            <li>
              Delete employees from the system
            </li>
          </ul>
          <br />
          <h3>Customisation</h3>
          <br />
          <p>
            We offer customisation as aservice should you wish to have your own
            dedicated app with your own domain <em>not</em> shared with other
            organisations, with your own theme, logo, images etc. Your own
            reports and customised changes. To find out, drop us a
            <a @click="gotoContact">line here</a> or
            <a href="mailto:support@perfectstaff.com">email</a> to
            support@perfectstaff.com explaining what your requirements are and
            we will quote you accordingly.
          </p>
          <br />
          <h3>Your information</h3>
          <br />
          <p>
            Your information on the system is important to you and to us, we
            will:
          </p>
          <ul>
            <li>
              not sell or rent it to a third party without your permission —
              although unless you opt out (see below), we may use your contact
              information to provide you with information we believe you need to
              know or may find useful, such as (for example) news about our
              services and products and modifications to the Terms of Service;
            </li>
            <li>
              take commercially reasonable precautions to protect the
              information from loss, misuse and unauthorized access, disclosure,
              alteration and destruction, however we cannot accept any liability
              for loss, misuse and unauthorized access, disclosure, alteration
              and destruction of data or information;
            </li>
            <li>not use or disclose the information except:</li>
            <ul>
              <li>
                as necessary to provide services or products you have ordered,
                such as (for example) by providing it to a carrier to deliver
                products you have ordered;
              </li>
              <li>
                as required by law, for example, in response to a subpoena or
                search warrant;
              </li>
              <li>
                to outside auditors who have agreed to keep the information
                confidential;
              </li>
              <li>as necessary to enforce the Terms of Service;</li>
              <li>
                as necessary to protect the rights, safety, or property of
                PerfectStaff, its users, or others; this may include (for
                example) exchanging information with other organizations for
                fraud protection and/or risk reduction.
              </li>
            </ul>
          </ul>
          <br />
          <h3>Cookies / European Union etc</h3>
          <br />
          <p>
            Please see PerfectStaff's
            <a @click="gotoPrivacy">privacy policy</a>.
          </p>
          <h3>Questions or comments?</h3>
          <br />
          <p>
            If you have questions or comments about PerfectStaff's privacy
            policy, send an
            <a href="mailto:support@perfectstaff.com">email</a> to
            support@perfectstaff.com, or contact us via any of the ways
            described in the About Us page at URL of PerfectStaff's website.
          </p>
          <br />
          <p>Thank you for choosing <strong>PerfectStaff!</strong></p>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "about",
  methods: {
    back() {
      this.$router.back();
    },
    goto() {
      this.$router.push({ name: "pricing" });
    },
    gotoContact() {
      this.$router.push({ name: "contact" });
    },
    gotoPrivacy() {
      this.$router.push({ name: "privacypolicy" });
    }
  }
};
</script>

<style scoped>
h3 {
  color: #010a43;
  text-decoration-line: underline;
}
a {
  text-decoration: none;
  color: black;
}
h1 {
  color: #010a43;
}
</style>
