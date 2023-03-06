import { SelectBox } from './select-box'
import { pokemonSortFilters, pokemonTypeFilters } from '~/utils/constants'
import { useNavigate, useSearchParams, useSubmit } from 'react-router-dom'

export const SearchBar = () => {
  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const subset = searchParams.get('subset')
  const sort = searchParams.get('sort')

  const clearFilters = () => {
    searchParams.delete('filter')
    navigate('/home')
  }

  const hasFilters = subset !== 'all' || sort

  const submit = useSubmit()

  return (
    <form onChange={(e) => submit(e.currentTarget)}>
      <div className="mt-4 flex w-full items-end gap-x-4 border-b-4 border-b-blue-900 border-opacity-30 pb-8">
        <SelectBox
          className="w-full rounded-xl px-3 py-2 text-gray-400"
          containerClassName="w-52"
          label="Subset"
          name="subset"
          options={pokemonTypeFilters}
          value={subset ?? undefined}
        />
        <SelectBox
          className="w-full rounded-xl px-5 py-2 text-gray-400"
          containerClassName="w-52"
          label="Sort"
          name="sort"
          options={pokemonSortFilters}
          value={sort ?? undefined}
        />
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="rounded-xl bg-red-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
          >
            Clear Filters
          </button>
        )}
      </div>
    </form>
  )
}
