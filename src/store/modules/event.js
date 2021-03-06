import EventService from '../../services/EventService';

export const namespaced = true;

export const state = {
  events: [],
  totalEvents: 0,
  event: {},
  perPage: 3,
};

export const mutations = {
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
};

export const actions = {
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then(() => {
        commit('ADD_EVENT', event);
        const notification = {
          type: 'success',
          message: 'Your event has been created!',
        };
        dispatch('notification/add', notification, { root: true });
      })
      .catch((err) => {
        const notification = {
          type: 'error',
          message: `There was a problem creating your event: ${err.message}`,
        };
        dispatch('notification/add', notification, { root: true });
        throw new Error(err);
      });
  },
  fetchEvents({ commit, dispatch }, { page }) {
    return EventService.getEvents(state.perPage, page)
      .then((res) => {
        commit('TOTAL_EVENTS', res.headers['x-total-count']);
        commit('SET_EVENTS', res.data);
      })
      .catch((err) => {
        const notification = {
          type: 'error',
          message: `There was a problem fetching events: ${err.message}`,
        };
        dispatch('notification/add', notification, { root: true });
        throw new Error(err);
      });
  },
  fetchEvent({ commit, getters, state }, id) {
    if (id === state.event.id) {
      return state.event;
    }

    const event = getters.getEventById(id);

    if (event) {
      commit('SET_EVENT', event);
      return event;
    } else {
      return EventService.getEvent(id).then((res) => {
        commit('SET_EVENT', res.data);
        return res.data;
      });
    }
  },
};

export const getters = {
  getEventById: (state) => (id) => {
    return state.events.find((event) => event.id === id);
  },
};
