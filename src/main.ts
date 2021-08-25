import { createServer } from 'net';

const netServer = createServer((socket) => {
    // 'connection' 监听器。
    console.log('client connected');
    socket.on('end', () => {
        console.log('client disconnected');
    });
    socket.write('hello\r\n');
    socket.pipe(socket);
});

netServer.on('error', (err) => {
    throw err;
});
netServer.listen(8124, () => {
    console.log('server bound');
});
