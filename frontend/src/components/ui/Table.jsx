import React from 'react';

const Table = ({ headers = [], data = [], renderRow, emptyMessage = 'No records found.' }) => {
  return (
    <div className="table-responsive overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-100 text-xs font-semibold text-slate-700 uppercase border-b border-slate-200">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data && data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length || 1} className="px-4 py-8 text-center text-slate-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
