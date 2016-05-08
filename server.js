var fs = require('fs'),
    http = require('http'),
    filePath = "./compact.mp3",
    stat = fs.statSync(filePath);

http.createServer((request, response) => {
        console.info("[New client] launching server !!");
        response.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });

        fs.createReadStream(filePath).pipe(response);
    })
    .listen(process.argv[2]);