var openModal = function () {
    // Get the modal
    var modal = document.getElementById('org-list-model');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'org-list-model';
        document.getElementsByTagName('body')[0].appendChild(modal);
        var styleNode = document.createElement('style');
        styleNode.type = "text/css";
        var cssText = ".modal{display:none;position:fixed;z-index:1;padding-top:100px;left:0;top:0;width:100%;height:100%;background-color:#000;background-color:rgba(0,0,0,.4)}.modal-content{position:relative;background-color:#fefefe;margin:auto;padding:0;border:1px solid #888;width:80%;box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);-webkit-animation-name:animatetop;-webkit-animation-duration:.4s;animation-name:animatetop;animation-duration:.4sborder-radius:6px;}@-webkit-keyframes animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}@keyframes animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}.close{color:#333;float:right;font-size:28px;font-weight:700}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer}.modal-footer,.modal-header{padding:2px 16px;background-color:#fff;color:#222;border-radius:7px;;}.modal-body{padding:25px 16px 25px;height:400px;overflow-y:auto;}table{font-family:arial,sans-serif;border-collapse:collapse;width:100%;}td,th{border:1px solid #dddddd;text-align:left;padding:8px;}";
        // browser detection (based on prototype.js)
        if (!!(window.attachEvent && !window.opera)) {
            styleNode.styleSheet.cssText = cssText;
        } else {
            var styleText = document.createTextNode(cssText);
            styleNode.appendChild(styleText);
        }
        document.getElementsByTagName('head')[0].appendChild(styleNode);
        modal.innerHTML = '<div class="modal-content"> <div class="modal-header"><span class="close" onclick="closeModal()">×</span><h2>Organizations List</h2></div>' +
                '<div class="modal-body"><p id="org-error"></p><div id="org-loader" align="center"></div><table id="orgList" border="1"><thead><tr>' +
                '<th><h4>Name</h4></th><th><h4>Email</h4></th><th><h4>Phone</h4></th></tr></thead><tbody></tbody>' +
                '</table></div><div class="modal-footer"></div></div>';
        modal.setAttribute("class", "modal");

    }
    modal.style.display = "block";
    loadData();

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

};

var emptyTable = function (table) {
    table.getElementsByTagName('tbody')[0].innerHTML = '';
}
var loadData = function () {
    var table = document.getElementById('orgList');
    var error = document.getElementById('org-error');
    var loader = document.getElementById('org-loader');
    error.style.display = 'none';
    loader.innerHTML = '<h5>Loading Organizations.....</h5>';
    error.textContent = 'Unable to Load Organizations';
    error.style.color = 'red';
    emptyTable(table);
    table.style.display = 'none';
    loader.style.display = 'block';
    var client = new HttpClient();
    client.get('/public/service/orgs', function (res) {
        res = JSON.parse(res);
        if (res && res.responseCode == "OK") {
            table.style.display = 'table';
            var data = res.result.response.content;
            if (data.length > 0)
            {
                var tblHtml = '';
                data.forEach(function (item, index) {
                    item.orgName = item.orgName || '';
                    item.contactDetail = item.contactDetail || [];
                    var emailList = '<ul style="list-style:none;">';
                    var phoneList = '<ul style="list-style:none;">';
                    item.contactDetail.forEach(function (contact, index) {
                        if (contact.email) {
                            emailList += '<li><a href="mailto:' + contact.email + '">'+contact.email+'</a></li>';
                        }
                        if (contact.phone) {
                            phoneList += '<li>' + contact.phone + '</li>';
                        }
                    });
                    emailList += '</ul>';
                    phoneList += '</ul>';

                    if (item.orgName != '') {
                        tblHtml += '<tr>' + '<td><h5>' + item.orgName + '</h5></td><td>'+emailList+'</td><td>'+phoneList+'</td></tr>';
                    }
                });
                table.getElementsByTagName('tbody')[0].innerHTML = tblHtml;
                loader.style.display = 'none';
                table.style.display = 'table';
            } else {
                loader.innerHTML = '<h5>No Organisations found</h5>';
                table.style.display = 'none';
            }

        } else {
            table.style.display = 'none';
            loader.style.display = 'none';
            error.style.display = 'block';
        }
    });
}

var closeModal = function () {
    var modal = document.getElementById('org-list-model');
    modal.style.display = "none";
}

var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}