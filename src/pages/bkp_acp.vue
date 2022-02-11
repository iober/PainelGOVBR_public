<template>
  <q-page class="q-pa-md q-ml-sm">
    <div class="row">
      <div class="col-lg-3 col-sm-3 col-md-3 col-xs-12">
        <q-select
          class="q-pb-md col-lg-12 col-xs-12 col-sm-12"
          v-model="selectNmCliente"
          use-input
          dense
          hide-selected
          fill-input
          outlined
          input-debounce="0"
          key="idCliente"
          :options="options"
          option-value="idCliente"
          option-label="nmCliente"
          label="Selecionar cliente"
          @filter="filterFn"
          behavior="menu"
          color="teal"
          lazy-rules
          :rules="[(val) => !!val]"
          @input="carrega()"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                0 Resultados. Digite um nome ou pressione Enter.
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-4 q-pb-md offset-md-5" align="right">
        <q-btn
          color="light-blue-7"
          round
          class="q-ml-md"
          icon="add"
          @click="addPlanoDialog = true"
        >
          <q-tooltip self="center right">Adicionar Plano</q-tooltip>
        </q-btn>
      </div>
    </div>
    <!--
    <div
      class="row flex-center text-accent q-gutter-sm"
      v-show="diasTotais === 0 && this.selectNmCliente"
    >
      <q-icon size="5em" name="sentiment_dissatisfied" />
      <span size="5em"> Ops! Cliente sem Plano... </span>
    </div>
