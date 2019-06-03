# Crazytown

Mad libs + Mafia + Kingdom of Loathing

## Architecture

* Game server
* Public display front-end
* Player controller front-end
* Chromecast adapter as game server and display
* Local web server adapters for game server, display, and controller

Websocket API e.g.:

* `ws://host/game1/watch`
* `ws://host/game1/player/eric`
* `ws://host/game1/player/justin`
