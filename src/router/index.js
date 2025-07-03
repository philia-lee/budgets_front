import { createRouter, createWebHistory } from "vue-router"

// 팀원 1: 인증 및 핵심 기능
import Login from "../views/auth/Login.vue"
import Register from "../views/auth/Register.vue"
import Profile from "../views/auth/Profile.vue"
import Transactions from "../views/transactions/TransactionList.vue"
import TransactionForm from "../views/transactions/TransactionForm.vue"
// import Categories from "../views/categories/CategoryList.vue"

// 팀원 2: 분석 및 예산
import Statistics from "../views/statistics/Statistics.vue"
import Budget from "../views/budget/Budget.vue"
// import Notifications from "../views/notifications/Notifications.vue"
// import Calendar from "../views/calendar/Calendar.vue"

// 팀원 3: 소셜 기능
import Groups from "../views/groups/GroupList.vue"
// import GroupDetail from "../views/groups/GroupDetail.vue"
// import Comparison from "../views/comparison/Comparison.vue"

// 홈
import Home from "../views/Home.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  // 팀원 1: 인증 관련
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  // 팀원 1: 거래 관련
  {
    path: "/transactions",
    name: "Transactions",
    component: Transactions,
  },
  {
    path: "/transactions/new",
    name: "NewTransaction",
    component: TransactionForm,
  },
  {
    path: "/transactions/:id/edit",
    name: "EditTransaction",
    component: TransactionForm,
  },
  // 팀원 1: 카테고리 관리
  // {
  //   path: "/categories",
  //   name: "Categories",
  //   component: Categories,
  // },
  // 팀원 2: 통계 및 분석
  {
    path: "/statistics",
    name: "Statistics",
    component: Statistics,
  },
  {
    path: "/budget",
    name: "Budget",
    component: Budget,
  },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   component: Notifications,
  // },
  // {
  //   path: "/calendar",
  //   name: "Calendar",
  //   component: Calendar,
  // },
  // 팀원 3: 소셜 기능
  {
    path: "/groups",
    name: "Groups",
    component: Groups,
  },
  // {
  //   path: "/groups/:id",
  //   name: "GroupDetail",
  //   component: GroupDetail,
  // },
  // {
  //   path: "/comparison",
  //   name: "Comparison",
  //   component: Comparison,
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
