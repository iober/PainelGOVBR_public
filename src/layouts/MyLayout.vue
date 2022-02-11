<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <div class="q-gutter-y-md column">
        <q-toolbar class="bg-primary text-white shadow-2 rounded-borders">
          <q-btn
            flat
            @click="drawer = !drawer"
            round
            dense
            icon="menu"
            v-if="userDetails.userId"
          />

          <q-separator
            dark
            vertical
            inset
            style="margin-left: 10px"
            v-if="userDetails.userId"
          />
          <img
            stretch
            flat
            src="../statics/logo.png"
            width="50px"
            style="margin-left: 15px"
          />
          <q-btn
            style="pointer-events: none"
            stretch
            flat
            label="Painel GOVBR"
          />
          <q-space />
          <div class="absolute-right q-pr-lg q-pl-lg q-pt-sm q-gutter-md">
              <img :src="photo" style="border-radius: 50%; width:34px;" class="cursor-pointer">
            <q-menu transition-show="flip-right" transition-hide="flip-right" class="mDark">
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-toggle
                    v-model="dark"
                    @input="darkMode()"
                    color="dark"
                    label="Modo Noturno"
                  />
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-btn
                    stack push
                    color="primary"
                    label="Logout"
                    size="sm"
                    v-close-popup
                    @click="logoutUser"
                  />
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </q-toolbar>
      </div>
    </q-header>
    <q-drawer
      v-if="userDetails.userId"
      show-if-above
      v-model="drawer"
      :mini="miniState"
      mini-to-overlay
      :width="200"
      :breakpoint="500"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      content-class="bg-grey-3"
    >
      <q-scroll-area
        class="fit"
        flat
        :style="this.dark == true ? 'backgroundColor:black; color:white' : ''"
      >
        <q-list>
          <q-item clickable to="/index" @click="mobileTest()">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section> Home </q-item-section>
          </q-item>
          <q-item clickable to="/acp" @click="mobileTest()">
            <q-item-section avatar>
              <q-icon name="date_range" />
            </q-item-section>
            <q-item-section> ACPs </q-item-section>
          </q-item>
          <q-item clickable to="/planejamento" @click="mobileTest()">
            <q-item-section avatar>
              <q-icon name="pending_actions" />
            </q-item-section>
            <q-item-section> Demandas </q-item-section>
          </q-item>
          <q-item clickable to="/contatos" @click="mobileTest()">
            <q-item-section avatar>
              <q-icon name="perm_contact_calendar" />
            </q-item-section>
            <q-item-section> Contatos </q-item-section>
          </q-item>
          <q-item clickable to="/visita" @click="mobileTest()">
            <q-item-section avatar>
              <q-icon name="business_center" />
            </q-item-section>
            <q-item-section> Visitas </q-item-section>
          </q-item>
          <q-item clickable to="/dashboard" @click="mobileTest()">
            <q-item-section avatar>
              <q-icon name="web" />
            </q-item-section>
            <q-item-section> Portais Web</q-item-section>
          </q-item>
          <q-item clickable to="/scripts" @click="mobileTest()">
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section> Scripts</q-item-section>
          </q-item>
          <q-item clickable to="/cards" @click="mobileTest()">
            <q-item-section avatar>
              <q-icon name="sticky_note_2" />
            </q-item-section>
            <q-item-section> Post-it </q-item-section>
          </q-item>
          <q-item clickable to="/diversos" @click="senhasDialog = true">
            <q-item-section avatar>
              <q-icon name="more_horiz" />
            </q-item-section>
            <q-item-section> Diversos</q-item-section>
          </q-item>
          <q-separator />
          <q-item
            clickable
            @click="
              abreViagens();
              mobileTest();
            "
          >
            <q-item-section avatar>
              <q-icon name="directions_car" />
            </q-item-section>
            <q-item-section> Viagens/RDV </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="
              abreWiki();
              mobileTest();
            "
          >
            <q-item-section avatar>
              <q-icon name="public" />
            </q-item-section>
            <q-item-section> Wiki GovbrSul </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="
              abreMonitorWS();
              mobileTest();
            "
          >
            <q-item-section avatar>
              <q-icon name="track_changes" />
            </q-item-section>
            <q-item-section> Monitor WS </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="
              abreMob();
              mobileTest();
            "
          >
            <q-item-section avatar>
              <q-icon name="desktop_mac" />
            </q-item-section>
            <q-item-section> Painel MOB </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="
              abreMobAPP();
              mobileTest();
            "
          >
            <q-item-section avatar>
              <q-icon name="phone_android" />
            </q-item-section>
            <q-item-section> APP MOB </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const stringOptions = []
