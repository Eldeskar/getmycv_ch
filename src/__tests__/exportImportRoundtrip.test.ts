import { describe, it, expect } from 'vitest'
import { migrateCV } from '../utils/storage'
import type { CV } from '../types/cv'

/**
 * Comprehensive CV fixture with every field populated,
 * localized strings in all 4 languages (en, de, fr, it),
 * and at least 2 entries wherever arrays are used.
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
    photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    photoZoom: 1.2,
    photoOffsetX: 5,
    photoOffsetY: -3,
    photoGrayscale: true,
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
      role: {
        en: 'Lead Developer',
        de: 'Leitender Entwickler',
        fr: 'Développeur principal',
        it: 'Sviluppatore principale',
      },
      location: 'Zürich',
      startDate: '2020-01',
      endDate: '',
      current: true,
      bullets: {
        en: ['Led a team of 8 engineers', 'Redesigned the microservices architecture'],
        de: ['Leitung eines Teams von 8 Ingenieuren', 'Neugestaltung der Microservices-Architektur'],
        fr: ["Direction d'une équipe de 8 ingénieurs", "Refonte de l'architecture microservices"],
        it: ['Guidato un team di 8 ingegneri', "Ridisegnato l'architettura dei microservizi"],
      },
    },
    {
      id: 'exp-2',
      company: 'StartupX GmbH',
      role: {
        en: 'Full-Stack Developer',
        de: 'Full-Stack-Entwickler',
        fr: 'Développeur full-stack',
        it: 'Sviluppatore full-stack',
      },
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
      degree: {
        en: 'Master of Science',
        de: 'Master of Science',
        fr: 'Master en sciences',
        it: 'Laurea magistrale',
      },
      field: {
        en: 'Computer Science',
        de: 'Informatik',
        fr: 'Informatique',
        it: 'Informatica',
      },
      startDate: '2012-09',
      endDate: '2014-07',
      grade: '5.8/6.0',
    },
    {
      id: 'edu-2',
      institution: 'Universität Bern',
      degree: {
        en: 'Bachelor of Science',
        de: 'Bachelor of Science',
        fr: 'Licence en sciences',
        it: 'Laurea triennale',
      },
      field: {
        en: 'Software Engineering',
        de: 'Softwaretechnik',
        fr: 'Génie logiciel',
        it: 'Ingegneria del software',
      },
      startDate: '2009-09',
      endDate: '2012-06',
      grade: '5.5/6.0',
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: {
        en: 'Programming Languages',
        de: 'Programmiersprachen',
        fr: 'Langages de programmation',
        it: 'Linguaggi di programmazione',
      },
      items: ['TypeScript', 'Python', 'Go'],
      levels: { TypeScript: 9, Python: 8, Go: 7 },
    },
    {
      id: 'skill-2',
      category: {
        en: 'Frameworks',
        de: 'Frameworks',
        fr: 'Frameworks',
        it: 'Framework',
      },
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
    {
      id: 'proj-1',
      name: 'OpenSource CLI',
      description: 'A developer productivity tool',
      url: 'https://github.com/alexm/cli',
      technologies: ['Rust', 'Tokio'],
    },
    {
      id: 'proj-2',
      name: 'DataViz Platform',
      description: 'Interactive data visualization dashboard',
      url: 'https://dataviz.example.com',
      technologies: ['React', 'D3.js', 'PostgreSQL'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: {
        en: 'AWS Solutions Architect',
        de: 'AWS Solutions Architect',
        fr: 'AWS Solutions Architect',
        it: 'AWS Solutions Architect',
      },
      institution: 'Amazon Web Services',
      date: '2023-05',
      description: {
        en: 'Professional level cloud architecture certification',
        de: 'Professionelle Cloud-Architektur-Zertifizierung',
        fr: 'Certification professionnelle en architecture cloud',
        it: 'Certificazione professionale di architettura cloud',
      },
    },
    {
      id: 'cert-2',
      title: {
        en: 'Kubernetes Administrator',
        de: 'Kubernetes-Administrator',
        fr: 'Administrateur Kubernetes',
        it: 'Amministratore Kubernetes',
      },
      institution: 'CNCF',
      date: '2022-11',
      description: {
        en: 'Certified Kubernetes Administrator (CKA)',
        de: 'Zertifizierter Kubernetes-Administrator (CKA)',
        fr: 'Administrateur Kubernetes certifié (CKA)',
        it: 'Amministratore Kubernetes certificato (CKA)',
      },
    },
  ],
  interests: {
    en: ['Open source', 'Mountain hiking', 'Photography'],
    de: ['Open Source', 'Bergwandern', 'Fotografie'],
    fr: ['Open source', 'Randonnée en montagne', 'Photographie'],
    it: ['Open source', 'Escursionismo in montagna', 'Fotografia'],
  },
}

describe('JSON export → import roundtrip', () => {
  it('preserves all CV data through JSON.stringify → JSON.parse → migrateCV', () => {
    // Export: same as exportJSON() but without the browser download
    const json = JSON.stringify(FULL_CV, null, 2)

    // Import: same as importJSON() — parse then migrate
    const parsed = JSON.parse(json)
    const imported = migrateCV(parsed)

    // Deep equality check
    expect(imported).toEqual(FULL_CV)
  })

  it('preserves personal info fields exactly', () => {
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    expect(imported.personal.name).toBe('Alex Müller')
    expect(imported.personal.email).toBe('alex@example.com')
    expect(imported.personal.phone).toBe('+41 79 123 45 67')
    expect(imported.personal.address).toBe('Bahnhofstrasse 10')
    expect(imported.personal.zip).toBe('8001')
    expect(imported.personal.city).toBe('Zürich')
    expect(imported.personal.country).toBe('Switzerland')
    expect(imported.personal.website).toBe('https://alex.dev')
    expect(imported.personal.linkedin).toBe('https://linkedin.com/in/alexmueller')
    expect(imported.personal.github).toBe('https://github.com/alexm')
    expect(imported.personal.birthday).toBe('1990-03-15')
    expect(imported.personal.nationality).toBe('Swiss')
    expect(imported.personal.driversLicense).toBe('B')
    expect(imported.personal.photo).toBe(FULL_CV.personal.photo)
    expect(imported.personal.photoZoom).toBe(1.2)
    expect(imported.personal.photoOffsetX).toBe(5)
    expect(imported.personal.photoOffsetY).toBe(-3)
    expect(imported.personal.photoGrayscale).toBe(true)
  })

  it('preserves localized strings in all 4 languages', () => {
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    // personal.title
    expect(imported.personal.title).toEqual(FULL_CV.personal.title)
    expect(imported.personal.title.en).toBe('Senior Software Engineer')
    expect(imported.personal.title.de).toBe('Leitender Softwareentwickler')
    expect(imported.personal.title.fr).toBe('Ingénieur logiciel senior')
    expect(imported.personal.title.it).toBe('Ingegnere software senior')

    // personal.summary
    expect(imported.personal.summary).toEqual(FULL_CV.personal.summary)
  })

  it('preserves localized string arrays in all 4 languages', () => {
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    // experience bullets
    expect(imported.experience[0].bullets).toEqual(FULL_CV.experience[0].bullets)
    expect(imported.experience[0].bullets.en).toHaveLength(2)
    expect(imported.experience[0].bullets.de).toHaveLength(2)
    expect(imported.experience[0].bullets.fr).toHaveLength(2)
    expect(imported.experience[0].bullets.it).toHaveLength(2)

    // interests
    expect(imported.interests).toEqual(FULL_CV.interests)
    expect(imported.interests.en).toHaveLength(3)
    expect(imported.interests.de).toHaveLength(3)
    expect(imported.interests.fr).toHaveLength(3)
    expect(imported.interests.it).toHaveLength(3)
  })

  it('preserves all array entries (experience, education, skills, etc.)', () => {
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    expect(imported.experience).toHaveLength(2)
    expect(imported.education).toHaveLength(2)
    expect(imported.skills).toHaveLength(2)
    expect(imported.languages).toHaveLength(3)
    expect(imported.projects).toHaveLength(2)
    expect(imported.certifications).toHaveLength(2)
  })

  it('preserves skill levels (numeric ratings)', () => {
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    expect(imported.skills[0].levels).toEqual({ TypeScript: 9, Python: 8, Go: 7 })
    expect(imported.skills[1].levels).toEqual({ React: 9, 'Node.js': 8, Django: 6 })
  })

  it('preserves project technologies arrays', () => {
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    expect(imported.projects[0].technologies).toEqual(['Rust', 'Tokio'])
    expect(imported.projects[1].technologies).toEqual(['React', 'D3.js', 'PostgreSQL'])
  })

  it('preserves experience current/endDate flags', () => {
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    expect(imported.experience[0].current).toBe(true)
    expect(imported.experience[0].endDate).toBe('')
    expect(imported.experience[1].current).toBe(false)
    expect(imported.experience[1].endDate).toBe('2019-12')
  })

  it('preserves certification descriptions in all languages', () => {
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    for (const lang of ['en', 'de', 'fr', 'it'] as const) {
      expect(imported.certifications[0].description[lang]).toBe(FULL_CV.certifications[0].description[lang])
      expect(imported.certifications[1].description[lang]).toBe(FULL_CV.certifications[1].description[lang])
      expect(imported.certifications[0].title[lang]).toBe(FULL_CV.certifications[0].title[lang])
      expect(imported.certifications[1].title[lang]).toBe(FULL_CV.certifications[1].title[lang])
    }
  })

  it('handles multiple roundtrips without data loss', () => {
    let cv = FULL_CV
    for (let i = 0; i < 5; i++) {
      const json = JSON.stringify(cv, null, 2)
      cv = migrateCV(JSON.parse(json))
    }
    expect(cv).toEqual(FULL_CV)
  })

  it('migration handles already-localized data as identity (no double-wrapping)', () => {
    // Simulate: export a CV that already has LocalizedString objects,
    // then import it — migrateCV should not wrap them again
    const json = JSON.stringify(FULL_CV)
    const imported = migrateCV(JSON.parse(json))

    // title should remain { en: '...', de: '...', ... } not { en: { en: '...' } }
    expect(typeof imported.personal.title.en).toBe('string')
    expect(typeof imported.experience[0].role.en).toBe('string')
    expect(Array.isArray(imported.experience[0].bullets.en)).toBe(true)
    expect(typeof imported.experience[0].bullets.en![0]).toBe('string')
  })
})
