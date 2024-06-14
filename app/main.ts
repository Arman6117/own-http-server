import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const headersAndBody = request.split("\r\n\r\n");
    const headers = headersAndBody[0].split("\r\n");
    const body = headersAndBody[1];

    const headerContentLength = headers.find((header) =>
      header.startsWith("Content-Length")
    );

    if (headerContentLength) {
      const contentLength = headerContentLength.split(":")[1].trim();
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${body} `

      socket.write(response)
    }

  });
});

server.listen(4221, "localhost");
