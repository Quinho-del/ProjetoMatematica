import { useState } from 'react'

function getInitials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function Card({ foto, nome }) {
  const [imageError, setImageError] = useState(false)

  return (
    <article className="person-card">
      <div className="person-photo">
        {!imageError ? (
          <img src={foto} alt={nome} onError={() => setImageError(true)} />
        ) : (
          <span>{getInitials(nome)}</span>
        )}
      </div>
      <h3>{nome}</h3>
    </article>
  )
}

export default Card
