/* eslint-disable */

const AnimationType = {
  scale: (game, hint) => {
    return game.add.tween(hint.scale)
      .to({
        x: hint.scale.x * 0.95,
        y: hint.scale.y * 0.95,
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
    this.hintDelay = 1
    this.timerHint = null
    this.hintAnimations = null
  
    this.init()
  }
  
  init = () => {
    this.#createHint()
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
      console.log('onTouchStartAction1')
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
      // ↓ пересчитывает последний кадр мира, для получения world position
      this.game.stage.updateTransform();
      this.hint.position.set(target.centerX, target.centerY)
    })

  }
  
  #runHintAnimate = () => {
    this.game.time.events.add(Phaser.Timer.SECOND * this.hintDelay, () => {
      this.hint.alpha = 1
      
      this.hintAnimations = AnimationType.scale(this.game, this.hint)
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
}
