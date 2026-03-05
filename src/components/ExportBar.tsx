import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CV } from '../types/cv'
import { exportJSON, exportPDF, exportDOCX, importJSON } from '../utils/export'

interface Props {
  cv: CV
  previewId: string
}

export function ExportBar({ cv, previewId }: Props) {
  const { t } = useTranslation()
  const [pdfLoading, setPdfLoading] = useState(false)
  const [docxLoading, setDocxLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handlePDF() {
    setPdfLoading(true)
    try {
      await exportPDF(previewId, cv.personal.name)
    } catch (e) {
      console.error(e)
    } finally {
      setPdfLoading(false)
    }
  }

  async function handleDOCX() {
    setDocxLoading(true)
    try {
      await exportDOCX(cv)
    } catch (e) {
      console.error(e)
    } finally {
      setDocxLoading(false)
    }
  }

  function handleJSON() {
    exportJSON(cv)
    showToast(t('export.backupSaved'))
  }

  function handlePrint() {
    window.print()
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importJSON(file)
      window.dispatchEvent(new CustomEvent('cv:import', { detail: imported }))
      showToast(t('export.importSuccess'))
    } catch {
      showToast(t('export.importError'))
    }
    e.target.value = ''
  }

  return (
    <div className="export-bar">
      <div className="export-bar__group">
        <button className="export-btn export-btn--print" onClick={handlePrint}>
          <span>🖨</span> {t('export.print')}
        </button>
        <span className="export-bar__hint">{t('export.printHint')}</span>
      </div>

      <div className="export-bar__group">
        <button
          className="export-btn export-btn--pdf"
          onClick={handlePDF}
          disabled={pdfLoading}
          title={t('export.downloadPDFTitle')}
        >
          {pdfLoading ? t('export.generating') : t('export.downloadPDF')}
        </button>

        <button
          className="export-btn export-btn--docx"
          onClick={handleDOCX}
          disabled={docxLoading}
          title={t('export.downloadWordTitle')}
        >
          {docxLoading ? t('export.generating') : t('export.downloadWord')}
        </button>

        <button
          className="export-btn export-btn--json"
          onClick={handleJSON}
          title={t('export.saveBackupTitle')}
        >
          {t('export.saveBackup')}
        </button>
      </div>

      <div className="export-bar__group">
        <label className="export-btn export-btn--import" title={t('export.importBackupTitle')}>
          {t('export.importBackup')}
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
      </div>

      {toast && (
        <div className="export-bar__toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}
