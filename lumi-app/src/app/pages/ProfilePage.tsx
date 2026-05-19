import React from 'react';
import { useNavigate } from 'react-router';
import { User, Settings, LogOut, ChevronRight, Heart, Calendar } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { BottomNavigation } from '../components/BottomNavigation';

export function ProfilePage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Usuario';
  const userInterests = JSON.parse(localStorage.getItem('userInterests') || '[]');
  
  const handleLogout = () => {
    // Confirmación antes de cerrar sesión
    const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmed) {
      // Limpiar datos del usuario
      localStorage.clear();
      // Redirigir a la página de bienvenida
      navigate('/');
    }
  };
  
  const savedRoutines = JSON.parse(localStorage.getItem('routines') || '[]');
  const routineCount = savedRoutines.length;
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Encabezado con avatar */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground">Hola, {userName}</p>
          </div>
        </div>
        
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary p-6 rounded-2xl border-2 border-border text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <p className="text-3xl font-semibold text-primary mb-1">{routineCount}</p>
            <p className="text-sm text-muted-foreground">Rutinas creadas</p>
          </div>
          
          <div className="bg-secondary p-6 rounded-2xl border-2 border-border text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-accent/30 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-accent" aria-hidden="true" />
            </div>
            <p className="text-3xl font-semibold text-accent mb-1">{userInterests.length}</p>
            <p className="text-sm text-muted-foreground">Intereses</p>
          </div>
        </div>
        
        {/* Opciones del perfil */}
        <div className="space-y-3">
          <h2 className="mb-4">Configuración</h2>
          
          {/* Mis intereses */}
          <button
            onClick={() => navigate('/interests')}
            className="w-full min-h-[80px] p-5 bg-white border-2 border-border rounded-2xl hover:border-primary/50 transition-all active:scale-98 flex items-center justify-between"
            aria-label="Ver y editar mis intereses"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-accent" aria-hidden="true" />
              </div>
              <div className="text-left">
                <h3 className="text-xl mb-1">Mis intereses</h3>
                <p className="text-muted-foreground text-base">Ver y editar mis preferencias</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          </button>
          
          {/* Información personal */}
          <button
            onClick={() => navigate('/profile-setup')}
            className="w-full min-h-[80px] p-5 bg-white border-2 border-border rounded-2xl hover:border-primary/50 transition-all active:scale-98 flex items-center justify-between"
            aria-label="Editar información personal"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div className="text-left">
                <h3 className="text-xl mb-1">Información personal</h3>
                <p className="text-muted-foreground text-base">Editar nombre y preferencias</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          </button>
        </div>
        
        {/* Botón de cerrar sesión */}
        <div className="pt-4">
          <AccessibleButton
            onClick={handleLogout}
            variant="destructive"
            fullWidth
            icon={LogOut}
            aria-label="Cerrar sesión"
          >
            Cerrar sesión
          </AccessibleButton>
        </div>
        
        {/* Información adicional */}
        <div className="bg-muted/50 p-6 rounded-2xl border-2 border-border text-center space-y-2">
          <p className="text-muted-foreground text-base">
            Versión 1.0.0
          </p>
          <p className="text-muted-foreground text-sm">
            Lumi - Rutinas inteligentes con propósito
          </p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}