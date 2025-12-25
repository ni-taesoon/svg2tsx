/**
 * 단축키 도움말 모달
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui';
import { SHORTCUTS, getShortcutLabel } from '@/shared/config/shortcuts';

interface ShortcutItemProps {
  label: string;
  description: string;
}

function ShortcutItem({ label, description }: ShortcutItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{description}</span>
      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
        {label}
      </kbd>
    </div>
  );
}

export interface ShortcutsHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>키보드 단축키</DialogTitle>
          <DialogDescription>
            빠른 작업을 위한 단축키 목록입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="divide-y">
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SWITCH_TO_INPUT)}
            description={SHORTCUTS.SWITCH_TO_INPUT.description}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SWITCH_TO_PREVIEW)}
            description={SHORTCUTS.SWITCH_TO_PREVIEW.description}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SWITCH_TO_OPTIONS)}
            description={SHORTCUTS.SWITCH_TO_OPTIONS.description}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SAVE_FILE)}
            description={SHORTCUTS.SAVE_FILE.description}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.COPY_CODE)}
            description={SHORTCUTS.COPY_CODE.description}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SHOW_HELP)}
            description={SHORTCUTS.SHOW_HELP.description}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
