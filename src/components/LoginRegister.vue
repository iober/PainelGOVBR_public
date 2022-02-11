<template>
  <div>
    <div align="center">
      <img stretch flat src="../statics/govsul.png" style="margin-left: 15px" />
    </div>
    <q-form @submit="submitForm">
      <div class="row">
        <div class="col-12 q-pa-sm">
          <q-input
            v-if="tab == 'register'"
            v-model="formData.name"
            class="q-mb-md"
            :rules="[(val) => !!val || 'Campo obrigatório!']"
            label="Nome"
          />
        </div>
        <div class="col-12 q-pa-sm" :class="tab == 'register' && 'col-md-6'">
          <q-input
            v-model="formData.email"
            class="q-mb-md"
            type="email"
            :rules="[
              (val) => !!val || 'Campo obrigatório!',
              (val) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido!',
            ]"
            label="E-mail"
          />
        </div>
        <div class="col-12 col-md-6 q-pa-sm">
          <q-input
            v-if="tab == 'register'"
            v-model="formData.emailConfirmation"
            class="q-mb-md"
            :rules="[
              (val) => val === formData.email || 'Os E-mails dever sem iguais!',
            ]"
            label="Confirmar e-mail"
          />
        </div>
        <div class="col-12 q-pa-sm" :class="tab == 'register' && 'col-md-6'">
          <q-input
            v-model="formData.password"
            class="q-mb-md"
            type="password"
            :rules="[
              (val) => !!val || 'Campo obrigatório!',
              (val) =>
                (val.length >= 6 && val.length <= 20) ||
                'Entre 6 e 20 caracteres!',
            ]"
            label="Senha"
          />
        </div>
        <div class="col-12 col-md-6 q-pa-sm">
          <q-input
            v-if="tab == 'register'"
            v-model="formData.passwordConfirmation"
            class="q-mb-md"
            type="password"
            :rules="[
              (val) => val === formData.password || 'A senha deve ser igual!',
            ]"
            label="Confirmar senha"
          />
        </div>
      </div>
      <div class="row justify-center">
        <q-space v-show="tab == 'register'" />
        <q-btn color="primary" type="submit" :label="tab" />       
      </div>
      <div v-show="tab == 'login'" class="row justify-center">
        <!-- <q-space /> -->
        <q-btn
          flat
          color="primary"
          @click="recoverDialog = true"
          class="q-mt-md"
          label="Esqueci a senha"
        />
      </div>
      <section v-if="tab == 'login'" id="firebaseui-auth-container" flat></section>
    </q-form>
    <q-dialog v-model="recoverDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Informe seu e-mail</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="emailRecover"
            autofocus
            :rules="[
              (val) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
                'Invalid email format!',
            ]"
            @keyup.enter="recoverDialog = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            :disable="!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRecover)"
            flat
            label="Recuperar"
            @click="sendRecoverEmail"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
export default {
  props: {
    tab: {
      type: String,
      default: "login",
    },
  },
  data() {
    return {
      user: null,
      googleAcesso: false,
      recoverDialog: false,
      emailRecover: "",
      formData: {
        name: "",
        email: "",
        emailConfirmation: "",
        password: "",
        passwordConfirmation: "",
      },
    };
  },
  
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$q.loading.show()
        // hiding in 2s
        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
        })        
      } else {
        this.$q.loading.show()
        // hiding in 2s
        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
        })
      }
    })
  },
  methods: {
    ...mapActions("auth", [
      "registerUser",
      "loginUser",
      "loginUserWithGoogleAuth",
      "loginUserWithFacebookAuth",
      "recoverPasswordWithEmail",
    ]),
    submitForm() {
      if (this.tab == "login") {
        this.loginUser(this.formData);
      } else if (this.tab == "register") {
        this.registerUser(this.formData);
      }
    },
    loginWithFacebook() {
      this.loginUserWithFacebookAuth();
    },
    loginWithGoogle() {
      this.loginUserWithGoogleAuth();
    },
    sendRecoverEmail() {
      this.recoverPasswordWithEmail({ email: this.emailRecover });
      this.emailRecover = "";
    },
    login () {
      var vm = this
      let ui = firebaseui.auth.AuthUI.getInstance()
      if (!ui) {
        ui = new firebaseui.auth.AuthUI(firebase.auth())
      }
      // var ui = new firebaseui.auth.AuthUI(firebase.auth());
      var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            vm.user = authResult.user
            firebase
              .auth()
              .currentUser.updateProfile()
              .then(res => {
                vm.$router.go()
              })
          },
          signInFailure: function (error) {
            console.log('signInFailure', error)
            alert(error.message)
            vm.$router.go()
          }
        },
        autoUpgradeAnonymousUsers: true,
        // signInFlow: "popup",
        // signInSuccessUrl: "/#/todo",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
      }
      ui.start('#firebaseui-auth-container', uiConfig)
    },
    logout () {
      var vm = this
      this.user = undefined
      if (!firebase.auth().currentUser) {
        alert('signOut 1', this.user)
        return
      }
      firebase
        .auth()
        .signOut()
        .then(function (res) {
          vm.login()
        })
        .catch(function (error) {
          console.log(error)
        })
    }    
  },
    mounted () {
    this.login()
  }
};
</script>

<style lang="scss">
.login-card {
  max-width: 600px;
}
</style>
