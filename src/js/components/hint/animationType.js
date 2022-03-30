const AnimationType = {
  scale: (game, hint, factor, duration) => {
    return game.add.tween(hint.scale)
      .to({
        x: (hint.scale.x * 0.90) * factor,
        y: (hint.scale.y * 0.90) * factor,
      }, Phaser.Timer.SECOND * duration, Phaser.Easing.Linear.None, false).yoyo(true)
      .yoyo(true)
      .repeat(-1)
  },
  angle: (game, hint, factor, duration) => {
    return game.add.tween(hint)
      .to({
        angle: 90,
      }, Phaser.Timer.SECOND * duration, Phaser.Easing.Linear.None, false).yoyo(true)
      .yoyo(true)
      .repeat(-1)
  }
}

export {
  AnimationType
}
