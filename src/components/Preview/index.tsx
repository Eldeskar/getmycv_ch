import { CV, CVSectionId, CVLanguage, TemplateId } from '../../types/cv'
import { buildDisplayCV, PlaceholderMap } from '../../utils/placeholderCV'
import { ResolvedCV } from '../../utils/resolveCV'
import { getCVLabels, CVLabels } from '../../utils/cvLabels'
import { ClassicTemplate } from './templates/Classic'
import { ModernTemplate } from './templates/Modern'
import { MinimalTemplate } from './templates/Minimal'
import { ExecutiveTemplate } from './templates/Executive'
import { ProfessionalTemplate } from './templates/Professional'
import { CreativeTemplate } from './templates/Creative'
import { OriginalTemplate } from './templates/Original'
import { SharpTemplate } from './templates/Sharp'
import { ElegantTemplate } from './templates/Elegant'

interface Props {
  cv: CV
  template: TemplateId
  sectionOrder: CVSectionId[]
  cvLanguage: CVLanguage
}

export type { PlaceholderMap, CVLabels, ResolvedCV }

export function Preview({ cv, template, sectionOrder, cvLanguage }: Props) {
  const { displayCV, placeholders } = buildDisplayCV(cv, cvLanguage)
  const labels = getCVLabels(cvLanguage)

  return (
    <>
      {template === 'classic' && <ClassicTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
      {template === 'modern' && <ModernTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
      {template === 'minimal' && <MinimalTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
      {template === 'executive' && <ExecutiveTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
      {template === 'professional' && <ProfessionalTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
      {template === 'creative' && <CreativeTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
      {template === 'original' && <OriginalTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
      {template === 'sharp' && <SharpTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
      {template === 'elegant' && <ElegantTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} labels={labels} locale={cvLanguage} />}
    </>
  )
}
