import { SelectBox } from './select-box'
import { pokemonSortFilters, pokemonTypeFilters } from '~/utils/constants'
import React, { type SetStateAction } from 'react'
import { type Filters } from '~/routes/home'

type props = {
  filters: Filters
  setFilters: React.Dispatch<SetStateAction<Filters>>
}

export const SearchBar: React.FC<props> = ({ filters, setFilters }) => {
  const clearFilters = () => {
    setFilters({
      type: 'all',
      sort: '',
    })
  }

  const hasFilters = filters.type !== 'all' || filters.sort

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFilters(() => ({ ...filters, [field]: event.target.value }))
  }

  return (
    <div className="mt-4 flex w-full items-end gap-x-4 border-b-4 border-b-blue-900 border-opacity-30 pb-8">
      <SelectBox
        className="w-full rounded-xl px-3 py-2 text-gray-400"
        containerClassName="w-52"
        label="Subset"
        name="pokemonType"
        options={pokemonTypeFilters}
        value={filters.type}
        onChange={(e) => handleInputChange(e, 'type')}
      />
      <SelectBox
        className="w-full rounded-xl px-5 py-2 text-gray-400"
        containerClassName="w-52"
        label="Sort"
        name="pokemonSort"
        options={pokemonSortFilters}
        value={filters.sort}
        onChange={(e) => handleInputChange(e, 'sort')}
      />
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="rounded-xl bg-red-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
        >
          Clear Filters
        </button>
      )}
      <div className="flex-1" />
    </div>
  )
}
