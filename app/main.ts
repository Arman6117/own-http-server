import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const path = request.split(' ')[1]
    const params =  path.split('/')[1]

    let response:string;

    const changeResponse = (response:string) =>{
      socket.write(response)
      socket.end();
    }

    switch (params) {
      case '' : 
        response = `HTTP/1.1 200 OK\r\n\r\n`
        changeResponse(response);
        break;
      case 'echo' : 
      const message = path.slice(6)
        response = `HTTP/1.1 200 OK\r\nContent-Type:text/plain\r\nContent-Length:${message.length}\r\n\r\n${message}`
        changeResponse(response);
        break;
      case 'user-agent' : 
      const userAgent = request.split('\r\n')[2]
      console.log(userAgent)
      //   response = `HTTP/1.1 200 OK\r\nContent-Type:text/plain\r\nContent-Length:${message.length}\r\n\r\n${message}`
      //   changeResponse(response);
        break;
    } 
  });
});

server.listen(4221, "localhost");
