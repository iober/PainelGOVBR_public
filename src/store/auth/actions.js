/* eslint-disable no-empty-pattern */
import { firebase, firebaseAuth, firebaseDb } from 'boot/firebase'
import { Notify } from 'quasar'

export function loginUser ({}, payload) {
  firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      notifySuccess('Bem-Vindo!')
    })
    .catch(error => {
      notifyError(error.message)
    })
}

export function loginUserWithGoogleAuth () {
  var provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')
  firebaseAuth.signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token.
    // var token = result.credential.accessToken
    // The signed-in user info.
    var user = result.user
    generateUserBase({ name: user.displayName, email: user.email })
    notifySuccess('Bem-Vindo!')
  })
    .catch(error => {
    // linked to the email:
    // var email = error.email
    // The provider's credential:
    // var credential = error.credential
      notifyError(error.message)
    })
}

export function loginUserWithFacebookAuth () {
  var provider = new firebase.auth.FacebookAuthProvider()
  // provider.addScope('name')
  // provider.addScope('email')
  firebaseAuth.signInWithPopup(provider).then(function (result) {
    // This gives you a Facebook Access Token.
    // var token = result.credential.accessToken
    // The signed-in user info.
    var user = result.user
    generateUserBase({ name: user.fullName, email: user.email })
    notifySuccess('Bem-Vindo!')
  })
    .catch(error => {
    // linked to the email:
    // var email = error.email
    // The provider's credential:
    // var credential = error.credential
      notifyError(error.message)
    })
}

export function registerUser ({}, payload) {
  firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      generateUserBase(payload)
      notifySuccess('Usuário cadastrado com sucesso!')
    })
    .catch(error => {
      notifyError(error.message)
    })
}

export function recoverPasswordWithEmail ({}, payload) {
  firebaseAuth.sendPasswordResetEmail(payload.email).then(response => {
    notifySuccess('E-mail de recuperação enviado com sucesso. Verifique.')
  })
    .catch(error => {
      notifyError(error.message)
    })
}

export function handleAuthStateChange ({ commit, dispatch, state }) {
  firebaseAuth.onAuthStateChanged(user => {
    if (user) {
      let userId = firebaseAuth.currentUser.uid
      firebaseDb.ref('users/' + userId).once('value', snapshot => {
        let userDetails = snapshot.val()
        commit('setUserDetails', {
          userId: userId,
          name: userDetails.name,
          email: userDetails.email
        })
      })
      dispatch('firebaseUpdateUser', {
        userId: userId,
        updates: {
          online: true
        }
      })
      this.$router.push('/index')
    } else {
      dispatch('firebaseUpdateUser', {
        userId: state.userDetails.userId,
        updates: {
          online: false
        }
      })
      commit('setUserDetails', {})
      this.$router.replace('/auth')
    }
  })
}

export function logoutUser () {
  firebaseAuth.signOut()
}

export function firebaseUpdateUser ({}, payload) {
  if (payload.userId) {
    firebaseDb.ref('users/' + payload.userId).update(payload.updates)
  }
}

function generateUserBase (payload) {
  let userId = firebaseAuth.currentUser.uid
  firebaseDb.ref('users/' + userId).set({
    displayName: payload.name,
    email: payload.email,
    online: true
  })
}

function notifySuccess (message) {
  Notify.create({
    message: message,
    type: 'positive',
    timeout: 2500
  })
}

function notifyError (message) {
  Notify.create({
    message: message,
    type: 'negative',
    timeout: 4000
  })
}
