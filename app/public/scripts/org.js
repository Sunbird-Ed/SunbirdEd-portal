var openModal = function () {
    // Get the modal
    var modal = document.getElementById('org-list-model');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'org-list-model';
        document.getElementsByTagName('body')[0].appendChild(modal);
        var styleNode = document.createElement('style');
        styleNode.type = "text/css";
        var cssText=".modal{display:none;position:fixed;z-index:1;padding-top:100px;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:#000;background-color:rgba(0,0,0,.4)}.modal-content{position:relative;background-color:#fefefe;margin:auto;padding:0;border:1px solid #888;width:80%;box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);-webkit-animation-name:animatetop;-webkit-animation-duration:.4s;animation-name:animatetop;animation-duration:.4sborder-radius:6px;}@-webkit-keyframes animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}@keyframes animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}.close{color:#333;float:right;font-size:28px;font-weight:700}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer}.modal-footer,.modal-header{padding:2px 16px;background-color:#fff;color:#222;border-radius:7px;;}.modal-body{padding:25px 16px 25px;}table{font-family:arial,sans-serif;border-collapse:collapse;width:100%;}td,th{border:1px solid #dddddd;text-align:left;padding:8px;}";
        // browser detection (based on prototype.js)
        if (!!(window.attachEvent && !window.opera)) {
            styleNode.styleSheet.cssText = cssText;
        } else {
            var styleText = document.createTextNode(cssText);
            styleNode.appendChild(styleText);
        }
        document.getElementsByTagName('head')[0].appendChild(styleNode);       
        modal.innerHTML = '<div class="modal-content"> <div class="modal-header"><span class="close" onclick="closeModal()">×</span><h2>Organizations List</h2></div>' +
                '<div class="modal-body"><table id="orgList" border="1"><thead><tr>' +
                '<th>Name</th><th>Email</th><th>Phone</th></tr></thead><tbody></tbody>' +
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
    emptyTable(table);
    var client = new HttpClient();
    client.get('/api/public/service/orgs', function (res) {
        res = JSON.parse(res);
        if (res && res.responseCode == "OK") {
            var data = res.result.response.content;
            var tblHtml = '';
            data.forEach(function (item, index) {
                item.orgName = item.orgName || '';
                item.contactDetails.email = item.contactDetails.email || '';
                item.contactDetails.phone = item.contactDetails.phone || '';
                if (item.orgName != '') {
                    tblHtml += '<tr>' + '<td>' + item.orgName + '</td><td>' + item.contactDetails.email + '</td><td>' + item.contactDetails.phone + '</td></tr>';
                }
            });
            table.getElementsByTagName('tbody')[0].innerHTML = tblHtml;
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
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

