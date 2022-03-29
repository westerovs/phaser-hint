/* eslint-disable */

const AnimationType = {
  scale: (game, hint, factor) => {
    return game.add.tween(hint.scale)
      .to({
        x: (hint.scale.x * 0.95) * factor,
        y: (hint.scale.y * 0.95) * factor,
      }, Phaser.Timer.QUARTER, Phaser.Easing.Power5, false).yoyo(true)
      .yoyo(true)
      .repeat(-1)
  }
}

export default class Hint {
  constructor(game, factor, sprites) {
    this.game = game
    this.factor = factor
    this.sprites = sprites
    
    this.hint = null
    this.hintDelay = 0
    this.timerHint = null
    this.hintAnimations = null
  
    this.init()
  }
  
  init = () => {
    this.#createHint()
    this.#runHintAnimate()
  
    this.#initSignals()
    this.#targetTouchAction()
  }
  
  destroyHint = () => {
    console.log('destroyHint')
    
    this.game.tweens.remove(this.hintAnimations)
    this.hint.destroy()
    this.hint = null
  }
  
  #initSignals = () => {
    this.game.onTouchStartAction = new Phaser.Signal()
  }
  
  #targetTouchAction = () => {
    this.game.onTouchStartAction.add((target) => {
      target.alive = false
      this.#getTargetPosition()
      this.#restartTween()
    })
  }
  
  #createHint = () => {
    this.hint = this.game.add.image(null, null, 'hint')
    this.hint.anchor.set(0)
    this.hint.alpha = 0

    this.#getTargetPosition()
  }
  
  #getTargetPosition = () => {
    this.hint.alpha = 0

    this.game.time.events.add(Phaser.Timer.SECOND * this.hintDelay, () => {
      this.hint.alpha = 1
  
      const hintTargets = []
  
      this.sprites.forEach(sprite => {
        if (!sprite.alive) return
        hintTargets.push(sprite)
      })
  
      if (hintTargets.length === 0) {
        this.destroyHint()
        return
      }
  
      const target = hintTargets[0]
      this.hint.position.set(target.centerX, target.centerY)
      
      // ↓ пересчитывает последний update кадр мира, для получения world position
      this.game.stage.updateTransform()
      // this.hint.scale.set(this.factor)
      this.hint.scale.x = this.factor
      
      // if (this.hint.worldPosition.x + this.hint.width > this.game.width) {
      //   console.log('x', this.hint.worldPosition.x + this.hint.width > this.game.width)
      //   this.hint.scale.x = -this.factor
      // }
      // if (this.hint.worldPosition.y + this.hint.height > this.game.height) {
      //   console.log('y', this.hint.worldPosition.x + this.hint.width > this.game.width)
      //   this.hint.scale.y = -this.factor
      // }
      // else {
      //   console.log('else')
      //   this.hint.scale.set(this.factor)
      // }
  
    })

  }
  
  #runHintAnimate = () => {
    this.game.time.events.add(Phaser.Timer.SECOND * this.hintDelay, () => {
      if (this.hint === null) return
      this.hint.alpha = 1
      
      // this.hintAnimations = AnimationType.scale(this.game, this.hint, this.factor)
      // this.hintAnimations = this.game.add.tween(this.hint.scale)
      //   .to({
      //     x: (this.hint.scale.x * 0.95) * this.factor,
      //     y: (this.hint.scale.y * 0.95) * this.factor,
      //   }, Phaser.Timer.QUARTER, Phaser.Easing.Power5, false).yoyo(true)
      //   .yoyo(true)
      //   .repeat(-1)
  
      this.hintAnimations = this.game.add.tween(this.hint)
        .to({
          angle: 90,
        }, Phaser.Timer.SECOND * 2, Phaser.Easing.Power5, false).yoyo(true)
        .yoyo(true)
        .repeat(-1)
      this.hintAnimations.start()
    })
  
    return this.hintAnimations
  }
  
  // #resetHintTimer() {
  //   if (this.timerHint) {
  //     console.log('destroy timer')
  //     this.timerHint.destroy()
  //   }
  //
  //   // таймер на 3 секунды
  //   this.timerHint = this.game.time.create(false)
  //   this.timerHint.loop(Phaser.Timer.SECOND * 3, () => {
  //     console.log('loop timer')
  //     // if (this.game.input.activePointer.isDown) return
  //     // this.createHintHand()
  //   })
  //   this.timerHint.start()
  // }
  
  #pauseHint = () => {
    this.hintAnimations.pause()
  }
  
  #resumeHint = () => {
    this.hintAnimations.resume()
  }
  
  #restartTween = () => {
    console.log('restart')
  
    // this.hint.scale.set(this.factor)
    this.#runHintAnimate()
  }
}
