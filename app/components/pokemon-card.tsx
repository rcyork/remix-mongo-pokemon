import { Outlet, useNavigate } from 'react-router-dom'
import { type PokemonWithAuthor } from '~/routes/home'

type PokemonCardProps = {
  char: PokemonWithAuthor
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ char }) => {
  const navigate = useNavigate()
  return (
    <>
      <Outlet />
      <div className="pokemon-card-grid h-52 w-52 rounded border-2 border-solid border-yellow-300 p-4 text-white">
        <div className="flex h-full w-full items-center justify-center">
          {char.name}
        </div>
        <button
          onClick={() => navigate(`/home/edit/${char.id}`)}
          className="rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
        >
          Edit
        </button>
      </div>
    </>
  )
}
