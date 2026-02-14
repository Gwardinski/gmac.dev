import { useGetGameState } from './useGetGameState';
import type { JoinRoomResponse } from './useJoinRoom';

export const GamePlayerStats = ({ roomId, playerId }: Omit<JoinRoomResponse, 'level'>) => {
  const { gameState } = useGetGameState(roomId, playerId);
  const { players } = gameState;

  console.log('gameState', gameState);

  return (
    <section className="flex h-20 min-w-sm rounded-md glass px-4 text-sm dark:dark-glass">
      <table>
        <tbody className="text-left">
          <tr>
            <th className="pr-4">Name</th>
            {players.map((player) => (
              <th key={`${player.playerId}-name`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.25 : 1 }}>
                <div style={{ color: player.playerColour.toLowerCase() }}>{player.playerName}</div>
              </th>
            ))}
          </tr>
          <tr>
            <th className="pr-4">Kills</th>
            {players.map((player) => (
              <th key={`${player.playerId}-kills`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.25 : 1 }}>
                <div style={{ color: player.playerColour.toLowerCase() }}>{player.killCount}</div>
              </th>
            ))}
          </tr>
          <tr>
            <th className="pr-4">Deaths</th>
            {players.map((player) => (
              <th key={`${player.playerId}-deaths`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.25 : 1 }}>
                <div style={{ color: player.playerColour.toLowerCase() }}>{player.deathCount}</div>
              </th>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
};
