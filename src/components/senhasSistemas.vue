<template>
  <div class='q-pa-md'>
    <div class="row q-pb-md q-gutter-y-sm">
      <div class="col-12" >
        <q-input v-model="dsSenha" outlined type="text" label="Descrição" />
      </div>
      <div class="col-12">
        <q-input v-model="usSenha" outlined type="text" label="Login" />
      </div>
      <div class="col-12">
        <q-input v-model="psSenha" outlined type="text" label="Senha" />
      </div>
      <div class="q-gutter-x-sm">
        <q-btn class="q-pa-xs" icon="add" dense color="primary" label="Adicionar" v-if="edit == false" @click="cadSenha()"/>
        <q-btn class="q-pa-xs" icon="done" dense color="teal-7" label="Alterar" v-if="edit == true" @click="saveEdit()"/>
        <q-btn class="q-pa-xs" icon="close" dense label="Cancelar" @click="edit = false; dsSenha = '', psSenha = '', usSenha = ''" v-if="edit == true"/>
      </div>
    </div>
    <q-list bordered separator  striped>
      <q-item v-ripple v-for="s in data" :key="s.idSenha" clickable class="row">
        <q-item-section avatar class="col-1">
          <q-icon color="primary" name="arrow_right"/>
        </q-item-section>
        <q-item-section @click="copiarSenha(s.psSenha)">
          <q-item-label>{{s.dsSenha}}</q-item-label>
          <q-item-label caption><b>Login: {{s.usSenha}}<br>Senha: {{s.psSenha}}</b></q-item-label>
          <q-tooltip content-style="background-color: green">
            CLIQUE PARA COPIAR A SENHA
          </q-tooltip>
        </q-item-section>

        <q-item-section side class="col-3">
          <div>
            <q-btn size="12px" flat color="red" dense round icon="delete" @click="removerSenha(s.idSenha, s.dsSenha)">
              <q-tooltip content-style="background-color:#C10015">
                Remover
              </q-tooltip>
            </q-btn>
            <q-btn size="12px" flat dense round icon="edit" color="teal-8" @click="editarSenha(s.idSenha, s.dsSenha, s.usSenha, s.psSenha); edit = true">
              <q-tooltip content-style="background-color:#0560a1">
                Editar
              </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import { Notify, copyToClipboard } from 'quasar'
import { firebase, firebaseDb } from 'boot/firebase'
export default {
  data () {
    return {
      visualizaSugestao: false,
      edit: false,
      userOn: '',
      dsSenha: '',
      usSenha: '',
      psSenha: '',
      idSenha: '',
      data: this.data,
      sugestao: {
        titulo: '',
        dsSugestao: '',
        user: ''
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
    this.carrega()
  },
  methods: {
    copiarSenha (senha) {
      copyToClipboard(senha)
    },
    carrega () {
      this.$axios
        .get(`${process.env.API}/senhas/`)
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
    async editarSenha (id, ds, us, ps) {
      this.dsSenha = ds
      this.usSenha = us
      this.psSenha = ps
      this.idSenha = id
    },
    async cadSenha () {
      let senha = {}
      senha.dsSenha = this.dsSenha
      senha.usSenha = this.usSenha
      senha.psSenha = this.psSenha
      this.sugestao.user = this.userOn
      console.log(senha)
      if (this.dsSugestao !== '' && this.dsSenha !== '' && this.usSenha !== '') {
        const axiosConfig = {
          method: 'post',
          url: `/cadSenhas`,
          data: senha
        }
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Dados cadastrados',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.dsSenha = ''
        this.psSenha = ''
        this.usSenha = ''
        this.carrega()
      } else {
        Notify.create({
          message: 'Ocorreu um erro. Todos os campos são obrigatórios.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    async saveEdit () {
      let dados = {}
      dados.dsSenha = this.dsSenha
      dados.usSenha = this.usSenha
      dados.psSenha = this.psSenha
      if (this.dsSenha !== '' && this.psSenha !== '' && this.usSenha !== '') {
        const axiosConfig = {
          method: 'put',
          url: `/senhaEdit/${this.idSenha}`,
          data: dados
        }
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Dados alterados',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.idSenha = ''
        this.dsSenha = ''
        this.usSenha = ''
        this.psSenha = ''
        this.edit = false
        this.carrega()
      } else {
        Notify.create({
          message: 'Todos os campos são obrigatórios.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    async removerSenha (id, ds) {
      this.$q
        .dialog({
          title: 'Confirmação de exclusão',
          message: 'Descrição: ' + ds,
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
            url: `/delSenha/${id}`
          }
          this.$axios(axiosConfig.url, axiosConfig)
            .then((R) => R.data)
            .catch(this.AxiosCatch)
          this.carrega()
          Notify.create({
            message: 'Senha removida.',
            position: 'bottom',
            color: 'red',
            timeout: 2800
          })
          this.carrega()
        })
        .onCancel(() => {})
    }
  }
}
</script>
