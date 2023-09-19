import React from 'react'

interface IconSvgProps {
  size?: number
  width?: number
  height?: number
  [key: string]: any
}

export const VerticalDotsIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  // Comprobaciones explícitas y estrictas para asegurarse de que size, width y height sean números válidos
  const iconSize = typeof size === 'number' && !isNaN(size) ? size : 24

  // Establecer valores predeterminados solo si width o height son números válidos o nulos
  const iconWidth = (typeof width === 'number' && !isNaN(width)) || width === null ? width : undefined
  const iconHeight = (typeof height === 'number' && !isNaN(height)) || height === null ? height : undefined

  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={iconHeight ?? iconSize}
      role="presentation"
      viewBox="0 0 24 24"
      width={iconWidth ?? iconSize}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  )
}
