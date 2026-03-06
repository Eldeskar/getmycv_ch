import { CV, CVLanguage } from '../types/cv'
import { EXAMPLE_CV } from '../data/exampleCV'
import { resolveCV, ResolvedCV, ls, lsa } from './resolveCV'

export interface PlaceholderMap {
  name: boolean
  title: boolean
  contact: boolean
  summary: boolean
  experience: boolean
  education: boolean
  skills: boolean
  languages: boolean
  certifications: boolean
  interests: boolean
}

export function buildDisplayCV(cv: CV, lang: CVLanguage): { displayCV: ResolvedCV; placeholders: PlaceholderMap } {
  const placeholders: PlaceholderMap = {
    name: !cv.personal.name.trim(),
    title: !ls(cv.personal.title, lang).trim(),
    contact: !cv.personal.email.trim() && !cv.personal.phone.trim(),
    summary: !ls(cv.personal.summary, lang).trim(),
    experience: cv.experience.length === 0,
    education: cv.education.length === 0,
    skills: cv.skills.length === 0,
    languages: cv.languages.length === 0,
    certifications: cv.certifications.length === 0,
    interests: lsa(cv.interests, lang).length === 0,
  }

  const resolved = resolveCV(cv, lang)
  const exampleResolved = resolveCV(EXAMPLE_CV, lang)

  const displayCV: ResolvedCV = {
    personal: {
      ...resolved.personal,
      name: placeholders.name ? exampleResolved.personal.name : resolved.personal.name,
      title: placeholders.title ? exampleResolved.personal.title : resolved.personal.title,
      email: placeholders.contact ? exampleResolved.personal.email : resolved.personal.email,
      phone: placeholders.contact ? exampleResolved.personal.phone : resolved.personal.phone,
      city: placeholders.contact ? exampleResolved.personal.city : resolved.personal.city,
      country: placeholders.contact ? exampleResolved.personal.country : resolved.personal.country,
      website: placeholders.contact ? exampleResolved.personal.website : resolved.personal.website,
      linkedin: placeholders.contact ? exampleResolved.personal.linkedin : resolved.personal.linkedin,
      github: placeholders.contact ? exampleResolved.personal.github : resolved.personal.github,
      summary: placeholders.summary ? exampleResolved.personal.summary : resolved.personal.summary,
    },
    experience: placeholders.experience ? exampleResolved.experience : resolved.experience,
    education: placeholders.education ? exampleResolved.education : resolved.education,
    skills: placeholders.skills ? exampleResolved.skills : resolved.skills,
    languages: placeholders.languages ? exampleResolved.languages : resolved.languages,
    projects: resolved.projects,
    certifications: placeholders.certifications ? exampleResolved.certifications : resolved.certifications,
    interests: placeholders.interests ? exampleResolved.interests : resolved.interests,
  }

  return { displayCV, placeholders }
}
