import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();


    const headers = request.split('\r\n')[2]
    const userAgent = headers.split(':')

    if(userAgent) {
      const message = userAgent[1];
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`

      socket.write(response)
    }
    else {
      const response = `HTTP/1.1 404 Not Found\r\n\r\n`
         socket.write(response)
    }

    //!Stage 1 2 3 4
   //  const path = request.split(' ')[1]

   //  if (path === '/') {
   //    const response = `HTTP/1.1 200 OK\r\n\r\n`
   //    socket.write(response)
   //  }else if(path.startsWith('/echo/')) {

   //    const message = path.slice(6);
   //     const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`
   //     socket.write(response)

   //  }else {
   //    const response = `HTTP/1.1 404 Not Found\r\n\r\n`
   //    socket.write(response)
   //  }
 
  });
});

server.listen(4221, "localhost");
