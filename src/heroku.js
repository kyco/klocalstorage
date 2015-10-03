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
  var myStyle   = '<style>.klocalstorage_activated{height:100%;overflow:hidden}#klocalstorage_overlay{position:fixed;z-index:99998;background-color:rgba(0,0,0,0.25);top:0;left:0;width:100%;height:100%;display:none}#klocalstorage_overlay.active{display:block}#klocalstorage_trigger{position:fixed;z-index:100000;top:0;right:0;width:25px;height:25px;line-height:25px;text-align:center;font-family:monospace;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}#klocalstorage_trigger.active{background-color:#fff}#klocalstorage *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}#klocalstorage{display:none;position:fixed;z-index:99999;top:0;right:0;width:600px;height:100%;background-color:#fff;font-family:monospace;white-space:pre;font-size:13px;line-height:1.5;overflow:scroll;box-shadow:0 0 15px #555}#klocalstorage.active{display:block}#klocalstorage h5{position:relative;padding:10px;height:40px;line-height:20px;-webkit-user-select:none;-moz-user-select:none;user-select:none}#klocalstorage h5+div{padding:0 10px;display:none;margin-bottom:10px}#klocalstorage h5+div.active{display:block}#klocalstorage h5:hover,#klocalstorage h5.active{background-color:#eee;cursor:pointer}#klocalstorage h5.active{border-left:5px solid #ddd}#klocalstorage h5.active button{display:block}#klocalstorage h5 button{position:absolute;display:none;top:9px;width:60px;height:23px;font-size:11px;cursor:default;text-align:center}#klocalstorage h5 button[action="save"],#klocalstorage h5 button[action="restore"]{right:15px}#klocalstorage h5 button[action="delete"]{right:75px}#klocalstorage h5 .klocalstorage_msg{position:absolute;top:12px;right:145px}#klocalstorage textarea.text{min-height:100%;line-height:1.5}#klocalstorage .jsoneditor,#klocalstorage .outer{height:auto;min-height:150px}#klocalstorage .outer{resize:vertical}</style>';
  var myTrigger = '<div id ="klocalstorage_trigger">+</div>';
  var myDiv     = '<div id ="klocalstorage"></div>';
  var myOverlay = '<div id ="klocalstorage_overlay"></div>';

  $('head').append(myStyle);
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
