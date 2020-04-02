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
import EventCard from '@/components/EventCard';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    EventCard,
  },
  created() {
    this.fetchEvents({
      perPage: 3,
      page: this.page,
    });
  },
  computed: {
    page() {
      return parseInt(this.$route.query.page) || 1;
    },
    hasNextPage() {
      return this.event.totalEvents > this.page * 3;
    },
    hasPrevPage() {
      return this.page !== 1;
    },
    ...mapState(['event', 'user']),
  },
  methods: mapActions('event', ['fetchEvents']),
};
</script>

<style scoped></style>
