/*
 * @name: ajax-comet.js
 * @author: Haosdent Huang
 * @email: haosdent@gmail.com
 * @date: 2013-05-11
 * @overview: Comet demo based ajax stream.
 */
window.onload = function(){
    var xhr;
    try{
        xhr = new XMLHttpRequest();
    }catch(e){
        alert('Please test this code in Chrome.');
        return;
    }

    var pos = 0;
    var addPoint = document.getElementById('add-point');
    // Match the informations in every syslog style record.
    var regex = /(\w+ +\d+ \d+:\d+:\d+) (\S+) ([\w \]\[]+): (.+)/;
    var tempNode = document.createElement('tbody');
    var tipNode = document.getElementById('tip');

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 1){
            tipNode.innerText = 'Finish to establish the connection.';
        }else if(xhr.readyState >= 3){
            if(xhr.readyState === 3){
                tipNode.innerText = 'Finish load data...';
            }else{
                tipNode.innerText = 'Receive data.....';
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
                tempNode.innerHTML = html;
                addPoint.appendChild(tempNode.children[0]);
            };
        };
    };

    xhr.open('GET', 'system.log', true);
    xhr.send(null);
};