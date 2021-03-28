const createPlayer = (x, y, game) => {
    const sprite = game.add.sprite(x, y, 'player')
    sprite.width = 64
    sprite.height = 64
    game.physics.p2.enable(sprite, false)
    return sprite
}
  
export default createPlayer