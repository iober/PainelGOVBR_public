<template>
  <div class="q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-grey-14" active-color="primary">
        <template v-slot:separator>
          <q-icon size="1.2em" name="arrow_forward" color="primary" />
        </template>
        <q-breadcrumbs-el label="Home" icon="home" to="/index" />
        <q-breadcrumbs-el label="Visitas" icon="business_center" to="/visita" />
      </q-breadcrumbs>
    </div>
    <div align="center" class="row">
      <q-select
        outlined
        v-model="areaSelect"
        :options="area"
        label="Área"
        class="col-lg-2 col-sm-3 col-xs-12 q-mr-sm q-mb-sm"
        @input="carregaArea(areaSelect)"
      />
      <q-input
        outlined
        v-model="dtAux"
        type="date"
        class="col-lg-2 col-sm-3 col-xs-12 q-mb-sm"
      >
        <q-tooltip self="center right" style="color: red"
          >Data retroativa à</q-tooltip
        >
      </q-input>
      <div class="q-pt-sm q-pl-sm q-pb-sm">
        <q-btn
          v-show="statusTodas === false"
          stack
          push
          @click="
            mostraTodas();
            statusTodas = true;
          "
          color="grey-6"
          >Mostrar Todas</q-btn
        >
        <q-btn
          v-show="statusTodas === true"
          stack
          push
          @click="
            carrega();
            statusTodas = false;
          "
          color="grey-7"
          >Esconder Antigas</q-btn
        >
      </div>
      <q-dialog
        v-model="addCont"
        class="dialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 600px; max-width: 90vw">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Cadastrar contato</div>
          </q-card-section>
          <q-card-section>
            <addContatoComp />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <p class="q-pt-xs" style="font-size: 12px; font-style: italic">
      *Utilize o campo de data para destacar os registros ANTERIORES a data
      selecionada. Data patrão, 6 meses anterior a data atual.
    </p>
    <!-- TABELA PRINCIPAL DA PAGINA -->
    <q-table
      :data="data"
      :columns="columns"
      row-key="idVisita"
      :filter="filter"
      no-results-label="Nenhum resultado encontrado."
      :pagination.sync="pagination"
      style="word-wrap: break-word"
    >
      <template v-slot:top-left>
        <h6 class="q-pl-lg"><b>Histórico de visitas</b></h6>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />

          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              :style="
                props.row.dtVisita < dtAux && props.row.status === 'A'
                  ? 'backgroundColor:#ff0000; color:white'
                  : ''
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
        </q-tr>
        <q-tr
          v-show="props.expand"
          :props="props"
          style="backgroundcolor: #e5f2f2"
        >
          <q-td colspan="100%">
            <div class="row">
              <div style="word-wrap" class="col-lg- col-sm-8 col-xs-12 q-pt-md">
                <div><b>Contato: </b> {{ props.row.contato }}</div>
              </div>
              <div style="word-wrap"  class="col-lg-10 col-sm-6 col-xs-12 q-pt-md">
                <b>Assuntos: </b>
                <div style="width: 800px; whiteSpace: normal; text-align: justify;"><span v-html="props.row.descricao"></span></div>
              </div>
            </div>
            <div class="q-mt-sm">
              <q-td>
                <q-btn
                  v-show="
                    userOn === 'Iober Henrique da Cruz' ||
                    userOn === 'Thiago Gomes' ||
                    userOn === 'Leonardo Parode'
                  "
                  class="q-mr-sm"
                  round
                  stack
                  push
                  color="primary"
                  size="sm"
                  @click="
                    editAux(
                      props.row.idVisita,
                      props.row.nmCliente,
                      props.row.tpVisita,
                      props.row.resumo,
                      props.row.descricao,
                      props.row.dtVisita,
                      props.row.contato
                    );
                    editarDiagVisita = true;
                  "
                >
                  <q-tooltip self="center right">Editar demanda</q-tooltip>
                  <q-icon name="edit" />
                </q-btn>
                <q-btn
                  v-show="
                    userOn === 'Iober Henrique da Cruz' ||
                    userOn === 'Thiago Gomes' ||
                    userOn === 'Leonardo Parode'
                  "
                  class="q-mr-lg"
                  round
                  stack
                  push
                  color="red-5"
                  @click="
                    removerVisita(props.row.idVisita, props.row.nmCliente)
                  "
                  size="sm"
                >
                  <q-tooltip>Remover cadastro</q-tooltip>
                  <q-icon name="delete" />
                </q-btn>
              </q-td>
            </div>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right flat>
        <q-input
          class="q-pa-md"
          id="x"
          v-model="filter"
          label="Pesquisar visitas"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          v-show="
            userOn === 'Iober Henrique da Cruz' ||
            userOn === 'Thiago Gomes' ||
            userOn === 'Leonardo Parode'
          "
          round
          stack
          push
          color="light-blue-7"
          class="q-ml-md"
          icon="add"
          @click="cadVisitaDialog = true"
        >
          <q-tooltip self="center right">Adicionar nova visita</q-tooltip>
        </q-btn>
      </template>
    </q-table>

    <!-- DIALOG VISITA -->
    <q-dialog v-model="cadVisitaDialog" class="dialog">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Nova visita</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-x-md">
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
              @input="carregaSelectContato(dadosCliente.idCliente)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    0 Resultados. Digite um nome ou pressione Enter.
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              outlined
              class="q-pb-sm col-lg-6 col-xs-12 col-sm-6"
              v-model="visita.tpVisita"
              :options="area"
              label="Área"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <q-input
              outlined
              v-model="visita.dtVisita"
              class="q-pb-sm col-lg-6 col-xs-12 col-sm-6"
              lazy-rules
              :rules="[(val) => !!val]"
              placeholder="Data da visita"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="visita.dtVisita"
                      @input="() => $refs.qDateProxy.hide()"
                      mask="DD/MM/YYYY"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="dadosContato"
              use-input
              max-values="4"
              multiple
              outlined
              key="idContato"
              :options="optionsContatos"
              option-value="idContato"
              option-label="nmContato"
              label="Digite o nome do contato"
              @filter="filterFnContato"
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
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  color="primary"
                  @click="
                    limpaCampos();
                    addCont = true;
                  "
                />
              </template>
            </q-select>
            <q-input
              outlined
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="visita.resumo"
              label="Resumo da atividade (até 80 caractéres)"
              maxlength="80"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <div class="col-lg-12 col-xs-12 col-sm-12">
              <q-editor
                min-height="3rem"
                outlined
                v-model="visita.descricao"
                placeholder="Descrição"
                lazy-rules
                :rules="[(val) => !!val]"
                :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  [
                    'bold',
                    'italic',
                    'strike',
                    'underline',
                    'subscript',
                    'superscript',
                  ],
                  ['unordered', 'ordered'],
                  ['link'],
                  ['print', 'fullscreen'],
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn
            label="Salvar"
            color="primary"
            @click="cadVisita()"
            v-close-popup
          />
          <q-btn
            color="white"
            text-color="black"
            label="Limpar"
            @click="limpaCampos()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- EDITAR DIALOG VISITA -->
    <q-dialog v-model="editarDiagVisita" class="dialog">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Editar visita</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-x-md">
            <q-select
              disable
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="nmEditAux"
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
            <q-select
              disable
              outlined
              class="q-pb-sm col-lg-6 col-xs-12 col-sm-6"
              v-model="visita.tpVisita"
              :options="area"
              label="Área"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <q-input
              outlined
              v-model="visita.dtVisita"
              class="q-pb-sm col-lg-6 col-xs-12 col-sm-6"
              lazy-rules
              :rules="[(val) => !!val]"
              placeholder="Data da visita. Ex: 01/01/2020"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="visita.dtVisita"
                      @input="() => $refs.qDateProxy.hide()"
                      mask="DD/MM/YYYY"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              outlined
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="visita.contato"
              label="Contato"
              maxlength="40"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <q-input
              outlined
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="visita.resumo"
              label="Resumo da atividade (até 80 caractéres)"
              maxlength="80"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <div class="col-lg-12 col-xs-12 col-sm-12">
              <q-editor
                min-height="3rem"
                outlined
                v-model="visita.descricao"
                placeholder="Descrição"
                :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  [
                    'bold',
                    'italic',
                    'strike',
                    'underline',
                    'subscript',
                    'superscript',
                  ],
                  ['unordered', 'ordered'],
                  ['link'],
                  ['print', 'fullscreen'],
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn
            label="Salvar"
            color="primary"
            @click="editarVisita()"
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
  </div>
