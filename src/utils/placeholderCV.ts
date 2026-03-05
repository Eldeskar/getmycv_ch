import { CV } from '../types/cv'
import { EXAMPLE_CV } from '../data/exampleCV'

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

export function buildDisplayCV(cv: CV): { displayCV: CV; placeholders: PlaceholderMap } {
  const placeholders: PlaceholderMap = {
    name: !cv.personal.name.trim(),
    title: !cv.personal.title.trim(),
    contact: !cv.personal.email.trim() && !cv.personal.phone.trim(),
    summary: !cv.personal.summary.trim(),
    experience: cv.experience.length === 0,
    education: cv.education.length === 0,
    skills: cv.skills.length === 0,
    languages: cv.languages.length === 0,
    certifications: cv.certifications.length === 0,
    interests: cv.interests.length === 0,
  }

  const displayCV: CV = {
    personal: {
      ...cv.personal,
      name: placeholders.name ? EXAMPLE_CV.personal.name : cv.personal.name,
      title: placeholders.title ? EXAMPLE_CV.personal.title : cv.personal.title,
      email: placeholders.contact ? EXAMPLE_CV.personal.email : cv.personal.email,
      phone: placeholders.contact ? EXAMPLE_CV.personal.phone : cv.personal.phone,
      city: placeholders.contact ? EXAMPLE_CV.personal.city : cv.personal.city,
      country: placeholders.contact ? EXAMPLE_CV.personal.country : cv.personal.country,
      website: placeholders.contact ? EXAMPLE_CV.personal.website : cv.personal.website,
      linkedin: placeholders.contact ? EXAMPLE_CV.personal.linkedin : cv.personal.linkedin,
      github: placeholders.contact ? EXAMPLE_CV.personal.github : cv.personal.github,
      summary: placeholders.summary ? EXAMPLE_CV.personal.summary : cv.personal.summary,
    },
    experience: placeholders.experience ? EXAMPLE_CV.experience : cv.experience,
    education: placeholders.education ? EXAMPLE_CV.education : cv.education,
    skills: placeholders.skills ? EXAMPLE_CV.skills : cv.skills,
    languages: placeholders.languages ? EXAMPLE_CV.languages : cv.languages,
    projects: cv.projects,
    certifications: placeholders.certifications ? EXAMPLE_CV.certifications : cv.certifications,
    interests: placeholders.interests ? EXAMPLE_CV.interests : cv.interests,
  }

  return { displayCV, placeholders }
}
