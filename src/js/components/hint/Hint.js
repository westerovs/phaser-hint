/*
1 В месте, где у вас обрабатывается клик по элементу вызвать:
this.game.OnHintTouchStartAction.dispatch(sprite)

// События на которые можно подписаться:
this.game.onHintDestroy.add(() => console.log('DESTROYED'))

// добавить:
// рандом
// старт, дестрой, hide
*/

import {AnimationType} from './animationType.js';

export default class Hint {
  constructor({
      game,
      factor,
      sprites,
      anchor = [0, 0],
      keyHint,
      animationType,
      durationHint = 0.25,
      delayHint = 1,
      targetKey = null,
    }) {
    this.game = game
    this.factor = factor
    this.sprites = sprites
    this.anchor = anchor
    this.keyHint = keyHint
    this.animationType = animationType
    
    this.durationHint = durationHint
    this.delayHint = delayHint
    this.targetKey = targetKey
    
    this.hint = null
    this.hintTargets = []
    this.hintAnimations = null
    
    this.isCustomAnimation = false
    this.init()
  }
  
  init = () => {
    this.#checkingParams()
    this.#createDebugDots()
    
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
    
    this.hint = this.game.add.image(x, y, this.keyHint)
    this.hint.anchor.set(...this.anchor)
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
  
    this.game.stage.updateTransform()
    const {x, y} = this.hintTargets[0].worldPosition
    
    // todo некорректно работает, если anchor цели отличен от 0.5!
    const centerX = x + 0
    const centerY = y + 0
    // const centerX = x + this.hintTargets[0].width / 2
    // const centerY = y + this.hintTargets[0].height / 2
  
    this.anchorDot.position.set(centerX, centerY)
    return {x: centerX, y: centerY}
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
  
      this.hintAnimations = AnimationType[this.animationType](this.game, this.hint, this.factor, this.durationHint)
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
  
  #restartAnimation = () => {
    this.#stopAnimation()
    this.#runAnimation()
  }
  
  #checkingParams = () => {
    // проверка на anchor
    if (!Array.isArray(this.anchor)) {
      throw new Error('HINT error: anchor должен быть только массивом, типа [0, 0.5] !')
    }
    
    // проверка на тип анимации
    const animationType = !!Object.keys(AnimationType)
      .find((key) => this.animationType === key)
    if (!animationType) throw new Error(`HINT error: недопустимое имя. Допустимые имена: ${ Object.keys(AnimationType) }`)
  }
  
  #createDebugDots = () => {
    this.anchorDot = this.game.add.image(120, 120, 'debugDot')
    this.anchorDot.anchor.set(0.5, 0.5)
    this.anchorDot.scale.set(2)
  }
}
