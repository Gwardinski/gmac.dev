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
      content: `${player.name} joined the game`,
      playerId: player.id,
      playerName: player.name,
      playerColour: player.colour,
    });
  }

  public playerRejoinEvent(player: PlayerClass) {
    this.onEvent({
      content: `${player.name} re-joined the game!`,
      playerId: player.id,
      playerName: player.name,
      playerColour: player.colour,
    });
  }

  public playerLeaveEvent(player: PlayerClass) {
    this.onEvent({
      content: `${player.name} left the game`,
      playerId: player.id,
      playerName: player.name,
      playerColour: player.colour,
    });
  }

  public playerDeathEvent(killer: PlayerClass, victim: PlayerClass) {
    this.onEvent({
      content: `${killer.name} killed ${victim.name}`,
      playerId: killer.id,
      playerName: killer.name,
      playerColour: killer.colour,
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
      content: `${player.name} picked up ${item.itemName}`,
      playerId: "system",
      playerName: "System",
      playerColour: "YELLOW",
    });
  }
}
