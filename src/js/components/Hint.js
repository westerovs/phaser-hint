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
  constructor(game, factor, sprites, targetKey = null) {
    this.game = game
    this.factor = factor
    this.sprites = sprites
    
    this.hint = null
    this.hintTargets = []
    
    this.hintDelay = 2
    this.timerHint = null
    this.hintAnimations = null
  
    this.hintIsDestroyed = false
    this.targetKey = targetKey
    this.init()
  }
  
  init = () => {
    this.#createHint()
    this.#runHintAnimate()
  
    this.#initSignals()
    this.#targetTouchAction()
  }
  
  destroyHint = () => {
    console.warn('Hint was destroyed')
    this.hintIsDestroyed = true
    
    this.hint.destroy()
    this.hint = null
  
    this.#stopAnimation()
  }
  
  #initSignals = () => {
    this.game.onTouchStartAction = new Phaser.Signal()
    this.game.onHintDestroy = new Phaser.Signal()
    
    this.game.onHintDestroy.add(this.destroyHint)
  }
  
  #createHint = () => {
    this.#getAliveTargets()
    
    const {x, y} = this.#getTargetPosition()
    
    this.hint = this.game.add.image(x, y, 'hint')
    this.hint.alpha = 0
  }
  
  #targetTouchAction = () => {
    this.game.onTouchStartAction.add((target) => {
      target.alive = false
      
      // если нет целей, то kill hint
      const countTargets = this.#getAliveTargets()
      if (countTargets <= 0) {
        this.game.onHintDestroy.dispatch(this.destroyHint)
        return
      }
      
      this.hint.alpha = 0
      this.#updateTargetPosition()
      this.#checkAndReverseHintPosition()
      this.#restartTween()
    })
  }
  
  #getAliveTargets = () => {
    this.hintTargets = []
    
    // проверка, был ли указан ключ при создании HINT
    if (this.targetKey !== null) {
      this.sprites.find(sprite => {
        if (sprite.key === this.targetKey) {
          this.hintTargets.push(sprite)
          this.targetKey = null
        }
      })
    } else {
      this.sprites.forEach(sprite => {
        if (!sprite.alive) return
        this.hintTargets.push(sprite)
      })
    }
    
    return this.hintTargets.length
  }
  
  #getTargetPosition = () => {
    if (this.hintTargets.length === 0) return {x: null, y: null}
  
    const target = this.hintTargets[0]
    const {centerX: x, centerY: y} = target
  
    return {x, y}
  }
  
  #updateTargetPosition = () => {
    const {x, y} = this.#getTargetPosition()
    if (this.hintTargets.length === 0) return
    
    this.hint.position.set(x, y)
  }
  
  #checkAndReverseHintPosition = () => {
    // ↓ пересчитывает последний update кадр мира, для получения world position
    this.game.stage.updateTransform()
    this.hint.scale.set(this.factor)
  
    if ((this.hint.worldPosition.x + this.hint.width) > this.game.width) {
      this.hint.scale.x = -this.factor
    }
    if ((this.hint.worldPosition.y + this.hint.height) > this.game.height) {
      this.hint.scale.y = -this.factor
    }
  }
  
  #runHintAnimate = () => {
    this.game.time.events.add(Phaser.Timer.SECOND * this.hintDelay, () => {
      if (this.hint === null) return
  
      this.hint.alpha = 1
      
      this.hintAnimations = AnimationType.scale(this.game, this.hint, this.factor)
      this.hintAnimations.start()
    })
  
    return this.hintAnimations
  }
  
  #stopAnimation = () => {
    if (this.hintAnimations && this.hintAnimations.isRunning) {
      this.hintAnimations.stop()
      this.game.tweens.remove(this.hintAnimations)
      this.hintAnimations = null
    }
  }
  
  #restartTween = () => {
    console.log('restart')
    this.#stopAnimation()
    this.#runHintAnimate()
  }
}
