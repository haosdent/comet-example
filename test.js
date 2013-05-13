/*
 * @name: test.js
 * @author: Haosdent Huang
 * @email: haosdent@gmail.com
 * @date: 2013-05-13
 * @overview: Comet example unit test javascript.
 */

test('function test: getXhr', function(){
    var xhr = getXhr();

    var expectResult = true;
    var result = xhr instanceof XMLHttpRequest;
    deepEqual(expectResult, result);
});

test('function test: appendTr', function(){
    var addPoint = document.createElement('tbody');
    var html = '<tr>'
             + '<td>a</td>'
             + '<td>b</td>'
             + '<td>c</td>'
             + '<td>c</td>'
             + '</tr>';
    appendTr(addPoint, html);
    appendTr(addPoint, html);

    var expectResult = html + html;
    var result = addPoint.innerHTML;
    deepEqual(expectResult, result);
});

test('function test: showResp', function(){
    var addPoint = document.createElement('tbody');
    var newResp = 'May 10 00:52:20 host0 tag0: content0\nMay 10 00:52:21 host1 tag1: content1';
    showResp(addPoint, newResp);
    showResp(addPoint, newResp);

    var expectResult = '<tr><td>May 10 00:52:20</td><td>host0</td><td>tag0</td><td>content0</td></tr>'
                     + '<tr><td>May 10 00:52:21</td><td>host1</td><td>tag1</td><td>content1</td></tr>'
                     + '<tr><td>May 10 00:52:20</td><td>host0</td><td>tag0</td><td>content0</td></tr>'
                     + '<tr><td>May 10 00:52:21</td><td>host1</td><td>tag1</td><td>content1</td></tr>';
    var result = addPoint.innerHTML;
    deepEqual(expectResult, result);
});