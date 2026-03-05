import { CV, CVSectionId, TemplateId } from '../../types/cv'
import { buildDisplayCV, PlaceholderMap } from '../../utils/placeholderCV'
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
}

export type { PlaceholderMap }

export function Preview({ cv, template, sectionOrder }: Props) {
  const { displayCV, placeholders } = buildDisplayCV(cv)

  return (
    <>
      {template === 'classic' && <ClassicTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
      {template === 'modern' && <ModernTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
      {template === 'minimal' && <MinimalTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
      {template === 'executive' && <ExecutiveTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
      {template === 'professional' && <ProfessionalTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
      {template === 'creative' && <CreativeTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
      {template === 'original' && <OriginalTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
      {template === 'sharp' && <SharpTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
      {template === 'elegant' && <ElegantTemplate cv={displayCV} placeholders={placeholders} sectionOrder={sectionOrder} />}
    </>
  )
}
