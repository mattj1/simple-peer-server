export class SimplePeerServer {

    peers: [];
    debug: boolean;

    constructor(httpServer, debug) {
        this.peers = [];

        this.debug = false;

        if (typeof debug != 'undefined') {
            this.debug = debug;
        }

        this.init(httpServer);
    }

    init(httpServer) {
        const ioServer = require('socket.io')(httpServer, {
            cors: {
                origin: '*',
            },
        });

        ioServer.sockets.on('connection', (socket) => {
            console.log("connection...", socket.id);
            socket.emit("peer_id", socket.id);
            // socket.emit("peer_id", {"test": "123"});
            // logs server messages on the client
            socket.on('message', (message) =>
                this._handleMessage(message, socket),
            );
            socket.on('initiate peer', (room) =>
                this._handleInitiatePeer(room, socket),
            );
            socket.on('sending signal', (message) =>
                this._handleSendSignal(message, socket),
            );

            socket.on('hangup', () => this._handleHangup(socket));

            socket.on('disconnect', (reason) =>
                this._handleDisconnect(reason),
            );

            socket.on('offer', (message) => {
                this._handleOffer(message, ioServer);
            });

            socket.on('answer', (message) => {
                this._handleAnswer(message, ioServer);
            });

            socket.on('peer_props', (message) => {
                console.log("got peer props: ", message);
                socket.peer_props = message;
            })

            socket.on("debug_get_host_peer_id", (message) => {
                let keys = Array.from(ioServer.sockets.sockets.keys());
                console.log(keys);
                for(let s of keys) {
                    let sck = ioServer.sockets.sockets.get(s);
                    console.log("socket: ", s, sck.peer_props);
                    if(sck.peer_props) {
                        if(sck.peer_props["is_host"] == true) {
                            socket.emit("debug_host_peer_id", s);

                            return;
                        }
                    }
                }

                socket.emit("debug_host_peer_id", null);
            })
        });
    }

    _handleOffer(message, ioServer) {
        console.log("handleOffer:", message);
        ioServer.to(message.peer_to).emit('offer', message);
    }

    _handleAnswer(message, ioServer) {
        console.log("handleAnswer:", message);
        ioServer.to(message.peer_to).emit('answer', message);
    }

    _handleMessage(message, socket) {
        this.debug && console.log('Client said: ', message);
        // for a real app, would be room-only (not broadcast)
        socket.broadcast.emit('message', message);
    }

    _handleInitiatePeer(room, socket) {
        this.debug &&
        console.log('Server initiating peer in room ' + room);
        socket.to(room).emit('initiate peer', room);
    }

    _handleSendSignal(message, socket) {
        this.debug &&
        console.log('Handling send signal to room ' + message.room);
        socket.to(message.room).emit('sending signal', message);
    }

    _handleHangup(socket: any) {
        this.debug && console.log('received hangup');
    }

    _handleDisconnect(reason) {
        this.debug && console.log('disconnecting bc ' + reason);
    }
}
