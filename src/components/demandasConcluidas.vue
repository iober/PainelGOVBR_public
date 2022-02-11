<template>
  <q-table
    dense
    :data="data"
    :columns="columns"
    row-key="idDemanda"
    :filter="filter"
    no-results-label="Nenhum resultado encontrado."
    :pagination.sync="pagination"
    style="word-wrap: break-word;"
  >
    <template v-slot:top-right flat>
      <q-input
        class="q-pa-md"
        id="x"
        v-model="filter"
        label="Pesquisar demandas"
      >
        <q-tooltip>Pesquisar por cliente ou área</q-tooltip>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template
      v-slot:header="props"
      :style="
        props.row.prioridade == '1 - Alta'
          ? 'backgroundColor:#ff0000; color:white'
          : ''
      "
    >
      <q-tr :props="props">
        <q-th auto-width />

        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
        <q-th algin="left" auto-width>Chamado</q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr
        :props="props"
        :style="props.row.status == 'I' ? 'backgroundColor:#dce7f3' : ''"
      >
        <q-td auto-width>
          <q-btn
            :style="
              props.row.prioridade == '1 - Alta'
                ? 'backgroundColor:#ff0000; color:white'
                : props.row.prioridade == '2 - Media'
                ? 'backgroundColor:#ffff19; color:black'
                : props.row.prioridade == '3 - Baixa'
                ? 'backgroundColor:#46a346; color:white'
                : 'bg-white text-black'
            "
            size="sm"
            round
            dense
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'add'"
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          @click="props.expand = !props.expand"
          style="cursor: pointer; hover: color: yellow"
        >
          {{ col.value }}
        </q-td>

        <q-td auto-width>
          <span @click="abreChamado(props.row.nrChamado)" style="cursor: pointer;">{{props.row.nrChamado}}</span>
          
        </q-td>
      </q-tr>
      <q-tr
        v-show="props.expand"
        :props="props"
        style="backgroundcolor: #e5f2f2; color: black"
      >
        <q-td colspan="100%">
          <div class="text-left">
            <b>Previsão de tempo: </b>
            {{ props.row.previsao.toUpperCase() + " Horas" }}
          </div>
          <div class="row">
            <div style="word-wrap" class="col-lg-9 col-sm-8 col-xs-12 q-pt-md">
              <b>Atividades: </b>
              <div
                style="width: 300px; whitespace: normal; text-align: justify"
              >
                <span v-html="props.row.atividade"></span>
              </div>
            </div>
            <div style="word-wrap" class="col-lg-6 col-sm-6 col-xs-12 q-pt-md">
              <b>Observações: </b>
              <div
                style="width: 500px; whitespace: normal; text-align: justify"
              >
                <span v-html="props.row.observacoes"></span>
              </div>
            </div>
          </div>
          <div class="q-mt-sm q-mr-sm">
            <q-td>
              <q-btn
                class="btn-fixed-width"
                color="primary"
                unelevated
                size="11px"
                rounded
                label="Restaurar"
                icon="restore"
                @click="
                  restaurarDemanda(
                    props.row.idDemanda,
                    props.row.nmClienteDemanda,
                    props.row.resumo
                  )
                "
              >
                <q-tooltip>Restaurar demanda</q-tooltip>
              </q-btn>
            </q-td>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { Notify, openURL } from "quasar";
export default {
  data() {
    return {
      filter: "",
      columns: [
        {
          name: "nmCliente",
          required: true,
          label: "Nome do cliente",
          align: "left",
          field: (row) => row.nmClienteDemanda.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "sistema",
          align: "left",
          label: "Sistema",
          field: (row) => row.sistema.toUpperCase(),
          sortable: true,
        },
        {
          name: "resumo",
          align: "left",
          label: "Resumo da Atividade",
          field: (row) => row.resumo.toUpperCase(),
          sortable: true,
          maxlength: 50,
        },
        {
          name: "inclusao",
          align: "left",
          label: "Inclusão",
          field: (row) => row.dataInclusao,
          sortable: true,
        },
        {
          name: "conclusao",
          align: "left",
          label: "Conclusão",
          field: (row) => row.dataConclusao,
          sortable: true,
        },
      ],
      data: this.data,
      pagination: {
        page: 1,
        rowsPerPage: 5,
        sortBy: "nmCliente",
        ascending: true,
      },
    };
  },
  created() {
    this.carregaConcluida();
  },
  methods: {
    carregaConcluida() {
      this.$axios
        .get(`${process.env.API}/demandasConcluidas/`)
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
    abreChamado(chamado) {
      var strWindowFeatures = "location=yes,height=700,width=1006,scrollbars=yes,status=yes";
      var URL = "http://siga2.duetotecnologia.com.br/html/hd/hdchamado/cadastro_chamado.php?cdchamado=" + chamado;
      var win = window.open(URL, "_blank", strWindowFeatures);
    },
    async restaurarDemanda(idDemanda, cliente, resumo) {
      await this.$q
        .dialog({
          title: "Confirmar restauração",
          message:
            "<b>Cliente: </b>" + cliente + "<br><b>Atividade: </b>" + resumo,
          persistent: false,
          html: true,
          ok: {
            push: true,
            label: "Confirmar",
            color: "blue-9",
          },
          cancel: {
            push: true,
            color: "grey-7",
            label: "Cancelar",
          },
        })
        .onOk(() => {
          this.restaura(idDemanda);
        })
        .onCancel(() => {});
    },
    async restaura(idDemanda) {
      const axiosConfig = {
        method: "put",
        url: `/restauraDemanda/${idDemanda}`,
      };
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch);
      Notify.create({
        message: "Demanda restaurada",
        position: "bottom",
        color: "green",
        timeout: 2800,
      });
      this.carregaConcluida();
    },
  },
};
</script>
