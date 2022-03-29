/*
1 В месте, где у вас обрабатывается клик по элементу вызвать:
this.game.OnHintTouchStartAction.dispatch(sprite)

// События на которые можно подписаться:
this.game.onHintDestroy.add(() => console.log('DESTROYED'))

* */

const AnimationType = {
  scale: (game, hint, factor, duration) => {
    return game.add.tween(hint.scale)
      .to({
        x: (hint.scale.x * 0.90) * factor,
        y: (hint.scale.y * 0.90) * factor,
      }, Phaser.Timer.SECOND * duration, Phaser.Easing.Linear.None, false).yoyo(true)
      .yoyo(true)
      .repeat(-1)
  }
}

export default class Hint {
  constructor(game, factor, sprites, durationHint = 0.25, delayHint = 1, targetKey = null) {
    this.game = game
    this.factor = factor
    this.sprites = sprites
    this.durationHint = durationHint
    this.delayHint = delayHint
    this.targetKey = targetKey
    
    this.hint = null
    this.hintTargets = []
    this.hintAnimations = null
  
    this.init()
  }
  
  init = () => {
    this.#createHint()
    this.#runAnimation()
  
    this.#initSignals()
    this.#targetTouchAction()
  }
  
  destroyHint = () => {
    console.warn('Hint was destroyed')

    this.hint.destroy()
    this.hint = null
    this.#stopAnimation()
  }
  
  #initSignals = () => {
    this.game.OnHintTouchStartAction = new Phaser.Signal()
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
    this.game.OnHintTouchStartAction.add((target) => {
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
    // Проверка, если hint за границы мира попадает.
    // ↓ Пересчитывает последний update кадр мира, для получения world position
    this.game.stage.updateTransform()
    this.hint.scale.set(this.factor)
    this.#restartAnimation()
  
    const worldBorderX = (this.hint.worldPosition.x + this.hint.width) > this.game.width
    const worldBorderY = (this.hint.worldPosition.y + this.hint.height) > this.game.height
  
    if (worldBorderX) {
      this.hint.scale.set(-this.factor, this.factor)
      this.#restartAnimation()
    }
    if (worldBorderY) {
      this.hint.scale.set(this.factor, -this.factor)
      this.#restartAnimation()
    }
  }
  
  #runAnimation = () => {
    this.game.time.events.add(Phaser.Timer.SECOND * this.delayHint, () => {
      if (this.hint === null) return
  
      this.hint.alpha = 1
      
      this.hintAnimations = AnimationType.scale(this.game, this.hint, this.factor, this.durationHint)
      this.hintAnimations.start()
    })
  
    return this.hintAnimations
  }
  
  #stopAnimation = () => {
    if (this.hintAnimations && this.hintAnimations.isRunning) {
      console.log('stop')
      this.hintAnimations.stop()
      this.game.tweens.remove(this.hintAnimations)
      this.hintAnimations = null
    }
  }
  
  #restartAnimation = () => {
    this.#stopAnimation()
    this.#runAnimation()
  }
}
