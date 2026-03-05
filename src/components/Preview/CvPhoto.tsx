import { PersonalInfo } from '../../types/cv'

interface Props {
  personal: PersonalInfo
  className: string
}

export function CvPhoto({ personal, className }: Props) {
  const hasAdjustment = personal.photoZoom !== 1 || personal.photoOffsetX !== 0 || personal.photoOffsetY !== 0 || personal.photoGrayscale

  const grayscaleStyle = personal.photoGrayscale ? { filter: 'grayscale(100%)' } : {}

  if (!hasAdjustment) {
    return <img src={personal.photo} alt="" className={className} style={grayscaleStyle} />
  }

  const zoom = personal.photoZoom
  const ox = personal.photoOffsetX
  const oy = personal.photoOffsetY
  return (
    <div className={`${className} cv-photo-wrap`}>
      <img
        src={personal.photo}
        alt=""
        style={{
          width: `${zoom * 100}%`,
          height: `${zoom * 100}%`,
          marginLeft: `${(1 - zoom) * 50 + ox * (zoom - 1)}%`,
          marginTop: `${(1 - zoom) * 50 + oy * (zoom - 1)}%`,
          objectFit: 'cover',
          ...grayscaleStyle,
        }}
      />
    </div>
  )
}
