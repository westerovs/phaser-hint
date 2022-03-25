import {SPRITES} from './const.js';
import {spriteParams, spriteNames} from './components/sprite/config.js'
import Sprite from './components/sprite/Sprite.js'

class Game {
  constructor() {
    this.game  = null
  }
  
  init() {
    this.game = new Phaser.Game(
      1366,
      1366,
      Phaser.CANVAS,
      null,
      {
        preload: this.preload,
        create : this.create,
        update : this.update,
      })
    
  }
  
  preload = () => {
    Object.keys(spriteNames).forEach(key => {
      this.game.load.image(key, `/src/img/skeletons/${ key }.png`)
    })
  }
  
  create = () => {
    this.createSprites()
  }
  
  createSprites = () => {
    spriteParams.forEach(sprite => {
      new Sprite(
        this.game,
        sprite.x,
        sprite.y,
        sprite.anchor,
        sprite._name,
      )
    })
  }
  
  update = () => {
  
  }
}

new Game().init()

