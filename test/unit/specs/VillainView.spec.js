import Vue from 'vue'
import VillainView from '@/components/VillainView'

describe('VillainView.vue', () => {
  it('should render correct contents', () => {
    expect(app.$mount($el.querySelector('.nav-toggle')).textContent)
      .toEqual('<<')
  })
})
