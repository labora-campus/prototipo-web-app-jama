import JamaApp from '@/components/jama-app'

export default function Page() {
  return <JamaApp />
}

export const metadata = {
  title: 'JAMA — Encontrá tu lugar para crear',
  description: 'Cafeterías y coworkings curados para trabajar mejor en Buenos Aires.',
}

export const dynamic = 'force-static'
