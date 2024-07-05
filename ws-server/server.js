import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8080 });
server.on('connection', ws => {
  ws.on('message', message => {
    const messageData = JSON.parse(message)
    
    if(messageData.type == 'message'){
      server.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'message', value: messageData.value }));
        }
      })
    }

    if(messageData.type == 'typing'){
      server.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'typing', value: messageData.value }))
        }
      })
    }
  })

  ws.send(JSON.stringify({ type: 'status',  value: 'connected'}));
});

console.log('WebSocket server is running on ws://localhost:8080');
