<template>
  <div class="q-pa-md">
      <q-table
        class="col-md-12"
        :data="data"
        dense
        :columns="columns"
        flat
        row-key="nome"
        no-results-label="Nenhum resultado encontrado."
        :pagination.sync="pagination"
        :filter="filter"
      >
        <template v-slot:top-left flat>
            <q-select
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="nmCliente"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="options"
              option-value="nome"
              option-label="nome"
              label="Nome do Cliente"
              @input="teste(nmCliente)"
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
        </template>
        <template v-slot:top-right flat>
            <q-input
            class="q-pa-md"
            id="x"
            v-model="filter"
            label="Pesquisar"
            >
            </q-input>
        </template>
      </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: this.data,
      filter: '',
      nmCliente: [],
      options: [{ 'nome': 'nmftp', 'senha': 'senhaftp' }],
      columns: [
        {
          name: 'backup',
          required: true,
          label: 'Nome do banco',
          align: 'left',
          field: (row) => row.nome.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'tamanho',
          required: true,
          label: 'Tamanho',
          align: 'left',
          field: (row) => row.tamanho.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'data',
          required: true,
          label: 'Data',
          align: 'left',
          field: (row) => row.dt.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true
        }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 300
        // rowsNumber: xx if getting data from a server
      }
    }
  },
  methods: {
    async teste (dados) {
      this.$q.loading.show()
      // hiding in 2s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
      }, 2000)
      await this.$axios
        .post(`${process.env.API}/ftp/`, dados)
        .then(response => {
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
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 99%
</style>
