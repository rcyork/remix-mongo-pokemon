import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { Outlet } from 'react-router-dom'
import { Layout } from '~/components/Layout'
import { requireUserId } from '~/utils/auth.server'
import { getFilteredPokemon } from '~/utils/pokemon.server'
import {
  type Prisma,
  type Pokemon as IPokemon,
  type Profile,
} from '@prisma/client'
import { SearchBar } from '~/components/search-bar'
import { PokemonCard } from '~/components/pokemon-card'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const url = new URL(request.url)
  const sort = url.searchParams.get('sort')
  const filter = url.searchParams.get('filter')

  let sortOptions: Prisma.PokemonOrderByWithRelationInput = {}
  if (sort) {
    if (sort === 'date') {
      sortOptions = { createdAt: 'desc' }
    }
    if (sort === 'author') {
      sortOptions = { author: { profile: { firstName: 'asc' } } }
    }
  }

  let textFilter: Prisma.PokemonWhereInput = {}
  if (filter) {
    textFilter = {
      OR: [
        { name: { mode: 'insensitive', contains: filter } },
        {
          author: {
            OR: [
              {
                profile: {
                  is: { firstName: { mode: 'insensitive', contains: filter } },
                },
              },
              {
                profile: {
                  is: { lastName: { mode: 'insensitive', contains: filter } },
                },
              },
            ],
          },
        },
      ],
    }
  }

  const createdPokemon = await getFilteredPokemon(
    userId,
    sortOptions,
    textFilter,
  )
  return json({ createdPokemon })
}

export interface PokemonWithAuthor extends IPokemon {
  author: {
    profile: Profile
  }
}

export default function Home() {
  const navigate = useNavigate()
  const { createdPokemon } = useLoaderData()

  return (
    <Layout>
      <Outlet />
      <div className="flex flex-col p-10">
        <div className="flex w-full justify-end">
          <form method="post" action="/logout">
            <button
              type="submit"
              className="rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
            >
              Sign Out
            </button>
          </form>
        </div>
        <div className="flex flex-col">
          <SearchBar />
          <div className="my-8 flex w-full justify-end">
            <button
              onClick={() => navigate(`/home/create`)}
              className="rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
            >
              Create Pokemon
            </button>
          </div>
          <div className="flex w-full flex-1 flex-col gap-y-4">
            <div className="grid w-fit grid-flow-col gap-4">
              {createdPokemon.map((char: PokemonWithAuthor) => {
                return <PokemonCard key={char.id} char={char} />
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// import { json, type LoaderFunction } from '@remix-run/node'
// import { useLoaderData } from '@remix-run/react'
// import { requireUserId } from '~/utils/auth.server'

// type Pokemon = {
//   count: number
//   next: string | null
//   previous: string | null
//   results: Char[]
// }

// type Char = {
//   name: string
//   url: string
// }

// export const loader: LoaderFunction = async ({ request }) => {
//   await requireUserId(request)
//   const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
//   return json(await res.json())
// }
