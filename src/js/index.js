import {SPRITES} from './const.js';
import {spriteParams, spriteNames} from './components/sprite/config.js'
import Sprite from './components/sprite/Sprite.js'
import Hint from './components/Hint.js';

class Game {
  constructor() {
    this.game  = null
    this.hint = null
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
        render : this.render
      })
  }
  
  preload = () => {
    Object.keys(spriteNames).forEach(key => {
      this.game.load.image(key, `./src/img/skeletons/${ key }.png`)
    })
    
    this.game.load.image('hint', './src/img/hint.png')
  }
  
  create = () => {
    this.#createSprites()
    this.#createHint()
  }
  
  #createHint = () => {
    this.hint = new Hint(this.game, 1, SPRITES).hint
  }
  
  #createSprites = () => {
    spriteParams.forEach(sprite => {
      SPRITES.push(new Sprite(
          this.game,
          sprite.x,
          sprite.y,
          sprite.anchor,
          sprite._name,
        ).sprite)
    })
  }
  
  render = () => {
    // SPRITES.forEach(sprite => {
    //   if (!sprite.alive) return
    //   this.game.debug.spriteBounds(sprite)
    // })
    // this.game.debug.spriteBounds(this.hint)
  }
}

new Game().init()

