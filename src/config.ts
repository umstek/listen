const config = {
  recognizedExtensions: new RegExp(
    import.meta.env.SNOWPACK_PUBLIC_RECOGNIZED_EXTENSIONS,
  ),
};

export default config;
