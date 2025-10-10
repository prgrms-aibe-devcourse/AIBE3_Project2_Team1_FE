import { Navigate, useParams } from 'react-router-dom';
import ChatRoomPage from '@/features/message/ChatRoomPage';

export default function ChatRoomRoute() {
  const { roomId } = useParams();
  const id = Number(roomId);
  if (!roomId || Number.isNaN(id)) return <Navigate to="/chat" replace />;
  return <ChatRoomPage roomId={id} />;
}
