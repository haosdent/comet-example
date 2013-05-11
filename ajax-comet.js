/*
 * @name: ajax-comet.js
 * @author: Haosdent Huang
 * @email: haosdent@gmail.com
 * @date: 2013-05-11
 * @overview: Comet demo based ajax stream.
 */

var showSyslog = function(addPoint, syslogUrl){
    // Create ajax request object.
    var xhr;
    if(window.XMLHttpRequest){
        // For IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    }else{
        // For IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // When the browser is not supported, the website would show warning.
    if(!xhr){
        alert('Sorry, you browser is not supported!');
        return;
    };

    // Use for mark the position of present response text.
    var pos = 0;
    // Match the informations in every syslog style record.
    var regex = /(\w+ +\d+ \d+:\d+:\d+) (\S+) ([\w \]\[]+): (.+)/;
    // Use for simplify dom operations.
    var tempNode = document.createElement('tbody');
    // Use for show the request status.
    var tipNode = document.getElementById('tip');

    // Ajax streaming callback function.
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 1){
            tipNode.innerText = 'Establish the connection.';
        }else if(xhr.readyState >= 3){
            // Handle request error.
            if(xhr.status >= 400){
                tipNode.innerText = 'Request error.';
                return;
            };

            if(xhr.readyState === 3){
                tipNode.innerText = 'Receive data.....';
            }else{
                tipNode.innerText = 'Finish load data.';
            };
            var resp = xhr.responseText;
            var data = resp.substring(pos).split('\n');
            var html;

            /*
             * I split the record by '\n' and sometimes I reveice incomplete responseText, the last record is incomplete and still in transmission.
             * So I calculate the pos but the last recode.
             * */
            pos = resp.length - data[data.length - 1].length;

            /*
             * At here, I calcute the range of data explicitly.
             * When the readyState of xhr is 4, the last record is complete and it should be to handle.
             * */
            var l;
            if(xhr.readyState === 3){
                l = data.length - 1;
            }else{
                l = data.length;
            };

            for(var i = 0; i < l; i++){
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
                // Create and insert a tr node with record to addPoint element.
                tempNode.innerHTML = html;
                addPoint.appendChild(tempNode.children[0]);
            };
        };
    };

    xhr.open('GET', syslogUrl, true);
    xhr.send(null);
};

window.onload = function(){
    var addPoint = document.getElementById('add-point');
    var syslogUrl = 'system.log';
    showSyslog(addPoint, syslogUrl);
};