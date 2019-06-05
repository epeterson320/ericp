const { ReplaySubject } = require("rxjs");
const Game = require("./Game");
const Message = require("./Message");

describe("Game", () => {
  it("Ignores unknown messages", () => {
    const game = new Game();
    const message = new Message({
      from: "123",
      to: "HOST",
      type: "uas;dlkasn;l",
      body: {
        a1pak: "as;lk"
      }
    });

    game.txMessage$.subscribe(() => {
      throw new Error("Fail");
    });
    game.rxMessage$.next(message);
  });

  it("Responds when a player joins", () => {
    expect.assertions(1);

    const game = new Game();

    const message = new Message({
      from: "PLAYER/ASPLK10A",
      to: "HOST",
      type: "JOIN",
      body: {
        name: "Joey"
      }
    });

    const expected = new Message({
      from: "HOST",
      to: "AUDIENCE",
      type: "PLAYER_JOINED",
      body: {
        name: "Joey"
      }
    });

    game.txMessage$.subscribe(gameMessage => {
      expect(gameMessage).toMatchObject(expected);
    });
    game.rxMessage$.next(message);
  });
});
