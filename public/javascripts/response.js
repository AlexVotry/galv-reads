// var xmlHttp = createXmlHttpRequestObject();
//
// function createXmlHttpRequestObject() {
//   var xmlHttp;
//
//   if(window.ActiveXObject) {
//     try{
//       xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
//     } catch(e) {
//       xmlHttp = false;
//     }
//   } else {
//     try {
//       xmlHttp = new XMLHttpRequest();
//     } catch(e) {
//       xmlHttp = false;
//     }
//   }
//   if(!xmlHttp)
//     alert('no xmlHttp');
//     else {
//       return xmlHttp;
//     }
// }

$(function() {
  $('#title').on('keydown', function(e) {
    if(e.keyCode === 9 || e.keyCode === 13) {
      var parameters = { title: $(this).val() };
      // //ajax request:
      $.get( '/books/new/title', parameters, function(data) {
        $('#response').html(data);
      });
    };
  });
});
