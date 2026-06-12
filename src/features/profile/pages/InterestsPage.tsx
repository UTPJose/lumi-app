import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Book, Music, Footprints, Coffee, Palette, Users, Heart, Camera } from 'lucide-react';
import { InterestCard } from '../components/InterestCard';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { useUserProfile } from '@/hooks/useUserProfile';
import { CARD_STYLES } from '@/styles/tailwind-constants';

const INTERESTS = [
  { id: 'reading', icon: Book, label: 'Lectura' },
  { id: 'music', icon: Music, label: 'Música' },
  { id: 'walking', icon: Footprints, label: 'Caminar' },
  { id: 'cooking', icon: Coffee, label: 'Cocina' },
  { id: 'art', icon: Palette, label: 'Arte' },
  { id: 'social', icon: Users, label: 'Socializar' },
  { id: 'wellness', icon: Heart, label: 'Bienestar' },
  { id: 'photos', icon: Camera, label: 'Fotografía' },
];

export function InterestsPage() {
  const navigate = useNavigate();
  const { setInterests } = useUserProfile();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      setInterests(selected);
      navigate('/home');
    }
  };

  return (
    <PageLayout>
      <div>
        <h1 className="mb-3">¿Qué te gusta hacer?</h1>
        <p className="text-muted-foreground">
          Selecciona las actividades que más disfrutas. Puedes elegir varias.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {INTERESTS.map((interest) => (
          <InterestCard
            key={interest.id}
            icon={interest.icon}
            label={interest.label}
            selected={selected.includes(interest.id)}
            onToggle={() => toggleInterest(interest.id)}
          />
        ))}
      </div>

      <div className={`${CARD_STYLES.white} p-4 rounded-2xl text-center`}>
        <p className="text-muted-foreground">
          {selected.length === 0
            ? 'Selecciona al menos una actividad'
            : `${selected.length} actividades seleccionadas`}
        </p>
      </div>

      <AccessibleButton
        onClick={handleContinue}
        disabled={selected.length === 0}
        variant="primary"
        fullWidth
      >
        Continuar
      </AccessibleButton>
    </PageLayout>
  );
}
