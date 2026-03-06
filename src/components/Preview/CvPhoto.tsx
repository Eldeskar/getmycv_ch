interface PhotoFields {
  photo: string
  photoZoom: number
  photoOffsetX: number
  photoOffsetY: number
  photoGrayscale: boolean
}

interface Props {
  personal: PhotoFields
  className: string
}

function PlaceholderAvatar({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`${className} cv-photo-placeholder`} xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#e5e7eb" />
      <circle cx="100" cy="78" r="40" fill="#c4c8cd" />
      <ellipse cx="100" cy="176" rx="65" ry="52" fill="#c4c8cd" />
    </svg>
  )
}

export function CvPhoto({ personal, className }: Props) {
  if (!personal.photo) {
    return <PlaceholderAvatar className={className} />
  }

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
