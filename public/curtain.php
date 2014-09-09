<html>
<head>
</head>

<body>

<a href="http://smile-cll54.nicovideo.jp/smile?v=12017728.24318">asdf</a>

<a href="file:///C:/xampp/htdocs/nicokara/theater.php?local=1">local file</a>

<script type="text/javascript">

(function tryPlayStreaming(contentsId,karaokeContentsId, siteCode, jq) {
    jq.ajax({
        type: "POST",
        async: false,
        url: "/dam/app/music/checkContractAtdam.jsp",
        data: "contentsId=" + contentsId,
        success: function(result) {
            console.log(result);
            result=result.replace(/\n/g,'');
            console.log(result);
            // if (Number(result) == 0) {
            //     // 未ログイン時
            //     WebMember.attach_message('atDam','1001');
            // } else if (Number(result) == 1) {
            //     // 未契約時
            //     WebMember.attach_message('atDam','1003');
            // } else
            if (Number(result) == 2) {
            //     // 契約済時
                sOpen(contentsId,karaokeContentsId,siteCode);
            // } else {
            //     location.href = "/various/error/import/systemerror.html";
            }
        },
        error: function() {
            location.href = "/various/error/import/systemerror.html";
        }
    });
})('3977946','2850969','01', jQuery);

function getOneTimeToken() {
var ret;
jQuery.noConflict();
(function($) {
    $.ajax({
        type: "GET",
        async: false,
  url: "/dam/app/auth/getOneTimeToken.jsp",
  // 成功時にtokenを取得
  success: function(token) {
            token=token.replace(/\n+$/g,'');
            ret = token;
  },
  error: function() {
      location.href = "/various/error/import/systemerror.html";
  }
    });
})(jQuery);

return ret;
}

function httpRequest(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState==4 && xmlHttp.status==200) {
      if (callback) {
        callback(xmlHttp.responseText);
      }
      xmlHttp.onreadystatechange = null;
    }
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
}

function getDamToken() {
  httpRequest("http://www.clubdam.com/dam/app/auth/getOneTimeToken.jsp",
    function (response) {
      console.log(response);
    }
  );
}


(function sOpen (contentsId,karaokeContentsId, siteCode) {
  var width = 1000;
  var height = 880;
  var token = getOneTimeToken();
  var url = '/app/service/leaf/karaokeAtDam.do?contentsId='+contentsId +
    '&karaokeContentsId='+karaokeContentsId+'&siteCode='+siteCode+'&token='+token;
  // win=window.open(url,'_blank');
  var openFrame = document.createElement("iframe");
  openFrame.src = url;
  document.body.appendChild(openFrame);
})('3977946','2850969','01');

</script>

<div class="damkaraScene"></div>

<script type="text/javascript" src="http://ext.nicovideo.jp/thumb_watch/sm1589969"></script>

</body>
</html>
