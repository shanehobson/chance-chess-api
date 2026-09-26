# Chance Chess API

Real-time multiplayer server for "Chance Chess", a chess variant in which a deck of cards dictates which pieces each player can move. The server manages two-player game rooms and relays moves and card changes between opponents over WebSockets.

## Features

- Creates game rooms identified by a client-supplied game ID
- Lets a second player join an existing room, and rejects joins to rooms that don't exist or already hold two players
- Relays each move and card change to the opponent in the same room
- Exchanges usernames between the two players
- Tracks connected sockets and removes them on disconnect

## Tech Stack

- Node.js
- Express
- Socket.IO 2.x

## Getting Started

```bash
npm install
npm run dev     # start with nodemon (auto-reload)
npm start       # start with node
```

The server listens on the port in the `PORT` environment variable, or `8000` if it isn't set.

## Socket Events

All communication happens over Socket.IO. There are no REST endpoints.

### Client to server

| Event | Payload | Behavior |
| --- | --- | --- |
| `createNewGame` | `gameId` | Joins the socket to a new room and replies with `createNewGame` `{ gameId, mySocketId }` |
| `playerJoinGame` | `{ gameId, userName, ... }` | Joins an existing room and broadcasts `playerJoinedRoom` to it; emits `status` with an error message if the room doesn't exist or is full |
| `player two joins` | `gameId` | Broadcasts `start game` to the room |
| `new move` | `{ userState: { gameId }, ... }` | Broadcasts `opponent move` to the room |
| `card change` | `{ gameId, ... }` | Broadcasts `opponent card change` to the room |
| `request username` | `gameId` | Broadcasts `give userName` with the requester's socket ID |
| `recieved userName` | `{ gameId, ... }` | Adds the sender's `socketId` and broadcasts `get Opponent UserName` |
| `disconnect` | none | Removes the socket from the in-memory session list |

### Server to client

`createNewGame`, `playerJoinedRoom`, `start game`, `status`, `opponent move`, `opponent card change`, `give userName`, `get Opponent UserName`

## Project Structure

```
app.js          # Express + Socket.IO server setup
game-logic.js   # Room management and event handlers
```
