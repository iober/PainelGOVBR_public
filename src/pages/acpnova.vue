<template>
  <q-page class="q-pa-md q-ml-sm">
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
      <q-breadcrumbs-el label="ACPs" icon="date_range" to="/acp" />
    </q-breadcrumbs>
  </div>
    <div class="row">
      <div class="q-ml-sm q-pr-md col col-lg-2 col-sm-3 col-md-3 col-xs-12">
        <q-select
          v-model="selectNmCliente"
          use-input
          dense
          hide-selected
          fill-input
          outlined
          input-debounce="0"
          key="idCliente"
          :options="optionsAcp"
          option-value="idCliente"
          option-label="nmCliente"
          label="Selecionar cliente"
          @filter="filterFnAcp"
          behavior="menu"
          color="teal"
          lazy-rules
          :rules="[(val) => !!val]"
          @input="carregaAnoAcp()"
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
      <div class="q-ml-sm q-pr-md q-pb-sm col col-lg-1 col-sm-2 col-md-2 col-xs-12">
        <q-select
          v-if="!this.$q.platform.is.mobile"
          v-model="anoAcpPlano"
          :options="optionsAnoAcpPlano"
          option-value="anoAcp"
          option-label="anoAcp"
          label="Ano/Plano"
          dense
          fill-input
          :disable="!this.selectNmCliente"
          @input="carrega()"
          outlined>
         <q-tooltip content-class='bg-red'
            content-style='font-size: 13px'
            :hide-delay='800'
            anchor='top middle' self='center middle'
            v-model="showing">
            Selecione o plano
          </q-tooltip>
        </q-select>
        <q-select
          v-else
          v-model="anoAcpPlano"
          :options="optionsAnoAcpPlano"
          option-value="anoAcp"
          option-label="anoAcp"
          label="Ano/Plano"
          dense
          fill-input
          :disable="!this.selectNmCliente"
          @input="carrega()"
          outlined>
        </q-select>
      </div>
      <div class="row">
        <q-btn @click="relatorioPlano()">Teste</q-btn>
      <div v-if="!this.$q.platform.is.mobile" class="q-ml-sm q-pr-md q-pb-md col col-lg-12 col-sm-12 col-md-12 col-xs-12">
        <q-btn color="teal-7" icon="subject" class="shadow-7" v-show="this.testaNovaTabelaAcp !== 'ok' && !this.data.sistema" @click="showResumo = true">Resumo Geral dos Planos</q-btn>
        <q-btn
          class="shadow-7"
          icon="description"
          v-show="this.testaNovaTabelaAcp === 'ok'"
          label="Relatório Plano"
          color="primary"
          :disable="ultimaAtualizacao === '' || diasUtilizados === '' || diasUtilizados === 0 || this.data.sistema || this.testaNovaTabelaAcp !== 'ok'"
          @click="txtRelDiag = true, relatorioPlano()"
        />
        <q-btn-dropdown
          icon="build"
          v-model="menuDropDown"
          class="q-ml-sm shadow-7"
          color="red"
          :disable="ultimaAtualizacao === ''"
          v-show="
          this.anoAcpPlano &&
          userOn === 'Gabriela Sfredo' ||
          userOn === 'Thiago Gomes' ||
          userOn === 'Iober Henrique da Cruz'"
          label="Ações do Plano"
          >
          <q-list>
            <q-item clickable v-close-popup @click="desativarPlano()">
              <q-item-section avatar>
                <q-avatar icon="no_encryption" color="grey-14" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Desativar Plano</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="excluirPlano()">
              <q-item-section avatar>
                <q-avatar icon="delete" color="red" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Excluir Plano</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="q-ma-sm" v-else>
        <q-btn color="teal-7 q-mb-sm" style="width: 100%" icon="subject" class="shadow-7" v-show="this.testaNovaTabelaAcp !== 'ok' && !this.data.sistema" @click="showResumo = true">Resumo Geral dos Planos</q-btn>
        <q-btn
          class="shadow-7 q-mb-sm"
          style="width: 100%"
          icon="description"
          v-show="this.testaNovaTabelaAcp === 'ok'"
          label="Relatório Plano"
          color="primary"
          :disable="ultimaAtualizacao === '' || diasUtilizados === '' || diasUtilizados === 0 || this.data.sistema || this.testaNovaTabelaAcp !== 'ok'"
           @click="txtRelDiag = true, relatorioPlano()"
        />
        <q-btn-dropdown
          icon="view_list"
          style="width: 100%"
          v-model="menuDropDown"
          class="shadow-7"
          color="red"
          :disable="ultimaAtualizacao === ''"
          v-show="
          this.anoAcpPlano &&
          userOn === 'Gabriela Sfredo' ||
          userOn === 'Thiago Gomes' ||
          userOn === 'Iober Henrique da Cruz'"
          label="Ações Plano"
          >
          <q-list>
            <q-item clickable v-close-popup @click="desativarPlano()">
              <q-item-section avatar>
                <q-avatar icon="no_encryption" color="grey-14" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Desativar Plano</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="excluirPlano()">
              <q-item-section avatar>
                <q-avatar icon="delete" color="red" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Excluir Plano</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      </div>
      <div class="col">
        <div class="col-md-4 q-pb-md offset-md-5" align="right">
          <q-btn
            stack push
            v-show="
              userOn === 'Gabriela Sfredo' ||
              userOn === 'Thiago Gomes' ||
              userOn === 'Iober Henrique da Cruz'
            "
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
    </div>
    <!--
    <div
      class="row flex-center text-accent q-gutter-sm"
      v-show="diasTotais === 0 && this.selectNmCliente"
    >
      <q-icon size="5em" name="sentiment_dissatisfied" />
      <span size="5em"> Ops! Cliente sem Plano... </span>
    </div>

    <div v-show="!this.selectNmCliente">
      <div class="full-width row flex-center text-accent q-gutter-sm q-pb-lg">
        <q-icon size="4.3em" name="warning" />
        <span> Selecione um cliente para continuar...</span>
      </div>
    </div>
    -->
    <div class="row">
      <div class="col-lg-3 col-sm-3 col-md-3 col-xs-12 q-pb-md q-mr-lg">
        <q-toolbar class="bg-primary text-white rounded-borders text-primary">
          <q-toolbar-title>Resumo do Plano</q-toolbar-title>
        </q-toolbar>
        <q-list bordered padding class="rounded-borders text-primary shadow-7">
          <q-item style="color: #003d00;font-weight: bold">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Gestor do Plano:<br> {{ gestor }} </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item color="red" style="color: #1ca099;font-weight: bold">
            <q-item-section avatar>
              <q-icon name="date_range" />
            </q-item-section>
            <q-item-section>Saldo Total: {{ diasTotais }}</q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item style="color: #ed8333; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="today" />
            </q-item-section>
            <q-item-section color="indigo"
              >Previstas até a Data: {{ contQtdAtual }}</q-item-section
            >
          </q-item>
          <q-separator spaced />
          <q-item style="color: #c5bf2c; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="event_available" />
            </q-item-section>
            <q-item-section
              >Saldo Utilizado: {{ diasUtilizados }}</q-item-section
            >
          </q-item>
          <q-separator spaced />
          <q-item style="color: #026ba8; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="hourglass_empty" />
            </q-item-section>

            <q-item-section
              >Saldo Restantes:
              {{ diasTotais - diasUtilizados }}</q-item-section
            >
          </q-item>
          <q-separator spaced />
          <q-item
            style="color: #198c19; font-weight: bold"
            v-if="this.contSaldoAux >= 0"
          >
            <q-item-section avatar>
              <q-icon name="pending_actions" />
            </q-item-section>
            <q-item-section
              >Saldo Pendente atual: {{ this.contSaldoAux }}</q-item-section
            >
          </q-item>
          <q-item
            style="color: red; font-weight: bold"
            v-if="this.contSaldoAux < 0"
          >
            <q-item-section avatar>
              <q-icon name="pan_tool" />
            </q-item-section>
            <q-item-section
              >Saldo Adiantado: {{ this.contSaldoAux * -1 }}</q-item-section
            >
          </q-item>
          <q-separator spaced />
          <q-item style="color: #747474; font-weight: bold">
            <q-item-section avatar>
              <q-icon name="update" />
            </q-item-section>
            <q-item-section>Última atualização: <br>{{ ultimaAtualizacao }}</q-item-section>
          </q-item>
          <!--
          <q-separator />
          <q-expansion-item
            label="Demandas cadastras"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
          -->
        </q-list>
      </div>
      <q-table
        dense
        class="my-sticky-column-table col-xs-12 col-lg-8 col-sm-8 col-md-8 q-mb-md q-mr-lg shadow-7"
        :data="data"
        :columns="columns"
        row-key="idAcp"
        :pagination.sync="pagination"
        no-data-label="nenhum cliente selecionado."
        hide-bottom
      >
      <template v-slot:header="props">
        <q-tr :props="props"  style="height: 50px;" >
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
       <template v-slot:body="props" >
          <q-tr
            :props="props"
            v-show="props.row.dtAcp"
            :style="
              dataAtual === props.row.dtAcp.substring(3, 11)
                ? 'backgroundColor:#c9c9b7; color:black'
                : ''
            "
          >
            <q-td key="mes" :props="props">
              <b>{{ props.row.dtAcp.substring(3, 11) }}</b>
            </q-td>
            <q-td key="previstas" :props="props">
              <q-badge outline color="blue-10" v-show="props.row.dtAcp !== ''" style="cursor: pointer;">
                {{ props.row.qtAcp }}
                <q-popup-edit
                  title="Personalizar ACP"
                  buttons
                  label-cancel="Cancelar"
                  label-set="Gravar"
                  persistent
                  @save="
                    personalizaAcp(
                      props.row.idCliente,
                      props.row.anoAcp,
                      props.row.seqAcp,
                      props.row.qtAcp,
                      props.row.execAcp
                    )
                  "
                  :disable="
                    userOn !== 'Gabriela Sfredo' &&
                    userOn !== 'Thiago Gomes' &&
                    userOn !== 'Iober Henrique da Cruz'
                  "
                  v-model="props.row.qtAcp"
                >
                  <q-input
                    v-model="props.row.qtAcp"
                    dense
                    type="number"
                    autofocus
                  />
                </q-popup-edit>
              </q-badge>
            </q-td>
            <q-td key="formalizadas" :props="props">
              <q-badge outline color="brown-8" style="cursor: pointer;">
                {{ props.row.execAcp }}
                <q-popup-edit
                  buttons
                  label-cancel="Cancelar"
                  label-set="Atualizar"
                  @save="
                    realizaAcp(
                      props.row.seqAcp,
                      props.row.execAcp,
                      props.row.qtAcp,
                      props.row.sistemas,
                      props.row.chamados
                    )
                  "
                  :disable="
                    userOn !== 'Gabriela Sfredo' &&
                    userOn !== 'Thiago Gomes' &&
                    userOn !== 'Iober Henrique da Cruz'
                  "
                  v-model="props.row.execAcp"
                >
                    <q-input
                      v-model="props.row.execAcp"
                      label="Qtdade ACP por chamado"
                      type="text"
                      autofocus
                      :input-style="{ fontWeight: 'bold'}"
                    />
                    <q-input
                      v-model="chamado.sistemas"
                      label="Sistemas"
                      type="text"
                      autofocus
                      mask="AAAAAA"
                    />
                    <q-input
                      v-model="chamado.chamados"
                      label="Chamado"
                      type="text"
                      autofocus
                      mask="########"
                    />
                    <q-input
                      label="Resumo do chamado"
                      type="textarea"
                      v-model="chamado.descricaoAcp"
                      autofocus
                      @keyup.enter.stop
                    />
                  <div align="center">
                    <q-btn class="q-mt-md" :disable="chamado.chamados === '' || chamado.descricaoAcp === '' || chamado.sistemas === ''" @click="cadChamado(props.row.idCliente, props.row.anoAcp, props.row.seqAcp)" color="primary" icon="add" label="Adicionar Chamado" />
                  </div>
                </q-popup-edit>
              </q-badge>
            </q-td>

            <q-td key="saldo" :props="props" >
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
            <q-td key="sistemas" :props="props" >
              <q-badge
                outline
                color="brown-8"
                style="min-width: 40px; min-height: 20px;"
              >
                {{ props.row.sistemas }}
              </q-badge>
            </q-td>
            <q-td key="chamados" :props="props" >
              <q-badge
                outline
                color="brown-8"
                style="min-width: 40px; min-height: 20px;"
              >
                {{ props.row.chamados }}
              </q-badge>
            </q-td>
            <q-td key="btnVisualizar" :props="props">
              <q-btn :disable="props.row.execAcp === 0" flat dense class="col-xs-12" color="blue-grey-6" icon="visibility" @click="acpVisualizaMes(props.row.idCliente, props.row.seqAcp, props.row.anoAcp, props.row.execAcp, props.row.qtAcp)"></q-btn>
            </q-td>
          </q-tr>
        </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-red-7 q-gutter-sm">
          <span style="font-size: 17px">
            Ops... {{ message }}
          </span>
          <q-icon size="2.0em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>
      </q-table>
      <div>
        <!--
        <q-btn
          :disable="ultimaAtualizacao === ''"
          stack push
          class="col-xs-12"
          label="Anotações"
          color="primary"
          @click="showAnotacao = true"
        />
        -->
      </div>
      <q-dialog v-model="showAnotacao" class="dialog">
        <q-card class="shadow-7" style="width: 900px">
          <q-card-section class="bg-primary text-white">
            <div style="font-size: 20px">Anotações</div>
          </q-card-section>
          <q-editor
            v-model="anotacao.anotacoes"
            min-height="10rem"
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
                showAnotacao = false;
              "
              color="primary"
              >Salvar</q-btn
            >
          </q-card-actions>
        </q-card>
      </q-dialog>
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
              class="q-pb-sm col-lg-12 col-xs-12 col-sm-12 col-md-12"
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
              label="Gestor do Cliente"
              dense
              outlined
              v-model="acp.gestorPlano"
              type="text"
              class="q-pb-sm col-lg-8 col-xs-12 col-sm-8 col-md-8"
              :disable="!this.acpNmClienteCad"
            />
            <q-input
              label="Ano/Plano"
              dense
              outlined
              mask="####-XX"
              v-model="acp.anoAcp"
              type="text"
              maxlength="9"
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
              :disable="!this.acpNmClienteCad && !this.acp.gestorPlano"
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
              this.dtFinal === '' || this.statusVisualiza === '' || this.acp.gestorPlano === ''
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
    <q-dialog
      v-model="showResumo"
      class="dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Saldo Atual Geral</div>
        </q-card-section>
        <q-card-section>
          <resumoAcp />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn @click="showResumo = false" color="primary">Fechar</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showMes"
      class="dialog"
      transition-show="scale"
      transition-hide="scale"
    >
    <q-card style='width: 700px; max-width: 80vw'>
      <q-card-section class='bg-primary text-white'>
        <div class='text-h6'>Relação de Chamados</div>
      </q-card-section>
      <q-card-section>
      <q-table
        dense
        :data="dataChamados"
        :ss="columnsAcpDesc"
        row-key="chamados"
        :filter="filter"
        no-results-label="Nenhum resultado encontrado."
        :pagination.sync="pagination"
        style="word-wrap: break-word;">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn size="sm" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="row">
                <div class="text-left" style="width: 550px; whiteSpace: normal;text-align: justify;" > <b>Atividade: </b> {{ props.row.descricaoAcp }} </div>
              </div>
              <div
                v-show="
                userOn === 'Gabriela Sfredo' ||
                userOn === 'Thiago Gomes' ||
                userOn === 'Iober Henrique da Cruz'"
              >
                <q-td class="q-gutter-xs">
                  <q-btn
                    stack
                    push
                    round
                    color="primary"
                    icon="edit"
                    padding="2.1px"
                    @click="editarChamado(props.row.sistemas, props.row.chamados, props.row.descricaoAcp)"
                  />
                  <q-btn
                    stack
                    push
                    round
                    color="red"
                    icon="delete"
                    padding="2.1px"
                    @click="removeChamado(props.row.chamados, props.row.descricaoAcp, props.row.idCliente)"
                  />
                </q-td>
              </div>
            </q-td>
          </q-tr>
        </template>
       </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="showMes = false" color="primary">Fechar</q-btn>
      </q-card-actions>
    </q-card>
    </q-dialog>
    <q-dialog v-model="editChamado">
      <q-card style="min-width: 350px">
        <q-card-section class='bg-primary text-white'>
          <div class='text-h6'>Editar Chamado</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="chamadoEdit.sistemas"
            label="Sistemas"
            type="text"
            autofocus
          />
          <q-input
            v-model="chamadoEdit.chamados"
            label="Chamado"
            type="text"
            autofocus
          />
          <q-input
            label="Resumo do chamado"
            type="textarea"
            v-model="chamadoEdit.descricaoAcp"
            autofocus
            @keyup.enter.stop
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Atualizar" @click="atualizaChamado()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="txtRelDiag">
      <q-card style="min-width: 65%">
      <q-card-section class='bg-primary text-white row'>
        <div class='text-h6 col-11'>Relatório do Plano</div>
        <div align="right"><q-btn outline push icon="print" @click="exp()" v-close-popup /></div>
      </q-card-section>
        <q-card-section class="q-pt-none">
          <span v-html="this.txtRel"></span>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
