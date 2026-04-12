import { Card, CardHeader } from '../gmac.ui';
import { useVariantState } from '../VariantToggle';
import { colorToHex } from './client-copies';
import { useLocalGameState } from './useGetGameState';

export const GameScore = () => {
  const { variant } = useVariantState();
  const gameState = useLocalGameState((s) => s.gameState);
  const { players } = gameState;

  const sortedPlayers = players.sort((a, b) => b.killCount - a.killCount);

  return (
    <Card as="section" variant={variant} className="h-[106px] w-fit min-w-sm">
      <CardHeader>
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
      </CardHeader>
    </Card>
  );
};
