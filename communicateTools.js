var http = require('http');

function getMindes(){
    var req = http.get(options, function(res){
  
        //응답처리
        var resData = '';
        res.on('data', function(chunk){
          resData += chunk;
        });
      
        res.on('end', function(){
          console.log(resData);
        });
      
        res.on('error', function(err){
          console.log("오류발생: "+ err.message);
        });
      
    });
}