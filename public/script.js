let gameRoom;
let myClientId;
let myChannel;
let players = {};
let totalPlayers = 0;

const BASE_SERVER_URL = "http://localhost:3000";
const myNickname = localStorage.getItem("nickname");



class GameScene extends Phaser.Scene {
    constructor() {
      super("gameScene")
    }
    
    //load assets
    preload() {
        this.load.spritesheet(
            "avatarA",
            "/player.png",
            {
                frameWidth: 48,
                frameHeight: 32
            }
        )

    }
    
    //init variables, define animations & sounds, and display assets
    create() {
        this.avatars = {}
        this.cursorKeys = this.input.keyboard.createCursorKeys()
        
        gameRoom.subscribe("game-state", (msg) => {
            players = msg.data.players
            totalPlayers = msg.data.playerCount
        })
    }
    
    //update the attributes of various game objects per game logic
    update() {
        for (let item in this.avatars) {
            if (!players[item]) {
                this.avatars[item].destroy()
                delete this.avatars[item]
            }
        }

        for (let item in players) {
            let avatarId = players[item].id
            if (this.avatars[avatarId]) {
                this.avatars[avatarId].x = players[item].x
                this.avatars[avatarId].y = players[item].y
            } else if (!this.avatars[avatarId]) {
                if (players[item].id != myClientId) {
                    let avatarName = "avatarA"

                    this.avatars[avatarId] = this.physics.add
                        .sprite(players[item].x, players[item].y, avatarName)
                        .setOrigin(0.5, 0.5)

                    this.avatars[avatarId].setCollideWorldBounds(true)

                    document.getElementById("join-leave-updates").innerHTML = 
                        players[avatarId].nickname + " joined"

                    setTimeout(() => {
                        document.getElementById("join-leave-updates").innerHTML = ""
                    }, 2000)

                } else if (players[item].id == myClientId) {
                    let avatarName = "avatarA"

                    this.avatars[avatarId] = this.physics.add
                        .sprite(players[item].x, players[item].y, avatarName)
                        .setOrigin(0.5, 0.5)
                    
                    this.avatars[avatarId].setCollideWorldBounds(true)
                }

            }
        }

        this.publishMyInput()
        
    }


    publishMyInput() {
        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
            myChannel.publish("pos", {
                keyPressed: "left"
            })
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
            myChannel.publish("pos", {
                keyPressed: "right"
            })
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
            myChannel.publish("pos", {
                keyPressed: "up"
            })
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
            myChannel.publish("pos", {
                keyPressed: "down"
            })
        }
    }

}

const config = {
    width: 1400,
    height: 750,
    backgroundColor: "#FFFFF",
    parent: "gameContainer",
    scene: [GameScene],
    physics: {
      default: "arcade"
    }
}

const realtime = Ably.Realtime({
    authUrl: BASE_SERVER_URL + "/auth",
})
  
realtime.connection.once("connected", () => {
    myClientId = realtime.auth.clientId
    gameRoom = realtime.channels.get("game-room")
    myChannel = realtime.channels.get("clientChannel-" + myClientId)
    gameRoom.presence.enter(myNickname)
    game = new Phaser.Game(config)
})