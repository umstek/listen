const config = {
  recognizedExtensionsRegex: new RegExp(import.meta.env.VITE_RECOGNIZED_EXTENSIONS_REGEX),
  recognizedExtensionsList: import.meta.env.VITE_RECOGNIZED_EXTENSIONS_CSV.split(',').map((ext: string) => `.${ext}`),
};

export default config;
