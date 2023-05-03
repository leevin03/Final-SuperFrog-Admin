import { createRouter, createWebHistory } from 'vue-router';
import AddStudent from './components/Add_Student.vue';
import ViewStudents from './components/View_Students.vue';
import AddRequest from './components/Add_Request.vue';
import ViewRequests from './components/View_Requests.vue';
import Login from './components/Login.vue';
import EditProfile from './components/Edit_Profile.vue';
import FindUser from './components/Find_User.vue';
import PerformanceReport from './components/Performance_Report.vue';
import PaymentReport from './components/Payment_Report.vue';
import FindRequest from './components/Find_Request.vue';

const routes = [
  {
    path: '/admin/add-student',
    component: AddStudent,
    meta: { requiresAuth: true, roles: ['SPIRITDIRECTOR'] },
  },
  {
    path: '/admin/view-students',
    component: ViewStudents,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/add-request',
    component: AddRequest,
    meta: { requiresAuth: true, roles: ['SPIRITDIRECTOR'] },
  },
  {
    path: '/admin/view-requests',
    component: ViewRequests,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/find-request',
    component: FindRequest,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/edit-profile',
    component: EditProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/find-student',
    component: FindUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/performance-report',
    component: PerformanceReport,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/payment-report',
    component: PaymentReport,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
