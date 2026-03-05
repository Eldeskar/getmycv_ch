import { useTranslation } from 'react-i18next'

interface Props {
  lastSaved: number | null
}

export function StorageIndicator({ lastSaved }: Props) {
  const { t } = useTranslation()

  function relativeTime(ts: number): string {
    const diff = Math.floor((Date.now() - ts) / 1000)
    if (diff < 5) return t('storage.justNow')
    if (diff < 60) return t('storage.secondsAgo', { count: diff })
    if (diff < 3600) return t('storage.minutesAgo', { count: Math.floor(diff / 60) })
    return t('storage.hoursAgo', { count: Math.floor(diff / 3600) })
  }

  return (
    <div className="storage-indicator" title={t('storage.tooltip')}>
      <span className={`storage-indicator__dot${lastSaved ? ' storage-indicator__dot--saved' : ''}`} />
      <span className="storage-indicator__text">
        {lastSaved
          ? `${t('storage.savedLocally')} · ${relativeTime(lastSaved)}`
          : t('storage.notSaved')
        }
      </span>
      <span className="storage-indicator__hint">?</span>
    </div>
  )
}
