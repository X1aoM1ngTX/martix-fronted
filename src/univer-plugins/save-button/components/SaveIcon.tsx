import { createElement, useEffect, useState } from 'react'

export function SaveIcon() {
  const [saving, setSaving] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState('')

  useEffect(() => {
    // 监听保存状态变化
    const handleSavingChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>
      setSaving(customEvent.detail)
    }
    const handleLastSaveTime = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setLastSaveTime(customEvent.detail)
    }

    window.addEventListener('univer-saving-state', handleSavingChange)
    window.addEventListener('univer-last-save-time', handleLastSaveTime)

    return () => {
      window.removeEventListener('univer-saving-state', handleSavingChange)
      window.removeEventListener('univer-last-save-time', handleLastSaveTime)
    }
  }, [])

  // 保存状态指示器文本
  const getStatusText = () => {
    if (saving) return '保存中...'
    if (lastSaveTime) return `已保存 ${lastSaveTime}`
    return ''
  }

  return createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: saving ? '#1890ff' : '#000'
    }
  },
    createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '1em',
      height: '1em',
      viewBox: '64 64 896 896',
      fill: 'currentColor',
      focusable: 'false',
      style: { color: '#000' }
    }, createElement('path', {
      d: 'M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z'
    })),
    createElement('span', {
      style: { marginLeft: '4px' }
    }, getStatusText())
  )
}
