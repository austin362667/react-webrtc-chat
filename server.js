const express = require("express");
const path = require("path");
const http = require("http");
const PeerDataServer = require("peer-data-server");
const fs = require("fs");

const PORT = parseInt(process.env.PORT, 10) || (process.env.NODE_ENV === "production" ? 443 : 3001);

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "build", "index.html"))
  );
}

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/lattemall.company/privkey.pem'),
  ca: [fs.readFileSync('/etc/letsencrypt/live/lattemall.company/fullchain.pem')],
  cert: fs.readFileSync('/etc/letsencrypt/live/lattemall.company/fullchain.pem')
};

const https = require('https')

const appendPeerDataServer = PeerDataServer.default || PeerDataServer;
const server = https.createServer(options, app);

appendPeerDataServer(server);

server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
