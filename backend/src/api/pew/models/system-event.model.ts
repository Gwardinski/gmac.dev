import type { Color } from "./base.models.pew";
import type { ItemClass } from "./item.model.pew";
import type { PlayerClass } from "./player.model.pew";

export type SystemEvent =
  | {
      type: "player-death";
      killerId: string;
      killerName: string;
      killerColour: Color;
      victimId: string;
      victimName: string;
      victimColour: Color;
    }
  | {
      type: "player-join";
      playerId: string;
      playerName: string;
      playerColour: Color;
    }
  | {
      type: "player-leave";
      playerId: string;
      playerName: string;
      playerColour: Color;
    }
  | {
      type: "item-spawn";
      itemName: string;
    }
  | {
      type: "item-picked-up";
      playerName: string;
      itemName: string;
    };
export class SystemEventClass {
  constructor(public onEvent: (event: SystemEvent) => void) {}
  public playerJoinEvent(player: PlayerClass) {
    this.onEvent({
      type: "player-join",
      playerId: player.playerId,
      playerName: player.playerName,
      playerColour: player.playerColour,
    });
  }

  public playerLeaveEvent(player: PlayerClass) {
    this.onEvent({
      type: "player-leave",
      playerId: player.playerId,
      playerName: player.playerName,
      playerColour: player.playerColour,
    });
  }

  public playerDeathEvent(killer: PlayerClass, victim: PlayerClass) {
    this.onEvent({
      type: "player-death",
      killerId: killer.playerId,
      killerName: killer.playerName,
      killerColour: killer.playerColour,
      victimId: victim.playerId,
      victimName: victim.playerName,
      victimColour: victim.playerColour,
    });
  }

  public itemSpawnEvent(item: ItemClass) {
    this.onEvent({
      type: "item-spawn",
      itemName: item.itemName,
    });
  }

  public itemPickedUpEvent(player: PlayerClass, item: ItemClass) {
    this.onEvent({
      type: "item-picked-up",
      playerName: player.playerName,
      itemName: item.itemName,
    });
  }
}
