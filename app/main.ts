import * as net from "net";
import * as fs from "fs";
// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const requestLines = request.split("\r\n");
    const [method, path] = requestLines[0].split(" ");
    const params = path.split("/")[1];

    console.log("Called method " + method);

    let response: string;

    const changeResponse = (response: string) => {
      socket.write(response);
      socket.end();
    };

    switch (method) {
      case "GET":
        switch (params) {
          case "":
            response = `HTTP/1.1 200 OK\r\n\r\n`;
            changeResponse(response);
            break;
          case "echo":
            const message = path.slice(6);
            response = `HTTP/1.1 200 OK\r\nContent-Type:text/plain\r\nContent-Length:${message.length}\r\n\r\n${message}`;
            changeResponse(response);
            break;

          case "user-agent":
            const userAgent = request.split("\r\n")[2];
            const userAgentMessage = userAgent.split(": ")[1];
            console.log(userAgentMessage);
            response = `HTTP/1.1 200 OK\r\nContent-Type:text/plain\r\nContent-Length:${userAgentMessage.length}\r\n\r\n${userAgentMessage}`;
            changeResponse(response);
            break;

          case "files":
            const args = process.argv.slice(2);
            const [_, __, fileName] = path.split("/");
            const [___, absPath] = args;
            const filePath = absPath + fileName;

            try {
              const content = fs.readFileSync(filePath);
              response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
              changeResponse(response);
            } catch (error) {
              response = `HTTP/1.1 404 Not Found\r\n\r\n`;
              changeResponse(response);
            }

          default:
            const defaultMessage = path.split("/")[1];

            response = `HTTP/1.1 404 Not Found\r\nContent-Type:text/plain\r\nContent-Length:${defaultMessage.length}\r\n\r\n${defaultMessage}`;
            changeResponse(response);
        }

      case "POST":
        const [_,dirName,fileName] = path.split('/')
        const filePath = dirName + "/" + fileName;

        const body = requestLines[4]
        console.log("logged body" + body)
    }
  });
});

server.listen(4221, "localhost");
