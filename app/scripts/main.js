require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['app', 'jquery'], function (app, $) {
  'use strict';
  var uri = "ws://192.168.1.55:1234";
  var gv, tv, status = "";
  var $go = $("#range_go");
  var $turn = $("#range_turn");

  var ws = app.init(uri);
  if (ws.readyState === 3) {
    status = "All systems go!";
  } else {
    status = "System halted.";
  }
  $(".title").text(status);

  // handle mouse changing events
  // TODO: add touch events
  $go.on("change", function(evt) {
    gv = evt.target.value;
    tv = $turn.val();
    app.send(gv + "," + tv);
  });
  $turn.on("change", function(evt) {
    tv = evt.target.value;
    gv = $go.val();
    app.send(gv + "," + tv);
  });

  // handle mouseup event (done with click and slide)
  $go.bind("mouseup keyup", function(evt) {
    gv = $go.val(64);
    tv = $turn.val();
    app.send(gv + "," + tv);
  });
  $turn.bind("mouseup keyup", function(evt) {
    gv = $go.val();
    tv = $turn.val(192);
    app.send(gv + "," + tv);
  });

  $(document).on("keydown", function(evt) {
    switch(evt.keyCode) {
      case 70: //go up
        if(gv > 0 && gv < 128) {
          gv = Number(gv) + 1;
        }
        $go.val(gv);
        app.send(gv + "," + tv);
        break;
      case 82: //go down
        if(gv > 0 && gv < 128) {
          gv = Number(gv) - 1;
        }
        $go.val(gv);
        app.send(gv + "," + tv);
        break;
      case 74: //turn up
        if(tv > 127 && tv < 256) {
          tv = Number(tv) + 1;
        }
        $turn.val(tv);
        app.send(gv + "," + tv);
        break;
      case 85: //turn down
        if(tv > 127 && tv < 256) {
          tv = Number(tv) - 1;
        }
        $turn.val(tv);
        app.send(gv + "," + tv);
        break;
      default:
        break;
    }
  });

  // keep sending current range values
  window.setInterval(function() {
    gv = $go.val();
    tv = $turn.val();
    app.send(gv + "," + tv);
  }, 250);
});
