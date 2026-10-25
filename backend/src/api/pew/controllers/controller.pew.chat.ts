import { returnAPIError, returnAPIResponse } from "../../../responses";
import type { ROOM_ID } from "../models";
import { addChat, getGameChats } from "../services";
import type { SendChatRequestModel } from "../validation";

export const getChatsController = (roomId: ROOM_ID) => {
  const [chats, error] = getGameChats(roomId);

  if (!chats || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(chats);
};

export const sendChatController = (roomId: ROOM_ID, body: SendChatRequestModel) => {
  const { playerId, content } = body;
  const [newChat, error] = addChat(roomId, playerId, content, false);

  if (!newChat || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(newChat);
};
