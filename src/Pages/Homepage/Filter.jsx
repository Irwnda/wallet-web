import React from 'react';

export default function Filter({ filterQuery, setFilterQuery }) {
  return (
    <div>
      <label htmlFor="filter">Filter</label>
      <input
        type="text"
        value={filterQuery}
        onChange={(event) => setFilterQuery(event.target.value)}
        name="filter"
        id="filter"
      />
    </div>
  );
}
