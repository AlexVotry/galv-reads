

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
