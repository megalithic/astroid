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
  var uri = "ws://192.168.1.90:1234";
  var gv, tv, status = "";
  var $go = $("#range_go");
  var $turn = $("#range_turn");
  var $out = $("h6");

  var ws = app.init(uri);
  // if (ws.readyState === 3) {
  //   status = "All systems go!";
  // } else {
  //   status = "System halted.";
  // }
  status = "All systems go!";
  $(".title").text(status);

  // handle mouse changing events
  // TODO: add touch events
  $go.on("change", function(evt) {
    gv = evt.target.value;
    tv = $turn.val();
    app.send(gv + "," + tv);
    $out.text(gv + ", " + tv);
  });
  $turn.on("change", function(evt) {
    tv = evt.target.value;
    gv = $go.val();
    app.send(gv + "," + tv);
    $out.text(gv + ", " + tv);
  });

  // handle mouseup event (done with click and slide)
  $go.bind("mouseup keyup", function(evt) {
    $go.val(64);
    gv = $go.val();
    tv = $turn.val();

    app.send(gv + "," + tv);
    $out.text(gv + ", " + tv);
  });
  $turn.bind("mouseup keyup", function(evt) {
    gv = $go.val();
    $turn.val(192);
    tv = $turn.val();

    app.send(gv + "," + tv);
    $out.text(gv + ", " + tv);
  });

  $(document).on("keydown", function(evt) {
    switch(evt.keyCode) {
      case 70: //go up
        if(gv > 0 && gv < 128) {
          gv = Number(gv) + 1;
        }
        $go.val(gv);
        break;
      case 82: //go down
        if(gv > 0 && gv < 128) {
          gv = Number(gv) - 1;
        }
        $go.val(gv);
        break;
      case 74: //turn up
        if(tv > 127 && tv < 256) {
          tv = Number(tv) + 1;
        }
        $turn.val(tv);
        break;
      case 85: //turn down
        if(tv > 127 && tv < 256) {
          tv = Number(tv) - 1;
        }
        $turn.val(tv);
        break;
      default:
        break;
    }
    app.send(gv + "," + tv);
    $out.text(gv + ", " + tv);
  });

  // keep sending current range values
  window.setInterval(function() {
    gv = $go.val();
    tv = $turn.val();
    app.send(gv + "," + tv);
  }, 250);
});
