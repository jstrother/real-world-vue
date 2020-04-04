<template>
  <div>
    <h1>Create an Event</h1>
    <form @submit.prevent="createEvent">
      <BaseSelect label="Select a category" :options="categories" v-model="event.category" />
      <h3>Name & describe your event</h3>
      <BaseInput
        type="text"
        placeholder="Title"
        label="Title"
        v-model="event.title"
        class="field"
      />
      <BaseInput
        type="text"
        placeholder="Description"
        label="Description"
        v-model="event.description"
        class="field"
      />
      <h3>Where is your event?</h3>
      <BaseInput type="text" placeholder="Location" v-model="event.location" class="field" />
      <h3>When is your event?</h3>
      <div class="field">
        <label>Date</label>
        <Datepicker v-model="event.date" placeholder="Select a date" />
      </div>
      <BaseSelect label="Select a time" :options="times" v-model="event.time" class="field" />
      <!-- <input type="submit" class="button -fill-gradient" value="Submit" /> -->
      <BaseButton type="submit" buttonClass="-fill-gradient">Submit</BaseButton>
    </form>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import NProgress from 'nprogress';

export default {
  components: {
    Datepicker,
  },
  data() {
    const times = [];
    for (let i = 1; i <= 24; i++) {
      times.push(i + ':00');
    }
    return {
      event: this.createFreshEvent(),
      times,
      categories: this.$store.state.categories,
    };
  },
  methods: {
    createEvent() {
      NProgress.start();
      this.$store
        .dispatch('event/createEvent', this.event)
        .then(() => {
          this.$router.push({
            name: 'event-show',
            params: { id: this.event.id },
          });
          this.event = this.createFreshEvent();
        })
        .catch(() => {
          NProgress.done();
        });
    },
    createFreshEvent() {
      const user = this.$store.state.user.user;
      const id = Math.floor(Math.random() * 1000000);
      return {
        category: '',
        organizer: user.name,
        id,
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        attendees: [],
      };
    },
  },
};
</script>

<style scoped>
.field {
  margin-bottom: 24px;
}
</style>
