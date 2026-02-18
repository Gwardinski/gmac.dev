import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { CHATS_DB, GAMES_DB } from "./db.pew";
import type { ROOM_ID } from "./models/base.models.pew";
import type { GameChat } from "./models/chat.model.pew";
import type { SystemChatParams } from "./models/system-event.model";
import { generateMessageId } from "./util.pew";

const MAX_MESSAGES_PER_ROOM = 50;

// REST Services

export function getGameChats(roomId: ROOM_ID): ServiceResponse<GameChat[]> {
  const chats = CHATS_DB.get(roomId) || [];
  return returnServiceResponse<GameChat[]>(chats);
}

// REST + WebSocket Services

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
  const player = currentGame.players.find((p) => p.id === playerId);
  if (!player) {
    return returnServiceResponse<GameChat>("INVALID_PLAYER_ID");
  }

  const newChat: GameChat = {
    chatId: generateMessageId(),
    playerId: player.id,
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

// System Services

export function addSystemChat(
  roomId: ROOM_ID,
  params: SystemChatParams
): ServiceResponse<GameChat> {
  const newChat: GameChat = {
    chatId: generateMessageId(),
    playerId: params.playerId,
    playerName: params.playerName,
    playerColour: params.playerColour,
    content: params.content,
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
