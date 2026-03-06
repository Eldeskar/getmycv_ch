import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function canUseLocalStorage(): boolean {
  try {
    const key = '__storage_test__'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function StorageIndicator() {
  const { t } = useTranslation()
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    setAvailable(canUseLocalStorage())
  }, [])

  return (
    <div
      className="storage-indicator"
      title={available ? t('storage.localOk') : t('storage.localBlocked')}
    >
      <span className={`storage-indicator__dot${available ? ' storage-indicator__dot--ok' : ' storage-indicator__dot--blocked'}`} />
      <span className="storage-indicator__text">
        {available ? t('storage.localOk') : t('storage.localBlocked')}
      </span>
    </div>
  )
}
