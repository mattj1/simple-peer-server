import {SimplePeerServer} from "./lib/SimplePeerServer";

let hostname = "localhost";
let port = 8003;

console.log(`Running on ${hostname}:${port}`);

const http = require('http');
const server = http.createServer();
const spServer = new SimplePeerServer(server, true);
server.listen(8003, "127.0.0.1");
