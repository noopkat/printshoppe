var nodesubmit = require("submit"),
    form = $('#printform'),
    i;

$('#printform').submit(function(e) {
  e.preventDefault();
  
  var items           = $('.item select'),
      itemLen         = items.length,
      customItems     = $('.customitem select'),
      customItemsLen  = customItems.length,
      customItemsFile = $('.customitem .customfile'),
      freetext        = $('#freetext').val(),
      msgBody         = '';


  // ala cart
  for (i = 0; i < itemLen; i++) {
    var itemQuant = $(items[i]).val();
    if (itemQuant > 0) {
      msgBody += items[i].id + ' x ' + itemQuant + '\n\n';
    }
  }

  // custom
  for (i = 0; i < customItemsLen; i++) {
    var itemQuant = $(customItems[i]).val();
    if (itemQuant > 0) {
      msgBody += $(customItemsFile[i]).val() + ' x ' + itemQuant + '\n\n';
    }
  }
  
  if (freetext != '') {
    msgBody += "Additional notes: \n" + freetext;
  }
  
  console.log(msgBody);
  $('#textdo').val(msgBody);
  
  var data = $('form').serialize();
  
  console.log(data);
  
  $.post( "/",  data, function() {console.log('yay', arguments)});
  
  $('#thanks').remove();
  var successhtml = "<h2 id='thanks'>Thanks, we got your print order! We will email you when it's ready to pick up.</h2>"
  $('#wrap').append(successhtml);
  
});
