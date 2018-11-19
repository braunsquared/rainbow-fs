
export const sep = '/';

export function normalize(path: string): string {
  const norm = path.replace(/\/{2,}/g, '/').replace(/\/$/, '');
  return norm.startsWith('/') ? norm : `/${norm}`;
}

export function join(...elements: (string | undefined)[] ): string {
  return normalize(elements.filter(i => !!i).join(sep));
}

export function split(path: string): string[] {
  const tokens = path.split(sep);
  return tokens.length > 0 && tokens[0] === '' ? tokens.slice(1) : tokens;
}

export interface ParsedPath {
  name: string,
  base: string,
  path: string,
  tokens: string[],
};

export function parse(path: string): ParsedPath {
  const norm = normalize(path);
  const tokens = split(norm);
  return {
    name: tokens[tokens.length - 1],
    base: join(...tokens.slice(0, tokens.length -1)),
    path: norm,
    tokens,
  };
}