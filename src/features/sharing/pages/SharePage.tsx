import React from 'react';
import { useNavigate } from 'react-router';
import { MessageCircle, Facebook, Link2, Mail, ArrowLeft } from 'lucide-react';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';

export function SharePage() {
  const navigate = useNavigate();

  const shareOptions = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'bg-[#25D366]',
      action: () => alert('Compartir por WhatsApp (demo)'),
    },
    {
      icon: Facebook,
      label: 'Facebook',
      color: 'bg-[#1877F2]',
      action: () => alert('Compartir por Facebook (demo)'),
    },
    {
      icon: Mail,
      label: 'Correo',
      color: 'bg-accent',
      action: () => alert('Compartir por correo (demo)'),
    },
    {
      icon: Link2,
      label: 'Copiar enlace',
      color: 'bg-muted',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace copiado!');
      },
    },
  ];

  return (
    <PageLayout showNavigation={false}>
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary mb-4 -ml-2 p-2 hover:bg-primary/10 rounded-xl transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          <span>Volver</span>
        </button>

        <h1 className="mb-3">Compartir rutina</h1>
        <p className="text-muted-foreground">Comparte tu rutina con familiares o amigos.</p>
      </div>

      <div className="bg-secondary p-6 rounded-2xl">
        <h4 className="mb-2">💡 ¿Por qué compartir?</h4>
        <p className="text-sm text-muted-foreground">
          Compartir tus rutinas permite que tus seres queridos sepan qué actividades tienes planeadas y puedan
          acompañarte.
        </p>
      </div>

      <div className="space-y-4">
        {shareOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.label}
              onClick={option.action}
              className={`w-full min-h-[80px] p-6 rounded-2xl transition-all active:scale-98 flex items-center gap-4 ${option.color} text-white hover:opacity-90`}
              aria-label={`Compartir por ${option.label}`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7" aria-hidden="true" />
              </div>
              <span className="text-xl">{option.label}</span>
            </button>
          );
        })}
      </div>
    </PageLayout>
  );
}
