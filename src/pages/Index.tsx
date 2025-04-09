
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-3">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-brand flex items-center justify-center mb-4">
          <Calendar className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          MeetingMaster
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-5">
          Agendamento e gerenciamento de salas de reuniões simplificado
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/login")}>Entrar</Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/signup")}>
            Criar Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