-->
    <div v-show="this.auxTrocaCliente === '' && this.selectNmCliente">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="4.3em" name="sentiment_dissatisfied" />
        <span> Ops! Cliente sem plano cadastrado...</span>
      </div>
    </div>
    <div v-show="!this.selectNmCliente">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="4.3em" name="warning" />
        <span> Selecione um cliente para continuar...</span>
      </div>
    </div>
    <div class="row" v-show="this.diasTotais > 0">
      <div class="col-lg-3 col-sm-3 col-xs-12 q-pb-md q-mr-lg">
        <q-list bordered padding class="rounded-borders text-primary">
          <q-item style="color: #003d00; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="assignment_ind" />
            </q-item-section>
            <q-item-section>Cod. EVCFAT: {{ this.codEvcfat }}</q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item style="color: green; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="date_range" />
            </q-item-section>
            <q-item-section>Dias do Plano: {{ diasTotais }}</q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item style="color: gray; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="event_available" />
            </q-item-section>
            <q-item-section
              >Dias Utilizados: {{ diasUtilizados }}</q-item-section
            >
          </q-item>
          <q-separator spaced />
          <q-item style="color: #026ba8; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="hourglass_empty" />
            </q-item-section>

            <q-item-section
              >Dias Restantes: {{ diasTotais - diasUtilizados }}</q-item-section
            >
          </q-item>
          <q-separator spaced />
          <q-item style="color: red; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="pending_actions" />
            </q-item-section>
            <q-item-section
              >ACPs Atuais/Atrasadas: {{ this.contSaldoAux }}</q-item-section
            >
          </q-item>
        </q-list>
      </div>
      <q-table
        class="my-sticky-column-table col-xs-12 col-lg-4 col-sm-4 col-md-4 q-mb-md q-mr-lg"
        :data="data"
        :columns="columns"
        row-key="idAcp"
        :pagination.sync="pagination"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            v-show="props.row.dtAcp"
            :style="
              dataAtual === props.row.dtAcp.substring(3, 11)
                ? 'backgroundColor:#f5f5dc; color:black'
                : ''
            "
          >
            <q-td key="mes" :props="props">
              <b>{{ props.row.dtAcp.substring(3, 11) }}</b>
            </q-td>
            <q-td key="previstas" :props="props">
              <q-badge outline color="blue-10" v-show="props.row.dtAcp !== ''">
                {{ props.row.qtAcp }}
              </q-badge>
            </q-td>
            <q-td key="realizadas" :props="props">
              <q-badge outline color="green-8" v-show="props.row.dtAcp !== ''">
                {{ props.row.execAcp }}
                <q-popup-edit
                  v-model="props.row.execAcp"
                  @hide="
                    realizaAcp(
                      props.row.idCliente,
                      props.row.anoAcp,
                      props.row.seqAcp,
                      props.row.qtAcp
                    )
                  "
                >
                  <q-input
                    v-model="acp.execAcp"
                    dense
                    type="number"
                    autofocus
                    counter
                    maxlength="2"
                  />
                </q-popup-edit>
              </q-badge>
            </q-td>

            <q-td key="saldo" :props="props">
              <q-badge
                v-show="props.row.dtAcp !== ''"
                :style="
                  props.row.saldo === 0
                    ? 'backgroundColor:#046db3; color:white'
                    : props.row.saldo < 0
                    ? 'backgroundColor:red; color:white'
                    : props.row.saldo >= props.row.saldo
                    ? 'backgroundColor:green; color:white'
                    : ''
                "
              >
                {{ props.row.saldo }}
              </q-badge>
            </q-td>
            <q-td key="sistemas" :props="props">
              <q-badge outline color="brown-8">
                {{ props.row.sistemas }}
                <q-popup-edit
                  v-model="props.row.sistemas"
                  @hide="
                    sistemaAcp(
                      props.row.idCliente,
                      props.row.anoAcp,
                      props.row.seqAcp,
                      props.row.sistemas
                    )
                  "
                >
                  <q-input
                    v-model="props.row.sistemas"
                    dense
                    type="text"
                    autofocus
                    counter
                    maxlength="30"
                  />
                </q-popup-edit>
              </q-badge>
            </q-td>
            <q-td key="chamados" :props="props">
              <q-badge outline color="brown-8">
                {{ props.row.chamados }}
                <q-popup-edit
                  v-model="props.row.chamados"
                  @hide="
                    chamadoAcp(
                      props.row.idCliente,
                      props.row.anoAcp,
                      props.row.seqAcp,
                      props.row.chamados
                    )
                  "
                >
                  <q-input
                    v-model="props.row.chamados"
                    dense
                    type="text"
                    autofocus
                    counter
                    maxlength="60"
                  />
                </q-popup-edit>
              </q-badge>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div style="width: 585px">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div style="font-size: 20px">Anotações</div>
          </q-card-section>
          <q-editor
            v-model="anotacao.anotacoes"
            min-height="19rem"
            max-height="30rem"
            :disable="this.btnAnotacao == 'b'"
            :toolbar="[
              ['left', 'center', 'right', 'justify'],
              ['bold', 'italic', 'strike'],
              ['unordered', 'ordered'],
              ['link'],
              ['print', 'fullscreen'],
            ]"
          />
          <q-card-actions align="right">
            <q-btn
              v-show="this.btnAnotacao === 'b'"
              @click="btnAnotacao = 'L'"
              :disable="
                !this.selectNmCliente.idCliente || this.diasTotais === 0
              "
              >Editar</q-btn
            >
            <q-btn
              v-show="this.btnAnotacao === 'L'"
              @click="
                btnAnotacao = 'b';
                GravaAnotacao();
              "
              color="primary"
              >Salvar</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <!------------ DIALOG ACP ------------------>
    <q-dialog v-model="addPlanoDialog" class="dialog">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Adicionar Plano ACP</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
            <q-select
              class="q-pb-sm col-lg-8 col-xs-12 col-sm-8 col-md-8"
              v-model="acpNmClienteCad"
              use-input
              dense
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
            <q-input
              label="Cod. EVCFAT"
              dense
              outlined
              v-model="acp.codEvcfat"
              type="text"
              maxlength="6"
              class="q-pb-sm col-lg-4 col-xs-12 col-sm-4 col-md-4"
              :disable="!this.acpNmClienteCad"
            />
            <q-input
              label="Total de dias Plano"
              dense
              outlined
              v-model="acp.totAcp"
              type="text"
              class="col-lg-4 col-sm-4 col-xs-12"
              :disable="!this.acpNmClienteCad && !this.acp.codEvcfat"
            />

            <q-input
              :disable="acp.totAcp === ''"
              dense
              outlined
              v-model="dtInicial"
              class="col-lg-4 col-sm-4 col-xs-12"
              type="date"
            />

            <q-input
              :disable="this.dtInicial === ''"
              dense
              outlined
              v-model="dtFinal"
              class="col-lg-4 col-sm-4 col-xs-12"
              type="date"
            />
            <div class="q-gutter-sm col-sm-12 col-md-12 col-lg-12">
              <q-btn
                color="teal-7"
                @click="gerar(dtInicial, dtFinal)"
                :disable="
                  this.acp.totAcp === '' ||
                  this.dtInicial === '' ||
                  this.dtFinal === '' ||
                  statusGera !== '' ||
                  this.dtFinal < this.dtInicial
                "
                >Gerar
              </q-btn>
              <q-btn
                color="grey-7"
                @click="visualizaPlanoDiag = true"
                :disable="
                  this.acp.totAcp === '' ||
                  this.dtInicial === '' ||
                  this.dtFinal === '' ||
                  statusVisualiza === ''
                "
                >Visualizar
              </q-btn>
              <q-btn
                @click="zeraDatas()"
                :disable="
                  this.acp.totAcp === '' ||
                  this.dtInicial === '' ||
                  this.dtFinal === ''
                "
                >Refazer
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary q-mb-sm">
          <q-btn
            id="btnSalvar"
            label="Salvar"
            color="primary"
            @click="
              criarPlano();
              submitted = false;
              addPlanoDialog = false;
            "
            :disable="
              !this.acpNmClienteCad === '' ||
              this.acp.totAcp === '' ||
              this.dtInicial === '' ||
              this.dtFinal === ''
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="visualizaPlanoDiag" class="dialog">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section>
          <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt01"
                :value="this.acp.dt01"
                outlined
                placeholder="Data 1° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt01"
                :value="this.acp.qt01"
                outlined
                placeholder="Qtde ACP no mês"
                class="col-sm-6 col-md-6 col-lg-6 col-xs-12"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt02"
                :value="this.acp.dt02"
                outlined
                placeholder="Data 2° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt02"
                :value="this.acp.qt02"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt03"
                :value="this.acp.dt03"
                outlined
                placeholder="Data 3° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt03"
                :value="this.acp.qt03"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt04"
                :value="this.acp.dt04"
                outlined
                placeholder="Data 4° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt04"
                :value="this.acp.qt04"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt05"
                :value="this.acp.dt05"
                outlined
                placeholder="Data 5° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt05"
                :value="this.acp.qt05"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt06"
                :value="this.acp.dt06"
                outlined
                placeholder="Data 6° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt06"
                :value="this.acp.qt06"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt07"
                :value="this.acp.dt07"
                outlined
                placeholder="Data 7° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt07"
                :value="this.acp.qt07"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt08"
                :value="this.acp.dt08"
                outlined
                placeholder="Data 8° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt08"
                :value="this.acp.qt08"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt09"
                :value="this.acp.dt09"
                outlined
                placeholder="Data 9° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt09"
                :value="this.acp.qt09"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt10"
                :value="this.acp.dt10"
                outlined
                placeholder="Data 10° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt10"
                :value="this.acp.qt10"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt11"
                :value="this.acp.dt11"
                outlined
                placeholder="Data 11° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt11"
                :value="this.acp.qt11"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>

            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.dt12"
                outlined
                placeholder="Data 12° Período"
              ></q-input>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <q-input
                dense
                disable
                v-model="acp.qt12"
                outlined
                placeholder="Qtde ACP no mês"
              ></q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Fechar" @click="visualizaPlanoDiag = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
