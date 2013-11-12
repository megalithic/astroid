/*global define */
define([], function () {
  'use strict';

  var wsUri, websocket;

  var send = function(message) {
    if(typeof websocket !== "undefined" && websocket.readyState === 1) {
      writeToScreen("SENT: " + message);
      websocket.send(message);
    }
  };

  var init = function(uri) {
    wsUri = uri;
    return setupWebSocket();
  };

  function onOpen(evt) {
    writeToScreen("CONNECTED");
    send("Initiating connection from client.");
  }

  function onClose(evt) {
    writeToScreen("DISCONNECTED");
  }

  function onMessage(evt) {
    writeToScreen("RESPONSE: " + evt.data);
  }

  function onError(evt) {
    writeToScreen("ERROR: " + evt.data);
  }

  function writeToScreen(message) {
    console.log(message);
  }

  function setupWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
      onOpen(evt);
    };
    websocket.onclose = function(evt) {
      onClose(evt);
    };
    websocket.onmessage = function(evt) {
      onMessage(evt);
    };
    websocket.onerror = function(evt) {
      onError(evt);
    };
    return websocket;
  }

  return {
    init: init,
    send: send
  };
});
