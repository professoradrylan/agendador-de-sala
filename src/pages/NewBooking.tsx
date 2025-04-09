
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { format, addHours, parseISO, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/models/types";
import { getAllRooms, getBookingsByRoomId, saveBooking } from "@/services/mockData";

const timeSlots = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 8; // Start at 8 AM
  return {
    value: hour.toString(),
    label: `${hour}:00`
  };
});

const durations = [
  { value: "30", label: "30 minutos" },
  { value: "60", label: "1 hora" },
  { value: "90", label: "1,5 horas" },
  { value: "120", label: "2 horas" },
  { value: "180", label: "3 horas" },
  { value: "240", label: "4 horas" }
];

const NewBooking = () => {
  const [searchParams] = useSearchParams();
  const roomIdParam = searchParams.get('roomId');
  const dateParam = searchParams.get('date');

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>(roomIdParam || "");
  const [date, setDate] = useState<Date>(dateParam ? parseISO(dateParam) : new Date());
  const [startTime, setStartTime] = useState<string>("9"); // Default to 9 AM
  const [duration, setDuration] = useState<string>("60"); // Default to 1 hour
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load all rooms
    const allRooms = getAllRooms();
    setRooms(allRooms);
  }, []);

  useEffect(() => {
    if (roomIdParam) {
      setSelectedRoom(roomIdParam);
    }
    if (dateParam) {
      setDate(parseISO(dateParam));
    }
  }, [roomIdParam, dateParam]);

  const calculateEndTime = () => {
    if (!startTime) return "";
    
    const startHour = parseInt(startTime);
    const durationMinutes = parseInt(duration);
    
    const startDate = setHours(setMinutes(new Date(date), 0), startHour);
    const endDate = addHours(startDate, durationMinutes / 60);
    
    return format(endDate, "HH:mm");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para reservar uma sala",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRoom || !date || !startTime || !duration || !title) {
      toast({
        title: "Informações faltando",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create start and end time Date objects
      const startHour = parseInt(startTime);
      const durationMinutes = parseInt(duration);
      
      const startDate = new Date(date);
      startDate.setHours(startHour, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + durationMinutes);
      
      // Check for conflicts
      const roomBookings = getBookingsByRoomId(selectedRoom);
      const hasConflict = roomBookings.some(booking => {
        const existingStart = new Date(booking.startTime);
        const existingEnd = new Date(booking.endTime);
        
        // Check if the new booking overlaps with an existing one
        return (
          (startDate >= existingStart && startDate < existingEnd) ||
          (endDate > existingStart && endDate <= existingEnd) ||
          (startDate <= existingStart && endDate >= existingEnd)
        );
      });
      
      if (hasConflict) {
        toast({
          title: "Conflito de reserva",
          description: "O horário selecionado já está reservado. Por favor, escolha um horário diferente.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Create booking object
      const newBooking = {
        id: `booking-${Date.now()}`,
        roomId: selectedRoom,
        userId: user.id,
        title,
        description,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        status: "confirmed" as const,
      };
      
      // Save the booking
      saveBooking(newBooking);
      
      toast({
        title: "Reserva bem-sucedida",
        description: "Sua sala foi reservada com sucesso",
      });
      
      // Redirect to bookings page
      navigate("/bookings");
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      toast({
        title: "Falha na reserva",
        description: "Ocorreu um erro ao criar sua reserva",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/bookings">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Reservas
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Reserva</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Agende uma nova reserva de sala de reunião
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Reunião</Label>
                <Input 
                  id="title" 
                  placeholder="Digite o título da reunião" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room">Selecionar Sala</Label>
                  <Select 
                    value={selectedRoom} 
                    onValueChange={setSelectedRoom}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} (Capacidade: {room.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                        locale={ptBR}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Horário de Início</Label>
                  <Select 
                    value={startTime} 
                    onValueChange={setStartTime}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário de início" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(slot => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duração</Label>
                  <Select 
                    value={duration} 
                    onValueChange={setDuration}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(durationOption => (
                        <SelectItem key={durationOption.value} value={durationOption.value}>
                          {durationOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {startTime && duration && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-brand" />
                  <span>Sua reunião terminará aproximadamente às </span>
                  <strong className="ml-1">{calculateEndTime()}</strong>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Digite detalhes da reunião, agenda, etc." 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando Reserva..." : "Reservar Agora"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default NewBooking;
