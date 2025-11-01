
import { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading2, List, ListOrdered, Link2 } from 'lucide-react';
import { Separator } from './ui/separator';

interface MarkdownToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
}

export function MarkdownToolbar({ textareaRef }: MarkdownToolbarProps) {
  const applyFormat = (syntaxStart: string, syntaxEnd: string = syntaxStart) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = `${syntaxStart}${selectedText}${syntaxEnd}`;

    textarea.setRangeText(newText, start, end, 'select');
    textarea.focus();

    // Trigger input event to update form state
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
  };

  const applyList = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = textarea.value.substring(0, start).split('\n');
    const currentLineStart = start - lines[lines.length - 1].length;
    
    const newText = `${syntax} `;
    textarea.setRangeText(newText, currentLineStart, currentLineStart, 'end');
    textarea.focus();

    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
  };

  const applyLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const url = prompt("Enter the URL:");

    if (url) {
        const newText = `[${selectedText || 'link text'}](${url})`;
        textarea.setRangeText(newText, start, end, 'end');
        textarea.focus();
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    }
  }

  return (
    <div className="flex items-center gap-1 border border-input rounded-md p-1 bg-transparent">
      <Button type="button" variant="ghost" size="icon" title="Heading" onClick={() => applyFormat('## ')}>
        <Heading2 className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button type="button" variant="ghost" size="icon" title="Bold" onClick={() => applyFormat('**')}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" title="Italic" onClick={() => applyFormat('*')}>
        <Italic className="h-4 w-4" />
      </Button>
       <Separator orientation="vertical" className="h-6" />
      <Button type="button" variant="ghost" size="icon" title="Bulleted List" onClick={() => applyList('*')}>
        <List className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" title="Numbered List" onClick={() => applyList('1.')}>
        <ListOrdered className="h-4 w-4" />
      </Button>
       <Separator orientation="vertical" className="h-6" />
       <Button type="button" variant="ghost" size="icon" title="Insert Link" onClick={applyLink}>
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
