/*
 * @name: ajax-comet.js
 * @author: Haosdent Huang
 * @email: haosdent@gmail.com
 * @date: 2013-05-11
 * @overview: Comet demo based ajax stream.
 */

var records = [] // Split the complete responseText into records and save them in this array.
  , currentPage = 1 // The current page number.
  , recordNumLimit = 10; // The limit number of records displayed in table.
var preBtn = document.getElementById('pre-btn')
  , nextBtn = document.getElementById('next-btn')
  , addPoint = document.getElementById('add-point');

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

// Save new responseText to global variable records.
var saveResp = function(newResp){
    newResp.split('\n').map(function(d){
        records.push(d);
    });
};

// Compute the number of pages, and check whether there is a next page.
var checkNext = function(){
    return Math.ceil(records.length / recordNumLimit) > currentPage? true : false;
};

// Check whether this is a previous page.
var checkPre = function(){
    return currentPage > 1? true : false;
};

// Update previous button and next button status.
var checkBtn = function(){
    if(checkNext()){
        nextBtn.className = 'next';
    }else{
        nextBtn.className = 'next disabled';
    };
    if(checkPre()){
        preBtn.className = 'previous';
    }else{
        preBtn.className = 'previous disabled';
    };
};

var toNext = function(){
    if(!checkNext()) return;
    currentPage++;
    checkBtn();
    showResp();
};

var toPre = function(){
    if(!checkPre()) return;
    currentPage--;
    checkBtn();
    showResp();
};

var showResp = function(){
    /*
     * Match the informations in every syslog style record.
     * (\w+ +\d+ \d+:\d+:\d+) matches time field in record.
     * (\S+) matches host field in record.
     * ([\w \]\[]+) matches tag field in record.
     * (.+) matches content field in record.
     * */
    var regex = /(\w+ +\d+ \d+:\d+:\d+) (\S+) ([\w \]\[]+): (.+)/;
    var startPos = (currentPage - 1) * recordNumLimit
      , endPos = startPos + recordNumLimit;
    if(endPos > records.length) endPos = records.length;
    var data = records.slice(startPos, endPos)
      , html = '';

    for(var i = 0, l = data.length; i < l; i++){
        var d = data[i];
        var results = regex.exec(d);
        // Skip the record if the format of it is invaild.
        if(results === null) continue;

        var time = results[1]
          , host = results[2]
          , tag = results[3]
          , content = results[4];

        html += '<tr>'
              + '<td>' + time + '</td>'
              + '<td>' + host + '</td>'
              + '<td>' + tag + '</td>'
              + '<td>' + content + '</td>'
              + '</tr>';
    };
    addPoint.innerHTML = html;
};

var getSyslog = function(url){
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
        saveResp(newResp);
        checkBtn();
        showResp();
    };

    xhr.open('GET', url, true);
    xhr.send(null);
};

// Bind listener to the previous button and next button.
preBtn.addEventListener('click', function(){
    toPre();
});
nextBtn.addEventListener('click', function(){
    toNext();
});