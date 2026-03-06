declare namespace API {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseIPageUserVO = {
    code?: number
    data?: IPageUserVO
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

  type DeleteRequest = {
    id?: number
  }

  type getUserByIdParams = {
    /** 用户ID */
    id: number
  }

  type getUserVOByIdParams = {
    /** 用户ID */
    id: number
  }

  type IPageUserVO = {
    size?: number
    total?: number
    records?: UserVO[]
    current?: number
    pages?: number
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
}
