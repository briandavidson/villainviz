// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App'
import router from './router'
import firebase from 'firebase'
import 'firebase/firestore'
import 'typeface-roboto'

Vue.use(VueFire)
// Vue.use(VueFeatherIcon)
Vue.config.productionTip = false

let unsubscribe = firebase.initializeApp({
    apiKey: 'AIzaSyDAzAv_jSCwTlwCzwemrDrBG6lV1v_PS2U',
    authDomain: 'villainviz-74b9d.firebaseapp.com',
    databaseURL: 'https://villainviz-74b9d.firebaseio.com/',
    projectId: 'villainviz-74b9d'
}).auth().onAuthStateChanged(() => {
    /* eslint no-new: "error" */
    var app = new Vue({
        el: '#app',
        template: '<App/>',
        components: {
            App
        },
        router
    })
    unsubscribe()
    if (app) {}
})

let db = firebase.database()
export default db
