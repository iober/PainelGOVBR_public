<template>
  <q-table
    id="tb"
    dense
    :data="data"
    :columns="columns"
    row-key="idCliente"
    :filter="filter"
    no-results-label="Nenhum resultado encontrado."
    :pagination.sync="pagination"
  >
    <template v-slot:top-right flat>
      <q-input
        class="q-pa-md"
        id="x"
        v-model="filter"
        label="Pesquisar Cliente"
      >
        <q-tooltip>Pesquisar por cliente ou área</q-tooltip>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:top-left flat>
    <vue-excel-xlsx
        style="border: none; opacity: 1; background-color: white"
        :data="data"
        :columns="columnsExel"
        :filename="'Resumo Planos ACP'"
        :sheetname="'resumoPlanos'"
        >
        <q-btn
        color="primary"
        icon-right="archive"
        label="Exportar Tabela"
      />
    </vue-excel-xlsx>
    </template>
  </q-table>
</template>
<script>
import VueExcelXlsx from 'vue-excel-xlsx'
import Vue from 'vue'
Vue.use(VueExcelXlsx)
export default {
  data () {
    return {
      filter: '',
      visualizaSugestao: false,
      userOn: '',
      data: this.data,
      sugestao: {
        titulo: '',
        dsSugestao: '',
        user: ''
      },
      columns: [
        {
          name: 'nmCliente',
          required: true,
          label: 'Nome do cliente',
          align: 'left',
          field: (row) => row.nmCliente.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'anoAcp',
          align: 'left',
          label: 'Ano/Plano',
          field: (row) => row.anoAcp
        },
        {
          name: 'dtEncerramento',
          align: 'left',
          label: 'Data Encerramento',
          field: (row) => row.dtEncerramento,
          sortable: true
        },
        {
          name: 'saldoAtualTotal',
          align: 'center',
          label: 'Saldo Atual',
          field: (row) => row.saldoAtualTotal,
          sortable: true
        }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'nmCliente',
        ascending: true
      },
      columnsExel: [
        {
          label: 'Cliente',
          field: 'nmCliente'
        },
        {
          label: 'Plano ACP',
          field: 'anoAcp'
        },
        {
          label: 'Data Fim Plano',
          field: 'dtEncerramento'
        },
        {
          label: 'Saldo Atual',
          field: 'saldoAtualTotal'
        }
      ]
    }
  },
  created () {
    this.carrega()
  },
  methods: {
    carrega () {
      this.$axios
        .get(`${process.env.API}/saldoGeral/`)
        .then((response) => {
          this.data = response.data
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Falha no carregamento',
            icon: 'report_problem'
          })
        })
    }
  }
}
</script>
<style>
#tb tr:nth-child(even) {
  background-color: #525b6114;
}
</style>
