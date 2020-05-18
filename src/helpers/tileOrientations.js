const tileOrientations = [
  {
    id: 1,
    positions: [
      {
        stateId: 1,
        default_state: 'state_1',
        clockwise: 'state_2',
        counterclockwise: 'state_4'
      },
      {
        stateId: 2,
        default_state: 'state_2',
        clockwise: 'state_3',
        counterclockwise: 'state_1'
      },
      {
        stateId: 3,
        default_state: 'state_3',
        clockwise: 'state_4',
        counterclockwise: 'state_2',
      },
      {
        stateId: 4,
        default_state: 'state_4',
        clockwise: 'state_1',
        counterclockwise: 'state_3'
      }
    ]
  }
]

export default tileOrientations;