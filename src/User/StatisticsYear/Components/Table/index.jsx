import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { arrowDown, arrowUp } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

// TODO:
/* eslint-disable */

const columns = [
  {
    Header: 'Species',
    accessor: 'name',
  },
  {
    Header: 'Records',
    accessor: 'record_count',
  },
  {
    Header: 'Count',
    accessor: 'total_individual_count',
  },
];

function Table({ data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <IonIcon src={arrowUp} />
                      ) : (
                        <IonIcon src={arrowDown} />
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Table;
