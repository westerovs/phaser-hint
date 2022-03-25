const createTween = (game, sprite, props) => {
  const {
          params,
          duration = 1,
          secondDelay = 0,
          yoyo = false,
          time = Phaser.Timer.SECOND * duration,
          easing = Phaser.Easing.Linear.None,
          autostart = true,
          delay = secondDelay,
          repeat = 0,
        } = props
  
  return game.add.tween(sprite)
    .to(params, time, easing, autostart, delay * 1000, repeat)
    .yoyo(yoyo)
}

const tweenSetAlpha = (game, sprite, alpha, second = 1, secondDelay = 0) => {
  return game.add
    .tween(sprite)
    .to({alpha}, Phaser.Timer.SECOND * second, Phaser.Easing.Linear.None, true, secondDelay * 1000)
}

const tweenTint = (game, spriteToTween, startColor, endColor, duration = 0) => {
  const colorBlend = {step: 0}
  
  return game.add.tween(colorBlend).to({step: 100}, 1000 * duration, Phaser.Easing.Default, false)
    .onUpdateCallback(() => {
      spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1)
    })
    .start()
}

const tweenShake = (game, sprite, duration) => {
  createTween(game, sprite, {
    params: {
      x: sprite.x + 10
    },
    duration: duration,
    repeat: 3,
    yoyo: true,
  })
}

export {
  tweenShake,
  tweenSetAlpha,
  tweenTint
}
