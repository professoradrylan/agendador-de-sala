
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-3">
      <div className="text-center max-w-md w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Ops! Página não encontrada</p>
        <Button asChild className="w-full">
          <Link to="/">Voltar para Início</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
