import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { CHATS_DB, GAMES_DB } from "./db.pew";
import type { Color, ROOM_ID } from "./models/base.models.pew";
import type { GameChat } from "./models/chat.model.pew";
import { generateMessageId } from "./util.pew";

const MAX_MESSAGES_PER_ROOM = 50;

export function getGameChatCount(roomId: ROOM_ID): number {
  return CHATS_DB.get(roomId)?.length || 0;
}

export function getGameChats(roomId: ROOM_ID): ServiceResponse<GameChat[]> {
  const chats = CHATS_DB.get(roomId) || [];
  return returnServiceResponse<GameChat[]>(chats);
}

export function addChat(
  roomId: ROOM_ID,
  playerId: string,
  content: string,
  isSystem: boolean
): ServiceResponse<GameChat> {
  const currentGame = GAMES_DB.get(roomId);
  if (!currentGame) {
    return returnServiceResponse<GameChat>("INVALID_ROOM_CODE");
  }
  const player = currentGame.players.find((p) => p.playerId === playerId);
  if (!player) {
    return returnServiceResponse<GameChat>("INVALID_PLAYER_ID");
  }

  const newChat: GameChat = {
    chatId: generateMessageId(),
    playerId: player.playerId,
    playerName: player.playerName,
    playerColour: player.playerColour,
    content: content,
    timestamp: Date.now(),
    isSystem: isSystem,
  };

  let chats = CHATS_DB.get(roomId);
  if (!chats) {
    chats = [];
    CHATS_DB.set(roomId, chats);
  }

  chats.push(newChat);

  if (chats.length > MAX_MESSAGES_PER_ROOM) {
    chats.splice(0, chats.length - MAX_MESSAGES_PER_ROOM);
  }

  return returnServiceResponse<GameChat>(newChat);
}

export function addSystemChat(
  roomId: ROOM_ID,
  content: string,
  playerId: string,
  playerName: string,
  playerColour: Color
): ServiceResponse<GameChat> {
  const newChat: GameChat = {
    chatId: generateMessageId(),
    playerId: playerId,
    playerName: playerName,
    playerColour: playerColour,
    content: content,
    timestamp: Date.now(),
    isSystem: true,
  };

  let chats = CHATS_DB.get(roomId);
  if (!chats) {
    chats = [];
    CHATS_DB.set(roomId, chats);
  }

  chats.push(newChat);

  if (chats.length > MAX_MESSAGES_PER_ROOM) {
    chats.splice(0, chats.length - MAX_MESSAGES_PER_ROOM);
  }

  return returnServiceResponse<GameChat>(newChat);
}
