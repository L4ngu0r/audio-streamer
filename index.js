var fs = require('fs'),
    http = require('http'),
    os = require('os'),
    fork = require('child_process').fork,
    directory = './files',
    clips = [],
    stream,
    currentFile,
    filePath = "./compact.mp3",
    port = 2000;

/**
 * Handle entry params
 */
process.argv.forEach((val, index) => {
    switch (index) {
        case 2:
            port = val;
            break;
        case 3:
            directory = val;
            break;
        case 4 :
            filePath = val;
            break;
        case 5 :
            // sorting order
            break;
    }
});

// Initialize
var files = fs.readdirSync(directory),
    compactFile = fs.createWriteStream(filePath);

/**
 * Creating an array of all the file
 */
files.forEach(function (file) {
    clips.push(file);
});

/**
 * Sorting alphabetically array
 */
clips.sort(function (a, b) {
    return a - b;
});

/**
 * Get server ip addresses
 * @returns {Array}
 */
function getIps() {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses;
}

/**
 * Handle app exit
 * @param child
 */
function exitHandler(child) {
    console.info("App is exiting...");

    fs.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
        console.info("Temporary file deleted");
    });

    child.on('exit', () => {
        console.info("Killing child process");
    });
    child.kill('SIGINT');
}

/**
 * Start another child process to launch the streamer
 */
function launchingServer() {
    console.info("Server will listen on address : " + getIps()[0] + " on port " + port);
    var child = fork("./server.js", [port]);
    process.on('exit', exitHandler.bind(null, child));
    process.on('SIGINT', exitHandler.bind(null, child));
}

/****************************
 *
 * Main function
 *
 ****************************/

function main() {
    if (!clips.length) {
        console.log("Process terminated");
        compactFile.end("Done");
        launchingServer();
        return;
    }

    currentFile = directory + '/' + clips.shift();
    stream = fs.createReadStream(currentFile);

    stream.pipe(compactFile, {end: false});

    stream.on("end", () => {
        console.log(currentFile + ' appended');
        main();
    });
}

main();