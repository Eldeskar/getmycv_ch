import { useTranslation } from 'react-i18next'
import { dismissBanner } from '../utils/storage'

interface Props {
  onDismiss: () => void
}

export function StorageBanner({ onDismiss }: Props) {
  const { t } = useTranslation()

  function handleDismiss() {
    dismissBanner()
    onDismiss()
  }

  return (
    <div className="storage-banner" role="alert">
      <div className="storage-banner__icon">⚠</div>
      <div className="storage-banner__text">
        <strong>{t('banner.sentence1')}</strong>
        {' '}{t('banner.sentence2')}
        {' '}<strong>{t('banner.sentence3')}</strong>{t('banner.sentence3suffix')}
      </div>
      <button className="storage-banner__close" onClick={handleDismiss} aria-label={t('banner.dismiss')}>
        ✕
      </button>
    </div>
  )
}
