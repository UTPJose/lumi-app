import { extractVoiceCommands, findBestMatch } from '../voiceCommandExtractor';

describe('voiceCommandExtractor', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('extracts buttons with aria-label', () => {
    document.body.innerHTML = `
      <button aria-label="Crear nueva rutina">Create</button>
      <button aria-label="Mis rutinas">Library</button>
    `;

    const commands = extractVoiceCommands();
    expect(commands.length).toBe(2);
    expect(commands[0].keywords).toContain('crear nueva rutina');
    expect(commands[1].keywords).toContain('mis rutinas');
  });

  test('finds best match with exact phrase', () => {
    document.body.innerHTML = `
      <button aria-label="Crear rutina">Create</button>
    `;

    const commands = extractVoiceCommands();
    const match = findBestMatch('crear rutina', commands);

    expect(match).not.toBeNull();
    expect(match?.confidence).toBe(1.0);
  });

  test('finds best match with partial phrase', () => {
    document.body.innerHTML = `
      <button aria-label="Crear nueva rutina">Create</button>
    `;

    const commands = extractVoiceCommands();
    const match = findBestMatch('crear rutina', commands);

    expect(match).not.toBeNull();
    expect(match?.confidence).toBeGreaterThan(0.6);
  });

  test('finds best match with fuzzy matching', () => {
    document.body.innerHTML = `
      <button aria-label="Mis rutinas">Library</button>
    `;

    const commands = extractVoiceCommands();
    const match = findBestMatch('mis rutina', commands);

    expect(match).not.toBeNull();
    expect(match?.confidence).toBeGreaterThan(0.5);
  });

  test('ignores hidden elements', () => {
    document.body.innerHTML = `
      <button aria-label="Visible">Visible</button>
      <button aria-label="Hidden" style="display:none">Hidden</button>
    `;

    const commands = extractVoiceCommands();
    expect(commands.length).toBe(1);
    expect(commands[0].keywords).toContain('visible');
  });

  test('generates word-level keywords', () => {
    document.body.innerHTML = `
      <button aria-label="Crear nueva rutina">Create</button>
    `;

    const commands = extractVoiceCommands();
    const keywords = commands[0].keywords;

    expect(keywords).toContain('crear');
    expect(keywords).toContain('nueva');
    expect(keywords).toContain('rutina');
  });

  test('returns null for no match below threshold', () => {
    document.body.innerHTML = `
      <button aria-label="Crear rutina">Create</button>
    `;

    const commands = extractVoiceCommands();
    const match = findBestMatch('xyz abc xyz', commands);

    expect(match).toBeNull();
  });
});
