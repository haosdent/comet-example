/*
 * @name: ajax-comet.js
 * @author: Haosdent Huang
 * @email: haosdent@gmail.com
 * @date: 2013-05-11
 * @overview: Comet demo based ajax stream.
 */

var getXhr = function(){
    var xhr;
    if(window.XMLHttpRequest){
        // For IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    }else{
        // For IE6, IE5
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // When the browser is not supported, the website would show warning.
    if(!xhr){
        alert('Sorry, you browser is not supported!');
        throw new Error('Unsupported browser!xs');
    };

    return xhr;
};

var appendTr = function(addPoint, html){
    // Use for simplify dom operations.
    var tempNode = document.createElement('tbody');
    // Create and insert a tr node with record content to addPoint element.
    tempNode.innerHTML = html;
    addPoint.appendChild(tempNode.children[0]);
};

var showResp = function(addPoint, newResp){
    /*
     * Match the informations in every syslog style record.
     * (\w+ +\d+ \d+:\d+:\d+) matches time field in record.
     * (\S+) matches host field in record.
     * ([\w \]\[]+) matches tag field in record.
     * (.+) matches content field in record.
     * */
    var regex = /(\w+ +\d+ \d+:\d+:\d+) (\S+) ([\w \]\[]+): (.+)/;
    var data = newResp.split('\n')
      , html;

    for(var i = 0, l = data.length; i < l; i++){
        var d = data[i];
        var results = regex.exec(d);
        // Skip the record if the format of it is invaild.
        if(results === null) continue;

        var time = results[1]
          , host = results[2]
          , tag = results[3]
          , content = results[4];

        html = '<tr>'
             + '<td>' + time + '</td>'
             + '<td>' + host + '</td>'
             + '<td>' + tag + '</td>'
             + '<td>' + content + '</td>'
             + '</tr>';
        // Append new html to appPoint.
        appendTr(addPoint, html);
    };
};

var showSyslog = function(addPoint, syslogUrl){
    // Create ajax request object.
    var xhr = getXhr();
    // Use for mark the position of present response text.
    var pos = 0;
    // Use for show the request status.
    var tipNode = document.getElementById('tip');

    // Ajax streaming callback function.
    xhr.onreadystatechange = function(){
        // Handle request error.
        if(xhr.readyState > 1 && xhr.status >= 400){
            tipNode.innerText = 'Request error.';
            return;
        };
        // When readyState is less than 2, return directly.
        if(xhr.readyState <= 2){
            tipNode.innerText = 'Establish the connection.';
            return;
        };

        var resp, newResp;
        resp = xhr.responseText;
        if(xhr.readyState === 3){
            tipNode.innerText = 'Receive data.....';
            /*
             * Sometimes client reveice incomplete responseText, the last record is incomplete and still in transmission.
             * So I split responseText but the last recode.
             * */
            newResp = resp.substring(pos, resp.lastIndexOf('\n'));
        }else if(xhr.readyState === 4){
            tipNode.innerText = 'Finish load data.';
            newResp = resp.substring(pos);
        };
        // Update pos to current location.
        pos += newResp.length;
        showResp(addPoint, newResp);
    };

    xhr.open('GET', syslogUrl, true);
    xhr.send(null);
};