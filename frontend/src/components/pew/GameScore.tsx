import { useGetGameState } from './useGetGameState';
import type { JoinRoomResponse } from './useJoinRoom';

export const GameScore = ({ roomId, playerId }: Omit<JoinRoomResponse, 'level'>) => {
  const { gameState } = useGetGameState(roomId, playerId);
  const { players } = gameState;

  const sortedPlayers = players.sort((a, b) => b.killCount - a.killCount);

  return (
    <section className="flex h-[88px] min-w-sm rounded-md glass p-4 text-sm dark:dark-glass">
      <table>
        <tbody className="text-left">
          <tr>
            <th className="pr-4">Name</th>
            {sortedPlayers.map((player) => (
              <th key={`${player.playerId}-name`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.2 : 1 }}>
                <div className={player.isSpawning ? 'animate-pulse' : ''} style={{ color: player.playerColour.toLowerCase() }}>
                  {player.playerName}
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <th className="pr-4">Kills</th>
            {sortedPlayers.map((player) => (
              <th key={`${player.playerId}-kills`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.2 : 1 }}>
                <div className={player.isSpawning ? 'animate-pulse' : ''} style={{ color: player.playerColour.toLowerCase() }}>
                  {player.killCount}
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <th className="pr-4">Deaths</th>
            {sortedPlayers.map((player) => (
              <th key={`${player.playerId}-deaths`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.2 : 1 }}>
                <div className={player.isSpawning ? 'animate-pulse' : ''} style={{ color: player.playerColour.toLowerCase() }}>
                  {player.deathCount}
                </div>
              </th>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
};