import firebase from 'firebase'
import { mapState, mapActions } from 'vuex'
import { openURL, date } from 'quasar'
export default {
  name: 'MyLayout',
  data () {
    return {
      dark: false,
      options: stringOptions,
      drawer: true,
      miniState: true,
      user: null,
      dataLog: new Date(),
      data: this.data,
      photo: '',
      dados: {
        sistema: '',
        nmClienteDemanda: '',
        prioridade: '',
        previsao: '',
        resumo: '',
        atividade: '',
        observacoes: '',
        dataInclusao: '',
        usuario: '',
        dataprevisao: ''
      },
      log: {
        dtLog: '',
        idUser: ''
      }
    }
  },
  created () {
    if (this.$route.query.id !== undefined) {
      this.compartilhada()
    }
    firebase.auth().onAuthStateChanged((user) => {
      this.photo = user.photoURL
      if (!user.photoURL) {
        console.log('null')
        this.photo = 'statics/login.png'
      }
      if (user) {
        this.user = user
        if (this.$q.platform.is.mobile) {
          this.drawer = false
          this.miniState = false
        }
        let timeStamp = Date.now()
        this.log.dtLog = date.formatDate(timeStamp, 'DD/MM/YYYY HH:mm')
        this.log.idUser = this.user.email
        const axiosConfig = {
          method: 'post',
          url: `/log/`,
          data: this.log
        }
        this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
      }
    })
  },
  computed: {
    ...mapState('auth', ['userDetails'])
  },
  methods: {
    compartilhada () {
      this.$axios
        .get(`${process.env.API}/compartilhada/` + this.$route.query.id)
        .then((response) => {
          this.data = response.data
          this.data.forEach((value, index) => {
            this.$q.dialog({
              message: '  <b>Equipe: </b>' + value.sistema +
                        '<br> <b>Cliente: </b>' + value.nmClienteDemanda +
                        '<br> <b>Prioridade: </b>' + value.prioridade +
                        '<br> <b>Previsão: </b>' + value.previsao +
                        '<br> <b>Resumo: </b>' + value.resumo +
                        '<br> <b>Atividade: </b>' + value.atividade +
                        '<br> <b>Observações: </b>' + value.observacoes +
                        '<br> <b>Data demanda: </b>' + value.dataInclusao +
                        '<br> <b>Prevista para: </b>' + value.dataprevisao +
                        '<br> <b>Cadastrada por: </b>' + value.usuario,
              persistent: false,
              html: true,
              ok: {
                push: true,
                label: 'Fechar'
              }
            }).onOk(() => {
            })
          })
        })
    },
    ...mapActions('auth', ['logoutUser']),
    mobileTest () {
      if (this.$q.platform.is.mobile) {
        this.drawer = false
      }
    },
    darkMode () {
      if (this.dark === true) {
        this.$q.dark.set(true)
      } else {
        this.$q.dark.set(false)
      }
    },
    abreMob () {
      openURL('https://painel.cidademob.com.br')
    },
    abreMobAPP () {
      openURL('https://m.cidademob.com.br')
    },
    abreMonitorWS () {
      openURL('https://wspronimmonitor.govbrsul.dev')
    },
    abreWiki () {
      openURL('https://wiki.govbrsul.dev')
    },
    abreViagens () {
      openURL('http://viagens.govbr.com.br/#/login')
    },
    drawerClick (e) {
      if (this.miniState) {
        this.miniState = false
        e.stopPropagation()
      }
    }
  }
}
</script>

<style>
.none {
  display: none;
}
.image_input_button {
  font-size: 25px;
}
</style>
