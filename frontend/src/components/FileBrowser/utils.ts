import { IMAGE_EXTENSIONS, TEXT_EXTENSIONS, RESERVED_FOLDER_NAMES, MAX_FOLDER_NAME_LENGTH } from '@/constants'

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return '⚡'
    case 'py':
      return '🐍'
    case 'json':
      return '📋'
    case 'md':
    case 'txt':
      return '📄'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return '🖼️'
    case 'pdf':
      return '📕'
    case 'zip':
    case 'tar':
    case 'gz':
      return '📦'
    case 'css':
    case 'scss':
      return '🎨'
    case 'html':
      return '🌐'
    case 'xml':
      return '📰'
    case 'csv':
      return '📊'
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎬'
    case 'mp3':
    case 'wav':
    case 'flac':
      return '🎵'
    default:
      return '📄'
  }
}

export const isTextFile = (fileName: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return TEXT_EXTENSIONS.includes(extension || '') || !extension // files without extension are often text
}

export const isImageFile = (fileName: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return IMAGE_EXTENSIONS.includes(extension || '')
}

export const getLanguageFromExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'py':
      return 'python'
    case 'json':
      return 'json'
    case 'html':
      return 'markup'  // Prism.js uses 'markup' for HTML
    case 'css':
      return 'css'
    case 'scss':
      return 'scss'
    case 'xml':
      return 'markup'  // Prism.js uses 'markup' for XML too
    case 'sql':
      return 'sql'
    case 'sh':
    case 'bat':
      return 'bash'
    case 'yaml':
    case 'yml':
      return 'yaml'
    case 'md':
      return 'markdown'
    case 'c':
    case 'h':
      return 'c'
    case 'cpp':
    case 'hpp':
      return 'cpp'
    case 'java':
      return 'java'
    case 'php':
      return 'php'
    case 'rb':
      return 'ruby'
    case 'go':
      return 'go'
    case 'rs':
      return 'rust'
    case 'swift':
      return 'swift'
    case 'kt':
      return 'kotlin'
    case 'scala':
      return 'scala'
    case 'pl':
      return 'perl'
    case 'r':
      return 'r'
    case 'vue':
      return 'vue'
    case 'svelte':
      return 'svelte'
    case 'astro':
      return 'astro'
    case 'toml':
      return 'toml'
    case 'ini':
    case 'conf':
      return 'ini'
    case 'csv':
      return 'csv'
    case 'log':
      return 'log'
    case 'dockerfile':
      return 'dockerfile'
    case 'env':
    case 'properties':
      return 'properties'
    default:
      return 'text'
  }
}

/**
 * Validates a folder name for file system compatibility
 * @param name - The folder name to validate
 * @returns Error message if invalid, null if valid
 */
export const validateFolderName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Folder name cannot be empty'
  }

  // Check for invalid characters (for S3/file systems)
  const invalidChars = /[<>:"/\\|?*]/
  const hasControlChars = name.split('').some(char => char.charCodeAt(0) < 32)

  if (invalidChars.test(name) || hasControlChars) {
    return 'Folder name contains invalid characters'
  }

  if (name.length > MAX_FOLDER_NAME_LENGTH) {
    return `Folder name is too long (max ${MAX_FOLDER_NAME_LENGTH} characters)`
  }

  // Check for reserved names (Windows compatibility)
  if (RESERVED_FOLDER_NAMES.includes(name.toUpperCase())) {
    return 'Folder name is reserved'
  }

  return null
}
