'use strict';

// Includes
var express = require('express');
var cluster = require('cluster');
var path = require('path');

// If this is the master process, set up the cluster
if (cluster.isMaster) {
    // Start one cluster worker node per CPU
    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    // Replace any workers that die
    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });

// If this is a worker process, start express server
} else {
    var app = express();

    // Add a basic route – login page
    app.get('/', function (request, response) {
        response.sendFile(path.join(__dirname + '/login.html'));
        response.end();
        //response.send('Hello from Worker ' + cluster.worker.id);
    });

    // Bind to a port
    app.listen(8042);
    console.log('Worker %d running!', cluster.worker.id);
}
