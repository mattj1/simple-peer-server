import {SimplePeerServer} from "./lib/SimplePeerServer";

const {readFileSync} = require("fs");
const {createServer} = require("http");


console.log("running...")

const http = require('http');
const server = http.createServer();
const spServer = new SimplePeerServer(server, true);
server.listen(8003, "localhost");
