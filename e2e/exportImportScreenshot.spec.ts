import { test, expect } from '@playwright/test'
import type { CV, AppState, CVLanguage } from '../src/types/cv'

/**
 * Comprehensive CV with every field filled, localized in all 4 languages,
 * at least 2 entries in every array section.
 */
const FULL_CV: CV = {
  personal: {
    name: 'Alex Müller',
    title: {
      en: 'Senior Software Engineer',
      de: 'Leitender Softwareentwickler',
      fr: 'Ingénieur logiciel senior',
      it: 'Ingegnere software senior',
    },
    photo: '',
    photoZoom: 1,
    photoOffsetX: 0,
    photoOffsetY: 0,
    photoGrayscale: false,
    email: 'alex@example.com',
    phone: '+41 79 123 45 67',
    address: 'Bahnhofstrasse 10',
    zip: '8001',
    city: 'Zürich',
    country: 'Switzerland',
    website: 'https://alex.dev',
    linkedin: 'https://linkedin.com/in/alexmueller',
    github: 'https://github.com/alexm',
    birthday: '1990-03-15',
    nationality: 'Swiss',
    driversLicense: 'B',
    summary: {
      en: 'Experienced engineer with 10+ years in full-stack development.',
      de: 'Erfahrener Ingenieur mit über 10 Jahren Erfahrung in der Full-Stack-Entwicklung.',
      fr: 'Ingénieur expérimenté avec plus de 10 ans en développement full-stack.',
      it: 'Ingegnere esperto con oltre 10 anni nello sviluppo full-stack.',
    },
  },
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp AG',
      role: { en: 'Lead Developer', de: 'Leitender Entwickler', fr: 'Développeur principal', it: 'Sviluppatore principale' },
      location: 'Zürich',
      startDate: '2020-01',
      endDate: '',
      current: true,
      bullets: {
        en: ['Led a team of 8 engineers', 'Redesigned microservices architecture'],
        de: ['Leitung eines Teams von 8 Ingenieuren', 'Neugestaltung der Microservices-Architektur'],
        fr: ["Direction d'une équipe de 8 ingénieurs", "Refonte de l'architecture microservices"],
        it: ['Guidato un team di 8 ingegneri', "Ridisegnato l'architettura dei microservizi"],
      },
    },
    {
      id: 'exp-2',
      company: 'StartupX GmbH',
      role: { en: 'Full-Stack Developer', de: 'Full-Stack-Entwickler', fr: 'Développeur full-stack', it: 'Sviluppatore full-stack' },
      location: 'Bern',
      startDate: '2016-06',
      endDate: '2019-12',
      current: false,
      bullets: {
        en: ['Built real-time dashboards with React', 'Implemented CI/CD pipelines'],
        de: ['Echtzeit-Dashboards mit React erstellt', 'CI/CD-Pipelines implementiert'],
        fr: ['Création de tableaux de bord en temps réel avec React', 'Mise en place de pipelines CI/CD'],
        it: ['Creato dashboard in tempo reale con React', 'Implementato pipeline CI/CD'],
      },
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'ETH Zürich',
      degree: { en: 'Master of Science', de: 'Master of Science', fr: 'Master en sciences', it: 'Laurea magistrale' },
      field: { en: 'Computer Science', de: 'Informatik', fr: 'Informatique', it: 'Informatica' },
      startDate: '2012-09',
      endDate: '2014-07',
      grade: '5.8/6.0',
    },
    {
      id: 'edu-2',
      institution: 'Universität Bern',
      degree: { en: 'Bachelor of Science', de: 'Bachelor of Science', fr: 'Licence en sciences', it: 'Laurea triennale' },
      field: { en: 'Software Engineering', de: 'Softwaretechnik', fr: 'Génie logiciel', it: 'Ingegneria del software' },
      startDate: '2009-09',
      endDate: '2012-06',
      grade: '5.5/6.0',
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: { en: 'Programming Languages', de: 'Programmiersprachen', fr: 'Langages de programmation', it: 'Linguaggi di programmazione' },
      items: ['TypeScript', 'Python', 'Go'],
      levels: { TypeScript: 9, Python: 8, Go: 7 },
    },
    {
      id: 'skill-2',
      category: { en: 'Frameworks', de: 'Frameworks', fr: 'Frameworks', it: 'Framework' },
      items: ['React', 'Node.js', 'Django'],
      levels: { React: 9, 'Node.js': 8, Django: 6 },
    },
  ],
  languages: [
    { id: 'lang-1', language: 'German', level: 'Native' },
    { id: 'lang-2', language: 'English', level: 'C2' },
    { id: 'lang-3', language: 'French', level: 'B2' },
  ],
  projects: [
    { id: 'proj-1', name: 'OpenSource CLI', description: 'A developer productivity tool', url: 'https://github.com/alexm/cli', technologies: ['Rust', 'Tokio'] },
    { id: 'proj-2', name: 'DataViz Platform', description: 'Interactive data visualization', url: 'https://dataviz.example.com', technologies: ['React', 'D3.js', 'PostgreSQL'] },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: { en: 'AWS Solutions Architect', de: 'AWS Solutions Architect', fr: 'AWS Solutions Architect', it: 'AWS Solutions Architect' },
      institution: 'Amazon Web Services',
      date: '2023-05',
      description: { en: 'Professional level certification', de: 'Professionelle Zertifizierung', fr: 'Certification professionnelle', it: 'Certificazione professionale' },
    },
    {
      id: 'cert-2',
      title: { en: 'Kubernetes Administrator', de: 'Kubernetes-Administrator', fr: 'Administrateur Kubernetes', it: 'Amministratore Kubernetes' },
      institution: 'CNCF',
      date: '2022-11',
      description: { en: 'CKA certification', de: 'CKA-Zertifizierung', fr: 'Certification CKA', it: 'Certificazione CKA' },
    },
  ],
  interests: {
    en: ['Open source', 'Mountain hiking', 'Photography'],
    de: ['Open Source', 'Bergwandern', 'Fotografie'],
    fr: ['Open source', 'Randonnée en montagne', 'Photographie'],
    it: ['Open source', 'Escursionismo in montagna', 'Fotografia'],
  },
}

