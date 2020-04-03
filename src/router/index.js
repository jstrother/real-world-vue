import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import EventList from '@/views/EventList';
import NotFound from '@/views/NotFound';
import NetworkIssue from '@/views/NetworkIssue';
import store from '@/store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'event-list',
    component: EventList,
    props: true,
  },
  {
    path: '/event/:id',
    name: 'event-show',
    // route level code-splitting
    // this generates a separate chunk (event-show.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "event-show" */ '../views/EventShow.vue'),
    props: true,
    beforeEnter(routeTo, routeFrom, next) {
      store
        .dispatch('event/fetchEvent', routeTo.params.id)
        .then((event) => {
          routeTo.params.event = event;
          next();
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            next({ name: '404', params: { resource: 'event' } });
          } else {
            next({ name: 'network-issue' });
          }
        });
    },
  },
  {
    path: '/event/create',
    name: 'event-create',
    // route level code-splitting
    // this generates a separate chunk (event-create.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "event-create" */ '../views/EventCreate.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
    props: true,
  },
  {
    path: '/network-issue',
    name: 'network-issue',
    component: NetworkIssue,
  },
  {
    path: '*',
    redirect: { name: 404, params: { resource: 'page' } },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((routeTo, routeFrom, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
