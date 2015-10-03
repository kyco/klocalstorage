/*
**
**  klocalstorage
**  =============
**
**  Version 1.0.1
**
**  Brought to you by
**  https://www.kycosoftware.com
**
**  Copyright 2015 Cornelius Weidmann
**
**  Distributed under the GPL
**
*/

'use strict';

var klocalstorage = {} || klocalstorage;

klocalstorage.JQUERY_URL           = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js';
klocalstorage.JSONEDITOR_URL       = 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/4.2.1/jsoneditor.min.js';
klocalstorage.JSONEDITOR_STYLE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/4.2.1/jsoneditor.min.css';

klocalstorage.STYLE     = document.getElementById('klocalstorage_style');
klocalstorage.SCRIPT    = document.getElementById('klocalstorage_script');
klocalstorage.ERROR_MSG = 'An error occurred while getting the required dependencies.';
klocalstorage.editor    = {};

klocalstorage.init = function() {
  var myTrigger = '<div id="klocalstorage_trigger">+</div>';
  var myDiv     = '<div id="klocalstorage"></div>';
  var myOverlay = '<div id="klocalstorage_overlay"></div>';

  $('body').append(myTrigger, myDiv, myOverlay);
  klocalstorage.getLatest();
  klocalstorage.attachMarkupHandlers();

  $('#klocalstorage_overlay').click(function() {
    $('#klocalstorage_trigger, #klocalstorage, #klocalstorage_overlay').toggleClass('active');
    $('body').toggleClass('klocalstorage_activated');
    if (!$('#klocalstorage_trigger').hasClass('active')) {
      $('#klocalstorage_trigger').html('+');
    }
  });

  $('#klocalstorage_trigger').click(function() {
    $(this).toggleClass('active');
    $('body').toggleClass('klocalstorage_activated');
    if ($(this).hasClass('active')) {
      $(this).html('-');
      klocalstorage.getLatest();
      klocalstorage.attachMarkupHandlers();
    } else {
      $(this).html('+');
    }
    $('#klocalstorage, #klocalstorage_overlay').toggleClass('active');
  });

  $('#klocalstorage_trigger').trigger('click');
};

klocalstorage.getLatest = function() {
  var markup     = '';
  var otherItems = {};
  var rawStorage = {};
  var n          = localStorage.length;
  var i, item, key, value;
  var options = {
    mode: 'tree',
    modes: ['tree', 'text']
  };

  for (i = 0; i < n; i++) {
    markup += '<h5 data-index="' + i + '">' + localStorage.key(i) + '<button action="delete">Delete</button><button action="save">Save</button></h5>';
    markup += '<div data-index="' + i + '"></div>';
  }

  markup += '<h5 data-index="' + (i + 1) + '">// Other items</h5>';
  markup += '<div data-index="' + (i + 1) + '"></div>';
  markup += '<h5 data-index="' + (i + 2) + '">// Raw localStorage</h5>';
  markup += '<div data-index="' + (i + 2) + '"></div>';

  $('#klocalstorage').html(markup);

  for (i = 0; i < n; i++) {
    item  = '';
    key   = localStorage.key(i);
    value = localStorage.getItem(key);
    klocalstorage.editor['_' + i] = new JSONEditor($('#klocalstorage div[data-index="' + i + '"]')[0], options);

    try {
      item = JSON.parse(value);
    } catch (err) {
      item = value;
    }

    if (typeof item !== 'object') {
      otherItems[key] = item;
      $('#klocalstorage div[data-index="' + i + '"], #klocalstorage h5[data-index="' + i + '"]').remove();
    } else {
      klocalstorage.editor['_' + i].set(item);
    }

    rawStorage[key] = item;
  }

  klocalstorage.editor['_' + (i + 1)] = new JSONEditor($('#klocalstorage div[data-index="' + (i + 1) + '"]')[0], options);
  klocalstorage.editor['_' + (i + 2)] = new JSONEditor($('#klocalstorage div[data-index="' + (i + 2) + '"]')[0], options);
  klocalstorage.editor['_' + (i + 1)].set(otherItems);
  klocalstorage.editor['_' + (i + 2)].set(rawStorage);
};

