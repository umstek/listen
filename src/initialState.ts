const initialState = {
  rootFolders: [] as FileSystemDirectoryHandle[],
  rootFiles: [] as FileSystemFileHandle[],
  folders: [] as FileSystemDirectoryHandle[],
  files: [] as FileSystemFileHandle[],
  path: [] as FileSystemDirectoryHandle[],
  activeFile: undefined as FileSystemFileHandle | undefined,
  hidden: {} as { [path: string]: string[] },
  deleteRequestedEntry: undefined as FileSystemHandle | undefined,
  openDialogOpen: false,
  openCollectionName: '',
  saveDialogOpen: false,
  saveCollectionName: '',
};

type State = typeof initialState;

export default initialState;
export type { State };
