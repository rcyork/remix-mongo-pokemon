import { type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Modal } from '~/components/modal'
import { requireUserId } from '~/utils/auth.server'

const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  return userId
}

export default function PokemonModal() {
  const userId = useLoaderData()
  return (
    <Modal isOpen={true} className="w-2/3 p-10">
      <h2>this is a modal</h2>
    </Modal>
  )
}
