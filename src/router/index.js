import Vue from 'vue'
import Router from 'vue-router'
import VillainView from '@/components/VillainView'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'VillainView',
        component: VillainView
    }]
})
