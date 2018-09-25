function youtubeQuery(api, search, callback) {
  var key = "AIzaSyAM1ahn1DkYNhmRvPBVnEHV0efORA52Vq4";
  var gapi = "https://www.googleapis.com/youtube/v3/" + api + "?part=snippet&key=" + key + "&" + search;
  httpRequest(gapi, function(response) {
    callback(response);
  });
}