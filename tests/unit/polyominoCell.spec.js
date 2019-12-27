import { shallowMount } from '@vue/test-utils'
import PolyominoCell from '@/components/PolyominoCell.vue'

describe('PolyominoCell.vue', () => {
  it('renders props.msg when passed', () => {
    const filled = true;
    const wrapper = shallowMount(PolyominoCell, {
      propsData: { filled }
    })
    expect(wrapper.exists()).toBeTruthy();

    let tile = wrapper.find('.polyomino-tile');
    expect(tile.contains('.polyomino-tile--filled')).toBeTruthy();
  })

  it('renders props.msg when passed', () => {
    const filled = false;
    const wrapper = shallowMount(PolyominoCell, {
      propsData: { filled }
    })
    expect(wrapper.exists()).toBeTruthy();

    let tile = wrapper.find('.polyomino-tile');
    expect(tile.contains('.polyomino-tile--filled')).toBeFalsy();
  })
})
