import { Card, CardBody, CardHeader, CardTitle } from '../gmac.ui';
import { useVariantState } from '../VariantToggle';
import { useFetchRooms } from './useFetchRooms';

export const GameRoomsActive = () => {
  const { variant } = useVariantState();
  const { data, isLoading, error } = useFetchRooms();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <Card variant={variant} className="max-h-[640px] w-fit min-w-sm">
      <CardHeader>
        <CardTitle>Active Rooms</CardTitle>
      </CardHeader>

      <CardBody>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Player Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((room) => (
              <tr key={room.roomName}>
                <td>{room.roomName}</td>
                <td>{room.playerCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};
