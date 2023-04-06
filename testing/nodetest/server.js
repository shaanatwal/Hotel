const net = require('net');

const server = net.createServer((socket) => {
  console.log('Java process connected');

  // Handle incoming data from Java process
  socket.on('data', (data) => {
    console.log(`Received from Java: ${data}`);
  });

  // Send data to Java process
  const message = 'Hello from Node!';
  console.log(`Sending to Java: ${message}`);
  socket.write(message);
});

server.listen(3000, () => {
  console.log('Node.js server listening on port 3000');
});
