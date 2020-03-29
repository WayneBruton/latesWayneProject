import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Policies from "../views/Policies";
import Employees from "../views/Employees";
import Settings from "../views/Settings";
import Contact from "../views/Contact";
import Faq from "../views/Faq";
import ViewDoc from "../views/ViewDoc";
import Pricing from "../views/Pricing";
import EditEmployees from "../views/EditEmployees";
import EditDocumentTypes from "../views/EditDocumentTypes";
import EditStaffTypes from "../views/EditStaffTypes";
import PrivacyPolicy from "../views/PrivacyPolicy";
import Editcompanydetails from "../views/EditCompanyDetails";
import EditColorTheme from "../views/EditColorTheme";

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
    component: About
  },
  {
    path: "/policies",
    name: "policies",
    component: Policies
  },
  {
    path: "/employees",
    name: "employees",
    component: Employees
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact
  },
  {
    path: "/faq",
    name: "faq",
    component: Faq
  },
  {
    path: "/viewDoc",
    name: "viewDoc",
    component: ViewDoc
  },
  {
    path: "/pricing",
    name: "pricing",
    component: Pricing
  },
  {
    path: "/editEmployees",
    name: "editEmployees",
    component: EditEmployees
  },
  {
    path: "/editDocumentTypes",
    name: "editDocumentTypes",
    component: EditDocumentTypes
  },
  {
    path: "/editStaffTypes",
    name: "editStaffTypes",
    component: EditStaffTypes
  },
  {
    path: "/privacyPolicy",
    name: "privacypolicy",
    component: PrivacyPolicy
  },
  {
    path: "/editcompanydetails",
    name: "editcompanydetails",
    component: Editcompanydetails
  },
  {
    path: "/editColorTheme",
    name: "editColorTheme",
    component: EditColorTheme
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
