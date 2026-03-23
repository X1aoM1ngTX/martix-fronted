declare namespace API {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseFileVO = {
    code?: number
    data?: FileVO
    message?: string
  }

  type BaseResponseIPageFileVO = {
    code?: number
    data?: IPageFileVO
    message?: string
  }

  type BaseResponseIPageUserVO = {
    code?: number
    data?: IPageUserVO
    message?: string
  }

  type BaseResponseIWorkbookData = {
    code?: number
    data?: IWorkbookData
    message?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUser = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
  }

  type clearCacheParams = {
    /** 文件ID */
    fileId: number
  }

  type DeleteRequest = {
    id?: number
  }

  type downloadFileParams = {
    /** 文件ID */
    fileId: number
  }

  type FileCreateRequest = {
    /** 文件名（如：销售数据.xlsx） */
    fileName: string
    /** 文件类型：xlsx/xls/csv */
    fileType: 'xlsx' | 'xls' | 'csv'
    /** 所有者ID（不传则默认为当前用户） */
    ownerId?: number
    /** 初始行数（可选，默认100） */
    rows?: number
    /** 初始列数（可选，默认26即A-Z） */
    cols?: number
  }

  type FileQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    fileName?: string
    fileType?: string
    ownerId?: number
  }

  type FileRenameRequest = {
    id?: number
    newFileName?: string
  }

  type FileVO = {
    id?: number
    fileName?: string
    fileType?: string
    fileSize?: number
    fileSizeDisplay?: string
    filePath?: string
    ownerId?: number
    fileMd5?: string
    createdAt?: string
    updatedAt?: string
  }

  type getExcelDataParams = {
    /** 文件ID */
    fileId: number
  }

  type getFileParams = {
    /** 文件ID */
    fileId: number
  }

  type getUserByIdParams = {
    /** 用户ID */
    id: number
  }

  type getUserVOByIdParams = {
    /** 用户ID */
    id: number | string
  }

  type ICellData = {
    /** 单元格的原始值 */
    v?: string | number | boolean
    /** 单元格的样式 id 或者样式对象 */
    s?: string | IStyleData
    /** 单元格的类型：1=字符串, 2=数字, 3=布尔值, 4=强制文本 */
    t?: number
    /** 公式 */
    f?: string
    /** 公式 ID */
    si?: string
    /** 富文本 */
    p?: Record<string, any>
    /** 自定义字段 */
    custom?: Record<string, any>
  }

  type IPageFileVO = {
    size?: number
    current?: number
    records?: FileVO[]
    total?: number
    pages?: number
  }

  type IPageUserVO = {
    size?: number
    current?: number
    records?: UserVO[]
    total?: number
    pages?: number
  }

  /** Univer 样式数据结构 */
  type IStyleData = {
    /** 字体名称 */
    ff?: string
    /** 字体大小 (pt) */
    fs?: number
    /** 是否斜体: 0=否, 1=是 */
    it?: number
    /** 是否加粗: 0=否, 1=是 */
    bl?: number
    /** 下划线 */
    ul?: {
      /** 是否展示下划线 */
      s?: number
      /** 颜色是否跟随字体颜色 */
      c?: number
      /** 下划线颜色 */
      cl?: IColorStyle
      /** 下划线类型 */
      t?: number
    }
    /** 删除线 */
    st?: {
      s?: number
      c?: number
      cl?: IColorStyle
      t?: number
    }
    /** 上划线 */
    ol?: {
      s?: number
      c?: number
      cl?: IColorStyle
      t?: number
    }
    /** 背景颜色 */
    bg?: IColorStyle
    /** 边框 */
    bd?: {
      /** 上边框 */
      t?: IBorderData
      /** 下边框 */
      b?: IBorderData
      /** 左边框 */
      l?: IBorderData
      /** 右边框 */
      r?: IBorderData
    }
    /** 字体颜色 */
    cl?: IColorStyle
    /** 上标下标: 1=正常, 2=下标, 3=上标 */
    va?: number
    /** 文字旋转 */
    tr?: {
      /** 旋转角度 */
      a?: number
      /** 是否垂直: 1=垂直, 0=水平 */
      v?: number
    }
    /** 水平对齐: 1=左对齐, 2=居中, 3=右对齐 */
    ht?: number
    /** 垂直对齐: 1=顶部, 2=居中, 3=底部 */
    vt?: number
    /** 截断溢出: 1=溢出, 2=截断, 3=自动换行 */
    tb?: number
    /** 内边距 */
    pd?: {
      t?: number
      b?: number
      l?: number
      r?: number
    }
    /** 数字格式 */
    n?: {
      pattern?: string
    }
  }

  type IColorStyle = {
    rgb?: string
  }

  type IBorderData = {
    /** 边框样式 */
    s?: number
    /** 边框颜色 */
    cl?: IColorStyle
  }

  type IWorkbookData = {
    /** Univer 模型版本 */
    appVersion?: string
    /** 语言环境 */
    locale?: string
    /** 工作簿 ID */
    id?: string
    /** 工作簿名称 */
    name?: string
    /** Sheet ID 列表 */
    sheetOrder?: string[]
    /** Sheet 数据对象 (key 为 sheetId) */
    sheets?: Record<string, IWorksheetData>
    /** 样式引用表 (key 为样式ID, value 为样式对象) */
    styles?: Record<string, IStyleData | null>
    /** 默认样式 */
    defaultStyle?: string | null
    /** 用户存储的自定义字段 */
    custom?: Record<string, any>
    /** 插件资源数据 */
    resources?: Array<{
      name: string
      data?: any
    }>
  }

  type IWorksheetData = {
    /** Sheet ID */
    id?: string
    /** Sheet 名称 */
    name?: string
    /** 标签颜色 */
    tabColor?: string
    /** 是否隐藏: 0=否, 1=是, 2=绝对隐藏 */
    hidden?: 0 | 1 | 2
    /** 行数 */
    rowCount?: number
    /** 列数 */
    columnCount?: number
    /** 缩放比例 */
    zoomRatio?: number
    /** 冻结配置 */
    freeze?: {
      startRow?: number
      startColumn?: number
      ySplit?: number
      xSplit?: number
    }
    /** 单元格数据 */
    cellData?: Record<number, Record<number, ICellData>>
    /** 行数据 */
    rowData?: Record<number, IRowData>
    /** 列数据 */
    columnData?: Record<number, IColumnData>
    /** 合并单元格 */
    mergeData?: IMergeData[]
    /** 默认行高 */
    defaultRowHeight?: number
    /** 默认列宽 */
    defaultColumnWidth?: number
    /** 是否显示网格线: 0=否, 1=是 */
    showGridlines?: 0 | 1
    /** 行头配置 */
    rowHeader?: {
      width?: number
      hidden?: 0 | 1
    }
    /** 列头配置 */
    columnHeader?: {
      height?: number
      hidden?: 0 | 1
    }
    /** 是否从右到左: 0=否, 1=是 */
    rightToLeft?: 0 | 1
    /** 网格线颜色 */
    gridlinesColor?: string
    /** 默认样式 */
    defaultStyle?: string | null
  }

  type IRowData = {
    /** 行高 */
    h?: number
    /** 是否隐藏: 0=否, 1=是 */
    hd?: 0 | 1
  }

  type IColumnData = {
    /** 列宽 */
    w?: number
    /** 是否隐藏: 0=否, 1=是 */
    hd?: 0 | 1
  }

  type IMergeData = {
    startRow?: number
    endRow?: number
    startColumn?: number
    endColumn?: number
  }

  type LoginUserVO = {
    id?: number
    account?: string
    nickName?: string
    avatar?: string
    profile?: string
    email?: string
    phone?: string
    location?: string
    role?: string
    status?: number
    points?: number
    isVip?: number
    vipNumber?: number
    vipExpireTime?: string
    lastLoginTime?: string
    createTime?: string
  }

  type saveExcelDataParams = {
    /** 文件ID */
    fileId: number
  }

  type uploadFileParams = {
    /** 所有者ID */
    ownerId?: number
  }

  type User = {
    id?: number
    account?: string
    password?: string
    email?: string
    phone?: string
    nickName?: string
    avatar?: string
    profile?: string
    location?: string
    role?: string
    status?: number
    points?: number
    isVip?: number
    vipNumber?: number
    vipExpireTime?: string
    lastLoginTime?: string
    lastLoginIp?: string
    editTime?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type UserAddRequest = {
    account?: string
    password?: string
    nickName?: string
    email?: string
    phone?: string
    role?: string
  }

  type UserLoginRequest = {
    account?: string
    password?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    account?: string
    nickName?: string
    role?: string
    status?: number
    isVip?: number
  }

  type UserRegisterRequest = {
    account?: string
    password?: string
    checkPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    nickName?: string
    avatar?: string
    profile?: string
    location?: string
    email?: string
    phone?: string
    role?: string
    status?: number
  }

  type UserVO = {
    id?: number
    account?: string
    nickName?: string
    avatar?: string
    profile?: string
    email?: string
    phone?: string
    location?: string
    role?: string
    status?: number
    points?: number
    isVip?: number
    vipNumber?: number
    vipExpireTime?: string
    lastLoginTime?: string
    lastLoginIp?: string
    createTime?: string
    updateTime?: string
  }

  type warmCacheParams = {
    /** 文件ID */
    fileId: number
  }
}
