$(document).ready(function () {
  
  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);

  $.get("/api/items/" + id, function (res) {
    console.log(res);

    $("#ml-response").html(res);
    });

});