export default class Sprite {
  constructor(
    game, x, y, anchor, name, disabled = false,
    initAngle, finishAngle, isComplete
  ) {
    this.game = game
    this.positionPartX = x
    this.positionPartY = y
    this.anchor = anchor
    this.anchorX = this.anchor[0]
    this.anchorY = this.anchor[1]
    this.spriteName = name
    this.disabled = disabled
    this.initAngle = initAngle
    this.finishAngle = finishAngle
    this.isComplete = isComplete
    
    this.block = null
    
    this.init()
  }
  
  init = () => {
    this.#createBlock()
  
  }
  
  #createBlock = () => {
    this.block = this.game.make.image(this.positionPartX, this.positionPartY, this.spriteName)
  
    this.block.inputEnabled = true
    this.block.anchor.set(...this.anchor)

    this.block.alpha = 1

    this.game.world.add(this.block)
    this.#initEvents()

    return this.block
  }
  
  #initEvents = () => {
    this.block.events.onInputDown.add(this.#onTouchStart)
  }
  
  #onTouchStart = (sprite, pointer) => {
    this.block.isPressed = true
    
    console.log('click')
  }
}
