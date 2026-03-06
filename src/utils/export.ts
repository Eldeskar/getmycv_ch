import { CV } from '../types/cv'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from 'docx'

// ─── JSON ────────────────────────────────────────────────────────────────────

export function exportJSON(cv: CV): void {
  const blob = new Blob([JSON.stringify(cv, null, 2)], {
    type: 'application/json',
  })
  downloadBlob(blob, `${cvFilename(cv.personal.name)}.json`)
}

export function importJSON(file: File): Promise<CV> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const cv = JSON.parse(e.target?.result as string) as CV
        resolve(cv)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

export async function exportPDF(elementId: string, name: string): Promise<void> {
  // Dynamically import html2pdf to avoid SSR issues
  const html2pdf = (await import('html2pdf.js')).default
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Preview element not found')

  // .cv-exporting resets min-height, transform, box-shadow, border-radius via CSS
  element.classList.add('cv-exporting')

  // Force reflow so html2canvas sees the updated layout
  void element.offsetHeight

  const opt = {
    margin: 0,
    filename: `${cvFilename(name)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,          // 210mm at 96dpi
      windowWidth: 794,
      height: element.scrollHeight,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }

  try {
    await html2pdf().set(opt).from(element).save()
  } finally {
    element.classList.remove('cv-exporting')
  }
}

// ─── DOCX ────────────────────────────────────────────────────────────────────

export async function exportDOCX(cv: CV): Promise<void> {
  const sections: Paragraph[] = []

  // Name
  if (cv.personal.name) {
    sections.push(
      new Paragraph({
        text: cv.personal.name,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      })
    )
  }

  // Title
  if (cv.personal.title) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: cv.personal.title, italics: true, size: 22 })],
        alignment: AlignmentType.CENTER,
      })
    )
  }

  // Contact line
  const contactParts = [cv.personal.email, cv.personal.phone, [cv.personal.city, cv.personal.country].filter(Boolean).join(', ')].filter(Boolean)
  if (contactParts.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join(' · '), size: 20 })],
        alignment: AlignmentType.CENTER,
      })
    )
  }

  // Online links
  const linkParts = [cv.personal.website, cv.personal.linkedin, cv.personal.github].filter(Boolean)
  if (linkParts.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: linkParts.join(' · '), size: 18, color: '2563EB' })],
        alignment: AlignmentType.CENTER,
      })
    )
  }

  // Summary
  if (cv.personal.summary) {
    sections.push(new Paragraph({ text: '' }))
    sections.push(new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_1 }))
    sections.push(new Paragraph({ text: cv.personal.summary }))
  }

  // Experience
  if (cv.experience.length) {
    sections.push(new Paragraph({ text: '' }))
    sections.push(new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_1 }))
    for (const exp of cv.experience) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role, bold: true }),
            new TextRun({ text: ` — ${exp.company}` }),
            new TextRun({
              text: `  ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`,
              color: '888888',
            }),
          ],
        })
      )
      for (const bullet of exp.bullets) {
        sections.push(new Paragraph({ text: bullet, bullet: { level: 0 } }))
      }
    }
  }

  // Education
  if (cv.education.length) {
    sections.push(new Paragraph({ text: '' }))
    sections.push(new Paragraph({ text: 'Education', heading: HeadingLevel.HEADING_1 }))
    for (const edu of cv.education) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true }),
            new TextRun({ text: ` — ${edu.institution}` }),
            new TextRun({ text: `  ${edu.endDate}`, color: '888888' }),
          ],
        })
      )
    }
  }

  // Skills
  if (cv.skills.length) {
    sections.push(new Paragraph({ text: '' }))
    sections.push(new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_1 }))
    for (const group of cv.skills) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${group.category}: `, bold: true }),
            new TextRun({ text: group.items.join(', ') }),
          ],
        })
      )
    }
  }

  // Languages
  if (cv.languages.length) {
    sections.push(new Paragraph({ text: '' }))
    sections.push(new Paragraph({ text: 'Languages', heading: HeadingLevel.HEADING_1 }))
    sections.push(
      new Paragraph({
        text: cv.languages.map((l) => `${l.language} (${l.level})`).join(', '),
      })
    )
  }

  // Projects
  if (cv.projects.length) {
    sections.push(new Paragraph({ text: '' }))
    sections.push(new Paragraph({ text: 'Projects', heading: HeadingLevel.HEADING_1 }))
    for (const proj of cv.projects) {
      const parts: TextRun[] = [new TextRun({ text: proj.name, bold: true })]
      if (proj.description) parts.push(new TextRun({ text: ` — ${proj.description}` }))
      sections.push(new Paragraph({ children: parts }))
      if (proj.url) {
        sections.push(new Paragraph({ children: [new TextRun({ text: proj.url, color: '2563EB' })] }))
      }
    }
  }

  // Certifications
  if (cv.certifications.length) {
    sections.push(new Paragraph({ text: '' }))
    sections.push(new Paragraph({ text: 'Certifications', heading: HeadingLevel.HEADING_1 }))
    for (const cert of cv.certifications) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.title, bold: true }),
            new TextRun({ text: ` — ${cert.institution}` }),
            new TextRun({ text: `  ${cert.date}`, color: '888888' }),
          ],
        })
      )
      if (cert.description) {
        sections.push(new Paragraph({ text: cert.description }))
      }
    }
  }

  // Interests
  if (cv.interests.length) {
    sections.push(new Paragraph({ text: '' }))
    sections.push(new Paragraph({ text: 'Interests', heading: HeadingLevel.HEADING_1 }))
    sections.push(new Paragraph({ text: cv.interests.join(', ') }))
  }

  const doc = new Document({
    sections: [{ children: sections }],
  })

  const buffer = await Packer.toBlob(doc)
  downloadBlob(buffer, `${cvFilename(cv.personal.name)}.docx`)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase()
}

/** Build filename as YYYYMMdd_lastname_firstname (or fallback to 'cv'). */
function cvFilename(name: string): string {
  const now = new Date()
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')

  const trimmed = name.trim()
  if (!trimmed) return `${date}_cv`

  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return `${date}_${sanitizeFilename(parts[0])}`

  const lastName = parts[parts.length - 1]
  const firstName = parts.slice(0, -1).join('_')
  return `${date}_${sanitizeFilename(lastName)}_${sanitizeFilename(firstName)}`
}
