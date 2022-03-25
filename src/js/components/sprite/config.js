const randomPos = (min = 100, max = 1166) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const spriteNames = {
  skeleton1: 'skeleton1',
  skeleton2: 'skeleton2',
  skeleton3: 'skeleton3',
  skeleton4: 'skeleton4',
  skeleton5: 'skeleton5',
  skeleton6: 'skeleton6',
}

const SPRITES_COUNT = Object.keys(spriteNames).length

const spriteParams = [
  {
    _name      : spriteNames.skeleton1,
    isDisabled : false,
    x          : 100,
    y          : 200,
    anchor     : [0.5, 0.5],
    initAngle  : 0,
    finishAngle: 0,
    isComplete : false,
  },
  {
    _name      : spriteNames.skeleton2,
    isDisabled : false,
    x          : 600,
    y          : 200,
    anchor     : [0.55, 0],
    initAngle  : 50,
    finishAngle: 0,
    isComplete : false,
  },
  {
    _name      : spriteNames.skeleton3,
    isDisabled : false,
    x          : 1300,
    y          : 100,
    anchor     : [1, 0],
    initAngle  : 75,
    finishAngle: 0,
    isComplete : false,
  },
  {
    _name      : spriteNames.skeleton4,
    isDisabled : false,
    x          : 400,
    y          : 900,
    anchor     : [1, 0.599],
    initAngle  : 80,
    finishAngle: 0,
    isComplete : false,
  },
  {
    _name      : spriteNames.skeleton5,
    isDisabled : false,
    x          : 800,
    y          : 900,
    anchor     : [1, 0.65],
    initAngle  : 120,
    finishAngle: 0,
    isComplete : false,
  },
  {
    _name      : spriteNames.skeleton6,
    isDisabled : false,
    x          : 1200,
    y          : 1000,
    anchor     : [1, 0.65],
    initAngle  : 120,
    finishAngle: 0,
    isComplete : false,
  },
]

export {
  SPRITES_COUNT,
  spriteParams,
  spriteNames
}
