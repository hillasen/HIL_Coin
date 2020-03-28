// minerPort: 2030
// nodePort: 2040

var mysql = require('mysql');
var io = require('socket.io')(http);

  

 
var http = require('http');
 
var server = http.createServer();
 
var port = 7070;
 
server.listen(port, function() {
    console.log('server start');
});

server.on('request', function(req, res) {
    var connection = mysql.createConnection({
        host     : 'db.hillasen.com',
        user     : 'jun061227',
        password : 'j93009202!',
        database : 'hillasen'
      });
    connection.connect();
    console.log("HI");
    let nodes = [];
    let ret = "";
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    connection.query('SELECT * FROM coin_nodes', function (error, results, fields) {
        
        if (error) {
            console.log(error);
        }
        console.log(results);
        for(const node of results){
            nodes.push(node['ip']);
            console.log(nodes);
            console.log(node['ip']);
            if(ret == ""){
                ret = ret + node['ip'];
            }
            else{
                ret = ret + "," + node['ip'];
            }
        
        
        }
        console.log(nodes);
        console.log(JSON.stringify(nodes, null, 4));
        res.write(ret);
        console.log(nodes)
        
        console.log("OKOK");
        res.end();
        connection.end();
        
    });
    
});




