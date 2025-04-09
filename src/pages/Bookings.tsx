
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, ArrowUpDown, Clock, Building2 } from "lucide-react";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { getBookingsByUserId, getRoomById } from "@/services/mockData";
import { Booking, Room } from "@/models/types";

const BookingsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (user) {
      const userBookings = getBookingsByUserId(user.id);
      setBookings(userBookings);
    }
  }, [user]);

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoomById(booking.roomId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort bookings by start time
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const timeA = new Date(a.startTime).getTime();
    const timeB = new Date(b.startTime).getTime();
    return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
  });

  // Separate bookings into upcoming and past
  const now = new Date();
  const upcomingBookings = sortedBookings.filter(booking => 
    isAfter(parseISO(booking.startTime), now)
  );
  const pastBookings = sortedBookings.filter(booking => 
    isBefore(parseISO(booking.endTime), now)
  );

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const getRoomForBooking = (booking: Booking): Room | undefined => {
    return getRoomById(booking.roomId);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const BookingList = ({ bookings }: { bookings: Booking[] }) => (
    <div className="space-y-4">
      {bookings.length > 0 ? (
        bookings.map(booking => {
          const room = getRoomForBooking(booking);
          return (
            <Card key={booking.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="font-medium text-lg">{booking.title}</h3>
                      <Badge className="ml-2" variant={booking.status === "confirmed" ? "default" : "outline"}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Building2 className="h-3 w-3 mr-1" />
                      {room ? room.name : "Sala Desconhecida"}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(parseISO(booking.startTime), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(parseISO(booking.startTime), "HH:mm")} - {format(parseISO(booking.endTime), "HH:mm")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/bookings/${booking.id}`}>Ver</Link>
                    </Button>
                    {isAfter(parseISO(booking.startTime), now) && (
                      <Button variant="destructive" size="sm">
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p>Nenhuma reserva encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Reservas</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Visualize e gerencie todas as suas reservas de salas
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button asChild>
            <Link to="/bookings/new">Nova Reserva</Link>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Buscar reservas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={toggleSortDirection}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Ordenar por Data {sortDirection === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Próximas ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Passadas ({pastBookings.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <BookingList bookings={upcomingBookings} />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <BookingList bookings={pastBookings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingsPage;
