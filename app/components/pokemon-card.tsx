import { useNavigate } from 'react-router-dom'
import { type Pokemon } from '~/routes/home'

type PokemonCardProps = {
  char: Pokemon
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ char }) => {
  const navigate = useNavigate()
  const avatar = char.avatar

  return (
    <>
      <div
        className={`${
          char.author ? 'pokemon-card-grid-with-author' : 'pokemon-card-grid'
        } h-80 w-72 rounded border-2 border-solid border-yellow-300 p-4 text-white`}
      >
        {char.author ? (
          <div className="flex w-full justify-end">
            <span className=" w-max rounded-xl bg-yellow-300 px-3 py-2 text-xs font-semibold text-blue-600">
              user created
            </span>
          </div>
        ) : null}
        <div className="pokemon-card-grid">
          {avatar ? (
            <div
              style={{
                backgroundImage: `url('${avatar}')`,
              }}
              className="flex h-full w-full flex-1 bg-contain bg-center bg-no-repeat"
            ></div>
          ) : null}
          <div className="my-2 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              name: {char.name}
            </div>
            <div className="flex items-center justify-center">
              height: {char.height}
            </div>
            <div className="flex items-center justify-center">
              weight: {char.weight}
            </div>
          </div>
        </div>
        {char.author ? (
          <div className="flex justify-between gap-4">
            <button
              onClick={() => navigate(`/home/edit/${char.id}`)}
              className="w-full rounded-xl bg-yellow-300 px-3 py-2 text-xs font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
            >
              Edit
            </button>
            <button
              onClick={() => navigate(`/home/delete/${char.id}`)}
              className="w-full rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}
