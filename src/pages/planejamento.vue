<template>
  <div class="q-pa-md">
    <div class="row" v-if="!this.$q.platform.is.mobile">
      <div class="col-3">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs class="text-grey-14" active-color="primary">
            <template v-slot:separator>
              <q-icon size="1.2em" name="arrow_forward" color="primary" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/index" />
            <q-breadcrumbs-el
              label="Demandas"
              icon="pending_actions"
              to="/planejamento"
            />
          </q-breadcrumbs>
        </div>
      </div>
      <div class="col-7">
        <div class="q-mb-md q-gutter-sm">
          <q-btn stack push @click="carrega('Todos')">Todos</q-btn>
          <q-btn stack push @click="carregaSistema('Educação')">Educação</q-btn>
          <q-btn stack push @click="carregaSistema('Financeira')"
            >Financeira</q-btn
          >
          <q-btn stack push @click="carregaSistema('Pessoal')">Pessoal</q-btn>
          <q-btn stack push @click="carregaSistema('Receitas')">Receitas</q-btn>
          <q-btn stack push @click="carregaSistema('Saúde')">Saúde</q-btn>
          <q-btn stack push @click="carregaSistema('Suprimentos')"
            >Suprimentos</q-btn
          >
        </div>
      </div>
    </div>
    <div v-if="this.$q.platform.is.mobile">
      <q-breadcrumbs class="text-grey-14" active-color="primary">
        <template v-slot:separator>
          <q-icon size="1.2em" name="arrow_forward" color="primary" />
        </template>
        <q-breadcrumbs-el label="Home" icon="home" to="/index" />
        <q-breadcrumbs-el
          label="Demandas"
          icon="pending_actions"
          to="/planejamento"
        />
      </q-breadcrumbs>
      <q-select
        outlined
        v-model="areaSelectModel"
        :options="areaSelect"
        label="SISTEMAS"
        class="q-pb-md q-pt-sm col col-xs-12"
        @input="carregaSistema(areaSelectModel)"
      />
    </div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="idDemanda"
      :filter="filter"
      no-results-label="Nenhum resultado encontrado."
      :pagination.sync="pagination"
      :visible-columns="visibleColumns"
      style="word-wrap: break-word"
    >
      <template v-slot:top-left flat>
        <div v-if="$q.screen.gt.xs" class="col">
          <q-toggle v-model="visibleColumns" val="sistema" label="Sistema" />
          <q-toggle v-model="visibleColumns" val="resumo" label="Resumo" />
          <q-toggle
            v-model="visibleColumns"
            val="inclusao"
            label="Data Inclusão"
          />
          <q-toggle
            v-model="visibleColumns"
            val="usuario"
            label="Responsável"
          />
          <q-toggle
            v-model="visibleColumns"
            val="prioridade"
            label="Prioridade"
          />
        </div>
        <br />
        <q-btn
          @click="demandasConcluidas = true"
          size="12px"
          rounded
          color="teal-7"
          stack
          push
          >Demandas concluídas</q-btn
        >
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
        </q-tr>
        <q-tr
          v-show="props.expand"
          :props="props"
          style="backgroundcolor: #e5f2f2; color: black"
        >
          <q-td colspan="100%">
            <div class="text-left">
              <b>Previsão de Horas: </b>
              {{ props.row.previsao.toUpperCase() + ' Horas' }}
            </div>
            <div class="row">
              <div style="word-wrap" class="col-lg-6 col-sm-8 col-xs-12 q-pt-md">
                <b>Atividades: </b>
                <div style="width: 550px; whiteSpace: normal;text-align: justify;"><span v-html="props.row.atividade"></span></div>
              </div>
              <div style="word-wrap"  class="col-lg-6 col-sm-6 col-xs-12 q-pt-md">
                <b>Observações: </b>
                <div style="width: 500px; whiteSpace: normal; text-align: justify;"><span v-html="props.row.observacoes"></span></div>
              </div>
            </div>
            <div class="q-mt-sm q-mr-sm">
              <q-td class="q-gutter-xs">
                <q-btn
                  stack
                  push
                  round
                  color="blue"
                  icon="share"
                  padding="2.1px"
                  @click="compartilhar(props.row.idDemanda)"
                />
                <q-fab
                  stack
                  push
                  color="purple"
                  icon="keyboard_arrow_right"
                  direction="right"
                  padding="2.2px"
                >
                  <q-fab-action
                    stack
                    push
                    padding="2.2px"
                    color="teal"
                    @click="
                      concluirDemanda(
                        props.row.idDemanda,
                        props.row.nmClienteDemanda,
                        props.row.resumo
                      )
                    "
                    icon="done"
                  >
                    <q-tooltip>Concluir demanda</q-tooltip></q-fab-action
                  >
                  <q-fab-action
                    stack
                    push
                    padding="2.2px"
                    color="primary"
                    @click="
                      editDemanda(
                        props.row.idDemanda,
                        props.row.idCliente,
                        props.row.nmClienteDemanda,
                        props.row.sistema,
                        props.row.prioridade,
                        props.row.resumo,
                        props.row.atividade,
                        props.row.observacoes,
                        props.row.previsao
                      );
                      editDialog = true;
                    "
                    icon="edit"
                    ><q-tooltip>Editar demanda</q-tooltip></q-fab-action
                  >
                  <q-fab-action
                    stack
                    push
                    padding="2.2px"
                    color="blue-grey-6"
                    @click="
                      inativarDemanda(
                        props.row.idDemanda,
                        props.row.nmClienteDemanda,
                        props.row.resumo
                      )
                    "
                    icon="power_settings_new"
                    ><q-tooltip>Stand-By</q-tooltip></q-fab-action
                  >
                  <q-fab-action
                    stack
                    push
                    padding="2.2px"
                    color="red"
                    @click="
                      confirmaRemove(
                        props.row.idDemanda,
                        props.row.nmClienteDemanda,
                        props.row.resumo
                      )
                    "
                    icon="delete"
                    ><q-tooltip>Excluir</q-tooltip></q-fab-action
                  >
                </q-fab>
              </q-td>
              <q-td auto-width>
                <q-btn
                  color="warning"
                  v-show="props.row.status === 'I'"
                  icon="power_settings_new"
                  size="sm"
                  round
                  @click="
                    restaurarDemanda(
                      props.row.idDemanda,
                      props.row.nmClienteDemanda,
                      props.row.resumo
                    )
                  "
                  dense
                >
                  <q-tooltip>Reativar demanda</q-tooltip>
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
          label="Pesquisar demandas"
        >
          <q-tooltip>Pesquisar por cliente ou área</q-tooltip>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          stack
          push
          round
          color="light-blue-7"
          class="q-ml-md"
          icon="add"
          @click="planDialog = true"
        >
          <q-tooltip self="center right">Adicionar nova demanda</q-tooltip>
        </q-btn>
      </template>
    </q-table>
    <div>
      <p class="q-pt-xs" style="font-size: 11px; font-style: italic">
        <span class="q-pt-xs"
          >*Prioridades:
          <q-badge
            color="red"
            padding="3px"
            text-color="white"
            label="Alta"
            class="q-mr-xs" />
          <q-badge
            color="yellow"
            text-color="black"
            label="Média"
            class="q-mr-xs" /><q-badge
            color="green"
            text-color="white"
            label="Baixa"
            class="q-mr-xs"
        /></span>
        <br />**Clique na linha para visualizar todas as informações.
        <br />***Utilize os botões do canto superior esquerdo da tabela para
        ocultar ou exibir colunas.
      </p>
    </div>
    <!-- CADASTRAMENTO DE DEMANDAS -->
    <q-dialog v-model="planDialog">
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Cadastrar demanda</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-x-md">
            <q-select
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="planNmCliente"
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
              max-values="2"
              multiple
              outlined
              use-chips
              class="q-pb-sm col-sm-6 col-md-6 col-lg-6 col-xs-12 col-sm-12"
              v-model="demanda.sistema"
              :options="area"
              label="Sistema"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <q-select
              outlined
              class="q-pb-sm col-sm-6 col-md-6 col-lg-6 col-xs-12 col-sm-6"
              v-model="demanda.prioridade"
              :options="optionPrioridade"
              label="Prioridade"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <q-input
              outlined
              class="q-pb-sm col-sm-6 col-md-6 col-lg-6 col-xs-12 col-sm-6"
              v-model="demanda.previsao"
              label="Previsão de tempo"
              maxlength="5"
              mask="##:##"
              lazy-rules
              :rules="[(val) => !!val]"
            >
              <q-tooltip> Tempo estimado para conclusão. </q-tooltip>
            </q-input>
            <q-input
              readonly
              standout
              class="q-pb-sm col-sm-6 col-md-6 col-lg-6 col-xs-12 col-sm-6"
              v-model="demanda.dataprevisao"
              label="Data para Execução"
              maxlength="5"
              lazy-rules
              :rules="[(val) => !!val]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="demanda.dataprevisao"
                      @input="() => $refs.qDateProxy.hide()"
                      mask="DD/MM/YYYY"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <q-tooltip>
                Data sugerida para formalização da demanda.
              </q-tooltip>
            </q-input>
            <q-input
              outlined
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="demanda.resumo"
              label="Resumo da atividade (até 80 caractéres)"
              maxlength="80"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <div class="q-pb-sm col-lg-12 col-xs-12 col-sm-12">
              <q-editor
                min-height="3rem"
                outlined
                v-model="demanda.atividade"
                placeholder="Descrição da atividade"
                :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'strike'],
                  ['unordered', 'ordered'],
                  ['link'],
                  ['print', 'fullscreen'],
                ]"
              />
            </div>
            <div class="q-pb-sm col-lg-12 col-xs-12 col-sm-12">
              <q-editor
                min-height="3rem"
                outlined
                v-model="demanda.observacoes"
                placeholder="Observações"
                :toolbar="[
                  ['left', 'center', 'right', 'justify', 'bold', 'italic'],
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary q-mb-sm">
          <q-btn
            id="btnSalvar"
            label="Salvar"
            color="primary"
            @click="
              cadDemanda();
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
    <!--------------------------------- EDIT DIALOG ---------------------------->
    <q-dialog v-model="editDialog" class="dialog">
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Alterar dados da demanda</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-x-md">
            <q-select
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="auxNmCliente"
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
              max-values="2"
              multiple
              outlined
              use-chips
              class="q-pb-sm col-sm-4 col-md-4 col-lg-4 col-xs-12 col-sm-12"
              v-model="edit.sistema"
              :options="area"
              label="Sistema"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <q-select
              outlined
              class="q-pb-sm col-sm-4 col-md-4 col-lg-4 col-xs-12 col-sm-12"
              v-model="edit.prioridade"
              :options="optionPrioridade"
              label="Selecione a prioridade"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <q-input
              outlined
              class="q-pb-sm col-sm-4 col-md-4 col-lg-4 col-xs-12 col-sm-12"
              v-model="edit.previsao"
              label="Previsão de tempo"
              maxlength="5"
              mask="##:##"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <q-input
              outlined
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12"
              v-model="edit.resumo"
              label="Resumo da atividade (até 80 caractéres)"
              maxlength="80"
              lazy-rules
              :rules="[(val) => !!val]"
            />
            <div class="q-pb-sm col-lg-12 col-xs-12 col-sm-12">
              <q-editor
                min-height="3rem"
                outlined
                v-model="edit.atividade"
                placeholder="Descrição da atividade"
                :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'strike'],
                  ['unordered', 'ordered'],
                  ['link'],
                  ['print', 'fullscreen'],
                ]"
              />
            </div>
            <div class="q-pb-sm col-lg-12 col-xs-12 col-sm-12">
              <q-editor
                min-height="3rem"
                outlined
                v-model="edit.observacoes"
                placeholder="Observações"
                :toolbar="[
                  ['left', 'center', 'right', 'justify', 'bold', 'italic'],
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary q-ma-sm">
          <q-btn
            id="btnEditar"
            label="Alterar"
            color="primary"
            @click="saveEdit()"
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
    <q-dialog
      v-model="demandasConcluidas"
      class="dialog q-pb-sm q-mb-sm"
      transition-show="scale"
      transition-hide="scale"
      persistent
    >
      <q-card style="min-width: 80vw; max-height: auto">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Demandas Concluídas/Canceladas</div>
        </q-card-section>
        <q-card-section>
          <demandasCon />
        </q-card-section>
        <q-card-actions align="right" class="text-primary q-ma-sm q-pb-md">
          <q-btn
            position="absolute-bottom"
            color="primary"
            text-color="white"
            label="Fechar"
            @click="carrega()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-space />
  </div>
