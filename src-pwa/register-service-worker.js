import { register } from 'register-service-worker'
import { Notify } from 'quasar'
// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register('firebase-messaging-sw.js', {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (/* registration */) {

  },

  registered (/* registration */) {
  },

  cached (/* registration */) {

  },

  updatefound (registration) {
    Notify.create({
      message: 'Por Favor aguarde. Atualização em andamento...',
      color: 'red-9',
      timeout: 0,
      position: 'top'
    })
  },

  updated (registration) {
    setTimeout(() => {
      window.location.reload(true)
    }, 3000)
  },

  offline () {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  error (/* err */) {
    // console.error('Error during service worker registration:', err)
  }
})