function buildAppState(cv: CV, cvLanguage: CVLanguage): AppState {
  return {
    cv,
    cvLanguage,
    selectedTemplate: 'modern',
    styleSettings: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      accentColor: '#1e2a3a',
      fontSize: 100,
      sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects', 'interests'],
      spacedLayout: false,
    },
    lastSaved: Date.now(),
  }
}

const CV_LANGUAGES: CVLanguage[] = ['en', 'de', 'fr', 'it']

for (const lang of CV_LANGUAGES) {
  test(`export→import roundtrip produces identical preview (${lang})`, async ({ page }) => {
    // 1. Inject the full CV into localStorage and load the app
    const state = buildAppState(FULL_CV, lang)
    await page.addInitScript((s) => {
      localStorage.setItem('getmycv_state', JSON.stringify(s))
    }, state)
    await page.goto('/')
    await page.waitForSelector('.preview-paper')

    // Wait for fonts/rendering to settle
    await page.waitForTimeout(1000)

    // 2. Screenshot the preview BEFORE export
    const preview = page.locator('.preview-paper')
    const beforeScreenshot = await preview.screenshot()

    // 3. Export: grab CV JSON from localStorage (same as exportJSON)
    const exportedJson = await page.evaluate(() => {
      const raw = localStorage.getItem('getmycv_state')
      if (!raw) throw new Error('No state in localStorage')
      return JSON.parse(raw).cv
    })

    // 4. Simulate import: clear state, re-inject the exported CV via the cv:import event
    await page.evaluate((cv) => {
      // Dispatch the same event that importJSON triggers
      window.dispatchEvent(new CustomEvent('cv:import', { detail: cv }))
    }, exportedJson)

    // Wait for re-render
    await page.waitForTimeout(1000)

    // 5. Screenshot the preview AFTER import
    const afterScreenshot = await preview.screenshot()

    // 6. Compare: screenshots must be identical
    expect(Buffer.compare(beforeScreenshot, afterScreenshot)).toBe(0)
  })
}
