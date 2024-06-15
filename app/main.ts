import * as net from "net";
import * as fs from "fs";
import * as zlib from "zlib";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

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
            const acceptEncoding = requestLines.find((line) =>
              line.startsWith("Accept-Encoding: ")
            );

            let encoding = '';
            if (acceptEncoding) {
              const encodings = acceptEncoding.split(": ")[1].split(", ");
              if (encodings.includes('gzip')) {
                encoding = 'gzip';
              }
            }

            if (encoding === "gzip") {
              zlib.gzip(message, (err, buffer) => {
                if (err) {
                  response = `HTTP/1.1 500 Internal Server Error\r\n\r\n`;
                  changeResponse(response);
                } else {
                  response = `HTTP/1.1 200 OK\r\nContent-Encoding: gzip\r\nContent-Type: text/plain\r\nContent-Length: ${buffer.length}\r\n\r\n`;
                  socket.write(response);
                  socket.write(buffer);
                  socket.end();
                }
              });
            } else {
              response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`;
              changeResponse(response);
            }
            break;

          case "user-agent":
            const userAgent = requestLines.find(line => line.startsWith("User-Agent: "));
            const userAgentMessage = userAgent ? userAgent.split(": ")[1] : "";
            response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentMessage.length}\r\n\r\n${userAgentMessage}`;
            changeResponse(response);
            break;

          case "files":
            const args = process.argv.slice(2);
            const [_, __, fileName] = path.split("/");
            const [___, absPath] = args;
            const filePath = absPath + fileName;

            try {
              const content = fs.readFileSync(filePath);
              response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n`;
              socket.write(response);
              socket.write(content);
              socket.end();
            } catch (error) {
              response = `HTTP/1.1 404 Not Found\r\n\r\n`;
              changeResponse(response);
            }
            break;

          default:
            const defaultMessage = path.split("/")[1];
            response = `HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: ${defaultMessage.length}\r\n\r\n${defaultMessage}`;
            changeResponse(response);
        }
        break;

      case "POST":
        const [__, dirName, postFileName] = path.split("/");
        const directoryPath = process.argv[3];
        const postFilePath = `${directoryPath}/${postFileName}`;

        console.log(postFilePath);
        const body = requestLines[requestLines.length - 1];
        try {
          fs.writeFileSync(postFilePath, body);
          response = `HTTP/1.1 201 Created\r\n\r\n`;
          changeResponse(response);
        } catch (error) {
          response = `HTTP/1.1 400 Bad Request\r\n\r\n`;
          changeResponse(response);
        }
        break;
    }
  });
});

server.listen(4221, "localhost", () => console.log("listening on port"));
