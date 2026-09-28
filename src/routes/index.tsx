import { createFileRoute } from '@tanstack/react-router'
import PlayerSearch from '../components/PlayerSearch'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <PlayerSearch />
  )
}
