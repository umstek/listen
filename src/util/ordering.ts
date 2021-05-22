export function tokenize(text: string) {
  return text.split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)|\b/);
}

export function tokenizeAndCompare(text1: string, text2: string) {}
