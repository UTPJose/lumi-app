import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { useUserProfile } from '@/hooks/useUserProfile';
import { INPUT_STYLES } from '@/styles/tailwind-constants';

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const { setName, setAge } = useUserProfile();
  const [name, setLocalName] = useState('');
  const [age, setLocalAge] = useState('');

  const handleContinue = () => {
    if (name && age) {
      setName(name);
      setAge(parseInt(age));
      navigate('/interests');
    }
  };

  return (
    <PageLayout showNavigation={false}>
      <div>
        <h1 className="mb-3">Cuéntanos sobre ti</h1>
        <p className="text-muted-foreground">Esta información nos ayuda a crear rutinas más personalizadas.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-3">
            ¿Cómo te llamas?
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Tu nombre"
            className={INPUT_STYLES}
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="age" className="block mb-3">
            ¿Cuál es tu edad?
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setLocalAge(e.target.value)}
            placeholder="Tu edad"
            className={INPUT_STYLES}
            aria-required="true"
          />
        </div>

        <div className="bg-secondary p-6 rounded-2xl">
          <p className="text-sm">
            💡 También puedes pedir ayuda a un familiar para configurar la aplicación.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <AccessibleButton
          onClick={handleContinue}
          disabled={!name || !age}
          variant="primary"
          fullWidth
        >
          Continuar
        </AccessibleButton>
      </div>
    </PageLayout>
  );
}
