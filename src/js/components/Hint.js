/* eslint-disable */
export default class Hint {
  constructor(game, factor, sprites) {
    this.game = game
    this.factor = factor
    this.sprites = sprites
    
    this.hintAnimations = null
    
    this.hint = null
    this.hintDelay = 1
    this.timerHint = null
    this.targets = []

    this.init()
  }
  
  init = () => {
    this.#createHint()
    this.#initSignals()
  }
  
  destroyHint = () => {
    setTimeout(() => {
      this.game.tweens.remove(this.hintAnimations)
      this.hint.destroy()
      this.hint = null
      console.log(this.hintAnimations)
    }, 1000)
  }
  
  #initSignals = () => {
    this.game.onTouchStartAction = new Phaser.Signal()
  
    this.game.onTouchStartAction.add((target) => {
      target.alive = false
      this.#getTargetPosition()
    })
  }
  
  #createHint = () => {
    this.hint = this.game.add.image(333, 333, 'hint')
    this.hint.anchor.set(0)
    this.hint.alpha = 0

    this.#getTargetPosition()
    this.#runHintAnimate()
  }
  
  #getTargetPosition = () => {
    this.targets = []
    
    this.sprites.forEach(sprite => {
      if (!sprite.alive) return
      this.targets.push(sprite)
    })
    
    if (this.targets.length === 0) return
    
    const target = this.targets[0]
    // ↓ пересчитывает последний кадр мира, для получения world position
    this.game.stage.updateTransform();
    this.hint.position.set(target.centerX, target.centerY)
  }
  
  #runHintAnimate = () => {
    this.hintAnimations = this.game.add.tween(this.hint.scale)
      .to({
        x: this.hint.scale.x * 0.95,
        y: this.hint.scale.y * 0.95,
      }, Phaser.Timer.QUARTER, Phaser.Easing.Power5, false, 1000 * this.hintDelay).yoyo(true)
      .yoyo(true)
      .repeat(2)
  
    this.hintAnimations.start()
      .onComplete.add(() => {
        console.log('complete anim')
        this.#getTargetPosition()
      })
  
    return this.hintAnimations
  }
  
  #resetHintTimer() {
    if (this.timerHint) {
      console.log('destroy timer')
      this.timerHint.destroy()
    }
    
    // таймер на 3 секунды
    this.timerHint = this.game.time.create(false)
    this.timerHint.loop(Phaser.Timer.SECOND * 3, () => {
      console.log('loop timer')
      // if (this.game.input.activePointer.isDown) return
      // this.createHintHand()
    })
    this.timerHint.start()
  }
  
  #pauseHint = () => {
    this.hintAnimations.pause()
  }
  
  #resumeHint = () => {
    this.hintAnimations.resume()
  }
}
