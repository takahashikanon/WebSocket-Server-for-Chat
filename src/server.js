
var server = require('ws').Server;
var s = new server({ port: 5001 });
var connectedAddressList = new Map();


s.on('connection', (ws, request) => {
    let originAddress = String(ws._socket.remoteAddress);
    let connectedAddress = originAddress.slice(originAddress.lastIndexOf(':') + 1);

    s.clients.forEach(client => {
        connectedAddressList.set(connectedAddress, connectedAddress);

        connectedAddressList.forEach((key, value) => {
            let sendData = {
                'status': 'connected',
                'ip': value,
            };
            client.send(JSON.stringify(sendData));

        });
    });

    ws.on('message', (message) => {

        s.clients.forEach(client => {
            let date = new Date();
            let timestamp = date.getHours() + ':' + plusZero(date.getMinutes());

            let sendData = {
                'status': 'message',
                'ip': String(connectedAddress),
                'data': String(message),
                'timestamp': String(timestamp),
            };

            let originClientAddress = client._socket._peername.address;
            let clientsAddress = originClientAddress.slice(originClientAddress.lastIndexOf(':') + 1);

            if (connectedAddress !== clientsAddress) {
                client.send(JSON.stringify(sendData));
            }
        })
    });

    ws.on('close', () => {
        s.clients.forEach(client => {
            let sendData = {
                'status': 'lost',
                'ip': connectedAddress,
            };
            client.send(JSON.stringify(sendData));
            connectedAddressList.delete(connectedAddress);
        });
    });

});

function plusZero(number) {
    let newNumber = number;

    if (String(number).length === 1) {
        newNumber = '0' + String(number);
    }

    return newNumber;
}