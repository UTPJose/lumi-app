import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Book, Music, Footprints, Coffee, Palette, Users, Heart, Camera } from 'lucide-react';
import { InterestCard } from '../components/InterestCard';
import { AccessibleButton } from '../components/AccessibleButton';

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
  const [selected, setSelected] = useState<string[]>([]);
  
  const toggleInterest = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };
  
  const handleContinue = () => {
    if (selected.length > 0) {
      localStorage.setItem('userInterests', JSON.stringify(selected));
      navigate('/home');
    }
  };
  
  return (
    <div className="min-h-screen bg-background px-6 py-8 pb-32">
      <div className="max-w-md mx-auto space-y-8">
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
        
        <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto">
          <div className="bg-white p-4 rounded-2xl mb-4 text-center">
            <p className="text-muted-foreground">
              {selected.length === 0 
                ? 'Selecciona al menos una actividad' 
                : `${selected.length} actividades seleccionadas`
              }
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
        </div>
      </div>
    </div>
  );
}
