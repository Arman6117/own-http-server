import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
//  socket.on('data', (data)=> {
//     const request = data.toString();
//     const pathname = request.split(' ')[1]
//     const response = pathname === '/' ? `HTTP/1.1 200 OK\r\n\r\n` : `HTTP/1.1 404 Not Found\r\n\r\n`

//     socket.write(response)
//  })

const responseContent = `HTTP/1.1 200 OK\r\nContent-Type:text/plain\r\nContent-Length:9\r\n\r\nraspberry` 
socket.write(responseContent)
});

server.listen(4221, "localhost");
