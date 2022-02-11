<template>
  <q-page>
    <div class='q-pa-md'>
    <div class='q-pa-md q-gutter-sm'>
      <q-breadcrumbs class='text-grey-14' active-color='primary'>
        <template v-slot:separator>
          <q-icon
            size='1.2em'
            name='arrow_forward'
            color='primary'
          />
        </template>
        <q-breadcrumbs-el label='Home' icon='home' to='/index' />
        <q-breadcrumbs-el label='Contatos' icon='perm_contact_calendar' to='/contatos' />
      </q-breadcrumbs>
    </div>
      <q-table
        class='col-md-12'
        :data='data'
        :columns='columns'
        row-key='idContato'
        :filter='filter'
        no-results-label='Nenhum resultado encontrado.'
        :pagination.sync='pagination'
      >
        <template v-slot:top-right flat>
          <q-input class='q-pa-md' v-model='filter' label='Pesquisar Cliente'>
            <q-tooltip>Pesquisar cadastro de contatos</q-tooltip>
            <template v-slot:append>
              <q-icon name='search' />
            </template>
          </q-input>
          <q-btn
            stack push
            round
            color='light-blue-7'
            class='q-ml-md'
            icon='add'
            @click='contatoDialog = true'
          >
            <q-tooltip self='center right'>Adicionar novo contato</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:body-cell-fones='props'>
          <q-td :props='props'>
         <q-btn flat type='a' :href='`tel:${props.row.foneContato}`'>{{ props.row.foneContato }}</q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-acoes='props'>
          <q-td :props='props'>
            <div>
              <q-btn
                stack push
                class='q-mr-lg'
                round
                color='red-5'
                @click='
                  confirmaRemove(props.row.idContato, props.row.nmContato)
                '
                size='sm'
              >
                <q-tooltip>Remover cadastro</q-tooltip>
                <q-icon name='delete' />
              </q-btn>
              <q-btn
                stack push
                class='q-mr-xs'
                round
                color='primary'
                @click='
                  editContato(props.row.idContato, props.row.nmContato, props.row.cargo, props.row.foneContato, props.row.nmCliente, props.row.idCliente);
                  submitted = true;
                '
                size='sm'
              >
                <q-tooltip self='center right'>Editar cadastro</q-tooltip>
                <q-icon name='edit' />
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- CADASTRAMENTO DE CLIENTES -->
    <q-dialog v-model='contatoDialog' class='dialog'>
      <q-card style='width: 700px; max-width: 80vw'>
        <q-card-section class='bg-primary text-white'>
          <div class='text-h6'>Cadastrar contato</div>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            v-model='contato.nmContato'
            label='Nome do contato'
            lazy-rules
            :rules='[(val) => !!val]'
            class='q-pb-sm'
            maxlength='60'
          />
          <q-input
            outlined
            v-model='contato.cargo'
            label='Cargo'
            lazy-rules
            :rules='[(val) => !!val]'
            class='q-pb-sm'
          />
          <q-input
            outlined
            v-model='contato.foneContato'
            label='Telefones para contato'
            lazy-rules
            :rules='[(val) => !!val]'
            class='q-pb-sm'
          />
          <q-select
            class='q-pb-sm col-lg-12 col-xs-12 col-sm-12'
            v-model='dadosCliente'
            use-input
            hide-selected
            fill-input
            outlined
            input-debounce='0'
            key='idCliente'
            :options='options'
            option-value='idCliente'
            option-label='nmCliente'
            label='Digite o nome do cliente'
            @filter='filterFn'
            behavior='menu'
            color='teal'
            lazy-rules
            :rules='[(val) => !!val]'
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class='text-grey'>
                  0 Resultados. Digite um nome ou pressione Enter.
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align='right' class='text-primary q-ma-sm'>
          <q-btn
            id='btnSalvar'
            label='Salvar'
            color='primary'
            @click='
              cadContato();
              limpaCampos();
              submitted = false;
            '
          />
          <q-btn
            label='Limpar'
            type='reset'
            color='white'
            text-color='black'
            class='q-ml-sm'
            @click='
              limpaCampos();
              submitted = false;
            '
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- EDICAÇÃO  DE CONTATOS -->
    <q-dialog v-model='editContatoDialog' class='dialog'>
      <q-card style='width: 700px; max-width: 80vw'>
        <q-card-section class='bg-primary text-white'>
          <div class='text-h6'>Editar contato</div>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            v-model='edit.nmContato'
            label='Nome do contato'
            lazy-rules
            :rules='[(val) => !!val]'
            class='q-pb-sm'
            maxlength='60'
          />
          <q-input
            outlined
            v-model='edit.cargo'
            label='Cargo'
            lazy-rules
            :rules='[(val) => !!val]'
            class='q-pb-sm'
          />
          <q-input
            outlined
            v-model='edit.foneContato'
            label='Telefones para contato'
            lazy-rules
            :rules='[(val) => !!val]'
            class='q-pb-sm'
          />
          <q-select
            class='q-pb-sm col-lg-12 col-xs-12 col-sm-12'
            v-model='dadosCliente'
            use-input
            hide-selected
            fill-input
            outlined
            input-debounce='0'
            key='idCliente'
            :options='options'
            option-value='idCliente'
            option-label='nmCliente'
            label='Digite o nome do cliente'
            @filter='filterFn'
            behavior='menu'
            color='teal'
            @input='trocaIdCliente(dadosCliente.idCliente)'
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class='text-grey'>
                  0 Resultados. Digite um nome ou pressione Enter.
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align='right' class='text-primary q-ma-sm'>
          <q-btn
            id='btnSalvar'
            label='Salvar'
            color='primary'
            @click='
              saveEdit();
              limpaCampos();
              editContatoDialog = false  ;
            '
          />
          <q-btn
            label='Limpar'
            type='reset'
            color='white'
            text-color='black'
            class='q-ml-sm'
            @click='
              limpaCampos();
              submitted = false;
            '
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { Notify } from 'quasar'
const stringOptions = []
export default {
  mounted () {
    this.carrega()
    for (var i = 0; i < stringOptions.length; ++i) {
      stringOptions.splice(i--, 1)
    }
    this.carregaSelectCliente()
  },
  data () {
    return {
      filter: '',
      dadosCliente: '',
      options: stringOptions,
      contatoDialog: false,
      editContatoDialog: false,
      contato: {
        nmContato: '',
        cargo: '',
        idCliente: '',
        foneContato: ''
      },
      edit: {
        nmContato: '',
        cargo: '',
        idCliente: '',
        foneContato: ''
      },
      data: this.data, // busca o select
      pagination: {
        page: 1,
        rowsPerPage: 5
        // rowsNumber: xx if getting data from a server
      },
      // AQUI ABAIXO, POPULA A TABELA COM DADOS DO BANCO
      columns: [
        {
          name: 'nmContato',
          required: true,
          label: 'Nome do contato',
          align: 'left',
          field: (row) => row.nmContato.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true,
          style: 'font-weight: bold'
        },
        {
          name: 'fones',
          align: 'left',
          label: 'Telefones',
          field: (row) => row.foneContato
        },
        {
          name: 'cargo',
          align: 'left',
          label: 'Cargo',
          field: (row) => row.cargo.toUpperCase()
        },
        {
          name: 'nmCliente',
          label: 'Nome do cliente',
          align: 'left',
          field: (row) => row.nmCliente.toUpperCase(),
          sortable: true
        },
        {
          name: 'acoes',
          align: 'right',
          label: 'Remover  -  Editar',
          field: 'acoes'
        }
      ]
    }
  },
  methods: {
    carrega () {
      this.$axios
        .get(`${process.env.API}/contatos/`)
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
    },
    carregaSelectCliente () {
      this.$axios
        .get(`${process.env.API}/clientesSelect/`)
        .then((response) => {
          this.dataPessoa = response.data
          this.dataPessoa.forEach((value, index) => {
            // this.options.push(value)
            stringOptions.push(value)
          })
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Falha no carregamento',
            icon: 'report_problem'
          })
        })
    },
    // Cadastra cliente
    async cadContato () {
      this.contato.idCliente = this.dadosCliente.idCliente
      if (this.contato.idCliente !== '' && this.contato.nmContato !== '') {
        const axiosConfig = {
          method: 'post',
          url: `/contato`,
          data: this.contato
        }
        this.contatoDialog = false
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Contato cadastrado.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.carrega()
      } else {
        Notify.create({
          message: 'Ocorreu um erro. Nome do contato é obrigatório.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    // DELETA cliente
    confirmaRemove (idContato, nome) {
      this.$q
        .dialog({
          title: 'Confirmação de exclusão',
          message: 'Remover: ' + nome,
          persistent: false,
          ok: {
            push: true,
            label: 'Confirmar',
            color: 'red-8'
          },
          cancel: {
            push: true,
            color: 'light-blue-9',
            label: 'Cancelar'
          }
        })
        .onOk(() => {
          this.delContato(idContato)
        })
        .onCancel(() => {})
    },
    async delContato (idContato) {
      const axiosConfig = {
        method: 'delete',
        url: `/delContato/${idContato}`
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Cadastro removido.',
        position: 'bottom',
        color: 'red',
        timeout: 800
      })
      this.carrega()
    },
    async trocaIdCliente (id) {
      this.edit.idCliente = id
      this.edit.nmContato = this.edit.nmContato
      this.edit.cargo = this.edit.cargo
      this.edit.foneContato = this.edit.foneContato
    },
    async editContato (idContato, nmContato, cargo, foneContato, nmCliente, idCliente) {
      this.edit.idContato = idContato
      this.edit.nmContato = nmContato
      this.edit.idCliente = idCliente
      this.edit.cargo = cargo
      this.edit.foneContato = foneContato
      this.dadosCliente = nmCliente
      this.editContatoDialog = true
    },
    async saveEdit () {
      if (this.edit.nmContato !== '' && this.edit.idCliente !== '') {
        const axiosConfig = {
          method: 'put',
          url: `/contato/${this.edit.idContato}`,
          data: this.edit
        }
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Contato alterado.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.carrega()
      } else {
        Notify.create({
          message: 'Nome do contato é obrigatório.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    filterFn (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      if (val.length < 0) {
        abort()
      } else {
        setTimeout(() => {
          update(() => {
            if (val === '') {
              this.options = stringOptions
            } else {
              const needle = val.toLowerCase()
              this.options = stringOptions.filter(
                (v) => v.nmCliente.toLowerCase().indexOf(needle) > -1
              )
            }
          })
        }, 200)
      }
    },
    limpaCampos () {
      this.dadosCliente = ''
      this.edit = {}
      this.contato = {}
    }
  }
}
</script>
