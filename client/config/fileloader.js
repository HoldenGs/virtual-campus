import { ASSETS_URL } from '.'

const fileLoader = game => {
  game.load.crossOrigin = 'Anonymous'
  game.stage.backgroundColor = '#1E1E1E'
  game.load.image('campus', `${ASSETS_URL}/campus/campus.png`)
  game.load.image('asphalt', `${ASSETS_URL}/sprites/asphalt/asphalt.png`)
  game.load.image('player', `${ASSETS_URL}/sprites/player/johnny.png`)
}

export default fileLoader