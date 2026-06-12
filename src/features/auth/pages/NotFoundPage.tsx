import React from 'react';
import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-6xl mb-4">404</h1>
          <h2 className="mb-3">Página no encontrada</h2>
          <p className="text-muted-foreground text-xl">Lo sentimos, la página que buscas no existe.</p>
        </div>

        <AccessibleButton
          onClick={() => navigate('/home')}
          variant="primary"
          icon={Home}
          fullWidth
        >
          Volver al inicio
        </AccessibleButton>
      </div>
    </PageLayout>
  );
}
