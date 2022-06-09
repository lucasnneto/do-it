<template>
  <v-container class="d-flex flex-column" style="height: 100vh">
    <v-dialog v-model="dialog" max-width="450px" transition="dialog-transition">
      <v-card class="pa-3 pt-10 rounded-0 d-flex flex-column">
        <v-text-field
          class="rounded-0"
          hide-details
          outlined
          @keyup.enter="editar"
          label="To do..."
          v-model="edit.msg"
        ></v-text-field>
        <v-switch
          v-model="edit.finished"
          :label="edit.finished ? 'Finalizada' : 'Em aguardo'"
        ></v-switch>
        <p class="text-body-2 ml-4">
          {{ formatDate(edit.dateFinished) }}
        </p>
        <div class="d-flex">
          <v-btn @click="editar" color="primary" class="mr-3">Salvar</v-btn>
          <v-btn @click="closeModal" outlined color="primary">Cancelar</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <div
      class="mt-2 mx-3 d-flex justify-space-between"
      :class="{
        'flex-column mb-5': $vuetify.breakpoint.mobile,
        'mb-11': !$vuetify.breakpoint.mobile,
      }"
    >
      <div class="d-flex">
        <v-icon x-large class="mr-2" color="primary">mdi-check-circle</v-icon>
        <h2 class="text-h3">DO IT</h2>
      </div>
      <div class="d-flex" :class="{ 'mt-2': $vuetify.breakpoint.mobile }">
        <v-select
          outlined
          hide-details
          :items="['Criação', 'Aguardando', 'Finalizada']"
          v-model="filtro"
          label="Ordernar"
        ></v-select>
        <v-btn
          icon
          outlined
          x-large
          class="ml-3"
          @click="exportar"
          color="primary"
        >
          <v-icon>mdi-database-export</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="d-flex mb-5 mx-3">
      <v-text-field
        class="rounded-0"
        hide-details
        outlined
        label="To do..."
        @keyup.enter="newTodo"
        v-model="mytodo"
      ></v-text-field>
      <v-btn
        class="ml-2 rounded-0"
        color="primary"
        height="56"
        :disabled="mytodo.length === 0"
        @click="newTodo"
      >
        <v-icon large> mdi-plus </v-icon>
      </v-btn>
    </div>
    <div class="d-flex align-center mb-9 mx-3">
      <progressBar :level="level" />
      <p
        class="ml-4 mb-0 text-h5"
        :class="{ 'text-h6': $vuetify.breakpoint.mobile }"
      >
        {{ lengthTodosFinish }}/{{ lengthTodos }}
      </p>
    </div>
    <div class="overflow-y-auto overflow-x-hidden h-full">
      <div
        v-if="lengthTodos === 0"
        class="d-flex flex-column justify-center align-center h-full"
      >
        <img src="@/assets/check.svg" alt="" />
        <p
          class="text-h text-center mt-2"
          :class="{ 'text-body-1': $vuetify.breakpoint.mobile }"
        >
          Nada aqui, começe a criar seus ToDos!
        </p>
      </div>
      <div v-else class="h-full relative">
        <transition-group
          name="list-complete"
          class="absolute ma-0 row"
          tag="div"
        >
          <v-col
            :cols="$vuetify.breakpoint.mobile ? 12 : 6"
            v-for="todo in filterTodo"
            :key="todo.id"
            class="list-complete-item"
            style="position: relative"
          >
            <v-card
              class="pt-5 px-4 d-flex flex-column justify-space-between"
              :style="todo.finished ? 'border: 1px solid #FF8282' : ''"
              height="190"
            >
              <v-card-text class="text--primary overflow-hidden">
                <div style="overflow: auto; height: 100%">
                  <p class="mb-0">{{ todo.msg }}</p>
                </div>
              </v-card-text>
              <v-card-actions class="d-flex flex-column align-start">
                <p class="text-body-2 ml-4">
                  {{ formatDate(todo.dateFinished) }}
                </p>
                <div class="d-flex justify-space-between" style="width: 100%">
                  <v-btn
                    color="primary"
                    text
                    :disabled="todo.finished"
                    @click="FINISH_TODO(todo.id)"
                  >
                    {{ todo.finished ? "COMPLETO" : "FINALIZAR" }}
                  </v-btn>
                  <div class="d-flex">
                    <v-btn icon large color="primary" @click="editModal(todo)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="todo.finished"
                      icon
                      large
                      color="primary"
                      @click="DELETE_TODO(todo.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card-actions>
            </v-card>
            <v-icon
              v-if="todo.finished"
              x-large
              style="position: absolute; top: 0; right: 0"
              color="primary"
              >mdi-check-circle</v-icon
            >
          </v-col>
        </transition-group>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import progressBar from "./progressBar.vue";
export default {
  name: "HomeScreen",
  components: { progressBar },

  data: () => ({
    mytodo: "",
    dialog: false,
    filtro: "Criação",
    edit: {
      id: "",
      dateFinished: "",
      finished: false,
      msg: "",
    },
  }),
  watch: {
    "edit.finished"(value) {
      if (value) {
        this.edit.dateFinished = moment();
      } else {
        this.edit.dateFinished = "";
      }
    },
  },
  computed: {
    ...mapGetters(["level", "lengthTodos", "lengthTodosFinish", "todos"]),
    filterTodo() {
      const todos = [...this.todos];
      if (this.filtro === "Aguardando") {
        todos.sort((a, b) => {
          return a.finished - b.finished;
        });
      } else if (this.filtro === "Finalizada") {
        todos.sort((a, b) => {
          return b.finished - a.finished;
        });
      }

      return todos;
    },
  },
  methods: {
    ...mapActions(["ADD_TODO", "FINISH_TODO", "DELETE_TODO", "UPDATE_TODO"]),
    exportar() {
      var link = document.createElement("a");
      link.download = "dados_" + moment() + ".json";
      link.href = "data:text/json;charset=utf-8," + JSON.stringify(this.todos);
      link.click();
    },
    formatDate(value) {
      if (!value) return "";
      return moment(value).format("DD-MM-YYYY hh:mm");
    },
    closeModal() {
      this.edit = { id: "", dateFinished: "", finished: false, msg: "" };
      this.dialog = false;
    },
    editModal(todo) {
      this.edit = { ...todo };
      this.dialog = true;
    },
    newTodo() {
      this.ADD_TODO(this.mytodo);
      this.mytodo = "";
    },
    editar() {
      this.UPDATE_TODO(this.edit);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.list-complete-item {
  transition: all 0.3s;
}
.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
