/* eslint-disable */
import {CRYSTALS} from '../utils/const'

export default class Hint {
  constructor(game, factor, sprites) {
    this.game = game
    this.factor = factor
    this.sprites = sprites
    this.crystals = CRYSTALS
    
    this.parent = this.game.context.canvas
    
    this.hintDelay = 3
    this.timerHint = null
    this.EnamHintAnimations = {
      show : false,
      scale: false,
      move: false,
    }
    
    this.hint = this.sprites.hint
    this.autorotateAnim = null
    this.alimeElem = null
    this.init()
  }
  
  init() {
    this.resetHintTimer()
    
    this.game.onTouchStartAction.add((pointer) => {
      this.hint.alpha = 0
      
      if (this.timerHint) this.timerHint.destroy()
      
      this.resetHintTimer()
      
      // if (this.autorotateAnim) {
      //   this.autorotateAnim.stop()
      //   this.alimeElem.angle = this.alimeElem.initAngle
      //   this.alimeElem.alpha = 1
      // }
    })
  }
  
  initAutorotate = (aliveElement) => {
    this.autorotateAnim = this.game.add.tween(aliveElement)
      .to({
        angle: 0,
        alpha: 0.7,
      }, Phaser.Timer.SECOND, Phaser.Easing.Linear.None, false, 500).yoyo(true).repeat(0)
    this.autorotateAnim.start()
  }
  
  createHintHand() {
    const aliveElements = []
    
    Object.values(CRYSTALS).forEach(crystal => {
      Object.values(crystal).filter((element) => {
        if (element.isComplete === false) aliveElements.push(element)
        return aliveElements
      })
    })
    
    if (aliveElements.length === 0) {
      this.hint.alpha = 0
      return
    }
    
    this.alimeElem = aliveElements[0]
    const {x: aliveElementPosX, y: aliveElementPosY} = aliveElements[0].worldPosition
    
    // this.initAutorotate(aliveElements[0])
    
    this.hint.alpha = 1
    this.hint.scale.set(this.game.factor, this.game.factor)
    
    // разобраться с масштабированием руки!
    this.game.onResizeSignal.add((isLandscape) => {
      this.hint.alpha = 0
      this.hint.scale.set(this.game.factor, this.game.factor)
      this.resetHintTimer()
    })
    
    switch (aliveElements[0]._name) {
      case 'crystalLeftBig':
        this.hint.position.set(aliveElementPosX - (50 * this.game.factor), aliveElementPosY)
        break
      case 'crystalLeft':
        this.hint.position.set(aliveElementPosX - (80 * this.game.factor), aliveElementPosY - (50 * this.game.factor))
        break
      case 'crystalTop':
        this.hint.position.set(aliveElementPosX - (20 * this.game.factor), aliveElementPosY - (120 * this.game.factor))
        break
      case 'crystalRight':
        this.hint.position.set(aliveElementPosX - (100 * this.game.factor), aliveElementPosY + (10 * this.game.factor))
        this.hint.scale.set(-this.game.factor, -this.game.factor)
        break
    }
    
    this.runHandAnimate(this.hint, aliveElements[0]._name)
  }
  
  runHandAnimate(hint) {
    // [1] set animations
    this.EnamHintAnimations.show  = this.createTween(hint, {alpha: 1}, 0, Phaser.Timer.QUARTER)
    this.EnamHintAnimations.scale = this.createTween(hint.scale, {
      x: hint.scale.x * 0.95,
      y: hint.scale.y * 0.95,
    }, 0, Phaser.Timer.QUARTER)
    
    // [2] окончание появления
    this.EnamHintAnimations.show
      .onComplete.add(() => {
      this.EnamHintAnimations.show = false
      this.EnamHintAnimations.scale.yoyo(true).repeat(2)
        .onComplete.add(() => {
        this.EnamHintAnimations.scale = false
        this.EnamHintAnimations.scale = this.createTween(hint, {alpha: 0}, 0, Phaser.Timer.HALF)
        this.resetHintTimer()
      })
    })
  }
  
  resetHintTimer() {
    if (this.timerHint) {
      this.timerHint.destroy()
    }
    // console.log('resetHintTimer')
    
    this.timerHint = this.game.time.create(false)
    this.timerHint.loop(Phaser.Timer.SECOND * this.hintDelay, () => {
      if (this.game.input.activePointer.isDown) return
      this.createHintHand()
    })
    this.timerHint.start()
  }
  
  createTween(
    sprite,
    prop,
    delay = 0,
    time = Phaser.Timer.SECOND,
    easing = Phaser.Easing.Linear.None,
    autostart = true,
  ) {
    return this.game.add
      .tween(sprite)
      .to(prop, time, easing, autostart, delay)
  }
}
