$(function() {
  'use strict';

  var previews,
      $fileForm = $('#fileForm'),
      $fileURLInput = $('#fileURLInput'),
      $exampleLinks = $('.example-link'),
      $previewImage = $('#previewImage'),
      $uploadFileLink = $('#uploadFileLink'),
      $resultsSection = $('.results-section'),
      $imagesContainer = $('#imagesContainer'),
      $metadataConsole = $('#metadataConsole'),
      $previewImageLink = $('#previewImageLink'),
      $advancedCheckboxes = $('input:checkbox'),
      $toggleCheckboxesLink = $('#toggleCheckboxesLink');

  previews = new FilePreviews({
    debug: true,
    resultsUrl: 'http://demo.filepreviews.io.s3-website-us-east-1.amazonaws.com/'
  });

  filepicker.setKey('Ah8QlzykQRGcsx1SaObz0z');

  var onFormSubmit = function(e) {
    var url = $fileURLInput.val();

    e.preventDefault();

    if (url) {
      $resultsSection.show();
      $previewImage.attr('src', previews.getPreviewURL(url));
      $previewImageLink.attr('href', '');
      $metadataConsole.html('Processing, please wait...');

      // This is how we integrate with FilePreviews.io
      // Look mom, no servers!
      previews.generate(url, function(err, result) {
        if (err) {
          $metadataConsole.text('Something went wrong...');
          $previewImage.attr('src', 'http://i.imgur.com/caZYo6v.jpg');
        } else {
          $previewImage.attr('src', result.previewURL + '?1');
          $previewImageLink.attr('href', result.previewURL + '?1');
          $metadataConsole.html(JSON.stringify(result.metadata, null, '  '));

          // Check if file is a PSD to do some extra stuff
          var psd = result.metadata.extra_data.psd;
          if (psd) displayLayers(psd);
        }
      });
    }
  };

  var displayLayers = function(psd) {
    psd.layers.forEach(function(layer) {
      if (layer.layers) displayLayers(layer); // This is a group extract sub-layers
      $('<hr class="preview-hr"><h5 class="preview-h5">' + layer.type + ': ' + layer.name + '</h5>').appendTo($imagesContainer);
      $('<img src="' + layer.url + '" class="preview-layer">').appendTo($imagesContainer);
    });
  };

  var onClickExampleLink = function(e) {
    var $link = $(e.currentTarget),
        linkHref = $link.attr('href');

    e.preventDefault();

    $('.preview-hr').remove();
    $('.preview-h5').remove();
    $('.preview-layer').remove();
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
    var allText = 'Check all',
        noneText = 'Uncheck all';

    e.preventDefault();

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
