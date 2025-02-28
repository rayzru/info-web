import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Сообщество Жильцов',
    short_name: 'Сердце Ростова 2',
    description: 'Сообщество жильцов ЖК Сердце Ростова 2',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',  
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
