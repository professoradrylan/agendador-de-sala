
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Booking, Room } from "@/models/types";
import { getBookingsByUserId, getAllRooms, getRoomById } from "@/services/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  useEffect(() => {
    if (user) {
      // Get user's bookings
      const userBookings = getBookingsByUserId(user.id);
      
      // Filter for upcoming bookings and sort them
      const now = new Date();
      const upcoming = userBookings
        .filter(booking => isAfter(parseISO(booking.endTime), now))
        .sort((a, b) => 
          parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
        )
        .slice(0, 5); // Get only next 5 bookings
      
      setUpcomingBookings(upcoming);
      
      // Get all rooms
      setRooms(getAllRooms().slice(0, 4)); // Show only 4 rooms
    }
  }, [user]);

  const getRoomForBooking = (bookingRoomId: string) => {
    return getRoomById(bookingRoomId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Painel</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Bem-vindo(a), {user?.name || "Usuário"}
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/bookings/new">Nova Reserva</Link>
        </Button>
      </div>

      {/* Upcoming Bookings */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Suas Próximas Reservas</h2>
        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {upcomingBookings.map((booking) => {
              const room = getRoomForBooking(booking.roomId);
              return (
                <Card key={booking.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-1">{booking.title}</CardTitle>
                      <Badge className="whitespace-nowrap">{booking.status === "confirmed" ? "Confirmada" : booking.status === "pending" ? "Pendente" : "Cancelada"}</Badge>
                    </div>
                    <CardDescription className="line-clamp-1">
                      {room ? room.name : "Sala Desconhecida"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">
                        {format(parseISO(booking.startTime), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {format(parseISO(booking.startTime), "HH:mm")} - {format(parseISO(booking.endTime), "HH:mm")}
                      </span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/bookings/${booking.id}`}>Ver Detalhes</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="mb-2">Você não tem reservas agendadas</p>
              <Button asChild>
                <Link to="/bookings/new">Reservar uma Sala</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Rooms */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Salas Disponíveis</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/rooms">Ver Todas</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {rooms.map((room) => (
            <Card key={room.id} className="h-full flex flex-col">
              <CardContent className="p-0 flex-grow flex flex-col">
                <div className="h-32 relative overflow-hidden rounded-t-lg">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3 flex-grow flex flex-col">
                  <h3 className="font-semibold line-clamp-1">{room.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1">{room.location}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <Users size={14} className="mr-1 flex-shrink-0" />
                    <span>Capacidade: {room.capacity}</span>
                  </div>
                  <div className="mt-auto pt-2">
                    <Button className="w-full" asChild>
                      <Link to={`/rooms/${room.id}`}>Ver Sala</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
