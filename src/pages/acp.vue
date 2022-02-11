<template>
  <q-page class="q-pa-md q-ml-sm">
    <table
      id="my-table2"
      hidden
    >
      <thead>
        <tr>
            <th class="text-center">Mês</th>
            <th class="text-center">Área</th>
            <th class="text-center">Chamados</th>
            <th class="text-center">Atividades</th>
        </tr>
      </thead>
      <tbody v-for="dados in this.dadosRelatorio" :key='dados.chamados'>
        <tr>
            <td class="text-left">{{dados.dtAcp}}</td>
            <td style="text-align:center">&nbsp{{dados.sistemas}}</td>
            <td style="text-align:center">&nbsp&nbsp&nbsp{{dados.chamados}}</td>
            <td style="text-align:justify-all">{{dados.descricao}}</td>
        </tr>
      </tbody>
    </table>
    <table
      id="my-table"
      hidden
    >
      <thead>
        <tr>
            <th class="text-left">Nome do Cliente</th>
            <th class="text-center">Total do Plano</th>
            <th class="text-center">Executadas</th>
            <th class="text-center">Previstas</th>
            <th class="text-center">Saldo no Mês</th>
        </tr>
      </thead>
      <tbody v-for="dados in this.relgeraldados" :key='dados.idcliente'>
        <tr v-if="dados.total && dados.nmCliente != 'teste'">
            <td class="text-left">{{dados.nmCliente}}</td>
            <td style="text-align:center">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{dados.total}}</td>
            <td style="text-align:center">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{dados.executadas}}</td>
            <td style="text-align:right">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{dados.previstas}}</td>
            <td style="text-align:right" v-if="dados.saldo >= 0">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{dados.saldo}}</td>
            <td style="text-align:right" v-if="dados.saldo < 0">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{dados.saldo}}</td>
        </tr>
      </tbody>
    </table>
    <table
      id="tbrelfiltro"
      hidden
    >
      <thead>
        <tr>
            <th class="text-center">Nome do cliente</th>
            <th class="text-center">Previstas</th>
            <th class="text-center">Executadas</th>
            <th class="text-center">Saldo</th>
        </tr>
      </thead>
      <tbody v-for="dados in this.dadosRelatorioFiltro" :key='dados.idCliente'>
        <tr v-if="dados.total && dados.nmCliente != 'teste'">
            <td class="text-left">{{dados.nmCliente}}</td>
            <td style="text-align:right">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{dados.previstas}}</td>
            <td style="text-align:center">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{dados.executadas}}</td>
            <td style="text-align:right" v-if="dados.saldo >= 0">&nbsp&nbsp&nbsp&nbsp&nbsp{{dados.saldo}}</td>
            <td style="text-align:right" v-if="dados.saldo < 0">&nbsp&nbsp&nbsp&nbsp{{dados.saldo}}</td>
        </tr>
      </tbody>
    </table>
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
      <div class="q-ml-sm q-pr-md col col-lg-2 col-sm-2 col-md-2 col-xs-12">
        <q-select
          v-model="selectNmCliente"
          use-input
          dense
          hide-selected
          fill-input
          outlined
          input-debounce="0"
          key="idCliente"
          clearable clear-icon="close"
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
        <q-checkbox label="Planos Inativos" dense v-model="ckinativo" :disable="!this.selectNmCliente" @input="carregaAnoAcp()" style="margin-top:-30px" class="text-bold">
          <q-tooltip>
            Mostra os planos inativos dos clientes.
          </q-tooltip>
        </q-checkbox>
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
          outlined
          >
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
        <div class="q-ml-sm q-pr-md q-pb-md col col-lg-12 col-sm-12 col-md-12 col-xs-12">
          <q-btn-dropdown
            class="shadow-7"
            icon="description"
            label="Relatórios Gerais"
            color="teal"
            v-show="this.testaNovaTabelaAcp !== 'ok' && !this.data.sistema"
          >
            <q-list bordered>
              <q-item clickable v-ripple  @click="relgeralDiag = true">
                <q-item-section avatar>
                  <q-icon color="primary" name="subject" />
                </q-item-section>
                <q-item-section>Resumo Plano Atual</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="filtrorelatorio = true">
                <q-item-section avatar>
                  <q-icon color="primary" name="bar_chart" />
                </q-item-section>
                <q-item-section>ACPs por Período</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn-dropdown
            class="shadow-7"
            icon="description"
            v-show="this.testaNovaTabelaAcp === 'ok'"
            label="Relatórios do Cliente"
            color="primary"
            :disable="ultimaAtualizacao === '' || diasUtilizados === '' || diasUtilizados === 0 || this.data.sistema || this.testaNovaTabelaAcp !== 'ok'"
          >
            <q-list bordered>
              <q-item clickable v-ripple v-show="this.testaNovaTabelaAcp === 'ok'" @click="relatorioPlano()">
                <q-item-section avatar>
                  <q-icon color="primary" name="description" />
                </q-item-section>
                <q-item-section>Relatório do Plano</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-show="this.testaNovaTabelaAcp === 'ok'" @click="filtrorelatorio = true; idClienteRel = selectNmCliente.idCliente">
                <q-item-section avatar>
                  <q-icon color="primary" name="bar_chart" />
                </q-item-section>
                <q-item-section>ACPs por Período</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

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
            label="Ações"
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
      <div class="q-pr-md q-pb-lg col col-lg-2 col-sm-3 col-md-3 col-xs-12"  v-if="!this.$q.platform.is.mobile">
        <q-input style="max-width:90%" outlined dense v-model="anotacao.anotacoes" label="Observações" :readonly="editobs === 0">
              <q-tooltip content-class='bg-green-8' content-style='font-size: 15px;'>
                {{anotacao.anotacoes}}
              </q-tooltip>
          <template v-slot:after>
            <q-icon name="save" color="primary" class="cursor-pointer" v-show="editobs === 1" @click="GravaAnotacao()">
              <q-tooltip>
                Gravar Alterações
              </q-tooltip>
            </q-icon>
            <q-icon name="edit" color="grey-7" class="cursor-pointer" v-show="editobs === 0" @click="liberaAnotacao()">
              <q-tooltip>
                Editar observação
              </q-tooltip>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="q-pa-sm col col-lg-2 col-sm-3 col-md-3 col-xs-12"  v-if="this.$q.platform.is.mobile">
        <q-input style="max-width:90%" outlined dense v-model="anotacao.anotacoes" label="Observações" :readonly="editobs === 0">
              <q-tooltip content-class='bg-green-8' content-style='font-size: 15px;'>
                {{anotacao.anotacoes}}
              </q-tooltip>
          <template v-slot:after>
            <q-icon name="save" color="primary" class="cursor-pointer" v-show="editobs === 1" @click="GravaAnotacao()">
              <q-tooltip>
                Gravar Alterações
              </q-tooltip>
            </q-icon>
            <q-icon name="edit" color="grey-7" class="cursor-pointer" v-show="editobs === 0" @click="liberaAnotacao()">
              <q-tooltip>
                Editar observação
              </q-tooltip>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col" v-if="!this.$q.platform.is.mobile">
        <div class="col-md-4 q-pb-md offset-md-5 q-pr-md" align="right">
          <q-btn
            style="margin-top: -55px"
            stack push
            v-show="
              userOn === 'Gabriela Sfredo' ||
              userOn === 'Thiago Gomes' ||
              userOn === 'Iober Henrique da Cruz'
            "
            color="light-blue-7"
            round
            icon="add"
            @click="addPlanoDialog = true"
          >
            <q-tooltip self="center right">Adicionar Plano</q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="col-12" v-if="this.$q.platform.is.mobile">
        <div class="q-pb-sm" align="center">
          <q-btn
            style="width:97%"
            v-show="
              userOn === 'Gabriela Sfredo' ||
              userOn === 'Thiago Gomes' ||
              userOn === 'Iober Henrique da Cruz'
            "
            color="light-blue-7"
            icon="add"
            label="Adicionar Plano"
            @click="addPlanoDialog = true"
          />
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
                  :disable="ckinativo === true ||
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
                  :disable="ckinativo === true ||
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
              <q-btn :disable="props.row.execAcp === 0 || ckinativo === true" flat dense class="col-xs-12" color="blue-grey-6" icon="visibility" @click="acpVisualizaMes(props.row.idCliente, props.row.seqAcp, props.row.anoAcp, props.row.execAcp, props.row.qtAcp)"></q-btn>
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

      <!-- ANOTACOES DA ACP ------------------------------------->
      <q-dialog v-model="showAnotacao" class="dialog">
        <q-card class="shadow-7" style="width: 900px">
          <q-card-section class="bg-primary text-white">
            <div style="font-size: 20px">Observações</div>
          </q-card-section>
          <q-card-section>
            {{ anotacao.anotacoes }}
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              @click="showAnotacao = false"
              >Fechar</q-btn
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
              class="q-pb-sm col-lg-3 col-xs-12 col-sm-3 col-md-3"
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
    <q-card style='width: 790px; max-width: 80vw'>
      <q-card-section class='bg-primary text-white'>
        <div class='text-h6'>Relação de Chamados</div>
      </q-card-section>
      <q-card-section>
      <q-table
        dense
        :data="dataChamados"
        :columns="columnsAcpDesc"
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

    <q-dialog v-model="relgeralDiag">
      <q-card style="width: 200px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6"> <q-icon name="date_range" /> Período</div>
        </q-card-section>
        <q-card-section>
          <q-select v-if="!selectNmCliente" v-model="tpFiltro" :options="optFiltroTipo" label="Tipo do Filtro" dense />
          <q-select v-if="!selectNmCliente" v-model="tpOrdem" :options="optFiltroOrdem" label="Ordenação" dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="GERAR RELATÓRIO" color="primary" v-close-popup @click="relGeral()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="filtrorelatorio">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6"> <q-icon name="date_range" /> Período</div>
        </q-card-section>
        <q-card-section>
          <q-select v-if="!selectNmCliente" v-model="tpFiltro" :options="optFiltroTipo" label="Tipo do Filtro" dense />
          <q-select v-if="!selectNmCliente" v-model="tpOrdem" :options="optFiltroOrdem" label="Ordenação" dense />
          <div style="max-width: 300px" class="q-mt-sm">
            <q-input filled v-model="dtFiltroI" mask="##/##/####" placeholder="De">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="dtFiltroI" mask="DD/MM/YYYY" style="width: 10px">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="q-pt-sm" style="max-width: 300px">
            <q-input filled v-model="dtFiltroF" mask="##/##/####"  placeholder="Até">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="dtFiltroF" mask="DD/MM/YYYY" style="width: 10px">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="GERAR RELATÓRIO" color="primary" :disable="!dtFiltroF || !dtFiltroI" v-close-popup @click="relatorioAnual()"/>
        </q-card-actions>
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
import JsPDF from 'jspdf'
import 'jspdf-autotable'
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
      relgeralDiag: false,
      tpFiltro: '',
      tpOrdem: '',
      optFiltroOrdem: [{ label: 'Crescente', value: 'ASC' }, { label: 'Decrescente', value: 'DESC' }],
      optFiltroTipo: [{ label: 'Por nome', value: 't1.nmcliente' }, { label: 'Por Saldo', value: 'saldo' }],
      idClienteRel: '',
      dtFiltroI: '',
      dtFiltroF: '',
      filtrorelatorio: false,
      relgeraldados: [],
      dadosRelatorio: [],
      dadosRelatorioFiltro: [],
      ckinativo: false,
      editobs: 0,
      teste: '',
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
          field: (row) => row.descricaoAcp.substring(0, 70),
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
      this.tpFiltro = this.optFiltroTipo[0]
      this.tpOrdem = this.optFiltroOrdem[0]
      var dia = new Date()
      var hj = dia.getDate()
      if (hj.toString().length === 1) {
        this.dtFiltroI = '01/01/' + dia.getFullYear()
        this.dtFiltroF = '0' + hj + '/' + this.dataAtual
      } else {
        this.dtFiltroI = '01/01/' + dia.getFullYear()
        this.dtFiltroF = hj + '/' + this.dataAtual
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
      var ina = 'a'
      if (this.ckinativo === true) {
        this.showLoading()
        ina = 'i'
      }
      this.gestor = ''
      this.ultimaAtualizacao = ''
      this.contSaldoAux = 0
      this.contSaldo = 0
      this.diasUtilizados = 0
      this.diasTotais = 0
      this.diasUtilizados = 0
      this.contQtdAtual = 0
      this.data = []
      this.anotacao = {}
      this.anoAcpPlano = []
      for (var i = 0; i < stringOptionsAnoAcpPlano.length; ++i) {
        stringOptionsAnoAcpPlano.splice(i--, 1)
      }
      this.$axios
        .get(`${process.env.API}/carregaPlanosCliente/${this.selectNmCliente.idCliente + ';' + ina}`)
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
    async liberaAnotacao () {
      this.editobs = 1
    },
    async GravaAnotacao () {
      this.anotacao.idCliente = this.selectNmCliente.idCliente
      this.anotacao.anoAcp = this.anoAcpPlano.anoAcp
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
      this.editobs = 0
    },
    async relGeral () {
      var dados = {}
      if (this.idClienteRel) {
        dados.where = 'where t1.idCliente = ' + this.idClienteRel
      } else {
        dados.where = ' ORDER BY ' + this.tpFiltro.value + ' ' + this.tpOrdem.value
      }
      const axiosConfig = {
        method: 'post',
        url: `/relGeral`,
        data: dados
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((response) => {
          this.relgeraldados = response.data
          setTimeout(() => {
            this.gerapdf()
          }, 300)
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Falha ao gerar o relatório',
            icon: 'report_problem'
          })
        })
    },
    async gerapdf () {
      var doc = new JsPDF()
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
      doc.setFontSize(9)
      // doc.addImage(imglogo, 'JPEG', 50, 10, 90, 50)
      doc.text(dtRel, 170, 8)
      doc.setFontSize(17)
      doc.text('Relatório Geral de ACP', 80, 20)
      doc.setFontSize(12)
      doc.text('CRC Passo Fundo', 92, 25)
      doc.setFontSize(9)
      var imglogo = 'data:image/png;base64,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'
      doc.addImage(imglogo, 'JPEG', 8, 3, 35, 25)
      doc.autoTable({ startY: 30 })
      doc.autoTable({
        html: '#my-table'
      })
      doc.save('Relatório Geral ACP.pdf')
    },
    async relatorioAnual () {
      var dados = {}
      dados.dti = this.dtFiltroI
      dados.dtf = this.dtFiltroF
      if (this.idClienteRel) {
        dados.where = 'where t1.idCliente = ' + this.idClienteRel
      } else {
        dados.where = ' ORDER BY ' + this.tpFiltro.value + ' ' + this.tpOrdem.value
      }
      const axiosConfig = {
        method: 'post',
        url: `/relFiltro`,
        data: dados
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((response) => {
          this.dadosRelatorioFiltro = response.data
          setTimeout(() => {
            var doc = new JsPDF()
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
            doc.setFontSize(9)
            // doc.addImage(imglogo, 'JPEG', 50, 10, 90, 50)
            doc.text(dtRel, 170, 8)
            doc.setFontSize(17)
            doc.text('Relação de ACPs por Período', 70, 20)
            doc.setFontSize(12)
            doc.text('CRC Passo Fundo', 91, 25)
            doc.setFontSize(9)
            var imglogo = 'data:image/png;base64,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'
            doc.addImage(imglogo, 'JPEG', 8, 3, 35, 25)
            doc.setFontSize(10)
            doc.text('Período de: ' + dados.dti + ' a ' + dados.dtf, 15, 35)
            doc.setFontSize(9)
            doc.autoTable({ startY: 30 })
            doc.autoTable({
              html: '#tbrelfiltro'
            })
            if (this.idClienteRel) {
              doc.save('Relatório ACP ' + this.selectNmCliente.nmCliente + '-' + dados.dti + '-' + dados.dtf + '.pdf')
            } else {
              doc.save('Relatório ACP ' + dados.dti + '-' + dados.dtf + '.pdf')
            }
          }, 400)
        })
        .catch(this.AxiosCatch)
      /*
      const doc = new JsPDF('l')
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
      var dataI, dataF
      var imglogo = 'data:image/png;base64,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'
      this.rel.idCliente = this.selectNmCliente.idCliente
      this.rel.anoAcp = this.anoAcpPlano.anoAcp
      this.rel.utilizados = this.diasUtilizados
      this.rel.total = this.diasTotais
      this.rel.previstas = this.contQtdAtual
      this.data.forEach((element, index, array) => {
        if (index === (0)) {
          dataI = element.dtAcp.substring(3, 11)
        }
        if (index === (this.data.length - 1)) {
          dataF = element.dtAcp.substring(3, 11)
        }
      })
      const axiosConfig = {
        method: 'post',
        url: `/rel`,
        data: this.rel
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((response) => {
          this.dadosRelatorio = response.data
          console.log(this.dadosRelatorio)
          doc.addImage(imglogo, 'JPEG', 8, 3, 35, 25)
          doc.setFontSize(9)
          doc.text(dtRel, 255, 8)
          doc.setFontSize(17)
          doc.text('Relatório de Execução de Acompanhamento Permanente', 78, 26)
          doc.setFontSize(9)
          doc.text('Cliente: ' + this.selectNmCliente.nmCliente, 15, 41)
          doc.text('Período: ' + dataI + ' à ' + dataF, 15, 46)
          doc.text('Total Contratado: ' + this.diasTotais, 73, 46)
          doc.text('Previstas: ' + this.contQtdAtual, 121, 46)
          doc.text('Utilizadas: ' + this.diasUtilizados, 154, 46)
          doc.autoTable({ startY: 41 })
          setTimeout(() => {
            doc.autoTable({
              showHead: 'firstPage',
              theme: 'grid',
              headStyles: { fillColor: [5, 96, 161] },
              html: '#my-table2'
            })
            doc.save('ACP - ' + this.selectNmCliente.nmCliente + '.pdf')
          }, 1500)
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
      */
    },
    async relatorioPlano () {
      const doc = new JsPDF('l')
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
      var dataI, dataF
      var imglogo = 'data:image/png;base64,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'
      this.rel.idCliente = this.selectNmCliente.idCliente
      this.rel.anoAcp = this.anoAcpPlano.anoAcp
      this.rel.utilizados = this.diasUtilizados
      this.rel.total = this.diasTotais
      this.rel.previstas = this.contQtdAtual
      this.data.forEach((element, index, array) => {
        if (index === (0)) {
          dataI = element.dtAcp.substring(3, 11)
        }
        if (index === (this.data.length - 1)) {
          dataF = element.dtAcp.substring(3, 11)
        }
      })
      const axiosConfig = {
        method: 'post',
        url: `/rel`,
        data: this.rel
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((response) => {
          this.dadosRelatorio = response.data
          doc.addImage(imglogo, 'JPEG', 8, 3, 35, 25)
          doc.setFontSize(9)
          doc.text(dtRel, 255, 8)
          doc.setFontSize(17)
          doc.text('Relatório de Execução de Acompanhamento Permanente', 78, 26)
          doc.setFontSize(9)
          doc.text('Cliente: ' + this.selectNmCliente.nmCliente, 15, 41)
          doc.text('Período: ' + dataI + ' à ' + dataF, 15, 46)
          doc.text('Total Contratado: ' + this.diasTotais, 73, 46)
          doc.text('Previstas: ' + this.contQtdAtual, 121, 46)
          doc.text('Utilizadas: ' + this.diasUtilizados, 154, 46)
          doc.autoTable({ startY: 41 })
          setTimeout(() => {
            doc.autoTable({
              showHead: 'firstPage',
              theme: 'grid',
              headStyles: { fillColor: [5, 96, 161] },
              html: '#my-table2'
            })
            doc.save('ACP - ' + this.selectNmCliente.nmCliente + '.pdf')
          }, 1500)
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
<style scoped>
table {
  border-spacing: 1.5cm 0cm;
}
</style>
