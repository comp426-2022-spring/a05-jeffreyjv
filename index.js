const fs = require("fs");
const minimist = require("minimist");
const args = minimist(process.argv.slice(2));
const express = require('express');
const app = express();

args['port', 'debug', 'log', 'help'];

const help = (`
server.js[options]
    --port  Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.
    --debug If set to true, creates endpoints /app/log/access/ which returns 
                a JSON access log from the database and /app/error which throws
                an error with the message "Error test succesfful". Defaults to false.
    --log   If set to false, no log files are written. Defaults to true. Logs are always
            written to database. 
    --help  Return this message and exit.
`);

if (args.help || args.h) {
    console.log(help);
    process.exit(0);
}

const logDB = require("./src/services/database.js");
const morgan = require('morgan');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('./public'));


args['port']
const HTTP_PORT = args.port ? args.port : 5000;

// Start an app server
const server = app.listen(HTTP_PORT, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', HTTP_PORT))
});



if(args.log != false && args.log != "false") {

    const logsDir = "./log/"
    if(!fs.existsSync(logsDir)) {
        
        fs.mkdirSync(logsDir)
    
    }
    
    const accessLogStream = fs.createWriteStream(logsDir +"access.log", {flags: 'a'})
    app.use(morgan('combined', {stream :accessLogStream}))
}

if(args.debug == true || args.debug == "true") {
    app.get("/app/log/access", (req, res) => {
        try{
            const caught1 = logDB.prepare("SELECT * FROM accesslog").all();
            res.status(200).json(caught1);
        } 
        catch(error) {
            console.error(error);
        }   
    });
    app.get("/app/error", (req,res) => {
        throw new Error("Error test succesful.");
    });
}

app.use((req, res, next) => {
    let logsData = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referrer: req.headers['referrer'],
        useragent: req.headers['user-agent']
    }
    const stmt = logDB.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const information = stmt.run(logsData.remoteaddr, logsData.remoteuser, logsData.time, logsData.method, logsData.url, logsData.protocol, logsData.httpversion, logsData.status, logsData.referrer, logsData.useragent);
    next();
})

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage);
    
});

app.get('/app/flip/', (req, res) => {
    res.status(200).json({'flip' : coinFlip()});
    res.writeHead(res.statusCode, {'Content-Type' : 'application/json'});
});


app.get('/app/flips/:number', (req, res) => {
    const flips = coinFlips(req.params.number);
    const summary = countFlips(flips);
    res.statusCode = 200;
    res.json({"raw" : flips, "summary" : summary});
  
});



app.get('/app/flip/call/heads', (req,res) => {
    var heads = flipACoin("heads");
    res.statusCode = 200;
    res.json(heads);
});

app.get('/app/flip/call/tails', (req,res) => {
    var tails = flipACoin("tails");
    res.statusCode = 200;
    res.json(tails);
});

// Default response for any other request
app.use(function(req, res){
    res.status(404).end('Endpoint does not exist');
    //res.type("text/plain");
});

/** Coin flip functions 
 * This module will emulate a coin flip given various conditions as parameters as defined below
 */

 function coinFlip() {
    return (Math.random() < 0.5 ? ("tails") : ("heads"));  
  }
  
 
  
  function coinFlips(flips) {
  
    let flipArray = [];
  
    for(var x = 0; x < flips; x++) {

      flipArray[x] = coinFlip();
    }
  
    return flipArray;
  
  }
  
  /** Count multiple flips
   */
  
  function countFlips(array) {
  

    let heads = 0;
    let tails = 0;

    for(var x = 0; x < array.length; x++){
        array[x] == "heads" ? heads++ : tails++
    }
    if(tails == 0) {
        return {
            heads : heads
        };
    } else if(heads == 0) {
        return {
            tails : tails
        };
    } else {
        return {
            heads: heads, tails: tails
        };
    }
  }
  
  /** Flip a coin!
    */
  
  function flipACoin(call) {
  

    let results = {call: call, flip: "", result: ""};
    results.flip = coinFlip();
    results.result = results.flip === call ? "win" : "lose";
    return results; 
  }