const express = require("express");
const { createServer } = require("http");
const webSocketServer = require("websocket").server;

const { getUniqueID } = require("./utils/getUniqueID");

const app = express();

const server = createServer(app);

server.listen(8000, (err, succ) => {
  console.log("listening on port 8000");
});

const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = {};

wsServer.on("request", (req) => {
  const userID = getUniqueID();
  console.log(
    `${new Date()} Received a new connection from origin ${req.origin}.`
  );

  const connection = req.accept(null, req.origin);
  clients[userID] = connection;
  console.log(`Connected ${userID} in ${Object.getOwnPropertyNames(clients)}.`);

  // when you receive a message
  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log("Received Message: ", message.utf8Data);
    }

    //broadcasting message to all connected clients
    for (key in clients) {
      clients[key].sendUTF(message.utf8Data);
      console.log(`sent message to ${clients[key]}`);
    }
  });
});
