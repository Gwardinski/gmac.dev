import { H3 } from '../ui';
import { useFetchRooms } from './game-api';

export const GameRoomsActive = () => {
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
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-lg glass p-4 dark:dark-glass">
      <H3>Active Rooms</H3>
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
    </div>
  );
};
