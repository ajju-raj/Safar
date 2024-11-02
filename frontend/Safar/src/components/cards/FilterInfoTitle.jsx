import React from 'react';
import moment from 'moment';
import { MdOutlineClose } from 'react-icons/md';

const FilterInfoTitle = ({ filterType, filterDates, onClose }) => {
  const DateRangeChip = ({ date, onClear }) => {
    const startDate = date?.from ? moment(date.from).format('DD MMM YYYY') : null;
    const endDate = date?.to ? moment(date.to).format('DD MMM YYYY') : null;

    return (
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded">
        <p className="text-xs font-medium">
          {startDate && endDate ? `${startDate} - ${endDate}` : "No date range"}
        </p>
        <button onClick={onClear} aria-label="Clear date range">
          <MdOutlineClose />
        </button>
      </div>
    );
  };

  return (
    filterType && (
      <div className="mb-5">
        {filterType === 'search' ? (
          <h3 className="text-lg font-medium">Search Results</h3>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Filtered by Date Range:</h3>
            <DateRangeChip date={filterDates} onClear={onClose} />
          </div>
        )}
      </div>
    )
  );
};

export default FilterInfoTitle;