const today = new Date();
var dtAtual = today.getMonth() + 1 + "/" + today.getFullYear();
import moment from "moment";
import { date, Notify } from "quasar";
const stringOptions = [];
export default {
  crated() {},
  mounted() {
    const today = new Date();
    this.dtAux = today.getMonth() + 1 + "/" + today.getFullYear();
    for (var i = 0; i < stringOptions.length; ++i) {
      stringOptions.splice(i--, 1);
    }
    this.carregaSelectCliente();
  },
  data() {
    return {
      anoBase: "2020",
      filter: "",
      options: stringOptions,
      contSaldo: 0,
      contSaldoAux: 0,
      dtAux: "",
      dataAtual: dtAtual,
      auxTrocaCliente: "",
      codEvcfat: "",
      anotacao: {
        idCliente: "",
        anoAcp: "",
        anotacoes: "",
      },
      btnAnotacao: "b",
      statusGera: "",
      statusVisualiza: "",
      acpNmClienteCad: "",
      selectNmCliente: "",
      addPlanoDialog: false,
      visualizaPlanoDiag: false,
      contMeses: 0,
      diasTotais: 0,
      diasUtilizados: 0,
      soma: [],
      dtInicial: "",
      dtFinal: "",
      valores: [],
      dadosExec: {
        idCliente: "",
        anoAcp: "",
        seqAcp: "",
        execAcp: "",
        qtAcp: "",
        sistemas: "",
        chamados: "",
      },
      acp: {
        idCliente: "",
        dt01: "",
        dt02: "",
        dt03: "",
        dt04: "",
        dt05: "",
        dt06: "",
        dt07: "",
        dt08: "",
        dt09: "",
        dt10: "",
        dt11: "",
        dt12: "",
        qt01: "",
        qt02: "",
        qt03: "",
        qt04: "",
        qt05: "",
        qt06: "",
        qt07: "",
        qt08: "",
        qt09: "",
        qt10: "",
        qt11: "",
        qt12: "",
        exec01: "",
        exec02: "",
        totAcp: "",
        anotacoes: "",
        codEvcfat: "",
        sistemas: "",
        chamados: ""
      },
      columns: [
        {
          name: "mes",
          label: "Mês",
          align: "left",
        },
        {
          name: "previstas",
          align: "center",
          label: "Previstas",
        },
        {
          name: "realizadas",
          align: "center",
          label: "Realizadas",
        },
        {
          name: "saldo",
          align: "center",
          label: "Saldo",
        },
        {
          name: "sistemas",
          align: "left",
          label: "Sistemas",
        },
        {
          name: "chamados",
          align: "left",
          label: "Chamados",
        },
      ],
      data: [],
      pagination: {
        page: 1,
        rowsPerPage: 12,
        descending: true,
      },
    };
  },
  beforeDestroy() {
    if (this.timer !== void 0) {
      clearTimeout(this.timer);
      this.$q.loading.hide();
    }
  },
  methods: {
    showLoading() {
      this.$q.loading.show();

      // hiding in 2s
      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = void 0;
      }, 2000);
    },
    async sistemaAcp(id, ano, seq, sistemas) {
      (this.dadosExec.idCliente = id),
        (this.dadosExec.anoAcp = ano),
        (this.dadosExec.seqAcp = seq),
        (this.dadosExec.sistemas = sistemas);
      const axiosConfig = {
        method: "put",
        url: `/acpSistema/${id}`,
        data: this.dadosExec,
      };
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch);
      this.acp.sistemas = "";
      this.carregaTable();
    },
    
    async chamadoAcp(id, ano, seq, chamado) {
      (this.dadosExec.idCliente = id),
        (this.dadosExec.anoAcp = ano),
        (this.dadosExec.seqAcp = seq),
        (this.dadosExec.chamados = chamado);
      const axiosConfig = {
        method: "put",
        url: `/acpChamado/${id}`,
        data: this.dadosExec,
      };
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch);
      this.acp.sistemas = "";
      this.carregaTable();
    },    

    async realizaAcp(id, ano, seq, qtAcp) {
      (this.dadosExec.idCliente = id),
        (this.dadosExec.anoAcp = ano),
        (this.dadosExec.seqAcp = seq),
        (this.dadosExec.execAcp = this.acp.execAcp),
        (this.dadosExec.qtAcp = qtAcp);
      const axiosConfig = {
        method: "put",
        url: `/acp/${id}`,
        data: this.dadosExec,
      };
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch);
      this.acp.execAcp = "";
      this.carregaTable();
    },

    carregaTable() {
      this.contSaldoAux = 0;
      this.contSaldo = 0;
      console.log(this.dtAux);
      this.diasUtilizados = 0;
      this.diasTotais = 0;
      this.diasUtilizados = 0;
      this.$axios
        .get(`${process.env.API}/acp/${this.selectNmCliente.idCliente}`)
        .then((response) => {
          this.data = response.data;
          this.auxTrocaCliente = "";
          this.data.forEach((value, index) => {
            this.contSaldo += parseInt(this.data[index].saldo);
            this.diasTotais = this.data[0].totAcp;
            this.codEvcfat = this.data[0].codEvcfat;
            this.anotacao.anotacoes = this.data[0].anotacoes;
            var cont = this.data[index].execAcp;
            this.diasUtilizados += parseInt(this.data[index].execAcp);
            if (this.data[index].dtAcp.substring(3, 11) === this.dtAux) {
              this.auxTrocaCliente = "T";
              this.data[index].saldo = this.contSaldo;
              this.contSaldoAux = this.contSaldo;
            }
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
      this.anotacao.anotacoes = "";
    },
    carrega() {
      this.showLoading();
      setTimeout(() => {
        this.contSaldoAux = 0;
        this.contSaldo = 0;
        console.log(this.dtAux);
        this.diasUtilizados = 0;
        this.diasTotais = 0;
        this.diasUtilizados = 0;
        this.$axios
          .get(`${process.env.API}/acp/${this.selectNmCliente.idCliente}`)
          .then((response) => {
            this.data = response.data;
            this.auxTrocaCliente = "";
            this.data.forEach((value, index) => {
              this.contSaldo += parseInt(this.data[index].saldo);
              this.diasTotais = this.data[0].totAcp;
              this.codEvcfat = this.data[0].codEvcfat;
              this.anotacao.anotacoes = this.data[0].anotacoes;
              var cont = this.data[index].execAcp;
              this.diasUtilizados += parseInt(this.data[index].execAcp);
              if (this.data[index].dtAcp.substring(3, 11) === this.dtAux) {
                this.auxTrocaCliente = "T";
                this.data[index].saldo = this.contSaldo;
                this.contSaldoAux = this.contSaldo;
              }
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
      }, 1800);
      this.anotacao.anotacoes = "";
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
        });
      }
    },
    async criarPlano() {
      this.valores = [
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "1",
          this.acp.dt01,
          this.acp.qt01,
          "",
          this.acp.qt01,
          "",
          this.acp.totAcp,
          " ",
          this.acp.codEvcfat,
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "2",
          this.acp.dt02,
          this.acp.qt02,
          "",
          this.acp.qt02,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "3",
          this.acp.dt03,
          this.acp.qt03,
          "",
          this.acp.qt03,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "4",
          this.acp.dt04,
          this.acp.qt04,
          "",
          this.acp.qt04,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "5",
          this.acp.dt05,
          this.acp.qt05,
          "",
          this.acp.qt05,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "6",
          this.acp.dt06,
          this.acp.qt06,
          "",
          this.acp.qt06,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "7",
          this.acp.dt07,
          this.acp.qt07,
          "",
          this.acp.qt07,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "8",
          this.acp.dt08,
          this.acp.qt08,
          "",
          this.acp.qt08,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "9",
          this.acp.dt09,
          this.acp.qt09,
          "",
          this.acp.qt09,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "10",
          this.acp.dt10,
          this.acp.qt10,
          "",
          this.acp.qt10,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "11",
          this.acp.dt11,
          this.acp.qt11,
          "",
          this.acp.qt11,
          "",
          "",
          "",
          "",
        ],
        [
          this.acpNmClienteCad.idCliente,
          "2020",
          "12",
          this.acp.dt12,
          this.acp.qt12,
          "",
          this.acp.qt12,
          "",
          "",
          " ",
          "",
        ],
      ];
      this.cadPlano();
    },
    async cadPlano() {
      const axiosConfig = {
        method: "post",
        url: `/cadPlano`,
        data: this.valores,
      };
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch);
      Notify.create({
        message: "Plano cadastrado.",
        position: "bottom",
        color: "green",
        timeout: 800,
      });
      if (this.selectNmCliente.idCliente === this.acpNmClienteCad.idCliente) {
        this.carrega();
        this.zeraDatas();
      }
      this.carrega();
      this.zeraDatas();
    },
    zeraDatas() {
      (this.statusGera = ""),
        (this.statusVisualiza = ""),
        (this.acpNmClienteCad = null);
      (this.dtInicial = ""),
        (this.dtFinal = ""),
        (this.acp = {
          totAcp: "",
        });
    },
    gerar(d1, d2) {
      this.statusGera = "1";
      this.statusVisualiza = "1";
      var dateStart = moment(d1);
      var dateEnd = moment(d2);
      var timeValues = [];
      var i = 1;
      while (
        dateEnd > dateStart ||
        dateStart.format("M") === dateEnd.format("M")
      ) {
        timeValues.push(dateStart.format("DD/MM/YYYY"));
        dateStart.add(1, "month");
        if (i === 1) {
          this.acp.dt01 = timeValues[i - 1];
        }
        if (i === 2) {
          this.acp.dt02 = timeValues[i - 1];
        }
        if (i === 3) {
          this.acp.dt03 = timeValues[i - 1];
        }
        if (i === 4) {
          this.acp.dt04 = timeValues[i - 1];
        }
        if (i === 5) {
          this.acp.dt05 = timeValues[i - 1];
        }
        if (i === 6) {
          this.acp.dt06 = timeValues[i - 1];
        }
        if (i === 7) {
          this.acp.dt07 = timeValues[i - 1];
        }
        if (i === 8) {
          this.acp.dt08 = timeValues[i - 1];
        }
        if (i === 9) {
          this.acp.dt09 = timeValues[i - 1];
        }
        if (i === 10) {
          this.acp.dt10 = timeValues[i - 1];
        }
        if (i === 11) {
          this.acp.dt11 = timeValues[i - 1];
        }
        if (i === 12) {
          this.acp.dt12 = timeValues[i - 1];
        }
        i++;
      }

      this.contMeses = i - 1;
      for (let index = 0; index < this.contMeses; index++) {
        if (index === 0) {
          this.acp.qt01 = this.acp.totAcp / this.contMeses;
        }
        if (index === 1) {
          this.acp.qt02 = this.acp.totAcp / this.contMeses;
        }
        if (index === 2) {
          this.acp.qt03 = this.acp.totAcp / this.contMeses;
        }
        if (index === 3) {
          this.acp.qt04 = this.acp.totAcp / this.contMeses;
        }
        if (index === 4) {
          this.acp.qt05 = this.acp.totAcp / this.contMeses;
        }
        if (index === 5) {
          this.acp.qt06 = this.acp.totAcp / this.contMeses;
        }
        if (index === 6) {
          this.acp.qt07 = this.acp.totAcp / this.contMeses;
        }
        if (index === 7) {
          this.acp.qt08 = this.acp.totAcp / this.contMeses;
        }
        if (index === 8) {
          this.acp.qt09 = this.acp.totAcp / this.contMeses;
        }
        if (index === 9) {
          this.acp.qt10 = this.acp.totAcp / this.contMeses;
        }
        if (index === 10) {
          this.acp.qt11 = this.acp.totAcp / this.contMeses;
        }
        if (index === 11) {
          this.acp.qt12 = this.acp.totAcp / this.contMeses;
        }
      }
    },
    async GravaAnotacao() {
      this.anotacao.idCliente = this.selectNmCliente.idCliente;
      this.anotacao.anoAcp = this.anoBase;
      const axiosConfig = {
        method: "put",
        url: `/anotacao/${this.anotacao.idCliente}`,
        data: this.anotacao,
      };
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch);
      Notify.create({
        message: "Anotação gravada.",
        position: "bottom",
        color: "green",
        timeout: 800,
      });
    },
  },
};
</script>
<style lang="sass">
.my-sticky-column-table
  thead tr:first-child th
    background-color: #73a7c9
  td:first-child
    background-color: #f5f5dc
    width: 50px
.my-sticky-column-table tbody td
  height: 25px
</style>