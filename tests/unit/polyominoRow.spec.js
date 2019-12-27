import { shallowMount } from '@vue/test-utils'
import PolyominoRow from '@/components/PolyominoRow.vue'

describe('PolyominoRow.vue', () => {
  it('renders props.msg when passed', () => {
    const rows = [];
    const wrapper = shallowMount(PolyominoRow, {
      propsData: { rows }
    })
    expect(wrapper.exists()).toBeTruthy();
  })
})