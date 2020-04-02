import Vue from 'vue';
import Vuex from 'vuex';
import EventService from '../services/EventService';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: 'abc123',
      name: 'Jim Strother',
    },
    categories: [
      'sustainability',
      'nature',
      'animal welfare',
      'housing',
      'education',
      'food',
      'community',
    ],
    events: [],
    totalEvents: 0,
    event: {},
  },
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    TOTAL_EVENTS(state, totalEvents) {
      state.totalEvents = totalEvents;
    },
    SET_EVENT(state, event) {
      state.event = event;
    },
  },
  actions: {
    createEvent({ commit }, event) {
      return EventService.postEvent(event)
        .then(() => {
          commit('ADD_EVENT', event);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then((res) => {
          commit('TOTAL_EVENTS', res.headers['x-total-count']);
          commit('SET_EVENTS', res.data);
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    fetchEvent({ commit, getters }, id) {
      const event = getters.getEventById(id);

      if (event) {
        commit('SET_EVENT', event);
      } else {
        EventService.getEvent(id)
          .then((res) => {
            commit('SET_EVENT', res.data);
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
    },
  },
  modules: {},
  getters: {
    getEventById: (state) => (id) => {
      return state.events.find((event) => event.id === id);
    },
  },
});
