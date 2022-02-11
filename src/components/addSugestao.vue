<template>
  <div>
    <q-card-section>
      <q-input
        outlined
        v-model="sugestao.titulo"
        placeholder="Titulo até 80 caractéres"
        lazy-rules
        :rules="[(val) => !!val]"
        class="q-pb-sm"
        maxlength="80"
      />
      <q-input
        autogrow
        outlined
        v-model="sugestao.dsSugestao"
        placeholder="Descrição até 600 caractéres"
        maxlength="600"
        lazy-rules
        :rules="[(val) => !!val]"
      />
    </q-card-section>
    <q-card-actions align="right" class="text-primary q-ma-sm">
      <q-btn
        id="btnSalvar"
        label="Salvar"
        color="primary"
        @click="
          cadSugestao();
          limpaCampos();
          submitted = false;
        "
        v-close-popup
      />
      <q-btn
        label="Cancelar"
        type="reset"
        color="white"
        text-color="black"
        class="q-ml-sm"
        v-close-popup
      />
      <q-btn
        icon="visibility"
        type="reset"
        color="white"
        flat
        text-color="black"
        class="q-ml-sm"
        @click="visualizaSugestao = true"
      />
    </q-card-actions>
    <q-dialog
      v-model="visualizaSugestao"
      class="dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 80vw; max-height: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Lista de Sugestões/Correções</div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-markup-table dense>
              <thead>
                <tr>
                  <th class="text-left">Id</th>
                  <th class="text-left">Titulo</th>
                  <th class="text-left">Descrição</th>
                  <th class="text-left">Usuário</th>
                  <th
                    class="text-left"
                    v-show="userOn === 'Iober Henrique da Cruz'"
                  >
                    Remover
                  </th>
              <th
                    class="text-left"
                    v-show="userOn === 'Iober Henrique da Cruz'"
                  >
                    Concluir
                  </th>
                </tr>
              </thead>
              <tbody v-for="s in data" :key="s.idSugestao">
                <tr style="word-wrap" :style="(s.status=='C')?'backgroundColor:#b2d8d8':''">
                  <td class="text-left">{{ s.idSugestao }}</td>
                  <td class="text-left">{{ s.titulo }}</td>
                  <td
                    class="text-left"
                    style="
                      width: 150px;
                      whitespace: normal;
                      text-align: justify;
                      word-wrap: break-word;
                    "
                  >
                    {{ s.dsSugestao }}
                  </td>
                  <td class="text-left">{{ s.user }}</td>
                  <td
                    class="text-left"
                    v-show="userOn === 'Iober Henrique da Cruz'"
                  >
                    <q-btn
                      icon="delete"
                      color="red"
                      flat
                      round
                      @click="removeSugestao(s.idSugestao, s.titulo)"
                      ><q-tooltip>Excluir sugestão</q-tooltip></q-btn
                    >
                  </td>
                  <td
                    class="text-left"
                    v-show="userOn === 'Iober Henrique da Cruz'"
                  >
                    <q-btn
                      icon="check_circle"
                      color="blue-9"
                      flat
                      round
                      @click="concluirSugestao(s.idSugestao, s.titulo)"
                      ><q-tooltip>Concluir sugestão</q-tooltip></q-btn
                    >
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary q-ma-sm">
          <q-btn
            color="white"
            text-color="black"
            label="Fechar"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { Notify } from 'quasar'
import { firebase, firebaseDb } from 'boot/firebase'
export default {
  data () {
    return {
      visualizaSugestao: false,
      userOn: '',
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
    carrega () {
      this.$axios
        .get(`${process.env.API}/sugestao/`)
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
    async cadSugestao () {
      this.sugestao.user = this.userOn
      if (this.sugestao.titulo !== '' && this.sugestao.dsSugestao !== '') {
        const axiosConfig = {
          method: 'post',
          url: `/sugestao`,
          data: this.sugestao
        }
        this.sugestaoDialog = false
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Sugestão enviada.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
      } else {
        Notify.create({
          message: 'Ocorreu um erro. Nome do contato é obrigatório.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    async removeSugestao (idSugestao, titulo) {
      this.$q
        .dialog({
          title: 'Confirmação de exclusão',
          message: 'Sugestão: ' + titulo,
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
            url: `/delSugestao/${idSugestao}`
          }
          this.$axios(axiosConfig.url, axiosConfig)
            .then((R) => R.data)
            .catch(this.AxiosCatch)
          this.carrega()
          Notify.create({
            message: 'Sugestão removida.',
            position: 'bottom',
            color: 'red',
            timeout: 2800
          })
          this.carrega()
        })
        .onCancel(() => {})
    },
    concluirSugestao (idSugestao, titulo) {
      this.$q
        .dialog({
          title: 'Confirmar conclusão',
          message: '<b>Sugestão: </b>' + titulo,
          persistent: false,
          html: true,
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
          const axiosConfig = {
            method: 'put',
            url: `/sugestao/${idSugestao}`
          }
          this.$axios(axiosConfig.url, axiosConfig)
            .then((R) => R.data)
            .catch(this.AxiosCatch)
          this.carrega()
          Notify.create({
            message: 'Sugestão concluida.',
            position: 'bottom',
            color: 'green-9',
            timeout: 2800
          })
          this.carrega()
        })
        .onCancel(() => {})
    },
    limpaCampos () {
      this.sugestao = {}
    }
  }
}
</script>
