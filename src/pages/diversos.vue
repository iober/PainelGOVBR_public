<template>
  <div class="q-pa-lg q-gutter-md">
    <q-btn @click="senhasDialog = true" label="Senhas de acesso" color="teal-8" icon-right="vpn_key"/>
    <q-btn @click="ftpDialog = true" label="Listar FTP" color="light-blue-8" icon-right="dns"/>
    <q-btn @click="sugestaoDialog = true" label="Sugestões" icon-right="support_agent" color="red-6"/>
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

    <q-dialog
      v-model="senhasDialog"
      class="dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Senhas</div>
        </q-card-section>
        <q-card-section>
          <senhasCon />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="ftpDialog"
      class="dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 700px; max-width: 400vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Conferência Backup FTP</div>
        </q-card-section>
        <q-card-section>
          <ftpCon />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import sugestaoCon from 'components/addSugestao.vue'
import senhasCon from 'components/senhasSistemas.vue'
import ftpCon from 'components/ftpList.vue'
export default {
  components: {
    sugestaoCon,
    senhasCon,
    ftpCon
  },
  data () {
    return {
      senhasDialog: false,
      sugestaoDialog: false,
      ftpDialog: false
    }
  },
  methods: {
  }
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 99%
</style>
