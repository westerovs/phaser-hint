import {SPRITES} from './const.js';
import {spriteParams, spriteNames} from './components/sprite/config.js'
import Sprite from './components/sprite/Sprite.js'
import Hint from './components/hint/Hint.js';

class Game {
  constructor() {
    this.game  = null
    this.hint  = null
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
        render : this.render,
      })
  }
  
  preload = () => {
    Object.keys(spriteNames).forEach(key => {
      this.game.load.image(key, `./src/img/skeletons/${ key }.png`)
    })
    
    this.game.load.image('hint', './src/img/hint.png')
    this.game.load.image('hint2', './src/img/hint2.png')
  }
  
  create = () => {
    this.#createSprites()
    this.#createGroup()
  
    this.#createHint()
  }
  
  render = () => {
    SPRITES.forEach(sprite => {
      if (sprite.alive) this.game.debug.spriteBounds(sprite)
    })
    this.game.debug.spriteBounds(this.hint.hint)
  }
  
  #createGroup = () => {
    const mainGroup = this.game.make.group()
    const mainGroupOffset = {
      x: 300,
      y: 0,
    }
    mainGroup.add(SPRITES[3])
    mainGroup.add(SPRITES[4])
    mainGroup.add(SPRITES[5])
    mainGroup.position.set(mainGroupOffset.x, mainGroupOffset.y)
    this.game.world.add(mainGroup)
  }
  
  #createHint = () => {
    this.hint = new Hint({
      game: this.game,
      factor: 1,
      sprites: SPRITES,
      keyHint: 'hint',
      anchor: [0, 0],
      animationType: 'scale'
    })
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
}

new Game().init()