klocalstorage.attachMarkupHandlers = function() {
  var clickSave = function(e) {
    var index = $(this).parent().data('index');
    var key   = localStorage.key(index);
    var value;

    e.stopImmediatePropagation();

    try {
      value = klocalstorage.editor['_' + index].get();
      localStorage.setItem(key, JSON.stringify(value));
      $(this).before('<span class="klocalstorage_msg">Saved!</span>');
      $('#klocalstorage h5 .klocalstorage_msg').fadeOut(1000, function() {
        $(this).remove();
      });
    } catch (err) {
      $(this).before('<span class="klocalstorage_msg">Error! Must be String, Number, Array or Object!</span>');
      $('#klocalstorage h5 .klocalstorage_msg').fadeOut(5000, function() {
        $(this).remove();
      });
    }
  };

  var clickDelete = function(e) {
    var index = $(this).parent().data('index');
    var value = klocalstorage.editor['_' + index].get();
    var key   = localStorage.key(index);

    e.stopImmediatePropagation();
    localStorage.removeItem(key);

    $(this)
    .prop('disabled', true)
    .siblings('button[action="save"]')
    .off('click')
    .html('Restore')
    .attr('action', 'restore')
    .on('click', function(ee) {
      ee.stopImmediatePropagation();
      localStorage.setItem(key, JSON.stringify(value));

      $(this)
      .attr('action', 'save')
      .html('Save')
      .off('click')
      .on('click', clickSave)
      .before('<span class="klocalstorage_msg">Restored!</span>')
      .siblings('button[action="delete"]')
      .prop('disabled', false);

      $('#klocalstorage h5 .klocalstorage_msg').fadeOut(1000, function() {
        $(this).remove();
      });
    });

    $(this).before('<span class="klocalstorage_msg">Deleted!</span>');
    $('#klocalstorage h5 .klocalstorage_msg').fadeOut(1000, function() {
      $(this).remove();
    });
  };

  $('#klocalstorage h5').off('click').on('click', function() {
    $(this).toggleClass('active').next('div').toggleClass('active');
  });

  $('#klocalstorage h5 button[action="save"]').off('click').on('click', clickSave);
  $('#klocalstorage h5 button[action="delete"]').off('click').on('click', clickDelete);
};

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////
//////////     HELPER FUNCTIONS
//////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

klocalstorage.corsRequest = function(url, method, data, callback, errCallback) {
  var req;

  if (XMLHttpRequest) {
    req = new XMLHttpRequest();

    if ('withCredentials' in req) {
      req.open(method, url, true);
      req.onerror = errCallback;

      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
          } else {
            errCallback();
          }
        }
      };

      req.send(data);
    }
  } else if (XDomainRequest) {
    req = new XDomainRequest();
    req.open(method, url);
    req.onerror = errCallback;
    req.onload  = function() {
      callback(req.responseText);
    };
    req.send(data);
  } else {
    // CORS not supported
    errCallback();
  }
};

klocalstorage.appendScript = function(d, content, script) {
  script           = d.createElement('script'); // eslint-disable-line
  script.async     = 1;
  script.innerHTML = content;

  klocalstorage.SCRIPT.parentNode.insertBefore(script, klocalstorage.SCRIPT);
};

klocalstorage.appendStyle = function(d, style) {
  style      = d.createElement('link'); // eslint-disable-line
  style.rel  = 'stylesheet';
  style.href = klocalstorage.JSONEDITOR_STYLE_URL;

  klocalstorage.STYLE.parentNode.insertBefore(style, klocalstorage.STYLE);
};

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////
//////////     START
//////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

klocalstorage.build = (function() {
  if (typeof jQuery === 'undefined' && typeof JSONEditor === 'undefined') {
    klocalstorage.corsRequest(klocalstorage.JQUERY_URL, 'GET', '', function(res) {
      klocalstorage.appendScript(document, res);

      klocalstorage.corsRequest(klocalstorage.JSONEDITOR_URL, 'GET', '', function(res2) {
        klocalstorage.appendScript(document, res2);

        klocalstorage.corsRequest(klocalstorage.JSONEDITOR_STYLE_URL, 'GET', '', function(res3) {
          klocalstorage.appendStyle(document, res3);
          klocalstorage.init();
        }, function() {
          console.error(klocalstorage.ERROR_MSG); // eslint-disable-line
        });
      }, function() {
        console.error(klocalstorage.ERROR_MSG); // eslint-disable-line
      });
    }, function() {
      console.error(klocalstorage.ERROR_MSG); // eslint-disable-line
    });
  }

  if (typeof jQuery === 'undefined' && typeof JSONEditor !== 'undefined') {
    klocalstorage.corsRequest(klocalstorage.JQUERY_URL, 'GET', '', function(res) {
      klocalstorage.appendScript(document, res);
      klocalstorage.init();
    }, function() {
      console.error(klocalstorage.ERROR_MSG); // eslint-disable-line
    });
  }

  if (typeof jQuery !== 'undefined' && typeof JSONEditor === 'undefined') {
    klocalstorage.corsRequest(klocalstorage.JSONEDITOR_URL, 'GET', '', function(res) {
      klocalstorage.appendScript(document, res);

      klocalstorage.corsRequest(klocalstorage.JSONEDITOR_STYLE_URL, 'GET', '', function(res2) {
        klocalstorage.appendStyle(document, res2);
        klocalstorage.init();
      }, function() {
        console.error(klocalstorage.ERROR_MSG); // eslint-disable-line
      });
    }, function() {
      console.error(klocalstorage.ERROR_MSG); // eslint-disable-line
    });
  }

  if (typeof jQuery !== 'undefined' && typeof JSONEditor !== 'undefined') {
    klocalstorage.init();
  }
})();
