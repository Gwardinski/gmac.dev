export function generateRoomId(): string {
  return `room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generatePlayerId(): string {
  return `player-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateBulletId(): string {
  return `bullet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateMessageId(): string {
  return `message-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
