import { extractPromptFromContent } from '../../src/utils/prompts';

describe('extractPromptFromContent', () => {
  describe('Happy Path', () => {
    test('should extract prompt with XML language and closing backticks', () => {
      const input = `## Prompt
\`\`\`xml
Context for speech recognition:
- Company: Acme Corporation
- Names: John Smith, Sarah Johnson
\`\`\``;

      const expected = "Context for speech recognition:\n- Company: Acme Corporation\n- Names: John Smith, Sarah Johnson";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should extract prompt without language specification', () => {
      const input = `## Prompt
\`\`\`
This is a simple prompt without language specification.
\`\`\``;

      const expected = "This is a simple prompt without language specification.";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should extract prompt with markdown language', () => {
      const input = `## Prompt
\`\`\`markdown
Transform the following text into a casual email.
Keep it friendly and conversational.
\`\`\``;

      const expected = "Transform the following text into a casual email.\nKeep it friendly and conversational.";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should extract prompt without closing backticks', () => {
      const input = `## Prompt
\`\`\`xml
Context for speech recognition:
- Company: Test Corp
- Technical terms: API, REST, GraphQL`;

      const expected = "Context for speech recognition:\n- Company: Test Corp\n- Technical terms: API, REST, GraphQL";
      expect(extractPromptFromContent(input)).toBe(expected);
    });
  });

  describe('Edge Cases', () => {
    test('should handle extra whitespace around prompt section', () => {
      const input = `## Prompt

\`\`\`xml

Context with extra whitespace around.

\`\`\``;

      const expected = "Context with extra whitespace around.";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should handle complex language specification', () => {
      const input = `## Prompt
\`\`\`{.javascript .numberLines startFrom="100"}
const prompt = "Complex language spec";
\`\`\``;

      const expected = 'const prompt = "Complex language spec";';
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should handle unicode and special characters', () => {
      const input = `## Prompt
\`\`\`урЯзык中文🚀
Контекст для распознавания речи:
- Компания: ООО "Рога & Копыта"
- Имена: João, François, 中文名字
- Специальные символы: !@#$%^&*()
- Эмодзи: 🚀💡🎯
\`\`\``;

      const expected = 'Контекст для распознавания речи:\n- Компания: ООО "Рога & Копыта"\n- Имена: João, François, 中文名字\n- Специальные символы: !@#$%^&*()\n- Эмодзи: 🚀💡🎯';
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should handle empty prompt content', () => {
      const input = `## Prompt
\`\`\`
\`\`\``;

      expect(extractPromptFromContent(input)).toBe("");
    });

    test('should handle only whitespace in prompt', () => {
      const input = `## Prompt
\`\`\`


   

\`\`\``;

      expect(extractPromptFromContent(input)).toBe("");
    });

    test('should handle multi-line with various formatting', () => {
      const input = `## Prompt
\`\`\`xml
Line 1: Normal text
Line 2:   Indented text
Line 3:
Line 4: Text after empty line

Line 6: Text after double empty line
\`\`\``;

      const expected = "Line 1: Normal text\nLine 2:   Indented text\nLine 3:\nLine 4: Text after empty line\n\nLine 6: Text after double empty line";
      expect(extractPromptFromContent(input)).toBe(expected);
    });
  });

  describe('Fallback Cases', () => {
    test('should return full content when no ## Prompt section', () => {
      const input = `Just plain text without any special formatting.
This should be returned as-is.`;

      const expected = "Just plain text without any special formatting.\nThis should be returned as-is.";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should return full content with wrong header format', () => {
      const input = `# Prompt
\`\`\`xml
This has wrong header format
\`\`\``;

      const expected = "# Prompt\n```xml\nThis has wrong header format\n```";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should return full content when no backticks after header', () => {
      const input = `## Prompt
Just text without code blocks`;

      const expected = "## Prompt\nJust text without code blocks";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should handle empty content', () => {
      expect(extractPromptFromContent("")).toBe("");
    });

    test('should handle only whitespace', () => {
      const input = "   \n\n   \n   ";
      expect(extractPromptFromContent(input)).toBe("");
    });
  });

  describe('Tricky Cases', () => {
    test('should handle backticks inside prompt content', () => {
      const input = `## Prompt
\`\`\`
This prompt contains \`code\` inside backticks.
And even \`\`\`triple backticks\`\`\` in the middle.
\`\`\``;

      const expected = "This prompt contains `code` inside backticks.\nAnd even ```triple backticks``` in the middle.";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should match first ## Prompt section when multiple exist', () => {
      const input = `## Prompt
\`\`\`
First prompt section
\`\`\`

## Prompt
\`\`\`
Second prompt section
\`\`\``;

      const expected = "First prompt section\n\n## Prompt\n```\nSecond prompt section";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should handle case insensitive header', () => {
      const input = `## prompt
\`\`\`xml
Lower case header
\`\`\``;

      const expected = "Lower case header";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should return full content when header has no space after ##', () => {
      const input = `##Prompt   
\`\`\`
Header without space after ##
\`\`\``;

      const expected = "##Prompt   \n```\nHeader without space after ##\n```";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should handle header with extra spaces', () => {
      const input = `##    Prompt   
\`\`\`
Header with extra spaces
\`\`\``;

      const expected = "Header with extra spaces";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should handle long language specification', () => {
      const input = `## Prompt
\`\`\`this-is-a-very-long-language-specification-that-should-still-work-properly
Content after long language spec
\`\`\``;

      const expected = "Content after long language spec";
      expect(extractPromptFromContent(input)).toBe(expected);
    });

    test('should handle prompt ending with triple backticks on same line', () => {
      const input = `## Prompt
\`\`\`
Simple prompt content\`\`\``;

      const expected = "Simple prompt content";
      expect(extractPromptFromContent(input)).toBe(expected);
    });
  });
});