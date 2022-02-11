<template>
  <q-page class="flex justify-center q-pa-md">
    <q-card class="full-width login-card shadow-5">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Registrar" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="login">
            <login-register :tab="tab" />
          </q-tab-panel>

          <q-tab-panel name="register">
            <login-register :tab="tab" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>

import LoginRegister from 'components/LoginRegister'

export default {
  components: {
    LoginRegister
  },
  data () {
    return {
      tab: 'login'
    }
  }
}
</script>
