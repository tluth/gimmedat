export interface TreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: TreeNode[]
  expanded?: boolean
  size?: string
  lastModified?: string
  fileType?: string
  loaded?: boolean // Whether folder contents have been loaded
  loading?: boolean // Whether folder is currently loading
}
