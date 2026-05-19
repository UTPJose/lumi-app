import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AccessibleButton } from '../components/AccessibleButton';

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  
  const handleContinue = () => {
    if (name && age) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userAge', age);
      navigate('/interests');
    }
  };
  
  return (
    <div className="min-h-screen bg-background px-6 py-8 pb-24">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <h1 className="mb-3">Cuéntanos sobre ti</h1>
          <p className="text-muted-foreground">
            Esta información nos ayuda a crear rutinas más personalizadas.
          </p>
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
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full min-h-[60px] px-6 py-4 bg-input-background rounded-2xl border-2 border-border focus:border-primary focus:outline-none transition-colors"
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
              onChange={(e) => setAge(e.target.value)}
              placeholder="Tu edad"
              className="w-full min-h-[60px] px-6 py-4 bg-input-background rounded-2xl border-2 border-border focus:border-primary focus:outline-none transition-colors"
              aria-required="true"
            />
          </div>
          
          <div className="bg-secondary p-6 rounded-2xl">
            <p className="text-sm">
              💡 También puedes pedir ayuda a un familiar para configurar la aplicación.
            </p>
          </div>
        </div>
        
        <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto">
          <AccessibleButton 
            onClick={handleContinue}
            disabled={!name || !age}
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
