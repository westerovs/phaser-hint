import {tweenShake, tweenSetAlpha, tweenTint } from '../../utils/tweens.js';

export default class Sprite {
  constructor(game, x, y, anchor, name) {
    this.game = game
    this.positionPartX = x
    this.positionPartY = y
    this.anchor = anchor
    this.spriteName = name
    
    this.sprite = null
    
    this.init()
  }
  
  init = () => {
    this.#createBlock()
  }
  
  #createBlock = () => {
    this.sprite = this.game.make.image(this.positionPartX, this.positionPartY, this.spriteName)
    this.sprite.inputEnabled = true
    this.sprite.anchor.set(...this.anchor)
    
    this.game.world.add(this.sprite)
    this.#initEvents()

    return this.sprite
  }
  
  #initEvents = () => {
    this.sprite.events.onInputDown.addOnce(this.#onTouchStart)
  }
  
  #onTouchStart = (sprite) => {
    console.log('knock! knock!')
    this.game.onTouchStartAction.dispatch(sprite)
    this.#destroySprite(sprite)
  }
  
  #destroySprite = (sprite) => {
    tweenShake(this.game, sprite, 0.03)
    tweenTint(this.game, sprite, sprite.tint, 0xFF000D, 0.05)
    tweenSetAlpha(this.game, sprite, 0, 0.3)
      .onComplete.add(() => {
      this.sprite.destroy()
      console.log('sprite alive:', sprite.alive)
    })
  }
}
