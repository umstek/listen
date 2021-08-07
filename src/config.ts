const config = {
  recognizedExtensionsRegex: new RegExp(
    import.meta.env.SNOWPACK_PUBLIC_RECOGNIZED_EXTENSIONS_REGEX,
  ),
  recognizedExtensionsList:
    import.meta.env.SNOWPACK_PUBLIC_RECOGNIZED_EXTENSIONS_CSV.split(',').map(
      (ext: string) => `.${ext}`,
    ),
  recognizedMimeTypesList:
    import.meta.env.SNOWPACK_PUBLIC_RECOGNIZED_MIME_TYPES_CSV.split(',').map(
      (mimeType: string) => mimeType.trim(),
    ),
};

export default config;
