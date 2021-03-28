import { WORLD_SIZE } from './../../config'

const { width, height } = WORLD_SIZE

const createWorld = game => {
  // Start P2 physics engine
  game.physics.startSystem(Phaser.Physics.P2JS)
  // We set this to true so our game won't pause if we focus
  // something else other than the browser
  game.stage.disableVisibilityChange = true
  // Here we set the bounds of our game world
  game.world.setBounds(0, 0, width, height)
  createMap(game)
}

const createMap = game => {
  let groundTiles = []
  for (let i = 0; i <= width / 64 + 1; i++) {
    for (let j = 0; j <= height / 64 + 1; j++) {
      const groundSprite = game.add.sprite(i * 64, j * 64, 'asphalt')
      groundTiles.push(groundSprite)
    }
  }
  let background = game.add.image(0,  0, 'campus')
  background.width = width
  background.height = height
  // let image = game.add.image(game.cameras.main.width / 2, game.cameras.main.height / 2, 'campus')
  // let scaleX = game.cameras.main.width / image.width
  // let scaleY = game.cameras.main.height / image.height
  // let scale = Math.max(scaleX, scaleY)
  // image.setScale(scale).setScrollFactor(0)
}

export default createWorld