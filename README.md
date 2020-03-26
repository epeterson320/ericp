# Crazytown

Goal: Mad libs + Mafia + Kingdom of Loathing

## Architecture

- Game server
- Public display front-end
- Player controller front-end
- Chromecast adapter as game server and display
- Local web server adapters for game server, display, and controller

## Tasks (not yet implemented)

- `yarn start`: launch dev display to localhost:3000, and players to :3001 and :3002
- `yarn test`: unit tests
- `yarn test-integration`: integration tests
- `yarn build`: build deployable chromecast package
- `yarn deploy`: upload build package to chromecast registry
