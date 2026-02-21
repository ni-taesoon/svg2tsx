/**
 * 단축키 도움말 모달
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui';
import { SHORTCUTS, getShortcutLabel } from '@/shared/config/shortcuts';
import { t } from '@/i18n';

interface ShortcutItemProps {
  label: string;
  description: string;
}

function ShortcutItem({ label, description }: ShortcutItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{description}</span>
      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">{label}</kbd>
    </div>
  );
}

export interface ShortcutsHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('shortcuts.title')}</DialogTitle>
          <DialogDescription>{t('shortcuts.description')}</DialogDescription>
        </DialogHeader>
        <div className="divide-y">
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SWITCH_TO_INPUT)}
            description={t('shortcuts.openFile')}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SWITCH_TO_PREVIEW)}
            description={t('shortcuts.switchPreview')}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SWITCH_TO_OPTIONS)}
            description={t('shortcuts.switchOptions')}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SAVE_FILE)}
            description={t('shortcuts.saveFile')}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.COPY_CODE)}
            description={t('shortcuts.copyCode')}
          />
          <ShortcutItem
            label={getShortcutLabel(SHORTCUTS.SHOW_HELP)}
            description={t('shortcuts.showHelp')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
