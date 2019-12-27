import { shallowMount } from '@vue/test-utils'
import PolyominoCell from '@/components/PolyominoCell.vue'

describe('PolyominoCell.vue', () => {
  it('renders props.msg when passed', () => {
    const filled = true;
    const wrapper = shallowMount(PolyominoCell, {
      propsData: { filled }
    })
    expect(wrapper.exists()).toBeTruthy();
  })
})
