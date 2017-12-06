var openModal = function () {
  // Get the modal
  var modal = document.getElementById('org-list-model')
  if (!modal) {
    modal = document.createElement('div')
    modal.id = 'org-list-model'
    document.getElementsByTagName('body')[0].appendChild(modal)
    var styleNode = document.createElement('style')
    styleNode.type = 'text/css'
    var cssText = '.modal{display:none;position:fixed;z-index:1;padding-top:100px;left:0;top:0;width:100%;height:100%;background-color:#000;background-color:rgba(0,0,0,.4)}.modal-content{position:relative;background-color:#fefefe;margin:auto;padding:0;border:1px solid #888;width:80%;box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);-webkit-animation-name:animatetop;-webkit-animation-duration:.4s;animation-name:animatetop;animation-duration:.4sborder-radius: 6px}@-webkit-keyframes animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}@keyframes animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}.close{color:#333;float:right;font-size:28px;font-weight:700}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer}.modal-footer,.modal-header{padding:2px 16px;background-color:#fff;color:#222;border-radius:7px}.modal-body{padding:16px 16px;height:400px;overflow-y:auto}.organizationListDataHome{padding:0px 11px 10px 10px!important;height:350px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;-ms-flex-line-pack:start;align-content:space-between;white-space:nowrap;overflow-x:auto;overflow-y:hidden}.organizationListViewHome{margin:0 10px 20px 0};'
    // browser detection (based on prototype.js)
    if (window.attachEvent && !window.opera) {
      styleNode.styleSheet.cssText = cssText
    } else {
      var styleText = document.createTextNode(cssText)
      styleNode.appendChild(styleText)
    }
    document.getElementsByTagName('head')[0].appendChild(styleNode)
    modal.innerHTML = '<div class="modal-content"> <div class="modal-header"><span class="close" onclick="closeModal()">×</span><h2>Organizations List</h2></div>' +
                '<div class="modal-body"><p id="org-error"></p><div id="org-loader" align="center"></div><ul id="orgContainer" class="organizationListDataHome"></ul></div><div class="modal-footer"></div></div>'
    modal.setAttribute('class', 'modal')
  }
  modal.style.display = 'block'
  loadData()

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
    }
  }
}

var emptyTable = function (table) {
  table.innerHTML = ''
}
var loadData = function () {
  var table = document.getElementById('orgContainer')
  var error = document.getElementById('org-error')
  var loader = document.getElementById('org-loader')
  error.style.display = 'none'
  loader.innerHTML = '<h5>Loading Organizations.....</h5>'
  error.textContent = 'Unable to Load Organizations'
  error.style.color = 'red'
  emptyTable(table)
  table.style.visibility = 'hidden'
  loader.style.display = 'block'
  var client = new HttpClient()
  client.get('/public/service/orgs', function (res) {
    res = JSON.parse(res)
    if (res && res.responseCode == 'OK') {
      table.style.visibility = 'visible'
      var data = res.result.response.content
      if (data.length > 0) {
        var html = ''
        data.forEach(function (item, index) {
          item.orgName = item.orgName || ''

          if (item.orgName != '') {
            html += '<li class="organizationListViewHome"><a href="/' + item.slug + '">' + item.orgName + '</a></li>'
          }
        })
        table.innerHTML = html
        loader.style.visibility = 'hidden'
        table.style.visibility = 'visible'
      } else {
        loader.innerHTML = '<h5>No Organisations found</h5>'
        table.style.display = 'none'
      }
    } else {
      table.style.visibility = 'hidden'
      loader.style.display = 'none'
      error.style.display = 'block'
    }
  })
}

var closeModal = function () {
  var modal = document.getElementById('org-list-model')
  modal.style.display = 'none'
}

var HttpClient = function () {
  this.get = function (aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest()
    anHttpRequest.onreadystatechange = function () {
      if (anHttpRequest.readyState == 4) { aCallback(anHttpRequest.responseText) }
    }

    anHttpRequest.open('GET', aUrl, true)
    anHttpRequest.send(null)
  }
}

function insertAfter (newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}
