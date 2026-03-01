import { colorToHex } from './client-copies';
import { useLocalGameState } from './useGetGameState';

export const GameScore = () => {
  const gameState = useLocalGameState((s) => s.gameState);
  const { players } = gameState;

  const sortedPlayers = players.sort((a, b) => b.killCount - a.killCount);

  return (
    <section className="flex h-[88px] min-w-sm rounded-md glass p-4 text-sm dark:dark-glass">
      <table>
        <tbody className="text-left">
          <tr>
            <th className="pr-4">Name</th>
            {sortedPlayers.map((player) => (
              <th key={`${player.id}-name`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.2 : 1 }}>
                <div className={player.isSpawning ? 'animate-pulse' : ''} style={{ color: colorToHex(player.colour) }}>
                  {player.name}
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <th className="pr-4">Kills</th>
            {sortedPlayers.map((player) => (
              <th key={`${player.id}-kills`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.2 : 1 }}>
                <div className={player.isSpawning ? 'animate-pulse' : ''} style={{ color: colorToHex(player.colour) }}>
                  {player.killCount}
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <th className="pr-4">Deaths</th>
            {sortedPlayers.map((player) => (
              <th key={`${player.id}-deaths`} className="pr-4" style={{ opacity: player.isDestroyed ? 0.2 : 1 }}>
                <div className={player.isSpawning ? 'animate-pulse' : ''} style={{ color: colorToHex(player.colour) }}>
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
