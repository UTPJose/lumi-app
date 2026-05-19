import React from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Calendar } from 'lucide-react';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { CardButton } from '../../../shared/components/buttons/CardButton';
import { useUserProfile } from '@/hooks/useUserProfile';
import { CARD_STYLES } from '@/styles/tailwind-constants';

export function HomePage() {
  const navigate = useNavigate();
  const { userName } = useUserProfile();

  return (
    <PageLayout>
      <div>
        <h1 className="mb-2">Hola, {userName} 👋</h1>
        <p className="text-muted-foreground">¿Qué te gustaría hacer hoy?</p>
      </div>

      <div className="space-y-4">
        <CardButton
          icon={Sparkles}
          title="Crear rutina nueva"
          description="Genera una rutina personalizada con inteligencia artificial"
          onClick={() => navigate('/create')}
          variant="primary"
          ariaLabel="Crear nueva rutina"
        />

        <CardButton
          icon={Calendar}
          title="Mis rutinas"
          description="Revisa y gestiona tus rutinas guardadas"
          onClick={() => navigate('/library')}
          variant="secondary"
          ariaLabel="Ver mis rutinas guardadas"
        />
      </div>

      <div className={`${CARD_STYLES.accent} p-6`}>
        <h4 className="mb-2">💡 Consejo del día</h4>
        <p className="text-muted-foreground">
          Comienza con actividades pequeñas y poco a poco aumenta la dificultad. ¡Lo importante es disfrutar el
          proceso!
        </p>
      </div>
    </PageLayout>
  );
}
