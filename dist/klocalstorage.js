/*
**
**  klocalstorage
**  =============
**
**  Version 1.0.0
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
  var myOptions = '<div id="klocalstorage_options">…</div>';
  var myDiv     = '<div id="klocalstorage"></div>';
  var myOverlay = '<div id="klocalstorage_overlay"></div>';

  $('body').append(myTrigger, myOptions, myDiv, myOverlay);
  klocalstorage.getLatest();
  klocalstorage.attachMarkupHandlers();

  $('#klocalstorage_overlay').click(function() {
    $('#klocalstorage_trigger, #klocalstorage_options, #klocalstorage, #klocalstorage_overlay').toggleClass('active');
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
    $('#klocalstorage_options, #klocalstorage, #klocalstorage_overlay').toggleClass('active');
  });
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
    markup += '<h5 data-index="' + i + '">' + localStorage.key(i) + '<button>Save</button></h5>';
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
  $('#klocalstorage h5').off('click').on('click', function() {
    $(this).toggleClass('active').next('div').toggleClass('active');
  });

  $('#klocalstorage h5 button').off('click').on('click', function(e) {
    var index = $(this).parent().data('index');
    var value = klocalstorage.editor['_' + index].get();
    var key   = localStorage.key(index);

    e.stopImmediatePropagation();
    localStorage.setItem(key, JSON.stringify(value));

    $(this).before('<span class="icon-select-selected"></span>');
    $('#klocalstorage h5 .icon-select-selected').fadeOut(1000, function() {
      $(this).remove();
    });
  });
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
