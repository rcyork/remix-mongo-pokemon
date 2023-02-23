import { type LoaderFunction } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'
import { Outlet } from 'react-router-dom'
import { Layout } from '~/components/Layout'
import { requireUserId } from '~/utils/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return null
}

export default function Home() {
  const navigate = useNavigate()
  return (
    <Layout>
      <Outlet />
      <form method="post" action="/logout">
        <button
          type="submit"
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
        >
          Sign Out
        </button>
      </form>
      <button
        onClick={() => navigate(`/home/create`)}
        className="absolute top-8 left-8 rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
      >
        Create Pokemon
      </button>
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
