<template>
  <q-page>
    <div class="q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-grey-14" active-color="primary">
        <template v-slot:separator>
          <q-icon
            size="1.2em"
            name="arrow_forward"
            color="primary"
          />
        </template>
        <q-breadcrumbs-el label="Home" icon="home" to="/index" />
        <q-breadcrumbs-el label="Portais Web" icon="web" to="/dasboard" />
      </q-breadcrumbs>
    </div>
      <q-table
        class="col-md-12"
        :data="data"
        :columns="columns"
        row-key="nmCliente"
        :filter="filter"
        no-results-label="Nenhum resultado encontrado."
        :pagination.sync="pagination"
      >
        <template v-slot:top-left flat>
          <q-input
            label="Ano PAD"
            style="max-width: 100px"
            type="number"
            v-model="ano"
            class="q-pa-md"
            maxlength="4"
          >
            <q-tooltip>Altere o ano de pesquisa do PAD</q-tooltip>
          </q-input>
        </template>
        <template v-slot:top-right flat>
          <q-input class="q-pa-md" v-model="filter" label="Pesquisar Cliente">
            <q-tooltip>Pesquisar cadastro de cliente</q-tooltip>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            stack push
            round
            color="light-blue-7"
            class="q-ml-md"
            icon="add"
            @click="cadDialog = true"
          >
            <q-tooltip self="center right">Adicionar novo cliente</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:body-cell-pad="props">
          <q-td :props="props">
            <div>
              <q-btn
                stack push
                color="cyan"
                :disable="!props.row.codTce"
                @click="abrePad(props.row.codTce)"
                size="md"
              >
                <q-tooltip>Acesso ao PAD no site do TCE</q-tooltip>
                <q-icon name="event_available" />
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-ptb="props">
          <q-td :props="props">
            <div>
              <q-btn
                stack push
                color="teal"
                :disable="!props.row.endTransparencia"
                @click="abreTB(props.row.endTransparencia)"
                size="md"
              >
                <q-tooltip>Acessar Portal da Transparência</q-tooltip>
                <q-icon name="location_city" />
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-comunicador="props">
          <q-td :props="props">
            <div>
              <q-btn
                stack push
                color="brown-6"
                :disable="!props.row.endComunicador"
                @click="abreTB(props.row.endComunicador)"
                size="md"
              >
                <q-tooltip>Acesso a comunicação Eletrônica</q-tooltip>
                <q-icon name="grading" />
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-cidadao="props">
          <q-td :props="props">
            <div>
              <q-btn
                stack push
                color="light-blue-10"
                :disable="!props.row.endCidadao"
                @click="abreTB(props.row.endCidadao)"
                size="md"
              >
                <q-tooltip>Acesso ao ARCidadão</q-tooltip>
                <q-icon name="emoji_people" />
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-nfse="props">
          <q-td :props="props">
            <div>
              <q-btn
                stack push
                color="amber-8"
                :disable="!props.row.endNfse"
                @click="abreTB(props.row.endNfse)"
                size="md"
              >
                <q-tooltip>Acesso a Nota Fiscal Eletrônica</q-tooltip>
                <q-icon name="store" />
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-deiss="props">
          <q-td :props="props">
            <div>
              <q-btn
                stack push
                color="blue-grey"
                :disable="!props.row.endDeiss"
                @click="abreTB(props.row.endDeiss)"
                size="md"
              >
                <q-tooltip>Acesso a DEISS</q-tooltip>
                <q-icon name="list_alt" />
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-lcon="props">
          <q-td :props="props">
            <div>
              <q-btn
                stack push
                color="purple-8"
                :disable="!props.row.endLcon"
                @click="abreTB(props.row.endLcon)"
                size="md"
              >
                <q-tooltip>Acesso ao Licitacon</q-tooltip>
                <q-icon name="gavel" />
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <div>
              <q-btn
                stack push
                class="q-mr-lg"
                round
                color="red-5"
                @click="
                  confirmaRemove(props.row.idCliente, props.row.nmCliente)
                "
                size="sm"
              >
                <q-tooltip>Remover cadastro</q-tooltip>
                <q-icon name="delete" />
              </q-btn>
              <q-btn
                stack push
                class="q-mr-xs"
                round
                color="primary"
                @click="
                  editPessoa(
                    props.row.idCliente,
                    props.row.nmCliente,
                    props.row.codTce,
                    props.row.endTransparencia,                    
                    props.row.endCidadao,
                    props.row.endNfse,
                    props.row.endDeiss,
                    props.row.endLcon,
                    props.row.endComunicador
                  );
                  editDialog = true;
                  submitted = true;
                "
                size="sm"
              >
                <q-tooltip self="center right">Editar cadastro</q-tooltip>
                <q-icon name="edit" />
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
      <div class="q-gutter-xs q-pt-sm">
        <q-btn color="blue-grey-8" @click="ping('endTransparencia');">Transparência</q-btn>
        <q-btn color="blue-grey-7" @click="ping('endNfse')">NFSE</q-btn>
        <q-btn color="blue-grey-6" @click="ping('endDeiss')">DEISS</q-btn>
        <q-btn color="blue-grey-5" @click="ping('endCidadao')">Cidadão</q-btn>
      </div>
    </div>

    <!-- CADASTRAMENTO DE CLIENTES -->
    <q-dialog v-model="cadDialog" class="dialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Cadastrar cliente</div>
        </q-card-section>
        <q-card-section>
          <input v-model="cliente.idCliente" hidden />
          <q-input
            outlined
            v-model="cliente.nmCliente"
            label="Nome do cliente"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="60"
          />
          <q-input
            type="number"
            outlined
            v-model="cliente.codTce"
            label="Código do TCE do cliente"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
          />
          <q-input
            outlined
            v-model="cliente.endTransparencia"
            label="Endereço do portal da transparência"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="cliente.endComunicador"
            label="Endereço do Comunicador"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="cliente.endCidadao"
            label="Endereço do ARCidadão"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="cliente.endNfse"
            label="Endereço da Nota fiscal eletrônica"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="cliente.endDeiss"
            label="Endereço da Deiss"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="cliente.endLcon"
            label="Endereço Licitacon"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="160"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary q-ma-sm">
          <q-btn
            id="btnSalvar"
            label="Salvar"
            color="primary"
            @click="
              cadCliente();
              limpaCampos();
              submitted = false;
            "
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
      </q-card>
    </q-dialog>
    <!-- AQUI FAZ A PARTE DO CÓDIGO QUE EDITA O CADASTRO - ONDE ABRE O DIALOG PARA EDIÇÃO DOS DADOS -->

    <q-dialog v-model="editDialog" class="dialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Alterar Dados</div>
        </q-card-section>
        <q-card-section>
          <input v-model="p2.idCliente" hidden />
          <q-input
            outlined
            required
            v-model="p2.nmCliente"
            label="Nome"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="80"
          />
          <q-input
            outlined
            v-model="p2.codTce"
            max="10"
            label="Código do TCE do cliente"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
          />
          <q-input
            outlined
            v-model="p2.endTransparencia"
            label="Endereço do portal da transparência"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="p2.endComunicador"
            label="Endereço do Comunicador"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="p2.endCidadao"
            label="Endereço do ARCidadão"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="p2.endNfse"
            label="Endereço da Nota Fiscal Eletrônica"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="p2.endDeiss"
            label="Endereço da Deiss"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="120"
          />
          <q-input
            outlined
            v-model="p2.endLcon"
            label="Endereço Licitacon"
            lazy-rules
            :rules="[(val) => !!val]"
            class="q-pb-sm"
            maxlength="160"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary q-ma-sm">
          <q-btn
            id="btnEditar"
            label="Alterar"
            color="primary"
            @click="saveEdit(p2.idCliente)"
            v-close-popup
          />
          <q-btn
            color="white"
            text-color="black"
            label="Cancelar"
            @click="limpaCampos()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="clientesTransp" class="dialog" >
      <q-card style="width: 700px; max-width: 70vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ this.sistAuxDialog }} - Status </div>
        </q-card-section>
        <q-card-section>
        <p class="q-pt-xs" style="font-size: 12px; font-style: italic">
          <span class="q-pt-xs">*Alguns clientes podem não ser rastreados por conta de proxy.</span>
        </p>
          <q-table
            class="col-md-12"
            :data="erros"
            :columns="columnsStatus"
            row-key="nmCliente"
            :filter="filter"
            no-results-label="Nenhum resultado encontrado."
            :pagination.sync="pagination2"
          >
          <template v-slot:body-cell-status="props">
            <q-td :props="props" :style="props.row.status === 'OK'
                ? 'color:green': props.row.status === 'OFF-LINE'?'color:red':''">
              {{props.row.status}}
            </q-td>
          </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Atualizar"
            color="primary"
            @click="ping(sistAux)"
          />
          <q-btn
            label="Fechar"
            type="reset"
            color="white"
            text-color="black"
            class="q-ml-sm"
            @click="clientesTransp = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="clientesOff" class="dialog" >
      <q-card style="width: 650px; max-width: 70vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ this.sistAuxDialog }} - Status </div>
        </q-card-section>
        <q-card-section>
      <p class="q-pt-xs" style="font-size: 12px; font-style: italic">
        <span class="q-pt-xs">*Alguns clientes podem não ser rastreados por conta de proxy.</span>
      </p>
     <q-markup-table>
      <thead>
        <tr>
          <th class="text-left"><b>Nome do cliente</b></th>
          <th class="text-center"><b>Status</b></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in erros" :key="e.cliente">
          <td class="text-left">{{ e.cliente }}</td>
          <td class="text-center" :style="e.status === 'OK'
                ? 'color:green': e.status === 'OFF-LINE'?'color:red':''"><b>{{ e.status }}</b></td>
        </tr>
      </tbody>
    </q-markup-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Atualizar"
            color="primary"
            @click="ping(sistAux)"
          />
          <q-btn
            label="Fechar"
            type="reset"
            color="white"
            text-color="black"
            class="q-ml-sm"
            @click="clientesOff = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- AQUI TERMINA O DIALOG -->
  </q-page>
