

const envConfig = require("dotenv").config()
const express = require("express")
const Ably = require("ably")

const app = express()

app.use(express.static("public"))
app.use(express.static("assets"))

const CANVAS_HEIGHT = 750
const CANVAS_WIDTH = 1400
const SHIP_PLATFORM = 718
const ABLY_API_KEY = process.env.ABLY_API_KEY
const PORT = process.env.PORT || 3000
const GAME_TICKER_MS = 100


let peopleAccessingTheWebsite = 0
let players = {}
let playerChannels = {}
let shipX = Math.floor((Math.random() * 1370 + 30) * 1000) / 1000
let shipY = SHIP_PLATFORM
let avatarColors = ["green", "cyan", "yellow"]
let avatarTypes = ["A"]
let gameOn = false
let names = ["Nathan", "Holden", "Harry", "Johnny", "Yu"]
totalPlayers = 0



const realtime = Ably.Realtime({
    key: ABLY_API_KEY,
    echoMessages: false,
})
  
//create a uniqueId to assign to clients on auth
const uniqueId = function () {
    return "id-" + totalPlayers + Math.random().toString(36).substr(2, 16)
}

// Authenticate client with Ably pub/sub
app.get("/auth", (request, response) => {
    const tokenParams = { clientId: uniqueId() }

    realtime.auth.createTokenRequest(tokenParams, function (err, tokenRequest) {
      if (err) {
        response
          .status(500)
          .send("Error requesting token: " + JSON.stringify(err))
      } else {
        response.setHeader("Content-Type", "application/json")
        response.send(JSON.stringify(tokenRequest))
      }
    })

  })

// Subscribe to player topics
realtime.connection.once("connected", () => {

  gameRoom = realtime.channels.get("game-room");

  gameRoom.presence.subscribe("enter", (player) => {
        let newPlayerId
        let newPlayerData
        totalPlayers++

        if (totalPlayers === 1) {
            gameTickerOn = true;
            startGameDataTicker()
        }

        newPlayerId = player.clientId
        playerChannels[newPlayerId] = realtime.channels.get(
            "clientChannel-" + player.clientId
        )

        newPlayerObject = {
            id: newPlayerId,
            x: Math.floor((Math.random() * 1370 + 30) * 1000) / 1000,
            y: 20,
            avatar: avatarTypes[randomAvatarSelector()],
            avatarColor: avatarColors[randomAvatarSelector()],
            //nickname: player.data,
            nickname: names[Math.floor(Math.random() * 5)],
        }

        players[newPlayerId] = newPlayerObject;
        subscribeToPlayerInput(playerChannels[newPlayerId], newPlayerId)

  });

  gameRoom.presence.subscribe("leave", (player) => {
        let leavingPlayer = player.clientId

        totalPlayers--
        delete players[leavingPlayer]
  });
});

// Helper functions

function startGameDataTicker() {
  let tickInterval = setInterval(() => {
      if (!gameTickerOn) {
          clearInterval(tickInterval)
      } else {
          gameRoom.publish("game-state", {
              players: players,
              playerCount: totalPlayers,
          })
      }
  }, GAME_TICKER_MS)
}

function subscribeToPlayerInput(channelInstance, playerId) {
  channelInstance.subscribe("pos", (msg) => {
      if (msg.data.keyPressed == "left") {
          if (players[playerId].x - 20 < 20) {
              players[playerId].x = 20
          } else {
              players[playerId].x -= 20
          }
      } else if (msg.data.keyPressed == "right") {
          if (players[playerId].x + 20 > 1380) {
              players[playerId].x = 1380
          } else {
              players[playerId].x += 20
          }
      } else if (msg.data.keyPressed == "up") {
          if (players[playerId].y - 20 < 20) {
              players[playerId].y = 20
          } else {
              players[playerId].y -= 20
          }
      } else if (msg.data.keyPressed == "down") {
          if (players[playerId].y + 20 > 730) {
              players[playerId].y = 730
          } else {
              players[playerId].y += 20
          }
      }
  })
}

function randomAvatarSelector() {
  return Math.floor(Math.random() * avatarTypes.length)
}


// Routes

app.get("/", (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    response.sendFile(__dirname + "/views/intro.html");
});

app.get("/gameplay", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});