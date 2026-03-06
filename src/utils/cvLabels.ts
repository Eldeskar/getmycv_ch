import { CVLanguage } from '../types/cv'

export interface CVLabels {
  profile: string
  experience: string
  education: string
  skills: string
  languages: string
  certifications: string
  interests: string
  contact: string
  details: string
  present: string
  grade: string
  licence: string
  nationality: string
  born: string
  skillsAndLanguages: string
  skillsAndExpertise: string
  contactDetails: string
}

const labels: Record<CVLanguage, CVLabels> = {
  en: {
    profile: 'Profile',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    certifications: 'Certifications',
    interests: 'Interests',
    contact: 'Contact',
    details: 'Details',
    present: 'Present',
    grade: 'Grade',
    licence: 'Licence',
    nationality: 'Nationality',
    born: 'Born',
    skillsAndLanguages: 'Skills & Languages',
    skillsAndExpertise: 'Skills & Expertise',
    contactDetails: 'Contact Details',
  },
  de: {
    profile: 'Profil',
    experience: 'Berufserfahrung',
    education: 'Ausbildung',
    skills: 'Kenntnisse',
    languages: 'Sprachen',
    certifications: 'Zertifikate',
    interests: 'Interessen',
    contact: 'Kontakt',
    details: 'Details',
    present: 'Heute',
    grade: 'Note',
    licence: 'Führerschein',
    nationality: 'Nationalität',
    born: 'Geboren',
    skillsAndLanguages: 'Kenntnisse & Sprachen',
    skillsAndExpertise: 'Kenntnisse & Expertise',
    contactDetails: 'Kontaktdaten',
  },
  fr: {
    profile: 'Profil',
    experience: 'Expérience professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    certifications: 'Certifications',
    interests: 'Centres d\'intérêt',
    contact: 'Contact',
    details: 'Détails',
    present: 'Présent',
    grade: 'Note',
    licence: 'Permis',
    nationality: 'Nationalité',
    born: 'Né(e)',
    skillsAndLanguages: 'Compétences & Langues',
    skillsAndExpertise: 'Compétences & Expertise',
    contactDetails: 'Coordonnées',
  },
  it: {
    profile: 'Profilo',
    experience: 'Esperienza lavorativa',
    education: 'Formazione',
    skills: 'Competenze',
    languages: 'Lingue',
    certifications: 'Certificazioni',
    interests: 'Interessi',
    contact: 'Contatto',
    details: 'Dettagli',
    present: 'Presente',
    grade: 'Voto',
    licence: 'Patente',
    nationality: 'Nazionalità',
    born: 'Nato/a',
    skillsAndLanguages: 'Competenze & Lingue',
    skillsAndExpertise: 'Competenze & Expertise',
    contactDetails: 'Recapiti',
  },
}

export function getCVLabels(lang: CVLanguage): CVLabels {
  return labels[lang]
}
