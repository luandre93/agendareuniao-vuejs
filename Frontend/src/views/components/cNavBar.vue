 <template>
  <nav class="d-lg-block d-none sidebar border-right border-left">
    <div class="sidebar-sticky">
      <ul class="nav flex-column" style="width:208px" id="menu">
        <div class="col mb-2 shadow-sm border-0">
          <div class="py-3">
            <span class="fa fa-address-card fa-fw"></span>
            <span
              class="font-weight-bolder rounded bg-info text-white ml-3 p-2 text-uppercase"
              style="font-size:12px"
            >{{usuario.nome}}</span>
          </div>
        </div>
        <li class="nav-item waves-effect waves-block">
          <router-link class="nav-link" to="/dashboard" active-class="active-nav-link">
            <span class="fa fa-list-alt fa-fw"></span>
            <a class="ml-3">Painel de Reuniões</a>
          </router-link>
        </li>
        <li class="nav-item waves-effect">
          <router-link class="nav-link" to="/relatorios">
            <span class="fa fa-file-text-o fa-fw"></span>
            <a class="ml-3">Relatórios</a>
          </router-link>
        </li>
        <li class="nav-item waves-effect">
          <router-link class="nav-link" to="/dashboard">
            <span class="fa fa-exchange fa-fw"></span>
            <a class="ml-3">Configurações</a>
          </router-link>
        </li>
        <li class="nav-item waves-effect waves-block">
          <router-link class="nav-link" to="/users" active-class="alert-info">
            <span class="fa fa-users fa-fw"></span>
            <a class="ml-3">Usuários</a>
          </router-link>
        </li>
      </ul>
    </div>
    <!-- <div class="fixed mt-md-auto bottom-text-mark border-top">
          <div class="mt-3 text-center">
            <a class="text-muted">© 2020 CoAgendei.</a>
          </div>
    </div>-->
  </nav>
</template>



<script>
import EventBus from "@/eventBus/EventBus";

export default {
  data() {
    return {
      usuario: {
        usuario: {
          id: "",
          email: "",
          nome: "",
          senha: "",
          nivel: "",
          cancelado: ""
        }
      }
    };
  },
  created() {
    EventBus.$on("usuario", usuarioCarregado => {
      this.usuario = usuarioCarregado;
    });
  }
};
</script>
