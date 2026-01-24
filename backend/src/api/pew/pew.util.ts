export function generateId(): string {
  return `room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
