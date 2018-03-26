var venueDirectory = 'joes-house';
var targetURL = 'http://theodoremichels.tech:3333/venues/' + venueDirectory + '/videos/';

var request = require('request');
var clc = require('cli-color');
var fs = require('fs');

var downloading = false;

console.log(clc.red.bgBlack.bold('Hello Dave. You\'re Looking well today.'));

var options = {
    url: targetURL
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);

        var newFile = false;

        var newFileName;
        
        for (var i = 0; i < info.length; i++) {
            var fileName = info[i];
            if (fileName != 'temp-download') {
                if (!fs.existsSync('data/' + fileName)) {

                    newFile = true;
                    newFileName = fileName;
                    console.log('New File: ' + clc.green(newFileName));
                }
            }
        }

        if (newFile) {
            downloading = true;
            request
                .get('http://theodoremichels.tech/venues/videos/' + venueDirectory + '/' + newFileName)
                .on('error', function (err) {
                    console.log(err);
                })
                .on('response', function (response) {
                    console.log('Beginning download of '+ newFileName +', code: ' + response.statusCode);

                })
                .pipe(fs.createWriteStream('data/' + newFileName + '.tmp').on('finish', function () {
                    console.log('Finished downloading ' + newFileName);
                    fs.rename('data/' + newFileName + '.tmp', 'data/' + newFileName, function(){
                        downloading = false;
                    });
                    
                }));
        }else{
            console.log(clc.blackBright('No new files found.'));
        }

    }
}

function checkServer() {
    if(!downloading){
        console.log('Checking server...');
        request(options, callback);
    }
    
}

if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

checkServer();
setInterval(checkServer, 5000);