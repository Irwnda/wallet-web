import React from 'react';

export default function Sorting({
  sortByValue,
  setSortByValue,
  sortOrderValue,
  setSortOrderValue
}) {
  return (
    <div className='sort'>
      <div>
        <label htmlFor="sort-by">Sort By</label>
        <select
          name="sort-by"
          id="sort-by"
          value={sortByValue}
          onChange={(event) => setSortByValue(event.target.value)}
        >
          <option value="">Select Sorting Value</option>
          <option value="date">Date</option>
          <option value="description">Description</option>
          <option value="amount">Amount</option>
        </select>
      </div>
      <div>
        <label htmlFor="sort-order">Sort Order</label>
        <select
          name="sort-order"
          id="sort-order"
          value={sortOrderValue}
          onChange={(event) => setSortOrderValue(event.target.value)}
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>
    </div>
  );
}
