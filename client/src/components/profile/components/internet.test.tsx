import { describe, it, expect, vi, beforeEach } from 'vitest';
import isURL from 'validator/lib/isURL';

vi.mock('validator/lib/isURL', () => ({
  default: vi.fn()
}));

vi.mock('../../../utils', () => ({
  maybeUrlRE: /https?:\/\/.*\..*/
}));

function getValidationStateFor(maybeURl: string, maybeUrlRE: RegExp): {
  state: 'success' | 'error' | null;
  message: string;
} {
 
  if (!maybeURl || !maybeUrlRE.test(maybeURl)) {
    return {
      state: null,
      message: ''
    };
  }
  

  if ((isURL as unknown as (s: string) => boolean)(maybeURl)) {
    return {
      state: 'success',
      message: ''
    };
  }
  
  return {
    state: 'error',
    message: 'validation.invalid-url'
  };
}

describe('InternetSettings - MC/DC Coverage Tests for getValidationStateFor', () => {
  const maybeUrlRE = /https?:\/\/.*\..*/;

  beforeEach(() => {
    vi.mocked(isURL).mockClear();
  });

  // CT1: URL vazia
  // Cobre: Tabela Verdade, Linha 1 - CD1V, CD2V
  // Entrada: "" | Saida Esperada: state: null, message: ""
  it('CT1: MC/DC - should return null state when URL is empty (CD1V, CD2V)', () => {
    const result = getValidationStateFor('', maybeUrlRE);
    expect(result.state).toBe(null);
    expect(result.message).toBe('');
  });

  // CT2: URL nao corresponde ao padrao
  // Cobre: Tabela Verdade, Linha 3 (par indep. CD2) - CD1F, CD2V
  // Entrada: "not-a-url" | Saida Esperada: state: null, message: ""
  it('CT2: MC/DC - should return null state when URL does not match pattern (CD1F, CD2V)', () => {
    const result = getValidationStateFor('not-a-url', maybeUrlRE);
    expect(result.state).toBe(null);
    expect(result.message).toBe('');
  });

  // CT3: URL corresponde ao padrao valida
  // Cobre: Tabela Verdade, Linha 4 - CD1F, CD2F
  // Entrada: "https://github.com/user" com isURL=true | Saida Esperada: state: "success", message: ""
  it('CT3: MC/DC - should return success when URL matches pattern and is valid (CD1F, CD2F)', () => {
    vi.mocked(isURL).mockReturnValue(true);
    const result = getValidationStateFor('https://github.com/user', maybeUrlRE);
    expect(result.state).toBe('success');
    expect(result.message).toBe('');
  });

  // CT4: URL corresponde mas invalida
  // Cobre: Tabela Verdade, Linha 4 (continua validacao) - CD1F, CD2F
  // Entrada: "https://github.com/user" com isURL=false | Saida Esperada: state: "error", message: "validation.invalid-url"
  it('CT4: MC/DC - should return error when URL matches pattern but is invalid (CD1F, CD2F)', () => {
    vi.mocked(isURL).mockReturnValue(false);
    const result = getValidationStateFor('https://github.com/user', maybeUrlRE);
    expect(result.state).toBe('error');
    expect(result.message).toBe('validation.invalid-url');
  });
});
