<template>
  <v-container class="d-flex flex-column justify-center" style="height: 100vh">
    <div class="d-flex justify-center mb-11">
      <v-icon x-large class="mr-2" color="primary">mdi-check-circle</v-icon>
      <h2 class="text-h3">DO IT</h2>
    </div>
    <div class="d-flex mb-5">
      <v-text-field
        class="rounded-0"
        hide-details
        outlined
        label="To do..."
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
    <div class="d-flex align-center mb-9">
      <progressBar :level="level" />
      <p class="ml-4 mb-0 text-h5">{{ lengthTodosFinish }}/{{ lengthTodos }}</p>
    </div>
    <div class="overflow-y-auto overflow-x-hidden">
      <div class="h-full relative">
        <v-row class="absolute ma-0">
          <v-col
            :cols="$vuetify.breakpoint.mobile ? 12 : 6"
            v-for="todo in todos"
            :key="todo.id"
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
              <v-card-actions class="d-flex justify-space-between">
                <v-btn
                  color="primary"
                  text
                  :disabled="todo.finished"
                  @click="FINISH_TODO(todo.id)"
                >
                  {{ todo.finished ? "COMPLETO" : "FINALIZAR" }}
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
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import progressBar from "./progressBar.vue";
export default {
  name: "HomeScreen",
  components: { progressBar },

  data: () => ({
    mytodo: "",
  }),
  computed: {
    ...mapGetters(["level", "lengthTodos", "lengthTodosFinish", "todos"]),
  },
  methods: {
    ...mapActions(["ADD_TODO", "FINISH_TODO", "DELETE_TODO"]),
    newTodo() {
      this.ADD_TODO(this.mytodo);
      this.mytodo = "";
    },
  },
};
</script>
