import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireUserId } from '~/utils/auth.server'

type Pokemon = {
  count: number
  next: string | null
  previous: string | null
  results: Char[]
}

type Char = {
  name: string
  url: string
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
  return json(await res.json())
}

export default function Index() {
  const pokemon = useLoaderData<Pokemon>()

  return (
    <div className="h-screen  w-full bg-slate-600">
      <h2 className="text-blue-200">Tailwind is working!</h2>
      <div>
        {pokemon.results.map((char) => {
          return <div key={char.name}>{char.name}</div>
        })}
      </div>
    </div>
  )
}
