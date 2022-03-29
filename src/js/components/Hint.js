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
  constructor(game, factor, sprites, initKey = null) {
    this.game = game
    this.factor = factor
    this.sprites = sprites
    
    this.hint = null
    this.hintTargets = []
    
    this.hintDelay = 1
    this.timerHint = null
    this.hintAnimations = null
  
    this.hintIsDestroyed = false
    this.initKey = initKey
    this.init()
  }
  
  init = () => {
    this.#createHint()
    // this.#runHintAnimate()
  
    this.#initSignals()
    this.#targetTouchAction()
  }
  
  destroyHint = () => {
    console.warn('destroy Hint')
    this.hintIsDestroyed = true
    
    this.hint.destroy()
    this.hint = null
  }
  
  #initSignals = () => {
    this.game.onTouchStartAction = new Phaser.Signal()
    this.game.onHintDestroy = new Phaser.Signal()
    
    this.game.onHintDestroy.add(this.destroyHint)
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
  
      this.#updateTargetPosition()
      this.#checkAndReverseHintPosition()
      // this.#restartTween()
    })
  }
  
  #createHint = () => {
    this.#getAliveTargets()
  
    const {x, y} = this.#getTargetPosition()
  
    this.hint = this.game.add.image(x, y, 'hint')
    this.hint.alpha = 0.1
  }
  
  #getAliveTargets = () => {
    this.hintTargets = []
    
    // проверка, был ли указан ключ при создании HINT
    if (this.initKey !== null) {
      this.sprites.find(sprite => {
        if (sprite.key === this.initKey) {
          this.hintTargets.push(sprite)
          this.initKey = null
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
    console.log('get Target Position')
  
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
      console.log('runHintAnimate')
  
      this.hint.alpha = 1
      
      this.hintAnimations = AnimationType.scale(this.game, this.hint, this.factor)
      this.hintAnimations = this.game.add.tween(this.hint.scale)
        .to({
          x: (this.hint.scale.x * 0.95) * this.factor,
          y: (this.hint.scale.y * 0.95) * this.factor,
        }, Phaser.Timer.QUARTER, Phaser.Easing.Power5, false).yoyo(true)
        .yoyo(true)
        .repeat(-1)
  
      this.hintAnimations.start()
    })
  
    return this.hintAnimations
  }
  
  #restartTween = () => {
    if (this.hintTargets.length === 0) return
    console.log('restart')

    this.game.tweens.remove(this.hintAnimations)
    this.hintAnimations = null
    // this.#runHintAnimate()
  }
}
