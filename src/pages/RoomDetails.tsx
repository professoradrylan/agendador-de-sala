
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, Users, MapPin, ArrowLeft } from "lucide-react";
import { format, parseISO, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getRoomById, getBookingsByRoomId } from "@/services/mockData";
import { Room, Booking } from "@/models/types";

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (id) {
      const roomData = getRoomById(id);
      if (roomData) {
        setRoom(roomData);
        
        // Get bookings for this room
        const roomBookings = getBookingsByRoomId(id);
        setBookings(roomBookings);
        
        // Filter bookings for the selected day
        filterBookingsForSelectedDay(date, roomBookings);
      }
    }
  }, [id]);

  const filterBookingsForSelectedDay = (selectedDate: Date, allBookings: Booking[] = bookings) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    const filteredBookings = allBookings.filter(booking => {
      const bookingDate = format(parseISO(booking.startTime), 'yyyy-MM-dd');
      return bookingDate === dateStr;
    });
    
    // Sort by start time
    filteredBookings.sort((a, b) => 
      parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
    );
    
    setDayBookings(filteredBookings);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      filterBookingsForSelectedDay(selectedDate);
    }
  };

  if (!room) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando detalhes da sala...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/rooms">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Salas
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room details column */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold mb-2 md:mb-0">{room.name}</h1>
                  <Button asChild>
                    <Link to={`/bookings/new?roomId=${room.id}`}>Reservar Esta Sala</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{room.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Capacidade: {room.capacity} pessoas</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recursos</h2>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-sm py-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Availability column */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Disponibilidade</h2>
              <div className="space-y-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>

                <div className="rounded-md border">
                  <div className="py-2 px-4 bg-gray-50 dark:bg-gray-800 text-sm font-medium">
                    Reservas para {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </div>
                  <div className="divide-y">
                    {dayBookings.length > 0 ? (
                      dayBookings.map((booking) => (
                        <div key={booking.id} className="py-2 px-4">
                          <div className="flex justify-between">
                            <div className="font-medium">{booking.title}</div>
                            <Badge variant="outline" className="ml-2">
                              {booking.status === "confirmed" ? "Confirmada" : booking.status === "pending" ? "Pendente" : "Cancelada"}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {format(parseISO(booking.startTime), "HH:mm")} - 
                            {format(parseISO(booking.endTime), "HH:mm")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 px-4 text-center text-gray-500">
                        Sem reservas para este dia
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Reserva Rápida</h2>
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map((dayOffset) => {
                  const bookDate = addDays(new Date(), dayOffset);
                  return (
                    <Button 
                      key={dayOffset} 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      asChild
                    >
                      <Link to={`/bookings/new?roomId=${room.id}&date=${format(bookDate, 'yyyy-MM-dd')}`}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dayOffset === 0 
                          ? "Hoje" 
                          : dayOffset === 1 
                            ? "Amanhã" 
                            : format(bookDate, "EEEE, dd 'de' MMM", { locale: ptBR })}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
