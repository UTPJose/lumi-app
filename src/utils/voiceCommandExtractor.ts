interface VoiceCommand {
  keywords: string[];
  action: () => void;
  element: HTMLElement;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function extractTextFromElement(element: HTMLElement): string[] {
  const texts: string[] = [];

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) texts.push(normalizeText(ariaLabel));

  const title = element.getAttribute('title');
  if (title) texts.push(normalizeText(title));

  const dataVoiceCommand = element.getAttribute('data-voice-command');
  if (dataVoiceCommand) texts.push(normalizeText(dataVoiceCommand));

  const textContent = element.textContent;
  if (textContent) texts.push(normalizeText(textContent));

  return texts.filter((t) => t.length > 0);
}

function generateKeywords(texts: string[]): string[] {
  const keywords = new Set<string>();

  texts.forEach((text) => {
    keywords.add(text);

    const words = text.split(/\s+/);
    words.forEach((word) => {
      if (word.length > 2) {
        keywords.add(word);
      }
    });

    if (words.length > 1) {
      for (let i = 0; i < words.length - 1; i++) {
        keywords.add(words.slice(i, i + 2).join(' '));
      }
    }
  });

  return Array.from(keywords);
}

function simulateClick(element: HTMLElement): void {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}

export function extractVoiceCommands(): VoiceCommand[] {
  const commands: VoiceCommand[] = [];

  const interactiveSelectors = [
    'button',
    'a[href]',
    'input[type="submit"]',
    'input[type="button"]',
    '[role="button"]',
    '[onclick]',
  ];

  const elements = Array.from(
    document.querySelectorAll(interactiveSelectors.join(','))
  ) as HTMLElement[];

  elements.forEach((element) => {
    const texts = extractTextFromElement(element);
    if (texts.length === 0) return;

    const keywords = generateKeywords(texts);
    if (keywords.length === 0) return;

    const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0;
    if (!isVisible) return;

    commands.push({
      keywords,
      action: () => simulateClick(element),
      element,
    });
  });

  return commands;
}

interface CommandMatch {
  command: VoiceCommand;
  confidence: number;
}

export function findBestMatch(transcript: string, commands: VoiceCommand[]): CommandMatch | null {
  const normalizedTranscript = normalizeText(transcript);
  const words = normalizedTranscript.split(/\s+/);

  let bestMatch: CommandMatch | null = null;

  commands.forEach((command) => {
    command.keywords.forEach((keyword) => {
      let confidence = 0;

      if (keyword === normalizedTranscript) {
        confidence = 1.0;
      } else if (normalizedTranscript.includes(keyword)) {
        confidence = 0.9;
      } else {
        const distance = levenshteinDistance(normalizedTranscript, keyword);
        const maxLength = Math.max(normalizedTranscript.length, keyword.length);
        confidence = Math.max(0, 1 - distance / (maxLength * 0.5));

        if (confidence < 0.6) confidence = 0;
      }

      for (const word of words) {
        if (word.length > 2 && keyword.includes(word)) {
          confidence = Math.min(1.0, confidence + 0.1);
          break;
        }
      }

      if (confidence > 0.5) {
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { command, confidence };
        }
      }
    });
  });

  return bestMatch;
}
