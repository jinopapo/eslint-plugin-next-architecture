import path from "node:path";

const projectRoot = process.cwd();

export const appDir = path.join(projectRoot, "app");
export const clientDir = path.join(projectRoot, "client");
export const serverDir = path.join(projectRoot, "server");
export const clientActionsDir = path.join(clientDir, "actions");
export const clientServicesDir = path.join(clientDir, "services");
export const clientRepositorysDir = path.join(clientDir, "repositorys");
export const clientPartsDir = path.join(clientDir, "parts");
export const clientStoreDir = path.join(clientDir, "store");
export const clientStoreAppDir = path.join(clientStoreDir, "app");
export const clientStorePagesDir = path.join(clientStoreDir, "pages");
export const clientComponentsDir = path.join(clientDir, "components");
export const serverServiceDir = path.join(serverDir, "service");
export const serverRepositoryDir = path.join(serverDir, "repository");

export const isInside = (targetDir, filePath) => {
  const normalizedTarget = path.normalize(targetDir);
  const normalizedFile = path.normalize(filePath);

  return (
    normalizedFile === normalizedTarget ||
    normalizedFile.startsWith(`${normalizedTarget}${path.sep}`)
  );
};

export const resolveImportPath = (importSource, currentFilePath) => {
  if (importSource.startsWith(".")) {
    return path.resolve(path.dirname(currentFilePath), importSource);
  }

  if (importSource.startsWith("@/")) {
    return path.resolve(projectRoot, importSource.slice(2));
  }

  if (importSource.startsWith("/")) {
    return path.resolve(projectRoot, importSource.slice(1));
  }

  return null;
};

export const getFileNameWithoutExt = (filePath) => {
  const ext = path.extname(filePath);
  return path.basename(filePath, ext);
};

export const getRelativePathSegments = (baseDir, targetPath) => {
  const relativePath = path.relative(baseDir, targetPath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return [];
  }

  return relativePath.split(path.sep).filter(Boolean);
};