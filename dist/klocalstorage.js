'use strict';

(function() {
  var editor = {};
  var myStyle = '.klocalstorage_activated{height:100%;overflow:hidden}#localstorage-browser-overlay{position:fixed;z-index:99998;background-color:rgba(0,0,0,0.25);top:0;left:0;width:100%;height:100%;display:none}#localstorage-browser-overlay.active{display:block}#localstorage-browser-trigger,#localstorage-browser-options{position:fixed;z-index:100000;top:0;right:0;width:25px;height:25px;line-height:25px;text-align:center;font-family:monospace;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}#localstorage-browser-trigger.active,#localstorage-browser-options.active{background-color:#fff}#localstorage-browser-options{right:25px;line-height:1.25;transform:rotate(90deg);display:none}#localstorage-browser{display:none;position:fixed;z-index:99999;top:0;right:0;width:600px;height:100%;background-color:#fff;font-family:monospace;white-space:pre;font-size:13px;line-height:1.5;overflow:scroll;box-shadow:0 0 15px #555}#localstorage-browser.active{display:block}#localstorage-browser h5{position:relative;padding:10px;-webkit-user-select:none;-moz-user-select:none;user-select:none}#localstorage-browser h5+div{padding:0 10px;display:none;margin-bottom:10px}#localstorage-browser h5+div.active{display:block}#localstorage-browser h5:hover,#localstorage-browser h5.active{background-color:#eee;cursor:pointer}#localstorage-browser h5.active button{display:block}#localstorage-browser h5 button{position:absolute;display:none;top:10px;right:15px}#localstorage-browser h5 .icon-select-selected{position:absolute;top:12px;right:60px}#localstorage-browser textarea.text{min-height:130px;resize:vertical;line-height:1.5}.jsoneditor .field,.jsoneditor .readonly,.jsoneditor .value{border:1px solid transparent;min-height:16px;min-width:32px;padding:2px;margin:1px;word-wrap:break-word;float:left}.jsoneditor .field p,.jsoneditor .value p{margin:0}.jsoneditor .value{word-break:break-word}.jsoneditor .readonly{min-width:16px;color:gray}.jsoneditor .empty{border-color:#d3d3d3;border-style:dashed;border-radius:2px}.jsoneditor .field.empty{background-image:url(https://klocalstorage.herokuapp.com/jsoneditor-icons.png);background-position:0 -144px}.jsoneditor .value.empty{background-image:url(https://klocalstorage.herokuapp.com/jsoneditor-icons.png);background-position:-48px -144px}.jsoneditor .value.url{color:green;text-decoration:underline}.jsoneditor a.value.url:focus,.jsoneditor a.value.url:hover{color:red}.jsoneditor .separator{padding:3px 0;vertical-align:top;color:gray}.jsoneditor .field.highlight,.jsoneditor .field[contenteditable=true]:focus,.jsoneditor .field[contenteditable=true]:hover,.jsoneditor .value.highlight,.jsoneditor .value[contenteditable=true]:focus,.jsoneditor .value[contenteditable=true]:hover{background-color:#FFFFAB;border:1px solid #ff0;border-radius:2px}.jsoneditor .field.highlight-active,.jsoneditor .field.highlight-active:focus,.jsoneditor .field.highlight-active:hover,.jsoneditor .value.highlight-active,.jsoneditor .value.highlight-active:focus,.jsoneditor .value.highlight-active:hover{background-color:#fe0;border:1px solid #ffc700;border-radius:2px}.jsoneditor div.tree button{width:24px;height:24px;padding:0;margin:0;border:none;cursor:pointer;background:url(https://klocalstorage.herokuapp.com/jsoneditor-icons.png)}.jsoneditor div.tree button.collapsed{background-position:0 -48px}.jsoneditor div.tree button.expanded{background-position:0 -72px}.jsoneditor div.tree button.contextmenu{background-position:-48px -72px}.jsoneditor div.tree button.contextmenu.selected,.jsoneditor div.tree button.contextmenu:focus,.jsoneditor div.tree button.contextmenu:hover{background-position:-48px -48px}.jsoneditor div.tree :focus{outline:0}.jsoneditor div.tree button:focus{background-color:#f5f5f5;outline:#e5e5e5 solid 1px}.jsoneditor div.tree button.invisible{visibility:hidden;background:0 0}.jsoneditor{color:#1A1A1A;border:1px solid #97B0F8;box-sizing:border-box;width:100%;height:100%;overflow:auto;position:relative;padding:0;line-height:100%}.jsoneditor,.jsoneditor div.outer{-moz-box-sizing:border-box;-webkit-box-sizing:border-box}.jsoneditor div.tree table.tree{border-collapse:collapse;border-spacing:0;width:100%;margin:0}.jsoneditor div.outer{width:100%;height:100%;margin:-35px 0 0;padding:35px 0 0;box-sizing:border-box;overflow:hidden}.jsoneditor div.tree{width:100%;height:100%;position:relative;overflow:auto}.jsoneditor textarea.text{width:100%;height:100%;margin:0;box-sizing:border-box;border:none;background-color:#fff;resize:none}.jsoneditor .menu,.jsoneditor textarea.text{-moz-box-sizing:border-box;-webkit-box-sizing:border-box}.jsoneditor tr.highlight{background-color:#FFFFAB}.jsoneditor div.tree button.dragarea{background:url(https://klocalstorage.herokuapp.com/jsoneditor-icons.png)-72px -72px;cursor:move}.jsoneditor div.tree button.dragarea:focus,.jsoneditor div.tree button.dragarea:hover{background-position:-72px -48px}.jsoneditor td,.jsoneditor th,.jsoneditor tr{padding:0;margin:0}.jsoneditor td,.jsoneditor td.tree{vertical-align:top}.jsoneditor .field,.jsoneditor .value,.jsoneditor td,.jsoneditor textarea,.jsoneditor th{font-family:droid sans mono,consolas,monospace,courier new,courier,sans-serif;font-size:10pt;color:#1A1A1A}.jsoneditor-contextmenu{position:absolute;z-index:99999}.jsoneditor-contextmenu ul{position:relative;left:0;top:0;width:124px;background:#fff;border:1px solid #d3d3d3;box-shadow:2px 2px 12px rgba(128,128,128,0.3);list-style:none;margin:0;padding:0}.jsoneditor-contextmenu ul li button{padding:0;margin:0;width:124px;height:24px;border:none;cursor:pointer;color:#4d4d4d;background:0 0;line-height:26px;text-align:left}.jsoneditor-contextmenu ul li button::-moz-focus-inner{padding:0;border:0}.jsoneditor-contextmenu ul li button:focus,.jsoneditor-contextmenu ul li button:hover{color:#1a1a1a;background-color:#f5f5f5;outline:0}.jsoneditor-contextmenu ul li button.default{width:92px}.jsoneditor-contextmenu ul li button.expand{float:right;width:32px;height:24px;border-left:1px solid #e5e5e5}.jsoneditor-contextmenu div.icon{float:left;width:24px;height:24px;border:none;padding:0;margin:0;background-image:url(https://klocalstorage.herokuapp.com/jsoneditor-icons.png)}.jsoneditor-contextmenu ul li button div.expand{float:right;width:24px;height:24px;padding:0;margin:0 4px 0 0;background:url(https://klocalstorage.herokuapp.com/jsoneditor-icons.png) 0 -72px;opacity:.4}.jsoneditor-contextmenu ul li button.expand:focus div.expand,.jsoneditor-contextmenu ul li button.expand:hover div.expand,.jsoneditor-contextmenu ul li button:focus div.expand,.jsoneditor-contextmenu ul li button:hover div.expand,.jsoneditor-contextmenu ul li.selected div.expand{opacity:1}.jsoneditor-contextmenu .separator{height:0;border-top:1px solid #e5e5e5;padding-top:5px;margin-top:5px}.jsoneditor-contextmenu button.remove>.icon{background-position:-24px -24px}.jsoneditor-contextmenu button.remove:focus>.icon,.jsoneditor-contextmenu button.remove:hover>.icon{background-position:-24px 0}.jsoneditor-contextmenu button.append>.icon{background-position:0 -24px}.jsoneditor-contextmenu button.append:focus>.icon,.jsoneditor-contextmenu button.append:hover>.icon{background-position:0 0}.jsoneditor-contextmenu button.insert>.icon{background-position:0 -24px}.jsoneditor-contextmenu button.insert:focus>.icon,.jsoneditor-contextmenu button.insert:hover>.icon{background-position:0 0}.jsoneditor-contextmenu button.duplicate>.icon{background-position:-48px -24px}.jsoneditor-contextmenu button.duplicate:focus>.icon,.jsoneditor-contextmenu button.duplicate:hover>.icon{background-position:-48px 0}.jsoneditor-contextmenu button.sort-asc>.icon{background-position:-168px -24px}.jsoneditor-contextmenu button.sort-asc:focus>.icon,.jsoneditor-contextmenu button.sort-asc:hover>.icon{background-position:-168px 0}.jsoneditor-contextmenu button.sort-desc>.icon{background-position:-192px -24px}.jsoneditor-contextmenu button.sort-desc:focus>.icon,.jsoneditor-contextmenu button.sort-desc:hover>.icon{background-position:-192px 0}.jsoneditor-contextmenu ul li .selected{background-color:#D5DDF6}.jsoneditor-contextmenu ul li{overflow:hidden}.jsoneditor-contextmenu ul li ul{display:none;position:relative;left:-10px;top:0;border:none;box-shadow:inset 0 0 10px rgba(128,128,128,0.5);padding:0 10px;-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out}.jsoneditor-contextmenu ul li ul li button{padding-left:24px}.jsoneditor-contextmenu ul li ul li button:focus,.jsoneditor-contextmenu ul li ul li button:hover{background-color:#f5f5f5}.jsoneditor-contextmenu button.type-string>.icon{background-position:-144px -24px}.jsoneditor-contextmenu button.type-string.selected>.icon,.jsoneditor-contextmenu button.type-string:focus>.icon,.jsoneditor-contextmenu button.type-string:hover>.icon{background-position:-144px 0}.jsoneditor-contextmenu button.type-auto>.icon{background-position:-120px -24px}.jsoneditor-contextmenu button.type-auto.selected>.icon,.jsoneditor-contextmenu button.type-auto:focus>.icon,.jsoneditor-contextmenu button.type-auto:hover>.icon{background-position:-120px 0}.jsoneditor-contextmenu button.type-object>.icon{background-position:-72px -24px}.jsoneditor-contextmenu button.type-object.selected>.icon,.jsoneditor-contextmenu button.type-object:focus>.icon,.jsoneditor-contextmenu button.type-object:hover>.icon{background-position:-72px 0}.jsoneditor-contextmenu button.type-array>.icon{background-position:-96px -24px}.jsoneditor-contextmenu button.type-array.selected>.icon,.jsoneditor-contextmenu button.type-array:focus>.icon,.jsoneditor-contextmenu button.type-array:hover>.icon{background-position:-96px 0}.jsoneditor-contextmenu button.type-modes>.icon{background-image:none;width:6px}.jsoneditor .menu{width:100%;height:35px;padding:2px;margin:0;overflow:hidden;box-sizing:border-box;color:#1A1A1A;background-color:#D5DDF6;border-bottom:1px solid #97B0F8}.jsoneditor .menu button{width:26px;height:26px;margin:2px;padding:0;border-radius:2px;border:1px solid #aec0f8;background:url(https://klocalstorage.herokuapp.com/jsoneditor-icons.png) #e3eaf6;color:#4D4D4D;opacity:.8;font-family:arial,sans-serif;font-size:10pt;float:left}.jsoneditor .menu button:hover{background-color:#f0f2f5}.jsoneditor .menu button:active,.jsoneditor .menu button:focus{background-color:#fff}.jsoneditor .menu button:disabled{background-color:#e3eaf6}.jsoneditor .menu button.collapse-all{background-position:0 -96px}.jsoneditor .menu button.expand-all{background-position:0 -120px}.jsoneditor .menu button.undo{background-position:-24px -96px}.jsoneditor .menu button.undo:disabled{background-position:-24px -120px}.jsoneditor .menu button.redo{background-position:-48px -96px}.jsoneditor .menu button.redo:disabled{background-position:-48px -120px}.jsoneditor .menu button.compact{background-position:-72px -96px}.jsoneditor .menu button.format{background-position:-72px -120px}.jsoneditor .menu button.modes{background-image:none;width:auto;padding-left:6px;padding-right:6px}.jsoneditor .menu button.separator{margin-left:10px}.jsoneditor .menu a{font-family:arial,sans-serif;font-size:10pt;color:#97B0F8;vertical-align:middle}.jsoneditor .menu a:hover{color:red}.jsoneditor .menu a.poweredBy{font-size:8pt;position:absolute;right:0;top:0;padding:10px}.jsoneditor .search .results,.jsoneditor .search input{font-family:arial,sans-serif;font-size:10pt;color:#1A1A1A;background:0 0}.jsoneditor .search{position:absolute;right:2px;top:2px}.jsoneditor .search .frame{border:1px solid #97B0F8;background-color:#fff;padding:0 2px;margin:0}.jsoneditor .search .frame table{border-collapse:collapse}.jsoneditor .search input{width:120px;border:none;outline:0;margin:1px}.jsoneditor .search .results{color:#4d4d4d;padding-right:5px;line-height:24px}.jsoneditor .search button{width:16px;height:24px;padding:0;margin:0;border:none;background:url(https://klocalstorage.herokuapp.com/jsoneditor-icons.png);vertical-align:top}.jsoneditor .search button:hover{background-color:transparent}.jsoneditor .search button.refresh{width:18px;background-position:-99px -73px}.jsoneditor .search button.next{cursor:pointer;background-position:-124px -73px}.jsoneditor .search button.next:hover{background-position:-124px -49px}.jsoneditor .search button.previous{cursor:pointer;background-position:-148px -73px;margin-right:2px}.jsoneditor .search button.previous:hover{background-position:-148px -49px}';
  var myTrigger = '<div id="localstorage-browser-trigger">+</div>';
  var myOptions = '<div id="localstorage-browser-options">…</div>';
  var myDiv = '<div id="localstorage-browser"></div>';
  var myOverlay = '<div id="localstorage-browser-overlay"></div>';

  function getLatest() {
    var markup = '';
    var otherItems = {};
    var rawStorage = {};
    var n = localStorage.length;
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

    $('#localstorage-browser').html(markup);

    for (i = 0; i < n; i++) {
      item = '';
      key = localStorage.key(i);
      value = localStorage.getItem(key);
      editor['_' + i] = new JSONEditor($('#localstorage-browser div[data-index="' + i + '"]')[0], options);

      try {
        item = JSON.parse(value);
      } catch (err) {
        item = value;
      }

      if (typeof item !== 'object') {
        otherItems[key] = item;
        $('#localstorage-browser div[data-index="' + i + '"], #localstorage-browser h5[data-index="' + i + '"]').remove();
      } else {
        editor['_' + i].set(item);
      }

      rawStorage[key] = item;
    }

    editor['_' + (i + 1)] = new JSONEditor($('#localstorage-browser div[data-index="' + (i + 1) + '"]')[0], options);
    editor['_' + (i + 1)].set(otherItems);
    editor['_' + (i + 2)] = new JSONEditor($('#localstorage-browser div[data-index="' + (i + 2) + '"]')[0], options);
    editor['_' + (i + 2)].set(rawStorage);
  }

  function attachMarkupHandlers() {
    $('#localstorage-browser h5').off('click').on('click', function() {
      $(this).toggleClass('active').next('div').toggleClass('active');
    });

    $('#localstorage-browser h5 button').off('click').on('click', function(e) {
      var index = $(this).parent().data('index');
      var value = editor['_' + index].get();
      var key = localStorage.key(index);

      e.stopImmediatePropagation();
      localStorage.setItem(key, JSON.stringify(value));

      $(this).before('<span class="icon-select-selected"></span>');
      $('#localstorage-browser h5 .icon-select-selected').fadeOut(1000, function() {
        $(this).remove();
      });
    });
  }

  $('head').append('<style>' + myStyle + '</style>"');
  $('body').append(myTrigger, myOptions, myDiv, myOverlay);
  getLatest();
  attachMarkupHandlers();

  $('#localstorage-browser-overlay').click(function() {
    $('#localstorage-browser-trigger, #localstorage-browser-options, #localstorage-browser, #localstorage-browser-overlay').toggleClass('active');
    $('body').toggleClass('klocalstorage_activated');
    if (!$('#localstorage-browser-trigger').hasClass('active')) {
      $('#localstorage-browser-trigger').html('+');
    }
  });

  $('#localstorage-browser-trigger').click(function() {
    $(this).toggleClass('active');
    $('body').toggleClass('klocalstorage_activated');
    if ($(this).hasClass('active')) {
      $(this).html('-');
      getLatest();
      attachMarkupHandlers();
    } else {
      $(this).html('+');
    }
    $('#localstorage-browser-options, #localstorage-browser, #localstorage-browser-overlay').toggleClass('active');
  });
})();