</template>
<script>
import { Notify, date } from 'quasar'
import { firebase, firebaseDb } from 'boot/firebase'
const areas = ['Coordenadoria', 'Comercial']
const stringOptions = []
const stringOptionsContatos = []
import addContatoComp from 'components/addContato.vue'
export default {
  components: {
    addContatoComp
  },
  data () {
    return {
      statusTodas: false,
      addCont: false,
      dtAux: '',
      userOn: '',
      area: areas,
      areaSelect: '',
      nmEditAux: '',
      options: stringOptions,
      optionsContatos: stringOptionsContatos,
      filter: '',
      cadVisitaDialog: false,
      editarDiagVisita: false,
      dadosCliente: '',
      dadosContato: '',
      data: this.data, // busca o select
      visita: {
        idCliente: '',
        resumo: '',
        descricao: '',
        dtVisita: '',
        tpVisita: '',
        contato: '',
        idContato: '',
        status: ''
      },
      pagination: {
        page: 1,
        rowsPerPage: 25,
        sortBy: 'dtVisita',
        descending: true
      },
      // AQUI ABAIXO, POPULA A TABELA COM DADOS DO BANCO
      columns: [
        {
          name: 'nmCliente',
          required: true,
          label: 'Nome do cliente',
          align: 'left',
          field: (row) => row.nmCliente.toUpperCase(),
          sortable: true,
          style: 'font-weight: bold'
        },
        {
          name: 'dtVisita',
          required: true,
          label: 'Data visita',
          align: 'left',
          format: (val) => date.formatDate(val, 'DD/MM/YYYY'),
          field: (row) => row.dtVisita,
          sortable: true
        },
        {
          name: 'resumo',
          required: true,
          label: 'Resumo',
          align: 'left',
          field: (row) => row.resumo.substring(0, 80)
        },
        {
          name: 'tpVisita',
          required: true,
          label: 'Área',
          align: 'left',
          field: (row) => row.tpVisita
        }
      ]
    }
  },
  created () {
    var MyDate = new Date()
    var MyDateString = ''
    var tempoMonth = ''
    MyDate.setDate(MyDate.getDate())
    switch (MyDate.getMonth()) {
      case 0:
        tempoMonth = '07'
        break
      case 1:
        tempoMonth = '08'
        break
      case 2:
        tempoMonth = '09'
        break
      case 3:
        tempoMonth = '10'
        break
      case 4:
        tempoMonth = '11'
        break
      case 5:
        tempoMonth = '12'
        break
      case 6:
        tempoMonth = '01'
        break
      case 7:
        tempoMonth = '02'
        break
      case 8:
        tempoMonth = '03'
        break
      case 9:
        tempoMonth = '04'
        break
      case 10:
        tempoMonth = '05'
        break
      case 11:
        tempoMonth = '06'
        break
    }
    var tempoDate = MyDate.getDate()
    if (tempoDate < 10) tempoDate = '0' + tempoDate
    if (tempoMonth >= 7 && tempoMonth <= 12) {
      MyDateString =
        +(MyDate.getFullYear() - 1) + '-' + tempoMonth + '-' + tempoDate
    } else {
      MyDateString = +MyDate.getFullYear() + '-' + tempoMonth + '-' + tempoDate
    }

    this.dtAux = MyDateString
    firebase.auth().onAuthStateChanged((user) => {
      if (user.displayName) {
        this.userOn = user.displayName
      } else {
        firebaseDb.ref('/users').on('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().email === user.email) {
              this.userOn = childSnapshot.val().displayName
            }
          })
        })
      }
    })
    // THIS.CARREGA, CARREGA OS DADOS NA TELA
    this.carrega()
    // ESSE FOR NÃO DEIXA CARREGAR A LISTA DE CLIENTES DUAS VEZES
    for (var i = 0; i < stringOptions.length; ++i) {
      stringOptions.splice(i--, 1)
    }
    // CARREGA O SELECT COM OS CLIENTES
    this.carregaSelectCliente()
  },
  methods: {
    carrega () {
      this.$axios
        .get(`${process.env.API}/visitas/`)
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
    mostraTodas () {
      this.$axios
        .get(`${process.env.API}/todasVisitas/`)
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
    async carregaArea (area) {
      this.$axios
        .get(`${process.env.API}/visitas/${area}`)
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
          this.dataVisita = response.data
          this.dataVisita.forEach((value, index) => {
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
    carregaSelectContato (idCliente) {
      this.dadosContato = null
      while (stringOptionsContatos.length > 0) {
        stringOptionsContatos.pop()
      }
      this.$axios
        .get(`${process.env.API}/clienteSelectContato/${idCliente}`)
        .then((response) => {
          this.dataContato = response.data
          this.dataContato.forEach((value, index) => {
            // this.options.push(value)
            stringOptionsContatos.push(value)
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
    testeVisita () {
      this.visita.contato = this.dadosContato
      const axiosConfig = {
        method: 'post',
        url: `/teste`,
        data: this.visita
      }
      this.cadDialog = false
      this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Visita cadastrada.',
        position: 'bottom',
        color: 'green',
        timeout: 800
      })
    },
    // Cadastra visitas
    async cadVisita () {
      this.visita.status = 'A'
      this.visita.contato = this.dadosContato[0].nmContato
      this.visita.idCliente = this.dadosCliente.idCliente
      if (
        this.visita.idCliente &&
        this.visita.dtVisita &&
        this.visita.tpVisita &&
        this.visita.descricao
      ) {
        const axiosConfig = {
          method: 'post',
          url: `/cadVisita`,
          data: this.visita
        }
        this.cadDialog = false
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Visita cadastrada.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.carrega()
        this.limpaCampos()
      } else {
        Notify.create({
          message: 'Ocorreu um erro. Todos os campos são obrigatórios.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    checkDate (val) {
      return date.isValid(val) || 'Invalid date.'
    },
    filterFn (val, update, abort) {
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
    filterFnContato (val, update, abort) {
      if (val.length < 0) {
        abort()
      } else {
        setTimeout(() => {
          update(() => {
            if (val === '') {
              this.optionsContatos = stringOptionsContatos
            } else {
              const needle = val.toLowerCase()
              this.optionsContatos = stringOptionsContatos.filter(
                (v) => v.nmContato.toLowerCase().indexOf(needle) > -1
              )
            }
          })
        }, 200)
      }
    },
    editAux (id, nmAux, tpVisita, resumo, desc, dt, contato) {
      this.visita.idVisita = id
      this.nmEditAux = nmAux
      this.visita.tpVisita = tpVisita
      this.visita.descricao = desc
      this.visita.resumo = resumo
      this.visita.contato = contato
      this.visita.dtVisita = date.formatDate(dt, 'DD/MM/YYYY')
    },
    async editarVisita (idVisita, cliente) {
      var a = this.visita.dtVisita.split(/\D/)
      this.visita.dtVisita = a.reverse().join('-')

      const axiosConfig = {
        method: 'put',
        url: `/visita/${this.visita.idVisita}`,
        data: this.visita
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Registro de demanda alterado.',
        position: 'bottom',
        color: 'green',
        timeout: 800
      })
      this.carrega()
      this.limpaCampos()
    },
    async removerVisita (idVisita, nmCliente) {
      this.$q
        .dialog({
          title: 'Confirmação de exclusão',
          message: 'Cliente: ' + nmCliente,
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
          const axiosConfig = {
            method: 'delete',
            url: `/delVisita/${idVisita}`
          }
          this.$axios(axiosConfig.url, axiosConfig)
            .then((R) => R.data)
            .catch(this.AxiosCatch)
          this.carrega()
          Notify.create({
            message: 'Visita removida.',
            position: 'bottom',
            color: 'red',
            timeout: 2800
          })
          this.carrega()
        })
        .onCancel(() => {})
    },
    limpaCampos () {
      this.dadosContato = null
      this.dadosCliente = null
      this.visita = {
        idCliente: '',
        descricao: '',
        tpVisita: '',
        dtVisita: '',
        resumo: '',
        contato: ''
      }
    }
  }
}
</script>
