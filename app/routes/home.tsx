import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { Outlet } from 'react-router-dom'
import { Layout } from '~/components/Layout'
import { getAllPokemon } from '~/utils/pokemon.server'
import { type Pokemon as IPokemon, type Profile } from '@prisma/client'
import { SearchBar } from '~/components/search-bar'
import { PokemonCard } from '~/components/pokemon-card'
import React, { useEffect } from 'react'

type RealCharRaw = {
  name: string
  url: string
}

type RealChar = {
  id: string
  height: number
  name: string
  weight: number
  sprites: RealCharSprites
}

type RealCharSprites = {
  front_default: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const createdPokemonRaw = await getAllPokemon()

  const createdPokemon = createdPokemonRaw.map((char) => {
    return {
      ...char,
      author: true,
    }
  })

  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
  const pokemonList = await res.json()
  const realPokemonRaw: RealChar[] = await Promise.all(
    pokemonList.results.map(async (char: RealCharRaw) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${char.name}`)
      return await res.json()
    }),
  )

  const realPokemon: Pokemon[] = realPokemonRaw.map((char: RealChar) => {
    return {
      id: char.id,
      height: char.height.toString(),
      name: char.name,
      weight: char.weight.toString(),
      avatar: char.sprites.front_default,
      author: false,
    }
  })

  return json({ createdPokemon, realPokemon })
}

export interface PokemonWithAuthor extends IPokemon {
  author: {
    profile: Profile
  }
}

export type Pokemon = {
  id: string
  name: string
  height: string
  weight: string
  avatar?: string
  userId?: string
  author: boolean
}

export type Filters = {
  type: 'all' | 'real' | 'created'
  sort:
    | ''
    | 'name asc'
    | 'name desc'
    | 'height asc'
    | 'height desc'
    | 'weight asc'
    | 'weight desc'
}

export default function Home() {
  const navigate = useNavigate()
  const { createdPokemon, realPokemon } = useLoaderData()

  const allPokemon = [...createdPokemon, ...realPokemon]

  const [filters, setFilters] = React.useState<Filters>({
    type: 'all',
    sort: '',
  })

  const [pokemon, setPokemon] = React.useState<Pokemon[]>(allPokemon)

  console.log('AAAAAAAAA', pokemon)

  useEffect(() => {
    let subset: Pokemon[]
    const type = filters.type

    switch (type) {
      case 'created':
        subset = createdPokemon
        break
      case 'real':
        subset = realPokemon
        break
      default:
        subset = allPokemon
        break
    }

    let sortedPokemon
    const sortStyle = filters.sort

    switch (sortStyle) {
      case 'name asc':
        sortedPokemon = subset.sort((a, b) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }

          return 0
        })
        break
      case 'name desc':
        sortedPokemon = subset.sort((a, b) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameB < nameA) {
            return -1
          }
          if (nameB > nameA) {
            return 1
          }

          return 0
        })
        break
      case 'height asc':
        sortedPokemon = subset.sort(
          (a, b) => parseInt(a.height) - parseInt(b.height),
        )
        break
      case 'height desc':
        sortedPokemon = subset.sort(
          (a, b) => parseInt(b.height) - parseInt(a.height),
        )
        break
      case 'weight asc':
        sortedPokemon = subset.sort(
          (a, b) => parseInt(a.weight) - parseInt(b.weight),
        )
        break
      case 'weight desc':
        sortedPokemon = subset.sort(
          (a, b) => parseInt(b.weight) - parseInt(a.weight),
        )
        break
      default:
        sortedPokemon = subset
        break
    }

    setPokemon(sortedPokemon)
  }, [filters])

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
          <SearchBar filters={filters} setFilters={setFilters} />
          <div className="my-8 flex w-full justify-end">
            <button
              onClick={() => navigate(`/home/create`)}
              className="rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
            >
              Create Pokemon
            </button>
          </div>
          <div className="flex w-full flex-1 flex-col gap-y-4">
            <div className="flex flex-wrap gap-4">
              {pokemon.map((char: Pokemon) => {
                return <PokemonCard key={char.id} char={char} />
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
