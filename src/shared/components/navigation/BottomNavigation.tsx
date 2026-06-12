import React, { useState } from 'react';
import { Home, Library, Bell, Plus, User, PersonStanding } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { AccessibilityPanel } from '../accessibility/AccessibilityPanel';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/home' },
    { icon: Library, label: 'Rutinas', path: '/library' },
    { icon: Plus, label: 'Nueva', path: '/create' },
    { icon: Bell, label: 'Recordatorios', path: '/reminders' },
    { icon: User, label: 'Perfil', path: '/profile' },
    { icon: PersonStanding, label: 'Accesibilidad', path: null },
  ];
  
  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border safe-area-bottom z-30"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="max-w-md mx-auto flex justify-around items-center px-2 py-3">
          {navItems.map((item) => {
            const isAccessibility = item.path === null;
            const isActive = isAccessibility ? isAccessibilityOpen : location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (isAccessibility) {
                    setIsAccessibilityOpen(!isAccessibilityOpen);
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`
                  flex flex-col items-center gap-1 min-w-[60px] py-2 px-2 rounded-xl transition-all
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AccessibilityPanel isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />
    </>
  );
}