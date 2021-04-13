export async function getFileSystemEntries(items: DataTransferItemList) {
  const fileSystemEntries = await Promise.all(
    Object.keys(items)
      .map((i) => items[Number(i)])
      .filter((item) => item.kind === 'file') // file or folder, not a string
      .map((f) => f.getAsFileSystemHandle()),
  );
  const directories = fileSystemEntries.filter(
    (entry) => entry.kind === 'directory',
  );
  const files = fileSystemEntries.filter((entry) => entry.kind === 'file');

  return { directories, files };
}

export async function iterateDirectory(directoryHandle: any) {
  const iterator = directoryHandle.entries();

  const directories = [];
  const files = [];

  while (true) {
    const result = await iterator.next();
    if (result.done) {
      break;
    }

    const [name, entry] = result.value;
    if (entry.kind === 'directory') {
      directories.push(entry);
    } else {
      files.push(entry);
    }
  }

  return { directories, files };
}

export const clamp = (min: number, max: number) => (value: number) =>
  Math.min(max, Math.max(min, value));
