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
  const textExtensions = [
    'txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'py', 'html', 'css', 'scss',
    'xml', 'csv', 'yaml', 'yml', 'toml', 'ini', 'conf', 'log', 'sql', 'sh',
    'bat', 'dockerfile', 'gitignore', 'gitattributes', 'env', 'properties',
    'c', 'cpp', 'h', 'hpp', 'java', 'php', 'rb', 'go', 'rs', 'swift',
    'kt', 'scala', 'pl', 'r', 'vue', 'svelte', 'astro'
  ]

  const extension = fileName.split('.').pop()?.toLowerCase()
  return textExtensions.includes(extension || '') || !extension // files without extension are often text
}

export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico']
  const extension = fileName.split('.').pop()?.toLowerCase()
  return imageExtensions.includes(extension || '')
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
