import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import moment from "moment";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    todos: [],
  },
  getters: {
    todos: (state) => state.todos,
    lengthTodos: (state) => state.todos.length,
    lengthTodosFinish: (state) =>
      state.todos.filter((el) => el.finished).length,
    level: (_, getters) =>
      getters.lengthTodos === 0
        ? 0
        : (getters.lengthTodosFinish / getters.lengthTodos) * 100,
  },
  mutations: {
    post(state, todo) {
      state.todos.push(todo);
    },
    delete(state, todo) {
      const index = state.todos.findIndex((el) => el.id === todo);
      if (index !== -1) {
        state.todos.splice(index, 1);
      }
    },
    update(state, todo) {
      const index = state.todos.findIndex((el) => el.id === todo.id);
      if (index !== -1) {
        state.todos.splice(index, 1, todo);
      }
    },
  },
  actions: {
    ADD_TODO({ commit }, payload) {
      const todo = {
        msg: payload,
        dateFinished: "",
        id: Math.floor(Date.now() * Math.random()).toString(36),
        finished: false,
      };
      commit("post", todo);
    },
    FINISH_TODO({ state, commit }, payload) {
      const index = state.todos.findIndex((el) => el.id === payload);
      if (index !== -1) {
        const todo = {
          msg: state.todos[index].msg,
          dateFinished: moment(),
          id: payload,
          finished: true,
        };
        commit("update", todo);
      }
    },
    UPDATE_TODO({ commit }, payload) {
      commit("update", payload);
    },
    DELETE_TODO({ commit }, payload) {
      commit("delete", payload);
    },
  },
});
