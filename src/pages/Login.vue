<template>
  <q-page class="q-pa-lg">
    <div id="cxLogin" v-if="user==undefined" vertical-bottom style="margin-top: 200px; display: none;">
      <section id="firebaseui-auth-container"></section>
    </div>
  </q-page>
</template>

<script>
import firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  data () {
    return {
      user: null
    }
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$q.loading.show()
        // hiding in 2s
        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
        }, 1000)
        this.$router.push({ name: 'planejamento' })
      } else {
        this.$q.loading.show()
        // hiding in 2s
        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
        }, 1000)
        document.getElementById('cxLogin').style.display = 'block'
        this.$router.push({ name: 'login' })
      }
    })
  },
  methods: {
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
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
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
}
</script>
