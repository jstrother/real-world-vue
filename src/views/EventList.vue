<template>
  <div>
    <h1>Events for {{ user.user.name }}</h1>
    <EventCard v-for="event in event.events" :key="event.id" :event="event" />
    <template v-if="hasPrevPage">
      <router-link :to="{ name: 'event-list', query: { page: page - 1 } }" rel="prev"
        >Previous Page</router-link
      >
    </template>
    <template v-if="hasPrevPage && hasNextPage"> | </template>
    <template v-if="hasNextPage">
      <router-link :to="{ name: 'event-list', query: { page: page + 1 } }" rel="next"
        >Next Page</router-link
      >
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EventCard from '@/components/EventCard';
import store from '@/store/index';

function getPageEvents(routeTo, next) {
  const currentPage = parseInt(routeTo.query.page) || 1;
  store
    .dispatch('event/fetchEvents', {
      page: currentPage,
    })
    .then(() => {
      routeTo.params.page = currentPage;
      next();
    });
}

export default {
  props: {
    page: {
      type: Number,
      required: true,
    },
  },
  components: {
    EventCard,
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    getPageEvents(routeTo, next);
  },
  beforeRouteUpdate(routeTo, routeFrom, next) {
    getPageEvents(routeTo, next);
  },
  computed: {
    hasNextPage() {
      return this.event.totalEvents > this.page * this.event.perPage;
    },
    hasPrevPage() {
      return this.page !== 1;
    },
    ...mapState(['event', 'user']),
  },
};
</script>

<style scoped></style>
