<template>
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
      </q-breadcrumbs>
    </div>
    <div class="row q-gutter-x-sm q-gutter-y-md">
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="link('/acp')"
        >
          <q-img src="/statics/plano.jpg">
            <div class="absolute-bottom">
              <div class="text-subtitle2">Planos ACPs</div>
            </div>
          </q-img>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="link('/planejamento')"
        >
          <q-img src="/statics/pdca.jpg">
            <div class="absolute-bottom">
              <div class="text-subtitle2">Planejamento de demandas</div>
            </div>
          </q-img>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="link('/dashboard')"
        >
          <q-img src="/statics/portal.png">
            <div class="absolute-bottom">
              <div class="text-subtitle2">Portais Web</div>
            </div>
          </q-img>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="link('/Scripts')"
        >
          <q-img src="/statics/scripts.png">
            <div class="absolute-bottom">
              <div class="text-subtitle2">Scripts</div>
            </div>
          </q-img>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="link('/cards')"
        >
          <q-img src="/statics/cards.png">
            <div class="absolute-bottom">
              <div class="text-subtitle2">Post-it</div>
            </div>
          </q-img>
        </q-card>
      </div>
    </div>
    <div class="q-pa-md q-gutter-sm q-pt-xl">
      <q-breadcrumbs class="text-grey-14" active-color="primary">
        <q-chip square icon="directions" color="blue-grey-14" text-color="white">Atalhos Diversos</q-chip>
      </q-breadcrumbs>
    </div>
    <div class="row q-gutter-x-sm q-gutter-y-md">
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="abreViagens()"
        >
          <q-img src="/statics/gpscar.png">
            <div class="absolute-bottom">
              <div class="text-subtitle2">Viagens/RDV</div>
            </div>
          </q-img>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="abreWiki()"
        >
          <q-img src="/statics/wiki.png">
            <div class="absolute-bottom">
              <div class="text-subtitle2">Wiki GOVBR Sul</div>
            </div>
          </q-img>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="abreMonitorWS()"
        >
          <q-img src="/statics/monitor.png">
            <div class="absolute-bottom">
              <div class="text-subtitle2">Monitor WSPRONIM</div>
            </div>
          </q-img>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="abreMob()"
        >
          <q-img src="/statics/mobPainel.png">
            <div class="absolute-bottom">
              <div class="text-subtitle2">CidadeMOB - Painel</div>
            </div>
          </q-img>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card
          class="my-card cursor-pointer relative-position shadow-16"
          tabindex="0"
          v-ripple
          @click="abreMobAPP()"
        >
          <q-img src="/statics/mobApp.png">
            <div class="absolute-bottom">
              <div class="text-subtitle2">CidadeMOB - APP</div>
            </div>
          </q-img>
        </q-card>
      </div>
    </div>
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
      v-model="sugestaoDialog"
      class="dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 400px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Sugestão e correção</div>
        </q-card-section>
        <q-card-section>
          <sugestaoCon />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { openURL } from 'quasar'
import resumoAcp from 'components/resumoAcp.vue'
import sugestaoCon from 'components/addSugestao.vue'
export default {
  components: {
    resumoAcp,
    sugestaoCon
  },
  data () {
    return {
      sugestaoDialog: false,
      showResumo: false
    }
  },
  methods: {
    abreMob () {
      openURL('https://painel.cidademob.com.br')
    },
    abreMobAPP () {
      openURL('https://m.cidademob.com.br')
    },
    abreMonitorWS () {
      openURL('https://admin:Gvbrs101@wspronimmonitor.govbrsul.dev/Main?id=&machine_id=&status=primary&status=warning&status=danger&crc=DUETO+-+PASSO+FUNDO&uf=')
    },
    abreWiki () {
      openURL('https://wiki.govbrsul.dev')
    },
    abreViagens () {
      openURL('http://viagens.govbr.com.br/#/login')
    },
    link (id) {
      this.$router.push(id)
    }
  }
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 99%
</style>
