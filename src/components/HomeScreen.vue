<template>
  <v-container class="d-flex flex-column" style="height: 100vh">
    <v-dialog v-model="dialog4" max-width="500px">
      <v-card class="pa-10">
        <h2 class="text-center mb-4">Deseja importar?</h2>
        <p>Encontramos uma lista nova de TO IT. Deseja importar?</p>
        <p class="primary--text">
          Obs. Essa ação vai apagar todos os já existentes
        </p>
        <div class="d-flex">
          <v-btn
            @click="importList"
            width="50%"
            color="primary"
            class="black--text mr-2"
            >importar</v-btn
          >
          <v-btn
            width="50%"
            @click="(dialog4 = false), clearURL()"
            color="white"
            class="black--text"
            >cancelar</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog3" max-width="500px">
      <v-card class="pa-10">
        <h2 class="text-center mb-4">Como deseja exportar?</h2>
        <div
          class="d-flex align-center"
          :class="$vuetify.breakpoint.mobile ? 'flex-column' : ''"
        >
          <v-btn color="primary" class="black--text" @click="dowloadFile">
            Baixar Arquivo
          </v-btn>
          <h2 class="mx-3">OU</h2>
          <vue-qrcode
            :value="dataCrpyto"
            :options="{ width: 200, margin: 2 }"
          ></vue-qrcode>
        </div>
        <p class="link-text" @click="copyLink">{{ dataCrpyto }}</p>
        <v-btn
          @click="dialog3 = false"
          color="white"
          class="black--text mt-3"
          block
          >Fechar</v-btn
        >
      </v-card>
    </v-dialog>
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
          <v-btn @click="editar" color="primary" class="mr-3 secondary--text"
            >Salvar</v-btn
          >
          <v-btn @click="closeModal" outlined color="primary">Cancelar</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" max-width="400px">
      <v-alert type="warning" prominent>
        <p>
          Atenção essa ação limpa toda sua lista de ToDos para inserir a nova
        </p>
        <v-btn class="mr-1" @click="importar">Enviar</v-btn>
        <v-btn outlined @click="dialog2 = false">Cancelar</v-btn>
      </v-alert>
    </v-dialog>
    <div
      class="mt-2 mx-3 d-flex justify-space-between"
      :class="{
        'flex-column mb-5': $vuetify.breakpoint.mobile,
        'mb-11': !$vuetify.breakpoint.mobile,
      }"
    >
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon
            :x-large="!$vuetify.breakpoint.mobile"
            class="mr-2"
            color="primary"
            >mdi-check-circle</v-icon
          >
          <h2
            class="text-h3"
            :class="{ 'text-body-1': $vuetify.breakpoint.mobile }"
          >
            DO IT
            {{
              $vuetify.breakpoint.mobile
                ? "- " + lengthTodosFinish + "/" + lengthTodos
                : ""
            }}
          </h2>
        </div>
        <v-btn
          v-if="$vuetify.breakpoint.mobile"
          icon
          @click="showDetails = !showDetails"
        >
          <v-icon>{{ showDetails ? "mdi-menu-up" : "mdi-menu-down" }}</v-icon>
        </v-btn>
      </div>
      <div
        v-if="
          !$vuetify.breakpoint.mobile ||
          ($vuetify.breakpoint.mobile && showDetails)
        "
        class="d-flex"
        :class="{ 'mt-2': $vuetify.breakpoint.mobile }"
      >
        <v-select
          outlined
          hide-details
          :items="['Criação', 'Aguardando', 'Finalizada']"
          v-model="filtro"
          label="Ordernar"
        ></v-select>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              x-large
              class="ml-3"
              v-bind="attrs"
              v-on="on"
              color="primary"
            >
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="exportar">
              <v-list-item-title>Exportar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dialog2 = true">
              <v-list-item-title>Importar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
        <v-icon color="secondary" large> mdi-plus </v-icon>
      </v-btn>
    </div>
    <div
      class="d-flex align-center mb-9 mx-3"
      v-if="!$vuetify.breakpoint.mobile"
    >
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
              :style="
                todo.finished
                  ? `border: 1px solid ${$vuetify.theme.themes.dark.primary}`
                  : ''
              "
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
import VueQrcode from "@chenfengyuan/vue-qrcode";
import CryptoJS from "crypto-js";
export default {
  name: "HomeScreen",
  components: { progressBar, VueQrcode },
  data: () => ({
    showDetails: false,
    mytodo: "",
    dialog: false,
    filtro: "Criação",
    dialog2: false,
    dataCrpyto: "",
    dialog3: false,
    dialog4: false,
    paramsDoIt: [],
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
    userUrl() {
      return window.location.origin;
    },
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
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("data");
    if (myParam) {
      var bytes = CryptoJS.AES.decrypt(myParam, "doandit");
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      this.paramsDoIt = JSON.parse(originalText);
      this.dialog4 = true;
    }
  },
  methods: {
    ...mapActions([
      "ADD_TODO",
      "FINISH_TODO",
      "DELETE_TODO",
      "UPDATE_TODO",
      "SET_TODOS",
    ]),
    clearURL() {
      if (location.href.includes("?")) {
        history.pushState({}, null, location.href.split("?")[0]);
      }
    },
    importList() {
      if (Array.isArray(this.paramsDoIt) && this.paramsDoIt.length) {
        this.SET_TODOS(this.paramsDoIt);
        this.paramsDoIt = [];
        this.dialog4 = false;
        this.clearURL();
      } else {
        this.$toast.error(
          "Ocorreu um erro ao importar, deixamos tudo como estava antes :("
        );
      }
    },
    dowloadFile() {
      var link = document.createElement("a");
      link.download = "dados_" + moment() + ".json";
      link.href = "data:text/json;charset=utf-8," + JSON.stringify(this.todos);
      link.click();
      this.dialog3 = false;
    },
    copyLink() {
      navigator.clipboard.writeText(this.dataCrpyto);
      this.dialog3 = false;
      this.$toast.success("Copiado para área de transferência");
    },
    exportar() {
      this.dialog3 = true;
      var cripto = CryptoJS.AES.encrypt(
        JSON.stringify(this.todos),
        "doandit"
      ).toString();
      const data = new URLSearchParams({ data: cripto });
      this.dataCrpyto = this.userUrl + "?" + data.toString();
    },
    importar() {
      this.dialog2 = false;
      var input = document.createElement("INPUT");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "application/JSON");
      input.addEventListener(
        "change",
        () => {
          let reader = new FileReader();
          reader.onload = (event) => {
            let str = event.target.result;
            let json = JSON.parse(str);
            if (Array.isArray(json)) {
              const refinedData = json
                .map((el) => ({
                  msg: el.msg || "",
                  id: el.id,
                  finished: el.finished || false,
                  dateFinished: el.dateFinished || "",
                }))
                .filter((el) => {
                  return !!el.id;
                });
              if (refinedData.length > 0) {
                this.SET_TODOS(refinedData);
              } else {
                this.$toast.error(
                  "A lista enviada esta vazia, ou não tem dados válidos, retornado a lista anterior"
                );
              }
            } else {
              this.$toast.error(
                "Ocorreu um erro ao tentar atualizar a lista, retornado a lista anterior"
              );
            }
          };

          // Read the file
          reader.readAsText(input.files[0]);
        },
        false
      );
      input.click();
    },
    formatDate(value) {
      if (!value) return "";
      return moment(value).format("DD/MM/YYYY HH:mm");
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
.link-text {
  border-radius: 6px;
  cursor: pointer;
  background-color: rgb(61, 61, 61);
  border: 2px dashed gray;
  max-width: 100%;
  padding: 1em;
  margin-top: 20px;
  margin-bottom: 0.4em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
