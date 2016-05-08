# audio-streamer

Create a compiled of mp3 based on a directory into one file, and stream this file with a server.

Based on [node-streams](https://github.com/qawemlilo/node-streams/blob/master/stream.js).

### Required

Just a bunch of mp3 located in this repository :

```
/files
```

### Use

```
node index <port> <mp3-directory> <mp3-compiled-file>
```

Example :
```
node index 2000 "./files" "./compact.mp3"
```

Launching server apart :

```
node server
```

Try listening on :

```
http://<your-ip>:<port>/
```

## Todos

- add param to change files sorting order

## License

MIT