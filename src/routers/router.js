import { createRouter, createWebHistory } from "vue-router";
import login from "../components/Login.vue";
import ShowUsers from "../components/ShowUsers.vue";
import Register from "../components/Register.vue";
import EditUser from "../components/EditUser.vue";
import Home from "../components/Home.vue";
import Vessels from "../components/Vessels.vue";
import Load from "../components/Load.vue";

import App from "@/App.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // Use the layout component as the wrapper

      children: [
        { path: "/home", component: Home },
        { path: "/users", component: ShowUsers },
        { path: "/users/create", component: Register },
        { path: "/users/edit/:id", component: EditUser },
        { path: "/vessels", component: Vessels },
        { path: "/load", component: Load },
      ],
    },
    { path: "/login", component: login },
  ],
});

export default router;
