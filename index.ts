import {SimplePeerServer} from "./lib/SimplePeerServer";

let hostname = "0.0.0.0"
let port = 8003;

for(let arg of process.argv) {
  if(!arg.startsWith("--"))
    continue;

  let params = arg.substring(2).split("=");

  if(params.length != 2)
    continue;

  if(params[0] == 'bind') {
    let p1 = params[1].split(":");
    hostname = p1[0];

    if(p1.length > 1) {
      port = parseInt(p1[1]);
    }
  }
}

console.log(`--- simple-peer-server running on ${hostname}:${port} ---`);

const http = require('http');
const server = http.createServer();
const spServer = new SimplePeerServer(server, true);
server.listen(port, hostname);
