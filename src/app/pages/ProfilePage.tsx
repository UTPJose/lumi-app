import React from 'react';
import { useNavigate } from 'react-router';
import { User, Settings, LogOut, ChevronRight, Heart, Calendar } from 'lucide-react';
import { PageLayout } from '../components/layouts/PageLayout';
import { StatCard } from '../components/StatCard';
import { AccessibleButton } from '../components/AccessibleButton';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRoutines } from '@/hooks/useRoutines';
import { CARD_STYLES, FLEX } from '@/styles/tailwind-constants';

export function ProfilePage() {
  const navigate = useNavigate();
  const { userName } = useUserProfile();
  const { userInterests } = useUserProfile();
  const { routines } = useRoutines();

  const handleLogout = () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmed) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <PageLayout showNavigation>
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">Hola, {userName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Calendar}
          iconColor="bg-primary/10"
          stat={routines.length}
          label="Rutinas creadas"
        />
        <StatCard
          icon={Heart}
          iconColor="bg-accent/30"
          stat={userInterests.length}
          label="Intereses"
        />
      </div>

      <div className="space-y-3">
        <h2 className="mb-4">Configuración</h2>

        <button
          onClick={() => navigate('/interests')}
          className={`w-full min-h-[80px] p-5 ${CARD_STYLES.white} rounded-2xl flex items-center justify-between`}
          aria-label="Ver y editar mis intereses"
        >
          <div className={`${FLEX.startCenter} gap-4`}>
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

        <button
          onClick={() => navigate('/profile-setup')}
          className={`w-full min-h-[80px] p-5 ${CARD_STYLES.white} rounded-2xl flex items-center justify-between`}
          aria-label="Editar información personal"
        >
          <div className={`${FLEX.startCenter} gap-4`}>
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

      <div className="bg-muted/50 p-6 rounded-2xl border-2 border-border text-center space-y-2">
        <p className="text-muted-foreground text-base">Versión 1.0.0</p>
        <p className="text-muted-foreground text-sm">Lumi - Rutinas inteligentes con propósito</p>
      </div>
    </PageLayout>
  );
}