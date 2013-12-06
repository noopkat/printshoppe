var nodesubmit = require("submit"),
    form = $('#printform'),
    Mailgun = require('mailgun').Mailgun,
    mg = new Mailgun('pubkey-5b09s06ygf5w-6aha4yvegnj3phg1pw2'),
    formData = {},
    i;

$('#printform').submit(function(e) {
  e.preventDefault();
  console.log(e);
  items = $('.item select');
  itemLen = items.length,
  customItems = $('.customitem select'),
  customItemsLen = customItems.length,
  customItemsFile = $('.customitem .customfile'),
  msgBody = '';

  // ala cart
  for (i = 0; i < items.length; i++) {
    var itemQuant = $(items[i]).val();
    if (itemQuant > 0) {
      msgBody += items[i].id + ' = ' + itemQuant + '\n';
    }
  }

  // custom
  for (i = 0; i < customItems.length; i++) {
    var itemQuant = $(customItems[i]).val();
    if (itemQuant > 0) {
      msgBody += $(customItemsFile[i]).val() + ' = ' + itemQuant + '\n';
    }
  }

  console.log(msgBody);
  $('#textdo').val(msgBody);
  var data = $( 'form' ).serialize();
  
  console.log(data);
  $.post( "test.php",  data, function() {console.log('yay', arguments)});


});