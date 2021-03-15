let io
let gameSocket
let gamesInSession = []

const initializeGame = (sio, socket) => {
    io = sio 
    gameSocket = socket 
    gamesInSession.push(gameSocket)
    gameSocket.on("disconnect", onDisconnect)
    gameSocket.on("new move", newMove)
    gameSocket.on("card change", cardChange)
    gameSocket.on("createNewGame", createNewGame)
    gameSocket.on("playerJoinGame", playerJoinsGame)
    gameSocket.on('request username', requestUserName)
    gameSocket.on('recieved userName', recievedUserName)
}  

function playerJoinsGame(idData) {
    const sock = this
    
    const room = io.sockets.adapter.rooms[idData.gameId]
   console.log(room)

    if (room === undefined) {
        this.emit('status' , "This game session does not exist." );
        return
    }
    if (room.length < 2) {

        idData.mySocketId = sock.id;
        sock.join(idData.gameId);

        if (room.length === 2) {
            io.sockets.in(idData.gameId).emit('start game', idData.userName)
        }
        io.sockets.in(idData.gameId).emit('playerJoinedRoom', idData);

    } else {
        this.emit('status' , "There are already 2 people playing in this room." );
    }
}


function createNewGame(gameId) {
    this.emit('createNewGame', {gameId: gameId, mySocketId: this.id});
    this.join(gameId)
}

function newMove(move) {
    const gameId = move.userState.gameId 
    io.to(gameId).emit('opponent move', move);
}

function cardChange(move) {
    const gameId = move.gameId 
    io.to(gameId).emit('opponent card change', move);
}

function onDisconnect() {
    let i = gamesInSession.indexOf(gameSocket);
    gamesInSession.splice(i, 1);
}


function requestUserName(gameId) {
    io.to(gameId).emit('give userName', this.id);
}

function recievedUserName(data) {
    data.socketId = this.id
    io.to(data.gameId).emit('get Opponent UserName', data);
}

exports.initializeGame = initializeGame