$(function() {
  'use strict';

  var $fileForm = $('#fileForm'),
      $fileURLInput = $('#fileURLInput'),
      $uploadFileLink = $('#uploadFileLink'),
      $exampleLinks = $('.example-link'),

      $toggleCheckboxesLink = $('#toggleCheckboxesLink'),
      $advancedCheckboxes = $('input:checkbox'),
      $resultsSection = $('.results-section'),
      $previewImage = $('#previewImage'),
      $previewImageLink = $('#previewImageLink'),
      $imagesContainer = $('#imagesContainer'),
      $metadataConsole = $('#metadataConsole');


  filepicker.setKey('Ah8QlzykQRGcsx1SaObz0z');

  var onFormSubmit = function(e) {
    e.preventDefault();

    var url = $fileURLInput.val();

    if (url) {
      $resultsSection.show();
      $previewImage.attr('src', FilePreviews.getPreviewURL(url));
      $previewImageLink.attr('href', '');
      $metadataConsole.html('Processing, please wait...');

      /*
       *
       *  This is how we integrate with FilePreviews.io
       *  Look mom, no servers!
       *
       */
      FilePreviews.generate(url, function(err, result) {
        if (err) {
          $metadataConsole.text('Something went wrong...');
          $previewImage.attr('src', 'http://i.imgur.com/caZYo6v.jpg');
        } else {
          $previewImage.attr('src', result.previewURL + '?1');
          $previewImageLink.attr('href', result.previewURL + '?1');
          $metadataConsole.html(JSON.stringify(result.metadata, null, '  '));

          // Check if file is a PSD
          // to do some extra stuff
          var psd = result.metadata.extra_data.psd;
          if (psd) {
            displayLayers(psd);
          }
        }
      });
    }
  };


  var displayLayers = function(psd) {
    psd.layers.forEach(function(layer) {
      if (layer.layers) {
        // This is a group extract sub-layers
        displayLayers(layer);
      }

      $('<hr class="preview-hr"><h5 class="preview-h5">' + layer.type + ': ' + layer.name + '</h5>').appendTo($imagesContainer);
      $('<img src="' + layer.url + '" class="preview-layer">').appendTo($imagesContainer);
    });
  };


  var onClickExampleLink = function(e) {
    e.preventDefault();

    var $link = $(e.currentTarget),
        linkHref = $link.attr('href');

    $('.preview-layer').remove();
    $('.preview-hr').remove();
    $('.preview-h5').remove();
    $fileURLInput.val(linkHref);
    $fileForm.submit();
  };


  var onUploadedFile = function(inkBlob) {
    $fileURLInput.val(inkBlob.url);
    $fileForm.submit();
  };


  var onClickUploadFileLink = function() {
    filepicker.pick(onUploadedFile);
  };


  var toggleCheckboxes = function(e) {
    e.preventDefault();

    var allText = 'Check all',
        noneText = 'Uncheck all';

    if ($toggleCheckboxesLink.text() === allText) {
      $toggleCheckboxesLink.text(noneText);
    } else {
      $toggleCheckboxesLink.text(allText);
    }

    $advancedCheckboxes.each(function() {
      var $elem = $(this);
      $elem.prop('checked', !$elem.prop('checked'));
    });
  };


  // Event handlers
  $fileForm.submit(onFormSubmit);
  $exampleLinks.click(onClickExampleLink);
  $uploadFileLink.click(onClickUploadFileLink);
  $toggleCheckboxesLink.click(toggleCheckboxes);

});
