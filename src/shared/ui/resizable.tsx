import { GripHorizontal } from 'lucide-react';
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from 'react-resizable-panels';

import { cn } from '@/shared/lib/utils';

type ResizablePanelGroupProps = Omit<GroupProps, 'orientation'> & {
  direction?: 'horizontal' | 'vertical';
};

const ResizablePanelGroup = ({
  className,
  direction = 'horizontal',
  ...props
}: ResizablePanelGroupProps) => (
  <Group
    className={cn(
      'flex h-full w-full',
      direction === 'vertical' ? 'flex-col' : 'flex-row',
      className
    )}
    orientation={direction}
    {...props}
  />
);

const ResizablePanel = ({
  className,
  ...props
}: PanelProps) => <Panel className={className} {...props} />;

type ResizableHandleProps = Omit<SeparatorProps, 'children'> & {
  withHandle?: boolean;
};

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: ResizableHandleProps) => (
  <Separator
    className={cn(
      'relative flex items-center justify-center bg-border transition-colors',
      'data-[orientation=horizontal]:h-full data-[orientation=horizontal]:w-px',
      'data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full',
      'hover:bg-primary/30',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border data-[orientation=vertical]:rotate-90">
        <GripHorizontal className="h-2.5 w-2.5" />
      </div>
    )}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