</template>
<script>
import { Notify, openURL, QSpinnerBars } from 'quasar'
export const required = (val) => !!val || 'Field is required'
export default {
  mounted () {
    this.carrega()
  },
  data () {
    return {
      ano: new Date().getFullYear(),
      filter: '',
      cadDialog: false,
      editDialog: false,
      submitted: false,
      clientesOff: false,
      clientesTransp: false,
      sistAux: '',
      sistAuxDialog: '',
      erros: [],
      cliente: {
        nmCliente: '',
        codTce: '',
        endTransparencia: '',
        endCidadao: '',
        endNfse: '',
        endDeiss: '',
        endLcon: ''
      },
      p2: {
        nmCliente: '',
        codTce: '',
        endTransparencia: '',
        endCidadao: '',
        endNfse: '',
        endDeiss: '',
        endLcon: ''
      },
      data: this.data, // busca o select
      pagination: {
        page: 1,
        rowsPerPage: 5
        // rowsNumber: xx if getting data from a server
      },
      pagination2: {
        page: 1,
        rowsPerPage: 15
      },
      // AQUI ABAIXO, POPULA A TABELA COM DADOS DO BANCO
      columns: [
        {
          name: 'Nome do cliente',
          required: true,
          label: 'Nome do cliente',
          align: 'left',
          field: (row) => row.nmCliente.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'pad',
          align: 'center',
          label: 'PAD',
          field: (row) => row.codTce
        },
        {
          name: 'ptb',
          align: 'center',
          label: 'Transparência',
          field: (row) => row.endTransparencia
        },
        {
          name: 'comunicador',
          align: 'center',
          label: 'Comunicador',
          field: (row) => row.endComunicador
        },
        {
          name: 'cidadao',
          align: 'center',
          label: 'ARCidadão',
          field: (row) => row.endCidadao
        },
        {
          name: 'nfse',
          align: 'center',
          label: 'NFS-E',
          field: (row) => row.endNfse
        },
        {
          name: 'deiss',
          align: 'center',
          label: 'DEISS',
          field: (row) => row.endDeiss
        },
        {
          name: 'lcon',
          align: 'center',
          label: 'Licitacon',
          field: (row) => row.endLcon
        },
        {
          name: 'acoes',
          align: 'right',
          label: 'REMOVER  -  EDITAR',
          field: 'acoes'
        }
      ],
      columnsStatus: [
        {
          name: 'cliente',
          align: 'left',
          label: 'Nome do Cliente',
          field: (row) => row.cliente,
          sortable: true
        },
        {
          name: 'nrversao',
          align: 'left',
          label: 'Versão TB',
          field: (row) => row.nrversao,
          sortable: true
        },
        {
          name: 'dtatualizacao',
          align: 'left',
          label: 'Data/Hora Atualização',
          field: (row) => row.dtatualizacao,
          sortable: true
        },
        {
          name: 'status',
          align: 'center',
          label: 'Status'
        }
      ]

    }
  },
  methods: {
    required,
    ping (sistemaOnline) {
      this.erros = []
      this.sistAux = sistemaOnline
      switch (sistemaOnline) {
        case 'endTransparencia':
          this.sistAuxDialog = 'Transparência'
          break
        case 'endDeiss':
          this.sistAuxDialog = 'DEISS'
          break
        case 'endCidadao':
          this.sistAuxDialog = 'Cidadão'
          break
        case 'endNfse':
          this.sistAuxDialog = 'NF-Eletrônica'
          break
        default:
          break
      }
      this.showLoading(sistemaOnline)
      this.$axios
        .get(`${process.env.API}/ping/${sistemaOnline}`)
        .then((response) => {
          this.erros = response.data
        })
    },
    showLoading (sist) {
      this.$q.loading.show({
        spinner: QSpinnerBars,
        spinnerColor: 'warning',
        messageColor: 'warning',
        message: '<b>Efetuando comunicação com o serviço de cada cliente. <br>Por favor aguarde...</b>'
      })
      // hiding in 2s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        if (sist === 'endTransparencia') {
          this.clientesTransp = true
        } else {
          this.clientesOff = true
        }
        this.timer = void 0
      }, 29100)
    },
    carrega () {
      this.$axios
        .get(`${process.env.API}/clientes/`)
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
    abrePad (codTce) {
      openURL(
        'http://portal.tce.rs.gov.br/pcdi2/relatorios-recibos-envio.action?&cdOrgao=' +
          codTce +
          '&ano=' +
          this.ano
      )
    },
    abreTB (endTransparencia) {
      if (endTransparencia.length === 0) {
        Notify.create({
          message: 'Cliente não tem este sistema cadastrado.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      } else {
        openURL(endTransparencia)
      }
    },
    // Cadastra cliente
    async cadCliente (idCliente) {
      if (this.cliente.nmCliente !== '') {
        const axiosConfig = {
          method: 'post',
          url: `/cadCliente`,
          data: this.cliente
        }
        this.cadDialog = false
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'cliente cadastrado.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.carrega()
      } else {
        Notify.create({
          message: 'Ocorreu um erro. Nome do cliente é obrigatório.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    // DELETA cliente
    confirmaRemove (idCliente, nome) {
      this.$q
        .dialog({
          title: 'Confirmação de exclusão',
          message: 'Confirma a exclusão do cadastro: ' + nome,
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
          this.delPessoa(idCliente)
        })
        .onCancel(() => {})
    },
    async delPessoa (idCliente) {
      const axiosConfig = {
        method: 'delete',
        url: `/cadCliente/${idCliente}`
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
    // Popula o DIALOG para editar a cliente
    editPessoa (idCliente, nome, nasc, endT, endC, endN, endD, endl, endComu) {
      this.p2.idCliente = idCliente
      this.p2.nmCliente = nome
      this.p2.codTce = nasc
      this.p2.endTransparencia = endT
      this.p2.endCidadao = endC
      this.p2.endNfse = endN
      this.p2.endDeiss = endD
      this.p2.endLcon = endl
      this.p2.endComunicador = endComu
    },
    // Salva a edição da cliente
    async saveEdit (idCliente) {
      if (this.p2.nmCliente !== '') {
        const axiosConfig = {
          method: 'put',
          url: `/cadCliente/${idCliente}`,
          data: this.p2
        }
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Cadastro alterado.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.carrega()
      } else {
        Notify.create({
          message: 'Nome do cliente é obrigatório.',
          position: 'bottom',
          color: 'red',
          timeout: 1900
        })
      }
    },
    limpaCampos () {
      this.erros = {
        cliente: ''
      }
      this.cliente = {
        nmCliente: '',
        codTce: '',
        endTransparencia: '',
        endCidadao: '',
        endNfse: '',
        endLcon: ''
      }
    }
  }
}
</script>
