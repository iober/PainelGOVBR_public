<template>
  <div>
    <div align="right" class="q-mr-md q-pt-lg">
      <q-btn
        stack
        push
        round
        color="light-blue-7"
        icon="add"
        @click="scriptDialog = true"
      >
        <q-tooltip>Adicionar Script</q-tooltip>
      </q-btn>
    </div>
    <q-splitter class="q-pb-md" v-model="splitterModel" style="height: 800px">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-md">Scripts</div>
          <q-separator />
          <q-select v-model="userselect" outlined :options="options" label="Selecionar Usuário" clearable clear-icon="close" dense @input="carrega(userselect)"/>
          <q-input placeholder="Pesquisar Script" outlined v-model="filter" clearable clear-icon="close" dense class="q-pt-xs"/>
          <q-table
            :data="data"
            :columns="columns"
            flat
            style="cursor: pointer"
            :visible-columns="visibleColumns"
            :filter="filter"
            row-key="idScript"
            virtual-scroll
            :virtual-scroll-item-size="48"
            :rows-per-page-options="[0]"
            :separator="separator"
            hide-header
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td @click="selecionaEscript(props.row.idScript)">
                 <q-icon name="chevron_right"/> {{ props.row.tituloScript }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </template>
      <template v-slot:separator>
        <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
      </template>
      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-md row">Código do Script
            <div v-show="idEdit">
              <q-btn icon="content_copy" flat color="green" @click="copiarScript()"><q-tooltip>&nbsp;Copiar Script</q-tooltip> COPIAR</q-btn>
              <q-btn icon="edit" flat color="primary" @click="scriptEditDialog = true"><q-tooltip>Editar Script</q-tooltip></q-btn>
              <q-btn icon="delete" flat color="red" @click="confirmaRemove(idEdit, scriptEdit.tituloScript)"><q-tooltip>Excluir Script</q-tooltip></q-btn>
            </div>
          </div>
          <q-separator />
          <div>
            <pre v-html="scriptSelecionado" />
          </div>
        </div>
      </template>
    </q-splitter>
    <q-dialog v-model="scriptDialog">
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Adicionar Script</div>
        </q-card-section>
        <q-card-section>
            <q-input
              label="Título do Script"
              maxlength="20000"
              v-model="script.tituloScript"
              outlined
              class="q-pb-md"
            />
            <q-input
              label="Script"
              v-model="script.dsScript"
              type="textarea"
              counter
              outlined
              maxlength="20000"
            >
              <template v-slot:hint>
              </template>
            </q-input>
        </q-card-section>
          <q-card-actions align="right" class="q-mb-md q-pr-md">
            <q-btn color="primary" @click="cadScript()">Salvar</q-btn>
            <q-btn
              color="white"
              text-color="black"
              @click="limpa()"
              label="Cancelar"
              v-close-popup
            />
          </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="scriptEditDialog">
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Editar Script</div>
        </q-card-section>
          <q-card-section>
            <q-input
              label="Título do Script"
              maxlength="20000"
              v-model="scriptEdit.tituloScript"
              outlined
              class="q-pb-md"
            />
            <q-input
              label="Script"
              v-model="scriptEdit.dsScript"
              type="textarea"
              counter
              outlined
              maxlength="20000"
            >
              <template v-slot:hint>
              </template>
            </q-input>
          </q-card-section>
          <q-card-actions align="right" class="q-mb-md q-pr-md">
            <q-btn color="primary" @click="editScript()">Salvar</q-btn>
            <q-btn
              color="white"
              text-color="black"
              label="Cancelar"
              v-close-popup
            />
          </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
import { Notify, copyToClipboard } from 'quasar'
export default {
  data () {
    return {
      options: [],
      separator: 'vertical',
      filter: '',
      userselect: '',
      idUsuario: '',
      scriptDialog: false,
      scriptEditDialog: false,
      splitterModel: 20, // start at 50%
      data: [],
      scriptSelecionado: '',
      script: {
        tituloScript: '',
        dsScript: '',
        idUser: ''
      },
      idEdit: '',
      scriptEdit: {
        tituloScript: '',
        dsScript: ''
      },
      visibleColumns: ['tituloScript'],
      columns: [
        {
          name: 'idScript',
          label: 'idScript',
          field: (row) => row.idScript,
          format: (val) => `${val}`
        },
        {
          name: 'tituloScript',
          required: true,
          label: 'tituloScript',
          align: 'left',
          field: (row) => row.tituloScript.toUpperCase(),
          format: (val) => `${val}`,
          sortable: true
        }
      ]
    }
  },
  created () {
    /* BUSCA O USUÁRIO, SEU E-MAIL É SEU ID */
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.idUsuario = user.email
        this.carrega(this.idUsuario)
        this.carregaselectuser()
      }
    })
  },
  methods: {
    teste (a) {
      console.log(a)
    },
    copiarScript (cp) {
      copyToClipboard(this.scriptSelecionado)
    },
    mouseOver: function () {
      this.active = !this.active
    },
    carregaselectuser () {
      this.$axios
        .get(`${process.env.API}/selectuserscript/`)
        .then((response) => {
          response.data.forEach(element => {
            if (element.iduser !== this.idUsuario) {
              this.options.push(element.iduser)
            }
          })
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    carrega (userselect) {
      if (userselect === null) {
        userselect = this.idUsuario
      }
      this.$axios
        .get(`${process.env.API}/scripts/${userselect}`)
        .then((response) => {
          this.data = response.data
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    selecionaEscript (id) {
      this.$axios
        .get(`${process.env.API}/scriptsSeleciona/${id}`)
        .then((response) => {
          this.idEdit = response.data[0].idScript
          this.scriptSelecionado = response.data[0].dsScript
          this.scriptEdit.tituloScript = response.data[0].tituloScript
          this.scriptEdit.dsScript = response.data[0].dsScript
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    async cadScript () {
      this.script.idUser = this.idUsuario
      if (this.script.tituloScript !== '' && this.script.dsScript !== '') {
        const axiosConfig = {
          method: 'post',
          url: `/scripts`,
          data: this.script
        }
        this.diagCard = false
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Script cadastrado.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.scriptDialog = false
        this.carrega(this.idUsuario)
        this.limpa()
      } else {
        Notify.create({
          message: 'Ocorreu um erro. O título e a descrição do script são obrigatórias.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    async editScript () {
      if (this.scriptEdit.tituloScript !== '' && this.scriptEdit.dsScript !== '') {
        const axiosConfig = {
          method: 'put',
          url: `/alteraScript/${this.idEdit}`,
          data: this.scriptEdit
        }
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        this.carrega(this.idUsuario)
        this.selecionaEscript(this.idEdit)
        this.scriptEditDialog = false
        Notify.create({
          message: 'Script alterado com sucesso.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        //  this.medium = false
      } else {
        Notify.create({
          message: 'Ocorreu um erro. O título e a descrição do script são obrigatórias.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    confirmaRemove (id, titulo) {
      this.$q
        .dialog({
          title: 'Confirmação de exclusão',
          message: '<b>Remover Script: </b>' + titulo,
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
          this.delScript(id)
        })
        .onCancel(() => {})
    },
    async delScript (id) {
      const axiosConfig = {
        method: 'delete',
        url: `/delScript/${id}`
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Script removido.',
        position: 'bottom',
        color: 'red',
        timeout: 800
      })
      this.carrega(this.idUsuario)
      this.idEdit = ''
      this.limpa()
    },
    limpa () {
      this.scriptSelecionado = ''
      this.script = {
        tituloScript: '',
        dsScript: ''
      }
      this.scriptEdit = {
        tituloScript: '',
        dsScript: ''
      }
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
