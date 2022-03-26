/* eslint-disable */
export default class Hint {
  constructor(game, factor, sprites) {
    this.game = game
    this.factor = factor
    this.sprites = sprites
    
    this.hintDelay = 3
    this.timerHint = null
    
    this.HintAnimations = {
      show : false,
      scale: false,
      move : false,
    }
  
    this.hint = null
    this.targets = []

    this.init()
  }
  
  init = () => {
    this.#createHint()
  }
  
  #createHint = () => {
    this.hint = this.game.add.image(333, 333, 'hint')
    this.hint.anchor.set(0)
    this.#getTargetPosition()
  }
  
  #getTargetPosition = () => {
    this.sprites.forEach(sprite => {
      if (!sprite.alive) return
      this.targets.push(sprite)
    })
    
    const target = this.targets[0]
    this.game.stage.updateTransform();
    this.hint.position.set(target.centerX, target.centerY)
  }
  
  #runHintAnimate = () => {

  }
  
  #resetHintTimer = () => {

  }
}