const today = new Date()
var dtAtualMes = ''
switch (today.getMonth()) {
  case 0:
    dtAtualMes = '01'
    break
  case 1:
    dtAtualMes = '02'
    break
  case 2:
    dtAtualMes = '03'
    break
  case 3:
    dtAtualMes = '04'
    break
  case 4:
    dtAtualMes = '05'
    break
  case 5:
    dtAtualMes = '06'
    break
  case 6:
    dtAtualMes = '07'
    break
  case 7:
    dtAtualMes = '08'
    break
  case 8:
    dtAtualMes = '09'
    break
  case 9:
    dtAtualMes = '10'
    break
  case 10:
    dtAtualMes = '11'
    break
  case 11:
    dtAtualMes = '12'
    break
}

var dtAtual = dtAtualMes + '/' + today.getFullYear()
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import { firebase, firebaseDb } from 'boot/firebase'
import { Notify } from 'quasar'
const stringOptions = []
const stringOptionsAcp = []
const stringOptionsAnoAcpPlano = []
const areaSistemas = ['AF', 'CP', 'GP']
import resumoAcp from 'components/resumoAcp.vue'
export default {
  components: {
    resumoAcp
  },
  data () {
    return {
      txtRelDiag: false,
      txtRel: '',
      showResumo: false,
      anoBase: '2020',
      filter: '',
      t1: '',
      t2: '',
      t3: '',
      step: 1,
      areaSelect: areaSistemas,
      areaSelectModel: '',
      showing: false,
      showMes: false,
      options: stringOptions,
      optionsAcp: stringOptionsAcp,
      optionsAnoAcpPlano: stringOptionsAnoAcpPlano,
      contSaldo: 0,
      contQtdAtual: 0,
      userOn: '',
      contSaldoAux: 0,
      dtAux: '',
      anoAcpPlano: '',
      testaNovaTabelaAcp: '',
      dataAtual: dtAtual,
      auxTrocaCliente: '',
      ultimaAtualizacao: '',
      gestor: '',
      anotacao: {
        idCliente: '',
        anoAcp: '',
        anotacoes: ''
      },
      btnAnotacao: 'b',
      statusGera: '',
      statusVisualiza: '',
      acpNmClienteCad: '',
      selectNmCliente: '',
      menuDropDown: false,
      addPlanoDialog: false,
      visualizaPlanoDiag: false,
      showAnotacao: false,
      editChamado: false,
      contMeses: 0,
      diasTotais: 0,
      diasUtilizados: '',
      soma: [],
      dtInicial: '',
      dtFinal: '',
      valores: [],
      idAux: '',
      seqAux: '',
      anoAux: '',
      qtacpAux: '',
      execAcpAux: '',
      dadosExec: {
        idCliente: '',
        anoAcp: '',
        seqAcp: '',
        qtAcp: '',
        execAcp: '',
        sistemas: '',
        chamados: '',
        ultimaAtualizacao: '',
        saldoAtualTotal: 0
      },
      rel: {
        idCliente: '',
        anoAcp: ''
      },
      chamado: {
        idCliente: '',
        anoAcp: '',
        seqAcp: '',
        sistemas: '',
        chamados: '',
        descricaoAcp: ''
      },
      chamadoEdit: {
        idCliente: '',
        anoAcp: '',
        seqAcp: '',
        sistemas: '',
        chamados: '',
        descricaoAcp: '',
        chamadoAnt: ''
      },
      acp: {
        idCliente: '',
        dt01: '',
        dt02: '',
        dt03: '',
        dt04: '',
        dt05: '',
        dt06: '',
        dt07: '',
        dt08: '',
        dt09: '',
        dt10: '',
        dt11: '',
        dt12: '',
        qt01: '',
        qt02: '',
        qt03: '',
        qt04: '',
        qt05: '',
        qt06: '',
        qt07: '',
        qt08: '',
        qt09: '',
        qt10: '',
        qt11: '',
        qt12: '',
        execAcp: '',
        totAcp: '',
        anotacoes: '',
        ultimaAtualizacao: '',
        saldoAtualTotal: '',
        statusAcp: 'A',
        gestorPlano: '',
        dtEncerramento: ''
      },
      columnsAcpDesc: [
        {
          name: 'mes',
          label: 'Mês',
          align: 'left',
          field: (row) => row.dtAcp.substring(3, 11),
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'sistemas',
          label: 'Sistemas',
          align: 'center',
          field: (row) => row.sistemas,
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'chamados',
          label: 'Chamados',
          align: 'left',
          field: (row) => row.chamados,
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'descricaoAcp',
          label: 'Resumo',
          align: 'left',
          field: (row) => row.descricaoAcp.substring(0, 50),
          format: (val) => `${val}`,
          sortable: true
        }
      ],
      columns: [
        {
          name: 'mes',
          label: 'Mês',
          align: 'left'
        },
        {
          name: 'previstas',
          align: 'center',
          label: 'Previstas'
        },
        {
          name: 'formalizadas',
          align: 'center',
          label: 'Formalizada'
        },
        {
          name: 'saldo',
          align: 'center',
          label: 'Saldo'
        },
        {
          name: 'sistemas',
          align: 'left',
          label: 'Sistemas'
        },
        {
          name: 'chamados',
          align: 'left',
          label: 'Chamados'
        },
        {
          name: 'btnVisualizar',
          align: 'center',
          label: 'Visualizar'
        }
      ],
      data: [],
      dataChamados: [],
      pagination: {
        page: 1,
        rowsPerPage: 12,
        descending: true
      }
    }
  },
  beforeDestroy () {
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      this.$q.loading.hide()
    }
  },
  mounted () {
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
    const today = new Date()
    var tempoMonth = ''
    switch (today.getMonth()) {
      case 0:
        tempoMonth = '01'
        break
      case 1:
        tempoMonth = '02'
        break
      case 2:
        tempoMonth = '03'
        break
      case 3:
        tempoMonth = '04'
        break
      case 4:
        tempoMonth = '05'
        break
      case 5:
        tempoMonth = '06'
        break
      case 6:
        tempoMonth = '07'
        break
      case 7:
        tempoMonth = '08'
        break
      case 8:
        tempoMonth = '09'
        break
      case 9:
        tempoMonth = '10'
        break
      case 10:
        tempoMonth = '11'
        break
      case 11:
        tempoMonth = '12'
        break
    }
    this.dtAux = tempoMonth + '/' + today.getFullYear()
    this.carregaSelectClienteAcp()
    this.carregaSelectCliente()
  },
  methods: {
    limpaTemp () {
      this.t1 = []
      this.t2 = ''
      this.t3 = ''
    },
    showLoading () {
      this.$q.loading.show()
      // hiding in 2s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
      }, 2000)
    },
    async sistemaAcp (id, ano, seq, sistemas) {
      this.dadosExec.idCliente = id
      this.dadosExec.anoAcp = ano
      this.dadosExec.seqAcp = seq
      this.dadosExec.sistemas = sistemas
      const axiosConfig = {
        method: 'put',
        url: `/acpSistema/${id}`,
        data: this.dadosExec
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      this.acp.sistemas = ''
    },

    async chamadoAcp (id, ano, seq, chamado) {
      this.dadosExec.idCliente = id
      this.dadosExec.anoAcp = ano
      this.dadosExec.seqAcp = seq
      this.dadosExec.chamados = chamado
      const axiosConfig = {
        method: 'put',
        url: `/acpChamado/${id}`,
        data: this.dadosExec
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      this.acp.sistemas = ''
    },
    async personalizaAcp (id, ano, seq, qtAcp, execAcp) {
      this.dadosExec.idCliente = id
      this.dadosExec.anoAcp = ano
      this.dadosExec.seqAcp = seq
      this.dadosExec.execAcp = execAcp
      this.dadosExec.qtAcp = qtAcp
      const axiosConfig = {
        method: 'put',
        url: `/personalizaAcp/${id}`,
        data: this.dadosExec
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      this.acp.execAcp = ''
      this.carrega()
    },

    async realizaAcp (seq, execAcp, qtAcp, sist, chamados) {
      var dataHora = new Date()
      var dia = dataHora.getDate()
      var mes = dataHora.getMonth() + 1
      var ano = dataHora.getFullYear()
      var hora = checkTime(dataHora.getHours())
      var min = checkTime(dataHora.getMinutes())
      function checkTime (i) {
        i = i < 10 ? '0' + i : i
        return i
      }
      if (dia < 10) {
        dia = '0' + dia
      } else if (mes < 10) {
        mes = '0' + (mes)
      }
      this.dadosExec.idCliente = this.selectNmCliente.idCliente
      this.dadosExec.anoAcp = this.anoAcpPlano.anoAcp
      this.dadosExec.seqAcp = seq
      this.dadosExec.execAcp = execAcp
      this.dadosExec.qtAcp = qtAcp
      this.dadosExec.sistemas = sist
      this.dadosExec.chamados = chamados
      this.dadosExec.ultimaAtualizacao = dia + '/' + mes + '/' + ano + ' ' + hora + ':' + min
      const axiosConfig = {
        method: 'put',
        url: `/acp/${this.selectNmCliente.idCliente}`,
        data: this.dadosExec
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      this.acp.execAcp = ''
      this.carrega()
    },
    carregaAnoAcp () {
      this.ultimaAtualizacao = ''
      this.contSaldoAux = 0
      this.contSaldo = 0
      this.diasUtilizados = 0
      this.diasTotais = 0
      this.diasUtilizados = 0
      this.contQtdAtual = 0
      this.data = []
      this.anoAcpPlano = []
      for (var i = 0; i < stringOptionsAnoAcpPlano.length; ++i) {
        stringOptionsAnoAcpPlano.splice(i--, 1)
      }
      this.$axios
        .get(`${process.env.API}/carregaPlanosCliente/${this.selectNmCliente.idCliente}`)
        .then((response) => {
          this.dataAnoAcp = response.data
          this.dataAnoAcp.forEach((value, index) => {
            // this.options.push(value)
            stringOptionsAnoAcpPlano.push(value)
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
      this.showing = true
    },
    async acpVisualizaMes (id, seq, ano, execAcp, qtAcp) {
      this.dataChamados = []
      this.idAux = id
      this.seqAux = seq
      this.anoAux = ano
      this.qtacpAux = qtAcp
      this.execAcpAux = execAcp
      this.$axios
        .get(`${process.env.API}/acpVisualizaMes/${id + ';' + seq + ';' + ano}`)
        .then((response) => {
          this.dataChamados = response.data
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Falha no carregamento',
            icon: 'report_problem'
          })
        })
      this.showMes = true
    },
    async cadChamado (id, ano, seq) {
      this.chamado.idCliente = id
      this.chamado.anoAcp = ano
      this.chamado.seqAcp = seq
      console.log(this.chamado.chamados)
      if (!this.chamado.chamados || !this.chamado.sistemas || !this.chamado.descricaoAcp) {
        Notify.create({
          message: 'Preencha todos os campos disponíveis.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      } else {
        if (ano !== '' && seq !== '') {
          const axiosConfig = {
            method: 'post',
            url: `/cadChamado`,
            data: this.chamado
          }
          await this.$axios(axiosConfig.url, axiosConfig)
            .then((R) => R.data)
            .catch(this.AxiosCatch)
          Notify.create({
            message: 'Chamado cadastrado.',
            position: 'bottom',
            color: 'green',
            timeout: 800
          })
        }
        this.chamado = {
          chamados: '',
          sistemas: '',
          descricaoAcp: ''
        }
      }
    },
    removeChamado (chamado, desc) {
      this.$q
        .dialog({
          title: 'Confirmar exclusão',
          message:
            ' <b>Chamado: </b>' +
            chamado +
            ' <br><b> Atividade: </b>' +
            desc.substring(0, 50),
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
          const axiosConfig = {
            method: 'delete',
            url: `/removeChamadoAcp/${chamado + ';' + this.anoAux + ';' + this.seqAux + ';' + this.execAcpAux + ';' + this.idAux + ';' + this.qtacpAux}`
          }
          this.$axios(axiosConfig.url, axiosConfig)
            .then((R) => R.data)
            .catch(this.AxiosCatch)
          Notify.create({
            message: 'Chamado removido.',
            position: 'bottom',
            color: 'red',
            timeout: 800
          })
          setTimeout(() => {
            this.acpVisualizaMes(this.idAux, this.seqAux, this.anoAux, this.execAcpAux - 1, this.qtacpAux)
            setTimeout(() => {
              this.carrega()
            }, 300)
          }, 500)
        })
        .onCancel(() => {})
    },
    async editarChamado (sistema, chamado, desc) {
      this.chamadoEdit.chamadoAnt = chamado
      this.chamadoEdit.idCliente = this.idAux
      this.chamadoEdit.anoAcp = this.anoAux
      this.chamadoEdit.seqAcp = this.seqAux
      this.chamadoEdit.sistemas = sistema
      this.chamadoEdit.chamados = chamado
      this.chamadoEdit.chamadoAnt = chamado
      this.chamadoEdit.descricaoAcp = desc
      this.editChamado = true
    },
    async atualizaChamado () {
      const axiosConfig = {
        method: 'put',
        url: `/atualizaChamado/`,
        data: this.chamadoEdit
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Dados atualizados.',
        position: 'bottom',
        color: 'green',
        timeout: 800
      })
      setTimeout(() => {
        this.acpVisualizaMes(this.idAux, this.seqAux, this.anoAux, this.execAcpAux, this.qtacpAux)
        setTimeout(() => {
          this.carrega()
        }, 300)
      }, 500)
    },
    async carrega () {
      var cont = 0
      this.testaNovaTabelaAcp = ''
      this.showLoading()
      setTimeout(() => {
        this.contSaldoAux = 0
        this.contSaldo = 0
        this.diasUtilizados = 0
        this.diasTotais = 0
        this.diasUtilizados = 0
        this.contQtdAtual = 0
        this.$axios
          .get(`${process.env.API}/acp/${this.selectNmCliente.idCliente + ';' + this.anoAcpPlano.anoAcp}`)
          .then((response) => {
            this.data = response.data
            this.auxTrocaCliente = ''
            this.gestor = this.data[0].gestorPlano
            this.ultimaAtualizacao = this.data[0].ultimaAtualizacao
            this.anotacao.anotacoes = this.data[0].anotacoes
            this.data.forEach((value, index) => {
              if (this.data[index].sistemas === null && this.data[index].sistemasAnt !== null) {
                this.data[index].sistemas = this.data[index].sistemasAnt
                this.data[index].chamados = this.data[index].chamadosAnt
                console.log(this.data[index].sistemasAnt)
              }
              this.contSaldo += parseInt(this.data[index].qtAcp)
              this.diasTotais += parseInt(this.data[index].qtAcp)
              if (this.data[index].descricaoAcp !== null) {
                this.testaNovaTabelaAcp = 'ok'
              }
              cont += parseInt(this.data[index].execAcp)
              this.diasUtilizados += parseInt(this.data[index].execAcp)
              if (this.data[index].dtAcp.substring(3, 11) === this.dtAux) {
                this.auxTrocaCliente = 'T'
                this.data[index].saldo = this.contSaldo
                this.contQtdAtual = this.contSaldo
              }
            })
            this.data.forEach((value, index) => {
              if (this.data[index].dtAcp.substring(3, 11) === this.dtAux) {
                this.data[index].saldo = this.data[index].saldo - cont
                this.contSaldoAux = this.data[index].saldo
              }
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
      }, 500)
      this.anotacao.anotacoes = ''
      setTimeout(() => {
        this.dadosExec.saldoAtualTotal = this.contSaldoAux
        const axiosConfig = {
          method: 'put',
          url: `/atualizaSaldoGeral/${this.selectNmCliente.idCliente + ';' + this.anoAcpPlano.anoAcp}`,
          data: this.dadosExec
        }
        this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
      }, 1000)
    },
    carregaSelectCliente () {
      for (var i = 0; i < stringOptions.length; ++i) {
        stringOptions.splice(i--, 1)
      }
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
    carregaSelectClienteAcp () {
      for (var i = 0; i < stringOptionsAcp.length; ++i) {
        stringOptionsAcp.splice(i--, 1)
      }
      this.$axios
        .get(`${process.env.API}/clientesSelectAcp/`)
        .then((response) => {
          this.dataPessoa = response.data
          this.dataPessoa.forEach((value, index) => {
            // this.options.push(value)
            stringOptionsAcp.push(value)
          })
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Falha no carregamento',
            icon: 'Report_problem'
          })
        })
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
        })
      }
    },
    filterFnAcp (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      if (val.length < 0) {
        abort()
      } else {
        setTimeout(() => {
          update(() => {
            if (val === '') {
              this.optionsAcp = stringOptionsAcp
            } else {
              const needle = val.toLowerCase()
              this.optionsAcp = stringOptionsAcp.filter(
                (v) => v.nmCliente.toLowerCase().indexOf(needle) > -1
              )
            }
          })
        })
      }
    },
    async criarPlano () {
      var dataHora = new Date()
      var dia = dataHora.getDate()
      var mes = dataHora.getMonth() + 1
      var ano = dataHora.getFullYear()
      var hora = checkTime(dataHora.getHours())
      var min = checkTime(dataHora.getMinutes())
      function checkTime (i) {
        i = i < 10 ? '0' + i : i
        return i
      }
      if (dia < 10) {
        dia = '0' + dia
      } else if (mes < 10) {
        mes = '0' + (mes + 1)
      }
      this.acp.ultimaAtualizacao = dia + '/' + mes + '/' + ano + ' ' + hora + ':' + min
      this.valores = [
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '1',
          this.acp.dt01,
          this.acp.qt01,
          '',
          this.acp.qt01,
          '',
          this.acp.totAcp,
          '',
          '',
          '',
          this.acp.ultimaAtualizacao,
          this.acp.totAcp,
          this.acp.statusAcp,
          this.acp.gestorPlano,
          this.acp.dtEncerramento
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '2',
          this.acp.dt02,
          this.acp.qt02,
          '',
          this.acp.qt02,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '3',
          this.acp.dt03,
          this.acp.qt03,
          '',
          this.acp.qt03,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '4',
          this.acp.dt04,
          this.acp.qt04,
          '',
          this.acp.qt04,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '5',
          this.acp.dt05,
          this.acp.qt05,
          '',
          this.acp.qt05,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '6',
          this.acp.dt06,
          this.acp.qt06,
          '',
          this.acp.qt06,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '7',
          this.acp.dt07,
          this.acp.qt07,
          '',
          this.acp.qt07,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '8',
          this.acp.dt08,
          this.acp.qt08,
          '',
          this.acp.qt08,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '9',
          this.acp.dt09,
          this.acp.qt09,
          '',
          this.acp.qt09,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '10',
          this.acp.dt10,
          this.acp.qt10,
          '',
          this.acp.qt10,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '11',
          this.acp.dt11,
          this.acp.qt11,
          '',
          this.acp.qt11,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ],
        [
          this.acpNmClienteCad.idCliente,
          this.acp.anoAcp,
          '12',
          this.acp.dt12,
          this.acp.qt12,
          '',
          this.acp.qt12,
          '',
          '',
          '',
          '',
          '',
          '',
          this.acp.totAcp,
          this.acp.statusAcp,
          '',
          ''
        ]
      ]
      this.cadPlano()
    },
    async cadPlano () {
      const axiosConfig = {
        method: 'post',
        url: `/cadPlano`,
        data: this.valores
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Plano cadastrado.',
        position: 'bottom',
        color: 'green',
        timeout: 800
      })
      if (this.selectNmCliente.idCliente === this.acpNmClienteCad.idCliente) {
        this.carrega()
        this.carregaAnoAcp()
        this.zeraDatas()
      }
      this.zeraDatas()
      this.anoAcpPlano = []
      this.carregaSelectClienteAcp()
    },
    zeraDatas () {
      this.statusGera = ''
      this.statusVisualiza = ''
      this.acpNmClienteCad = null
      this.dtInicial = ''
      this.dtFinal = ''
      this.acp = {
        totAcp: '',
        statusAcp: 'A'
      }
    },
    gerar (d1, d2) {
      this.statusGera = '1'
      this.statusVisualiza = '1'
      var dateStart = moment(d1)
      var dateEnd = moment(d2)
      this.acp.dtEncerramento = dateEnd.format('MM/YYYY')
      var timeValues = []
      var i = 1
      while (
        // eslint-disable-next-line
        dateEnd > dateStart ||
        dateStart.format('M') === dateEnd.format('M')
      ) {
        timeValues.push(dateStart.format('DD/MM/YYYY'))
        dateStart.add(1, 'month')
        if (i === 1) {
          this.acp.dt01 = timeValues[i - 1]
        }
        if (i === 2) {
          this.acp.dt02 = timeValues[i - 1]
        }
        if (i === 3) {
          this.acp.dt03 = timeValues[i - 1]
        }
        if (i === 4) {
          this.acp.dt04 = timeValues[i - 1]
        }
        if (i === 5) {
          this.acp.dt05 = timeValues[i - 1]
        }
        if (i === 6) {
          this.acp.dt06 = timeValues[i - 1]
        }
        if (i === 7) {
          this.acp.dt07 = timeValues[i - 1]
        }
        if (i === 8) {
          this.acp.dt08 = timeValues[i - 1]
        }
        if (i === 9) {
          this.acp.dt09 = timeValues[i - 1]
        }
        if (i === 10) {
          this.acp.dt10 = timeValues[i - 1]
        }
        if (i === 11) {
          this.acp.dt11 = timeValues[i - 1]
        }
        if (i === 12) {
          this.acp.dt12 = timeValues[i - 1]
        }
        i++
      }

      this.contMeses = i - 1
      for (let index = 0; index < this.contMeses; index++) {
        if (index === 0) {
          this.acp.qt01 = this.acp.totAcp / this.contMeses
        }
        if (index === 1) {
          this.acp.qt02 = this.acp.totAcp / this.contMeses
        }
        if (index === 2) {
          this.acp.qt03 = this.acp.totAcp / this.contMeses
        }
        if (index === 3) {
          this.acp.qt04 = this.acp.totAcp / this.contMeses
        }
        if (index === 4) {
          this.acp.qt05 = this.acp.totAcp / this.contMeses
        }
        if (index === 5) {
          this.acp.qt06 = this.acp.totAcp / this.contMeses
        }
        if (index === 6) {
          this.acp.qt07 = this.acp.totAcp / this.contMeses
        }
        if (index === 7) {
          this.acp.qt08 = this.acp.totAcp / this.contMeses
        }
        if (index === 8) {
          this.acp.qt09 = this.acp.totAcp / this.contMeses
        }
        if (index === 9) {
          this.acp.qt10 = this.acp.totAcp / this.contMeses
        }
        if (index === 10) {
          this.acp.qt11 = this.acp.totAcp / this.contMeses
        }
        if (index === 11) {
          this.acp.qt12 = this.acp.totAcp / this.contMeses
        }
      }
    },
    excluirPlano () {
      this.$q
        .dialog({
          title: 'Confirmar exclusão',
          message: ' <b>Cliente: </b>' + this.selectNmCliente.nmCliente + ' <br><b> Plano: </b>' + this.anoAcpPlano.anoAcp,
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
          this.remover()
        })
        .onCancel(() => {})
    },
    async remover () {
      const axiosConfig = {
        method: 'delete',
        url: `/excluirPlano/${this.selectNmCliente.idCliente + ';' + this.anoAcpPlano.anoAcp}`
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Plano removido.',
        position: 'bottom',
        color: 'red',
        timeout: 800
      })
      this.data = []
      this.selectNmCliente = []
      this.ultimaAtualizacao = ''
      this.anoAcpPlano = []
    },
    async desativarPlano () {
      await this.$q
        .dialog({
          title: 'Confirmar desativação?',
          message:
            '<b>Cliente: </b>' + this.selectNmCliente.nmCliente + '<br><b>Plano: </b>' + this.anoAcpPlano.anoAcp,
          persistent: false,
          html: true,
          ok: {
            push: true,
            label: 'Confirmar',
            color: 'red-9'
          },
          cancel: {
            push: true,
            color: 'light-blue-9',
            label: 'Cancelar'
          }
        })
        .onOk(() => {
          this.confirmaDesativar()
        })
        .onCancel(() => {})
    },
    async confirmaDesativar () {
      const axiosConfig = {
        method: 'put',
        url: `/desativarPlano/${this.selectNmCliente.idCliente + ';' + this.anoAcpPlano.anoAcp}`,
        data: this.dadosExec
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Plano Desativado.',
        position: 'bottom',
        color: 'green',
        timeout: 800
      })
      this.carregaSelectClienteAcp()
      this.data = []
      this.selectNmCliente = []
      this.ultimaAtualizacao = ''
      this.anoAcpPlano = []
    },
    async GravaAnotacao () {
      this.anotacao.idCliente = this.selectNmCliente.idCliente
      this.anotacao.anoAcp = this.anoBase
      const axiosConfig = {
        method: 'put',
        url: `/anotacao/${this.anotacao.idCliente}`,
        data: this.anotacao
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Anotação gravada.',
        position: 'bottom',
        color: 'green',
        timeout: 800
      })
    },
    async relatorioPlano () {
      var data = new Date()
      var dia = data.getDate().toString()
      var diaF = (dia.length === 1) ? '0' + dia : dia
      var mes = (data.getMonth() + 1).toString()
      var mesF = (mes.length === 1) ? '0' + mes : mes
      var anoF = data.getFullYear()
      var hora = data.getHours().toString()
      var horaF = (hora.length === 1) ? '0' + hora : hora
      var minuto = data.getMinutes().toString()
      var minutoF = (minuto.length === 1) ? '0' + minuto : minuto
      var dtRel = diaF + '/' + mesF + '/' + anoF + ' - ' + horaF + ':' + minutoF
      var texto
      /*
      this.rel.idCliente = this.selectNmCliente.idCliente
      this.rel.anoAcp = this.anoAcpPlano.anoAcp
      this.rel.utilizados = this.diasUtilizados
      this.rel.total = this.diasTotais
      this.rel.previstas = this.contQtdAtual
      */
      this.rel.idCliente = '25'
      this.rel.anoAcp = '2021-1'
      this.rel.utilizados = '4'
      this.rel.total = '12'
      this.rel.previstas = '3'
      this.data.forEach((element, index, array) => {
        if (index === (0)) {
          this.rel.dataI = element.dtAcp.substring(3, 11)
        }
        if (index === (this.data.length - 1)) {
          this.rel.dataF = element.dtAcp.substring(3, 11)
        }
      })
      const axiosConfig = {
        method: 'post',
        url: `/rel`,
        data: this.rel
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((response) => {
          response.data.forEach((value, index) => {
            console.log(value)
          })
          texto = '<table style="font-family: arial, sans-serif;border-collapse: collapse;width: 100%;">' +
                    '<tr>' +
                      '<th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Chamados</th>' +
                    '</tr>'
          response.data.forEach((value, index) => {
            texto += '<tr><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' + value.dtAcp + '</td></tr>'
            texto += '<tr><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' + value.sistemas + '</td></tr>'
            texto += '<tr><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' + value.chamados + '</td></tr>'
            texto += '<tr><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' + value.descricao + '</td></tr>'
          })
          texto += '</table>'
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Falha no carregamento',
            icon: 'report_problem'
          })
        })
      this.txtRel = texto
      this.exp()
    },
    async exp () {
      this.txtRelDiag = true
      /*
      html2pdf(this.txtRel, {
        margin: [0.5, 0.3, 0.5, 0.3], // top, left, buttom, right
        filename: 'ACPs - ' + this.selectNmCliente.nmCliente + '.pdf',
        image: { type: 'jpeg', quality: 1.5 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' },
        html2canvas: { scale: 2, scrollX: 0, scrollY: 0, width: 1080 }
      }) */
    },
    async limparChamado () {
      this.chamado = {
        chamados: '',
        sistemas: '',
        descricaoAcp: ''
      }
    }
  }
}
</script>
<style lang="sass">
.my-sticky-column-table
  thead tr:first-child th
    background-color: #63a1c9
  td:first-child
    background-color: #c9c9b7
    width: 50px
.my-sticky-column-table tbody td
  height: 25px
</style>
