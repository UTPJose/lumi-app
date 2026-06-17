import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { AccessibleButton } from '@/shared/components/buttons/AccessibleButton';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToRoutines: () => void;
  routineTitle: string;
}

export function CompletionModal({
  isOpen,
  onClose,
  onGoToRoutines,
  routineTitle,
}: CompletionModalProps) {
  useEffect(() => {
    if (isOpen) {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      requestAnimationFrame(frame);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            ¡Felicitaciones!
          </DialogTitle>
          <DialogDescription className="text-center">
            Completaste todas las actividades de "{routineTitle}". ¡Excelente
            trabajo! ¿Quieres volver a la sección de rutinas?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <AccessibleButton
            onClick={onGoToRoutines}
            variant="primary"
            fullWidth
          >
            Ir a mis rutinas
          </AccessibleButton>
          <AccessibleButton onClick={onClose} variant="outline" fullWidth>
            Seguir aquí
          </AccessibleButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
