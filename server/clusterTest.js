const cluster = require('cluster'); // native to node
const http = require('http');
const numCPUs = require('os').availableParallelism();
const process = require('process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
    // what is does ? 
    // create a new worker process
    // each worker process has its own event loop and memory space
    // each worker process has its own pid
    // each worker process has its own socket connection
    // each worker process has its own http server
    // each worker process has its own socket.io instance
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
    console.log(`Worker ${process.pid} has been used!!!!`)
  }).listen(8000);

  console.log(`Worker ${process.pid} started  `);
}