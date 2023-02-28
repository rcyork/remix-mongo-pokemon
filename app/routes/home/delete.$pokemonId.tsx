import { type ActionFunction, redirect } from '@remix-run/node'
import { useNavigate } from 'react-router-dom'
import { Modal } from '~/components/modal'
import { deletePokemonById } from '~/utils/pokemon.server'

export const action: ActionFunction = async ({ params }) => {
  const { pokemonId } = params

  if (typeof pokemonId !== 'string') {
    return redirect('/home')
  }

  await deletePokemonById(pokemonId)
  return redirect('/home')
}

const PokemonDeleteModal = () => {
  const navigate = useNavigate()
  return (
    <Modal isOpen={true} className="w-2/3 p-10">
      <p>Are you sure you want to permanently delete this pokemon?</p>
      <div className="mt-4 flex justify-end">
        <form method="post">
          <button
            type="submit"
            className="mr-4 rounded-xl bg-red-500 px-3 py-2 font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-red-700"
          >
            Delete
          </button>
        </form>
        <button
          onClick={() => navigate(`/home`)}
          className="rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default PokemonDeleteModal
