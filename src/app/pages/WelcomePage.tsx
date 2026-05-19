import React from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AccessibleButton } from '../components/AccessibleButton';

export function WelcomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white flex flex-col items-center justify-center px-6 pb-20">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-14 h-14 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-primary mb-4">Lumi</h1>
          <p className="text-2xl text-foreground">Rutinas inteligentes con propósito</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl">
            <p className="text-xl leading-relaxed">
              Te ayudamos a crear rutinas personalizadas para que cada día tenga significado y propósito.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl">
            <p className="text-xl leading-relaxed">
              Simple, claro y pensado para ti.
            </p>
          </div>
        </div>
        
        <div className="pt-4 space-y-4">
          <AccessibleButton 
            onClick={() => navigate('/profile-setup')}
            variant="primary"
            fullWidth
          >
            Comenzar
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}
