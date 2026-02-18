import type { Color } from "./base.models.pew";
import type { ItemClass } from "./item.model.pew";
import type { PlayerClass } from "./player.model.pew";

export type SystemChatParams = {
  content: string;
  playerId: string;
  playerName: string;
  playerColour: Color;
  secondColor?: Color;
};

export class SystemEventClass {
  constructor(public onEvent: (params: SystemChatParams) => void) {}

  public playerJoinEvent(player: PlayerClass) {
    this.onEvent({
      content: `${player.playerName} joined the game`,
      playerId: player.id,
      playerName: player.playerName,
      playerColour: player.playerColour,
    });
  }

  public playerRejoinEvent(player: PlayerClass) {
    this.onEvent({
      content: `${player.playerName} re-joined the game!`,
      playerId: player.id,
      playerName: player.playerName,
      playerColour: player.playerColour,
    });
  }

  public playerLeaveEvent(player: PlayerClass) {
    this.onEvent({
      content: `${player.playerName} left the game`,
      playerId: player.id,
      playerName: player.playerName,
      playerColour: player.playerColour,
    });
  }

  public playerDeathEvent(killer: PlayerClass, victim: PlayerClass) {
    this.onEvent({
      content: `${killer.playerName} killed ${victim.playerName}`,
      playerId: killer.id,
      playerName: killer.playerName,
      playerColour: killer.playerColour,
    });
  }

  public itemSpawnEvent(item: ItemClass) {
    this.onEvent({
      content: `${item.itemName} spawned`,
      playerId: "system",
      playerName: "System",
      playerColour: "YELLOW",
    });
  }

  public itemPickedUpEvent(player: PlayerClass, item: ItemClass) {
    this.onEvent({
      content: `${player.playerName} picked up ${item.itemName}`,
      playerId: "system",
      playerName: "System",
      playerColour: "YELLOW",
    });
  }
}
