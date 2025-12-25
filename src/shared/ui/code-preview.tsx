/**
 * 코드 미리보기 컴포넌트
 *
 * prism-react-renderer를 사용한 구문 하이라이팅
 */

import { Highlight, themes } from 'prism-react-renderer';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/app/providers';

export interface CodePreviewProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  language = 'tsx',
  className,
}) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? themes.vsDark : themes.vsLight;

  return (
    <Highlight theme={theme} code={code} language={language}>
      {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            highlightClassName,
            'rounded-lg p-4 overflow-auto text-sm font-mono',
            className
          )}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="inline-block w-8 text-right mr-4 text-gray-500 select-none">
                {i + 1}
              </span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
