import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
// import About from "../views/About.vue";
// import Policies from "../views/Policies";
// import Employees from "../views/Employees";
// import Settings from "../views/Settings";
// import Contact from "../views/Contact";
// import Faq from "../views/Faq";
// import ViewDoc from "../views/ViewDoc";
// import Pricing from "../views/Pricing";
// import EditEmployees from "../views/EditEmployees";
// import EditDocumentTypes from "../views/EditDocumentTypes";
// import EditStaffTypes from "../views/EditStaffTypes";
// import PrivacyPolicy from "../views/PrivacyPolicy";
// import Editcompanydetails from "../views/EditCompanyDetails";
// import EditColorTheme from "../views/EditColorTheme";
// import PmtSuccess from "../views/PmtSuccess";
// import PmtCancel from "../views/PmtCancel";
// import Terms from "../views/Terms";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "About" */ "../views/About.vue")
    // component: About
  },
  {
    path: "/policies",
    name: "policies",
    // component: Policies,
    component: () =>
      import(/* webpackChunkName: "Policies" */ "../views/Policies")
  },
  {
    path: "/employees",
    name: "employees",
    // component: Employees,
    component: () =>
      import(/* webpackChunkName: "Employees" */ "../views/Employees")
  },
  {
    path: "/settings",
    name: "settings",
    // component: Settings,
    component: () =>
      import(/* webpackChunkName: "Settings" */ "../views/Settings")
  },
  {
    path: "/contact",
    name: "contact",
    // component: Contact,
    component: () =>
      import(/* webpackChunkName: "Contact" */ "../views/Contact")
  },
  {
    path: "/faq",
    name: "faq",
    // component: Faq,
    component: () => import(/* webpackChunkName: "Faq" */ "../views/Faq")
  },
  {
    path: "/viewDoc",
    name: "viewDoc",
    // component: ViewDoc,
    component: () =>
      import(/* webpackChunkName: "ViewDoc" */ "../views/ViewDoc")
  },
  {
    path: "/pricing",
    name: "pricing",
    // component: Pricing,
    component: () =>
      import(/* webpackChunkName: "Pricing" */ "../views/Pricing")
  },
  {
    path: "/editEmployees",
    name: "editEmployees",
    // component: EditEmployees,
    component: () =>
      import(/* webpackChunkName: "EditEmployees" */ "../views/EditEmployees")
  },
  {
    path: "/editDocumentTypes",
    name: "editDocumentTypes",
    // component: EditDocumentTypes,
    component: () =>
      import(
        /* webpackChunkName: "EditDocumentTypes" */ "../views/EditDocumentTypes"
      )
  },
  {
    path: "/editStaffTypes",
    name: "editStaffTypes",
    // component: EditStaffTypes,
    component: () =>
      import(/* webpackChunkName: "EditStaffTypes" */ "../views/EditStaffTypes")
  },
  {
    path: "/privacyPolicy",
    name: "privacypolicy",
    // component: PrivacyPolicy,
    component: () =>
      import(/* webpackChunkName: "PrivacyPolicy" */ "../views/PrivacyPolicy")
  },
  {
    path: "/editcompanydetails",
    name: "editcompanydetails",
    // component: Editcompanydetails,
    component: () =>
      import(
        /* webpackChunkName: "EditCompanyDetails" */ "../views/EditCompanyDetails"
      )
  },
  {
    path: "/editColorTheme",
    name: "editColorTheme",
    // component: EditColorTheme,
    component: () =>
      import(/* webpackChunkName: "EditColorTheme" */ "../views/EditColorTheme")
  },
  {
    path: "/pmtsuccess",
    name: "pmtsuccess",
    // component: PmtSuccess,
    component: () =>
      import(/* webpackChunkName: "PmtSuccess" */ "../views/PmtSuccess")
  },
  {
    path: "/pmtsuccessSMS",
    name: "pmtsuccessSMS",
    // component: PmtSuccess,
    component: () =>
      import(/* webpackChunkName: "PmtSuccess" */ "../views/PmtSuccessSMS")
  },
  {
    path: "/pmtcancel",
    name: "pmtcancel",
    // component: PmtCancel,
    component: () =>
      import(/* webpackChunkName: "PmtCancel" */ "../views/PmtCancel")
  },
  {
    path: "/terms",
    name: "terms",
    // component: Terms,
    component: () => import(/* webpackChunkName: "Terms" */ "../views/Terms")
  },
  {
    path: "/textunits",
    name: "textunits",
    // component: Terms,
    component: () =>
      import(/* webpackChunkName: "Terms" */ "../views/TextUnits")
  },
  {
    path: "/pmtCancelSMS",
    name: "pmtCancelSMS",
    // component: Terms,
    component: () =>
      import(/* webpackChunkName: "Terms" */ "../views/PmtCancelSMS")
  },
  {
    path: "/viewmydocs/:org/:id",
    name: "/viewmydocs",
    // component: Terms,
    component: () =>
      import(/* webpackChunkName: "Terms" */ "../views/ViewMyDocs")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
