<template>
  <div class="app">
    <div class="row">
      <div class="col mx-0 px-0 mt-1">
        <!-- Cabeçalho -->
        <div class="border-bottom mb-2 border-color-light">
          <h4 class="text-left px-2 h5">
            <i class="fa fa-list-alt mr-3"></i>Painel de Reuniões
          </h4>
        </div>

        <div class="col-auto">
          <!-- Procurar -->

          <div class="col form-row">
            <div class="form-row mr-3 float-left">
              <div class="form-row border-bottom block">
                <span class="fa fa-search fa-lg fw pb-2 pt-2 mt-1"></span>
                <input
                  type="search"
                  class="form-control bg-white border-0 pl-3 pr-3"
                  @keyup.enter="buscarReuniao"
                  :value="$route.query.procurar"
                  aria-describedby="helpId"
                  placeholder="Procurar..."
                  style="width: 320px"
                />
              </div>
            </div>

            <!--- Botão Adicionar -->
            <div class="col">
              <div
                class="nav-link px-2 py-2 rounded-pill waves-effect waves-ripple float-right"
                data-toggle="modal"
                style="background: #eee"
                data-target="#publicarReuniao"
              >
                <span class="fa fa-plus text-success fa-fw"></span>
                <span class="pr-2 font-weight-bold">Publicar</span>
              </div>
            </div>
          </div>

          <div class="row py-1 border-bottom border-color-light"></div>

          <!--- Inicio dos Cartões de Reunião -->

          <div class="row mt-3" v-if="mostrarCards">
            <div
              v-for="todo in reunioesFiltradas.slice().reverse()"
              :key="todo.id"
              class="row col-auto py-2"
              style="font-size: 13px !important;"
            >
              <div class="col-auto pr-0">
                <div
                  class="card px-0 shadow-sm border my-3 mx-1"
                  role="card"
                  style="width: 19rem; border-color:#ebeef5!important "
                >
                  <div class="card-header rounded p-3" :class="todo.cor">
                    <div class="text-white form-row">
                      <div class="col">
                        <div class="h5 text-truncate" style="max-width: 220px;">{{todo.titulo}}</div>

                        <div class="h6 pt-1" style="font-size: 14px;">{{usuario.nome}}</div>
                      </div>

                      <div class="col-2 float-right">
                        <div class="ml-3 form-row">
                          <div class="btn px-0 py-0" data-toggle="tooltip" title="Disabled tooltip">
                            <span
                              class="fa fa-tasks fa-lg text-white"
                              aria-hidden="true"
                              type="button"
                              :data-target="'#modal'+todo.id"
                              data-toggle="modal"
                              @click="limparBtnSuccess()"
                            ></span>
                          </div>
                        </div>
                        <div class="ml-3 form-row pt-2">
                          <div class="btn px-0 py-0">
                            <span
                              class="fa fa-paperclip fa-lg text-white"
                              type="button"
                              :data-target="'#modal'+todo.id"
                              data-toggle="modal"
                            ></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body p-2 pb-4 px-3">
                    <div class="h6 pt-2" style="font-size: 14px;">Data do inicio da reunião</div>
                    <div class="text-body">
                      <div class="py-1">
                        <span class="fa fa-calendar fa-lg fa-fw mr-2"></span>
                        <a>{{transformarData(todo.data)}} – Inicio {{todo.hora_inicial}} até {{todo.hora_final}}.</a>
                      </div>
                      <div class="py-1">
                        <span class="fa fa-map-marker fa-lg fa-fw mr-2"></span>
                        <a>{{todo.localizacao}}</a>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer bg-light border-top p-1 text-justify">
                    <button
                      class="btn nav-link px-2 rounded-pill waves-effect bg-light"
                      @click="excluirReuniao(todo.id)"
                    >Excluir</button>
                    <button
                      class="btn nav-link px-2 rounded-pill waves-effect bg-light"
                      @click="gerarAta()"
                    >Gerar Ata</button>
                    <button
                      class="btn nav-link px-2 rounded-pill waves-effect bg-light float-right"
                      @click="iniciarReuniao(todo.id)"
                    >
                      <span class="px-2 font-weight-bold">Entrar</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Modal Pautas -->
              <div class="modal fade bd-example-modal-lg" :id="'modal'+todo.id">
                <div class="modal-dialog modal-lg" style="max-width:990px">
                  <div class="modal-content rounded p-2">
                    <div class="modal-header p-2 border-bottom">
                      <div class="mx-auto">
                        <div class="modal-title h5 pt-1 text-center">Pautas - {{todo.titulo}}</div>
                      </div>
                      <button
                        type="button"
                        class="btn waves-effect waves-circle font-weight-bold border-0 bg-danger"
                        data-dismiss="modal"
                      >
                        <span class="h5 text-white">X</span>
                      </button>
                    </div>
                    <div class="modal-body scrollbar my-2" id="style-7">
                      <div class="row">
                        <div class="col-auto px-2 mt-3 float-left flex-column position-fixed">
                          <button
                            class="btn waves-effect waves-circle font-weight-bold border-0"
                            @click.prevent="novaPauta(todo.id)"
                          >
                            <span class="fa fa-plus fa-lg"></span>
                          </button>
                        </div>
                        <!-- Pautas -->
                        <div
                          class="col ml-5 my-3 border-0 border-left-0 border-right-0"
                          style="max-height:600px; height:400px"
                        >
                          <div class="form-row" v-for="todoP in todosPauta" :key="todoP.id">
                            <div class="col row py-2" v-if="todoP.id_reuniao == todo.id">
                              <div class="col">
                                <input
                                  tabindex="1"
                                  placeholder="Escreva sua pauta aqui..."
                                  type="textarea"
                                  v-model.trim="todoP.pauta"
                                  @keydown.space="limparBtnSuccess(todoP.id)"
                                  @keydown.delete="limparBtnSuccess(todoP.id)"
                                  @keydown.tab="atualizarPauta(todoP.id, todoP.pauta)"
                                  @keydown.enter="atualizarPauta(todoP.id, todoP.pauta)"
                                  @change="atualizarPauta(todo.id, todo.pauta)"
                                  class="form-control border-left border-right-0 border-top-0 rounded-0"
                                />
                              </div>
                              <div class>
                                <button
                                  class="btn waves-effect float-right nav-link"
                                  @click="excluirPauta(todoP.id)"
                                >
                                  <span class="fa fa-trash-o"></span>
                                </button>
                              </div>
                              <div class>
                                <button
                                  class="btn waves-effect float-right nav-link"
                                  @click="atualizarPauta(todoP.id, todoP.pauta)"
                                >
                                  <span
                                    :style="{color: btnSuccess[todoP.id]}"
                                    class="fa fa-check-circle"
                                  ></span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        tabindex="1"
                        type="button"
                        class="btn btn-secondary waves-effect"
                        data-dismiss="modal"
                        @click="listarPautas()"
                      >Voltar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <center class="h4 my-5">Olá, não existe reuniões agendadas.</center>
          </div>

          <!--- Fim dos Cartões -->

          <!-- Modal Adicionar reuniao -->

          <div class="modal fade bd-example-modal-lg" id="publicarReuniao">
            <div class="modal-dialog modal-lg">
              <div class="modal-content rounded p-2">
                <form @submit.prevent="novaReuniao">
                  <div class="modal-header p-2 border-bottom">
                    <div class="mx-auto">
                      <div class="modal-title h5 pt-1 text-center">Publicar Reunião</div>
                    </div>
                    <button
                      type="button"
                      class="btn waves-effect waves-circle font-weight-bold border-0 bg-danger"
                      data-dismiss="modal"
                    >
                      <span class="h5 text-white">X</span>
                    </button>
                  </div>

                  <div class="modal-body p-0">
                    <div class="form-row mt-2 p-3">
                      <div class="col-auto p-2">
                        <span class="fa fa-comments-o fa-lg fa-fw"></span>
                      </div>
                      <div class="col">
                        <input
                          type="text"
                          v-model.trim="reuniao.titulo"
                          class="form-control border-left-0 border-right-0 border-top-0 rounded-0 mb-2"
                          placeholder="Titulo"
                          aria-describedby="helpId"
                        />
                      </div>
                    </div>
                    <div class="form-row p-3">
                      <div class="col-auto p-2">
                        <span class="fa fa-bars fa-lg fa-fw"></span>
                      </div>
                      <div class="col">
                        <input
                          type="text"
                          v-model.trim="reuniao.categoria"
                          class="form-control border-left-0 border-right-0 border-top-0 rounded-0"
                          placeholder="Categoria"
                          aria-describedby="helpId"
                          style="outline: none; user-select: text; white-space: pre-wrap; overflow-wrap: break-word;"
                        />
                      </div>
                    </div>

                    <div class="form-row p-3">
                      <div class="col-auto p-2">
                        <span class="fa fa-map-o fa-lg fa-fw"></span>
                      </div>
                      <div class="col">
                        <input
                          type="text"
                          v-model.trim="reuniao.localizacao"
                          class="form-control border-left-0 border-right-0 border-top-0 rounded-0"
                          placeholder="Localização"
                          aria-describedby="helpId"
                        />
                      </div>
                    </div>
                    <div class="form-row p-3">
                      <div class="col-auto p-2">
                        <span class="fa fa-calendar fa-lg fa-fw"></span>
                      </div>
                      <div class="col">
                        <input
                          type="date"
                          v-model="reuniao.data"
                          class="form-control border-left-0 border-right-0 border-top-0 rounded-0"
                          placeholder="Localização"
                          aria-describedby="helpId"
                        />
                      </div>
                    </div>
                    <div class="form-row p-3">
                      <div class="col-auto py-2">
                        <span class>Inicio</span>
                      </div>
                      <div class="col">
                        <input
                          type="time"
                          v-model="reuniao.hora_inicial"
                          class="form-control border-left-0 border-right-0 border-top-0 rounded-0"
                          placeholder
                          aria-describedby="helpId"
                        />
                      </div>
                      <div class="col-auto py-2">
                        <span>Final</span>
                      </div>
                      <div class="col">
                        <input
                          type="time"
                          v-model="reuniao.hora_final"
                          class="form-control border-left-0 border-right-0 border-top-0 rounded-0"
                          placeholder="Localização"
                          aria-describedby="helpId"
                        />
                      </div>
                      <div class="col-auto py-2">
                        <span class>Cor</span>
                      </div>
                      <div class="col">
                        <select
                          v-model="reuniao.cor"
                          class="form-control border-left-0 border-right-0 border-top-0 rounded-0"
                        >
                          <option
                            v-for="option in options"
                            :key="option.id"
                            v-bind:value="option.value"
                          >{{ option.text }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer border-0 pt-3">
                    <button type="submit" class="btn btn-block waves-effect btn-primary">Publicar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <!-- Fim Modal -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import reunioes from "@/services/reunioes";
import pautas from "@/services/pautas";
import functions from "@/libs/transformardata";
import EventBus from "@/eventBus/EventBus";
import router from "@/router/index.js";
export default {
  data() {
    return {
      viewCards: "",
      showModal: false,
      showPauta: true,
      mostrarCards: true,
      usuario: EventBus.usuario,
      reuniao: {
        id: "",
        id_usuario: "",
        titulo: "",
        data: "",
        categoria: "",
        localizacao: "",
        hora_inicial: "",
        hora_final: "",
        cancelada: "",
        iniciada: "",
        cor: "Azul"
      },
      pauta: {
        id: "",
        pauta: "",
        id_reuniao: "",
        horario: "",
        comentario: ""
      },
      options: [
        { text: "Azul", value: "gradient-bg-blue" },
        { text: "Vermelho", value: "gradient-bg-red" },
        { text: "Amarelo", value: "gradient-bg-yellow" },
        { text: "Verde", value: "gradient-bg-green" }
      ],
      btnSuccess: [],
      todosPauta: [],
      todosReunioes: []
    };
  },

  mounted() {
    this.sleep(50).then(() => {
      this.listarReunioesIdUsuario(this.usuario.id);
      this.listarPautas();
    });
  },

  created() {
    EventBus.$on("usuario", usuarioCarregado => {
      this.usuario = usuarioCarregado;
      this.reuniao.id_usuario = this.usuario.id;
    });
    this.usuarios = EventBus.usuario;
    this.reuniao.id_usuario = this.usuarios.id;
  },

  computed: {
    reunioesFiltradas() {
      const procurar = this.$route.query.procurar;
      return !procurar
        ? this.todosReunioes
        : this.todosReunioes.filter(t =>
            t.titulo.toLowerCase().includes(procurar.toLowerCase())
          );
    }
  },

  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    transformarData(x) {
      return functions.transformarData(x);
    },
    limparBtnSuccess(id) {
      this.btnSuccess[id] = "#000";
    },

    iniciarReuniao(id) {
      for (this.index in this.reunioesFiltradas) {
        if (this.reunioesFiltradas[this.index].id == id) {
          if (
            functions.compareDates(
              functions.transformarData(this.reunioesFiltradas[this.index].data)
            ) == "dataFuturo"
          ) {
            alert(
              "Não é possivel entrar na Reunião, pois ela esta agendada para " +
                functions.transformarData(
                  this.reunioesFiltradas[this.index].data
                ) +
                " e só será liberada essa data."
            );
          }
          if (
            functions.compareDates(
              functions.transformarData(this.reunioesFiltradas[this.index].data)
            ) == "dataPassado"
          ) {
            alert(
              "Essa reunião já passou da data agendada e está bloqueada para entrar!"
            );
          }
          if (
            functions.compareDates(
              functions.transformarData(this.reunioesFiltradas[this.index].data)
            ) == "dataAtual"
          ) {
            router.push({ name: "pReuniao", params: { id: id } });
          }
        }
      }
    },

    buscarReuniao(event) {
      this.$router.push({
        path: "/dashboard",
        query: {
          procurar: event.target.value
        }
      });
    },

    visualizarComo() {
      if (this.viewCards == "Cartões") {
        console.log("cartões");
        this.showPauta = false;
        this.tamanhoClasse = "col-auto";
      }
      if (this.viewCards == "Pautas") {
        console.log("Pautas");
        this.showPauta = true;
        this.tamanhoClasse = "col-12";
      }
    },

    limparCampos() {
      this.reuniao.titulo = "";
      this.reuniao.categoria = "";
      this.reuniao.localizacao = "";
      this.reuniao.hora_inicial = "";
      this.reuniao.hora_final = "";
    },

    excluirPauta(id) {
      pautas
        .delPauta(id)
        .then(() => {
          this.listarPautas();
        })
        .catch(err => {
          alert("Não foi possivel exluir pauta... " + err);
        });
    },

    excluirReuniao(id) {
      for (this.index in this.todosPauta) {
        if (this.todosPauta[this.index].id_reuniao == id) {
          pautas.delPauta(this.todosPauta[this.index].id);
        }
      }
      reunioes
        .delReuniao(id)
        .then(() => {
          this.listarReunioesIdUsuario(this.usuario.id);
        })
        .catch(err => {
          alert("Não foi possivel exluir Reunião... " + err);
        });
    },

    atualizarPauta(id, pauta) {
      if (pauta == "" || pauta == pauta.trim) {
        alert("campo está vazio, favor preencha ou exclua.");
      } else {
        this.pauta.pauta = pauta;
        this.pauta.id = id;
        this.btnSuccess[id] = "#3CB371";
        pautas
          .atualizarPauta(id, this.pauta)
          .then(() => {
            this.listarPautas();
            this.pauta.pauta = "";
            this.pauta.id = "";
          })
          .catch(err => {
            alert("Não foi possivel atualizar pauta... " + err);
          });
      }
    },

    // Função de Nova Pauta
    novaPauta(id) {
      this.pauta.id_reuniao = id;
      this.pauta.pauta = "";
      pautas
        .addPauta(this.pauta)
        .then(() => {
          this.listarPautas();
          this.pauta.pauta = "";
          this.pauta.id_reuniao = "";
        })
        .catch(() => {
          alert("Erro ao adicionar!");
        });
    },

    // Função de Nova Reuniao
    novaReuniao() {
      if (
        !(
          this.reuniao.titulo &&
          this.reuniao.categoria &&
          this.reuniao.localizacao &&
          this.reuniao.hora_inicial &&
          this.reuniao.hora_final &&
          this.reuniao.data
        )
      ) {
        alert("Por favor, preencha os campos obrigatórios.");
      } else {
        reunioes
          .addReuniao(this.reuniao)
          .then(() => {
            this.listarReunioesIdUsuario(this.usuario.id);
            this.limparCampos();
            $(".modal").modal("hide");
          })
          .catch(() => {
            alert("Erro ao adicionar !");
          });
      }
    },

    listarReunioesIdUsuario(id) {
      reunioes.ListarReunioesID(id).then(resposta => {
        this.todosReunioes = resposta.data;
        this.todosReunioes.length == 0
          ? (this.mostrarCards = false)
          : (this.mostrarCards = true);
      });
    },

    //Listar Pautas
    listarPautas() {
      pautas.ListarPautas().then(resposta => {
        this.todosPauta = resposta.data;
      });
    }
  }
};
</script>

<style scoped>
@media (max-width: 991px) {
  [role="card"] {
    min-width: 100% !important;
    margin-left: 29px !important;
  }
}

.shadow-custom {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}

.gradient-bg-blue {
  background: radial-gradient(
    ellipse at center,
    rgba(96, 108, 136, 1) 10%,
    rgba(63, 76, 107, 1) 86%
  );
}
.gradient-bg-red {
  background: radial-gradient(
    ellipse at center,
    rgb(156, 90, 90) 10%,
    rgb(136, 77, 77) 86%
  );
}
.gradient-bg-yellow {
  background: radial-gradient(
    ellipse at center,
    rgb(172, 173, 80) 10%,
    rgb(141, 141, 66) 86%
  );
}
.gradient-bg-green {
  background: radial-gradient(
    ellipse at center,
    rgb(115, 173, 97) 10%,
    rgb(97, 144, 81) 86%
  );
}
</style>