import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActionChip {
  id: string;
  label: string;
  onClick?: () => void;
}

interface ActionChipsProps {
  chips: ActionChip[];
  className?: string;
  chipClassName?: string;
}

export function ActionChips({ chips, className, chipClassName }: ActionChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {chips.map((chip, i) => (
        <motion.button
          key={chip.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          onClick={chip.onClick}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium',
            'bg-white/[0.04] border border-white/[0.10]',
            'text-white/80 hover:text-white hover:bg-white/[0.08]',
            'hover:border-white/[0.18] hover:shadow-[0_0_20px_rgba(17,115,188,0.12)]',
            'transition-all duration-300 cursor-pointer',
            chipClassName
          )}
        >
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
}
