<template>
  <div>
    <q-card-section>
      <q-input
        outlined
        v-model="contato.nmContato"
        label="Nome do contato"
        lazy-rules
        :rules="[(val) => !!val]"
        class="q-pb-sm"
        maxlength="60"
      />
      <q-input
        outlined
        v-model="contato.cargo"
        label="Cargo"
        lazy-rules
        :rules="[(val) => !!val]"
        class="q-pb-sm"
      />
      <q-select
        class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
        v-model="dadosCliente"
        use-input
        hide-selected
        fill-input
        outlined
        input-debounce="0"
        key="idCliente"
        :options="options"
        option-value="idCliente"
        option-label="nmCliente"
        label="Digite o nome do cliente"
        @filter="filterFn"
        behavior="menu"
        color="teal"
        lazy-rules
        :rules="[(val) => !!val]"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              0 Resultados. Digite um nome ou pressione Enter.
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>
    <q-card-actions align="right" class="text-primary q-ma-sm">
      <q-btn
        id="btnSalvar"
        label="Salvar"
        color="primary"
        @click="
          cadContato();
          limpaCampos();
          submitted = false;
        "
        v-close-popup
      />
      <q-btn
        label="Limpar"
        type="reset"
        color="white"
        text-color="black"
        class="q-ml-sm"
        @click="
          limpaCampos();
          submitted = false;
        "
      />
    </q-card-actions>
  </div>
</template>
<script>
import { Notify } from "quasar";
const stringOptions = [];
export default {
  mounted() {
    this.carrega();
    for (var i = 0; i < stringOptions.length; ++i) {
      stringOptions.splice(i--, 1);
    }
    this.carregaSelectCliente();
  },
  data() {
    return {
      filter: "",
      dadosCliente: "",
      options: stringOptions,
      contatoDialog: false,
      editContatoDialog: false,
      contato: {
        nmContato: "",
        cargo: "",
        idCliente: "",
      },
      edit: {
        nmContato: "",
        cargo: "",
        idCliente: "",
      },
      data: this.data, // busca o select
      pagination: {
        page: 1,
        rowsPerPage: 5,
        // rowsNumber: xx if getting data from a server
      },
      // AQUI ABAIXO, POPULA A TABELA COM DADOS DO BANCO
      columns: [
        {
          name: "nmContato",
          required: true,
          label: "Nome do contato",
          align: "left",
          field: (row) => row.nmContato.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true,
          style: "font-weight: bold",
        },
        {
          name: "cargo",
          align: "left",
          label: "Cargo",
          field: (row) => row.cargo.toUpperCase(),
        },
        {
          name: "nmCliente",
          label: "Nome do cliente",
          align: "left",
          field: (row) => row.nmCliente.toUpperCase(),
          sortable: true,
        },
        {
          name: "acoes",
          align: "right",
          label: "Remover  -  Editar",
          field: "acoes",
        },
      ],
    };
  },
  methods: {
    carrega() {
      this.$axios
        .get(`${process.env.API}/contatos/`)
        .then((response) => {
          this.data = response.data;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Falha no carregamento",
            icon: "report_problem",
          });
        });
    },
    carregaSelectCliente() {
      this.$axios
        .get(`${process.env.API}/clientesSelect/`)
        .then((response) => {
          this.dataPessoa = response.data;
          this.dataPessoa.forEach((value, index) => {
            // this.options.push(value)
            stringOptions.push(value);
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Falha no carregamento",
            icon: "report_problem",
          });
        });
    },
    // Cadastra cliente
    async cadContato() {
      this.contato.idCliente = this.dadosCliente.idCliente;
      if (this.contato.idCliente !== "" && this.contato.nmContato !== "") {
        const axiosConfig = {
          method: "post",
          url: `/contato`,
          data: this.contato,
        };
        this.contatoDialog = false;
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch);
        Notify.create({
          message: "Contato cadastrado.",
          position: "bottom",
          color: "green",
          timeout: 800,
        });
        this.carrega();
      } else {
        Notify.create({
          message: "Ocorreu um erro. Nome do contato é obrigatório.",
          position: "bottom",
          color: "red",
          timeout: 2000,
        });
      }
    },
    // DELETA cliente
    confirmaRemove(idContato, nome) {
      this.$q
        .dialog({
          title: "Confirmação de exclusão",
          message: "Remover: " + nome,
          persistent: false,
          ok: {
            push: true,
            label: "Confirmar",
            color: "red-8",
          },
          cancel: {
            push: true,
            color: "light-blue-9",
            label: "Cancelar",
          },
        })
        .onOk(() => {
          this.delContato(idContato);
        })
        .onCancel(() => {});
    },
    async delContato(idContato) {
      const axiosConfig = {
        method: "delete",
        url: `/delContato/${idContato}`,
      };
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch);
      Notify.create({
        message: "Cadastro removido.",
        position: "bottom",
        color: "red",
        timeout: 800,
      });
      this.carrega();
    },
    async trocaIdCliente(id) {
      this.edit.idCliente = id;
      this.edit.nmContato = this.edit.nmContato;
      this.edit.cargo = this.edit.cargo;
    },
    async editContato(idContato, nmContato, cargo, nmCliente, idCliente) {
      this.edit.idContato = idContato;
      this.edit.nmContato = nmContato;
      this.edit.idCliente = idCliente;
      this.edit.cargo = cargo;
      this.dadosCliente = nmCliente;
      this.editContatoDialog = true;
    },
    async saveEdit() {
      if (this.edit.nmContato !== "" && this.edit.idCliente !== "") {
        const axiosConfig = {
          method: "put",
          url: `/contato/${this.edit.idContato}`,
          data: this.edit,
        };
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch);
        Notify.create({
          message: "Contato alterado.",
          position: "bottom",
          color: "green",
          timeout: 800,
        });
        this.carrega();
      } else {
        Notify.create({
          message: "Nome do contato é obrigatório.",
          position: "bottom",
          color: "red",
          timeout: 2000,
        });
      }
    },
    filterFn(val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      if (val.length < 0) {
        abort();
      } else {
        setTimeout(() => {
          update(() => {
            if (val === "") {
              this.options = stringOptions;
            } else {
              const needle = val.toLowerCase();
              this.options = stringOptions.filter(
                (v) => v.nmCliente.toLowerCase().indexOf(needle) > -1
              );
            }
          });
        }, 200);
      }
    },
    limpaCampos() {
      this.dadosCliente = "";
      this.edit = {};
      this.contato = {};
    },
  },
};
</script>
