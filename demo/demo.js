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
      $metadataConsole = $('#metadataConsole');


  filepicker.setKey('Ah8QlzykQRGcsx1SaObz0z');

  /*
   * Actual demo code
   *
   */
  var onFormSubmit = function(e) {
    e.preventDefault();

    var url = $fileURLInput.val();

    if (url) {
      $resultsSection.show();
      $previewImage.attr('src', FilePreviews.getPreviewURL(url));
      $previewImageLink.attr('href', '');
      $metadataConsole.html('Processing, please wait...');

      // Here's all the magic
      FilePreviews.generate(url, function(err, result) {
        if (err) {
          $metadataConsole.text('Something went wrong...');
          $previewImage.attr('src', 'http://i.imgur.com/caZYo6v.jpg');
        } else {
          $previewImage.attr('src', result.previewURL + '?1');
          $previewImageLink.attr('href', result.previewURL + '?1');
          $metadataConsole.html(JSON.stringify(result.metadata, null, '  '));
        }
      });
    }
  };


  var onClickExampleLink = function(e) {
    e.preventDefault();

    var $link = $(e.currentTarget),
        linkHref = $link.attr('href');

    $fileURLInput.val(linkHref);
  };


  var onUploadedFile = function(inkBlob) {
    $fileURLInput.val(inkBlob.url);
    $fileForm.submit();
  };


  var onClickUploadFileLink = function(e) {
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
