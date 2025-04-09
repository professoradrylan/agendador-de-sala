
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Monitor, Coffee, Tv, PenSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Room } from "@/models/types";
import { getAllRooms } from "@/services/mockData";
import { useAuth } from "@/context/AuthContext";

// Feature icons mapping
const featureIcons: Record<string, React.ReactNode> = {
  "Projetor": <Monitor size={14} />,
  "TV": <Tv size={14} />,
  "Máquina de Café": <Coffee size={14} />,
};

const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms] = useState<Room[]>(getAllRooms());
  const { isAdmin } = useAuth();

  const filteredRooms = rooms.filter((room) => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.features.some(feature => 
      feature.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salas de Reuniões</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore e reserve salas disponíveis
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar salas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {isAdmin && (
            <Button asChild>
              <Link to="/admin/rooms/new">
                <PenSquare className="mr-2 h-4 w-4" />
                Adicionar Sala
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{room.location}</p>
                  
                  <div className="flex items-center mt-2 mb-3">
                    <Users size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm">Capacidade: {room.capacity}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.features.map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        {featureIcons[feature] || null}
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" asChild>
                      <Link to={`/rooms/${room.id}`}>Ver Detalhes</Link>
                    </Button>
                    <Button asChild>
                      <Link to={`/bookings/new?roomId=${room.id}`}>Reservar</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-8">
            <p className="mb-4">Nenhuma sala encontrada com os critérios de busca.</p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Limpar Busca
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