</template>
<script>
const stringOptions = []
const prioridades = ['1 - Alta', '2 - Media', '3 - Baixa']
const areas = [
  'Educação',
  'Financeira',
  'Pessoal',
  'Receitas',
  'Saúde',
  'Suprimentos'
]
const areaSistemas = [
  'Todos',
  'Educação',
  'Financeira',
  'Pessoal',
  'Receitas',
  'Saúde',
  'Suprimentos'
]
import { Notify, date, openURL } from 'quasar'
import { firebase, firebaseDb } from 'boot/firebase'
import demandasCon from 'components/demandasConcluidas.vue'
export default {
  components: {
    demandasCon
  },
  data () {
    return {
      demandasConcluidas: false,
      area: areas,
      areaSelect: areaSistemas,
      areaSelectModel: '',
      prioridades,
      auxSistema: '',
      optionPrioridade: prioridades,
      filter: '',
      planDialog: false,
      editDialog: false,
      planNmCliente: '',
      userOn: '',
      options: stringOptions,
      edit: {
        idCliente: '',
        nmClienteDemanda: '',
        sistema: [],
        prioridade: '',
        resumo: '',
        atividade: '',
        previsao: '',
        observacoes: '',
        dataInclusao: ''
      },
      auxNmCliente: '',
      demanda: {
        idCliente: '',
        nmClienteDemanda: '',
        sistema: [],
        prioridade: '',
        resumo: '',
        atividade: '',
        previsao: '',
        observacoes: '',
        dataInclusao: '',
        usuario: '',
        status: 'A',
        dataConclusao: '',
        nrChamado: '',
        dataprevisao: ''
      },
      visibleColumns: [
        'sistema',
        'resumo',
        'inclusao',
        'dataprevisao',
        'usuario'
      ],
      columns: [
        {
          name: 'nmCliente',
          required: true,
          label: 'Nome do cliente',
          align: 'left',
          field: (row) => row.nmClienteDemanda.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'sistema',
          align: 'left',
          label: 'Sistema',
          field: (row) => row.sistema.toUpperCase(),
          sortable: true
        },
        {
          name: 'resumo',
          align: 'left',
          label: 'Resumo da Atividade',
          field: (row) => row.resumo.toUpperCase(),
          sortable: true,
          maxlength: 50
        },
        {
          name: 'prioridade',
          align: 'left',
          label: 'Prioridade',
          field: (row) => row.prioridade.toUpperCase(),
          sortable: true
        },
        {
          name: 'inclusao',
          align: 'left',
          label: 'Data Inclusão',
          field: (row) => row.dataInclusao,
          sortable: true
        },
        {
          name: 'dataprevisao',
          align: 'left',
          label: 'Data Estimada',
          field: (row) => row.dataprevisao,
          format: (val) => date.formatDate(val, 'DD/MM/YYYY'),
          sortable: true
        },
        {
          name: 'usuario',
          align: 'left',
          label: 'Responsável',
          field: (row) => row.usuario,
          sortable: true
        }
      ],
      data: this.data,
      pagination: {
        page: 1,
        rowsPerPage: 5,
        sortBy: 'prioridade',
        ascending: true
      }
    }
  },
  created () {
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
    // THIS.CARREGA, CARREGA OS DADOS DOS ANIMAIS, ID E NOME DO DONO
    this.carrega()
    // ESSE FOR NÃO DEIXA CARREGAR A LISTA DE CLIENTES DUAS VEZES
    for (var i = 0; i < stringOptions.length; ++i) {
      stringOptions.splice(i--, 1)
    }
    // CARREGA O SELECT COM OS CLIENTES
    this.carregaSelectCliente()
  },
  methods: {
    async carrega () {
      this.auxSistema = 'Todos'
      await this.$axios
        .get(`${process.env.API}/demandas/`)
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
    carregaSistema (sistema) {
      if (sistema === 'Todos') {
        sistema = ''
      }
      this.auxSistema = sistema
      this.$axios
        .get(`${process.env.API}/demandas/${sistema}`)
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
    async cadDemanda () {
      this.demanda.status = 'A'
      this.demanda.usuario = this.userOn
      this.demanda.idCliente = this.planNmCliente.idCliente
      this.demanda.nmClienteDemanda = this.planNmCliente.nmCliente
      if (
        this.demanda.sistema &&
        this.demanda.resumo &&
        this.demanda.prioridade &&
        this.demanda.idCliente &&
        this.demanda.atividade
      ) {
        const today = new Date()
        const date =
          today.getDate() +
          '/' +
          (today.getMonth() + 1) +
          '/' +
          today.getFullYear()
        this.demanda.dataInclusao = date
        const axiosConfig = {
          method: 'post',
          url: `/cadDemanda`,
          data: this.demanda
        }
        this.planDialog = false
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(() => {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: 'Ocorreu um erro. Os dados não foram salvos.',
              icon: 'report_problem'
            })
          })
        if (this.auxSistema === 'Todos') {
          this.carrega()
          this.limpaCampos()
        } else {
          this.carregaSistema(this.auxSistema)
        }
        Notify.create({
          message: 'Demanda cadastrada.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
      } else {
        Notify.create({
          message: 'Dados incompletos. Preencha todos campos obrigatórios.',
          position: 'bottom',
          color: 'red',
          timeout: 800
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
    confirmaRemove (idDemanda, nmCliente, atividade) {
      this.$q
        .dialog({
          title: 'Confirmar exclusão',
          message:
            ' <b>Cliente: </b>' +
            nmCliente +
            ' <br><b> Atividade: </b>' +
            atividade,
          persistent: false,
          html: true,
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
          this.remover(idDemanda)
        })
        .onCancel(() => {})
    },
    async remover (idDemanda) {
      const axiosConfig = {
        method: 'delete',
        url: `/demanda/${idDemanda}`
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
      if (this.auxSistema === 'Todos') {
        this.carrega()
      } else {
        this.carregaSistema(this.auxSistema)
      }
    },
    editDemanda (
      idDemanda,
      idCliente,
      nmCliente,
      sistema,
      prioridade,
      resumo,
      atividade,
      observacoes,
      previsao
    ) {
      this.edit.idDemanda = idDemanda
      this.edit.idCliente = idCliente
      this.auxNmCliente = nmCliente
      this.edit.sistema[0] = sistema
      this.edit.prioridade = prioridade
      this.edit.resumo = resumo
      this.edit.atividade = atividade
      this.edit.observacoes = observacoes
      this.edit.previsao = previsao
    },
    async saveEdit () {
      var id = ''
      id = this.auxNmCliente.idCliente
      if (id === undefined) {
        id = this.edit.idCliente
        this.edit.nmClienteDemanda = this.auxNmCliente
      } else {
        this.edit.idCliente = id
        this.edit.nmClienteDemanda = this.auxNmCliente.nmCliente
      }
      const axiosConfig = {
        method: 'put',
        url: `/demanda/${this.edit.idDemanda}`,
        data: this.edit
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
      if (this.auxSistema === 'Todos') {
        this.carrega()
        this.edit.sistema = []
      } else {
        this.carregaSistema(this.auxSistema)
      }
    },
    async concluirDemanda (idDemanda, cliente, resumo) {
      const today = new Date()
      const date =
        today.getDate() +
        '/' +
        (today.getMonth() + 1) +
        '/' +
        today.getFullYear()
      this.demanda.dataConclusao = date
      this.$q
        .dialog({
          title: 'Confirmação de conclusão',
          message: 'A agenda foi aprovada pelo cliente e já está no SIGA?',
          persistent: true,
          ok: {
            push: true,
            label: 'Sim',
            color: 'green-9'
          },
          cancel: {
            push: true,
            color: 'blue-9',
            label: 'Não'
          }
        })
        .onOk(() => {
          this.$q
            .dialog({
              title: 'Confirmação de conclusão',
              message: 'Digite o chamado do SIGA.',
              html: true,
              ok: {
                push: true,
                label: 'Confirmar',
                color: 'blue-9'
              },
              cancel: {
                push: true,
                color: 'grey-7',
                label: 'Cancelar'
              },
              prompt: {
                model: this.demanda.nrChamado,
                isValid: (val) => val.length > 5,
                type: 'text',
                dense: true,
                maxlength: 6
              },
              persistent: true
            })
            .onOk((val) => {
              this.demanda.nrChamado = val
              const axiosConfig = {
                method: 'put',
                url: `/confirmaDemanda/${idDemanda}`,
                data: this.demanda
              }
              this.$axios(axiosConfig.url, axiosConfig)
                .then((R) => R.data)
                .catch(this.AxiosCatch)
              this.carrega()
              Notify.create({
                message: 'Demanda concluída',
                position: 'bottom',
                color: 'green',
                timeout: 2800
              })
              this.carrega()
            })
            .onCancel(() => {})
        })
        .onCancel(() => {
          this.demanda.nrChamado = ''
          this.$q
            .dialog({
              title: 'Confirmação de conclusão',
              message: 'Deseja realmente confirmar está demanda?',
              html: true,
              ok: {
                push: true,
                label: 'Confirmar',
                color: 'blue-9'
              },
              cancel: {
                push: true,
                color: 'grey-7',
                label: 'Cancelar'
              },
              persistent: true
            })
            .onOk(() => {
              const axiosConfig = {
                method: 'put',
                url: `/confirmaDemanda/${idDemanda}`,
                data: this.demanda
              }
              this.$axios(axiosConfig.url, axiosConfig)
                .then((R) => R.data)
                .catch(this.AxiosCatch)
              this.carrega()
              Notify.create({
                message: 'Demanda concluída',
                position: 'bottom',
                color: 'green',
                timeout: 2800
              })
              this.carrega()
            })
        })
    },
    async restaurarDemanda (idDemanda, cliente, resumo) {
      await this.$q
        .dialog({
          title: 'Confirmação de Ativação',
          message:
            ' <b>Cliente: </b>' + cliente + '<br><b>Atividade: </b>' + resumo,
          persistent: false,
          html: true,
          ok: {
            push: true,
            label: 'Confirmar',
            color: 'blue-9'
          },
          cancel: {
            push: true,
            color: 'grey-7',
            label: 'Cancelar'
          }
        })
        .onOk(() => {
          this.restaura(idDemanda)
        })
        .onCancel(() => {})
    },
    async restaura (idDemanda) {
      const axiosConfig = {
        method: 'put',
        url: `/restauraDemanda/${idDemanda}`
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Demanda restaurada',
        position: 'bottom',
        color: 'green',
        timeout: 2800
      })
      this.carrega()
    },
    async inativarDemanda (idDemanda, cliente, resumo) {
      this.$q
        .dialog({
          title: 'Confirmação de Stand-by',
          message:
            '<b>Cliente: </b>' + cliente + '<br><b>Atividade: </b>' + resumo,
          persistent: false,
          html: true,
          ok: {
            push: true,
            label: 'Confirmar',
            color: 'blue-9'
          },
          cancel: {
            push: true,
            color: 'grey-7',
            label: 'Cancelar'
          }
        })
        .onOk(() => {
          const axiosConfig = {
            method: 'put',
            url: `/inativaDemanda/${idDemanda}`
          }
          this.$axios(axiosConfig.url, axiosConfig)
            .then((R) => R.data)
            .catch(this.AxiosCatch)
          this.carrega()
          Notify.create({
            message: 'Demanda em Stand-by',
            position: 'bottom',
            color: 'green',
            timeout: 2800
          })
          this.carrega()
        })
        .onCancel(() => {})
    },
    compartilhar (idDemanda) {
      openURL(
        'https://api.whatsapp.com/send?text=Para visualizar a demanda clique no link a seguir: https://painelgovbr-demanda.web.app/%23/compartilhada/?id=' +
          idDemanda
      )
    },
    limpaCampos () {
      this.planNmCliente = null
      this.demanda = {
        idCliente: '',
        atividade: '',
        observacoes: '',
        previsao: '',
        prioridade: '',
        resumo: '',
        dataprevisao: ''
      }
    }
  }
}
</script>

<style>
.q-field--standout.q-field--readonly .q-field__control::before {
  border: 1px solid rgb(190, 190, 190);
  background-color: white;
}
</style>
