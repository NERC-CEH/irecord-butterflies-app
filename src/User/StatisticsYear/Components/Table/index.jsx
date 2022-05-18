import { useTable, useSortBy } from 'react-table';
import { arrowDown, arrowUp } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const columns = [
  {
    Header: 'Species',
    accessor: 'name',
  },
  {
    Header: 'Records',
    accessor: 'record_count',
    isSorted: true,
  },
  {
    Header: 'Count',
    accessor: 'total_individual_count',
  },
];

// eslint-disable-next-line
function Table({ data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [
            {
              id: 'record_count',
              desc: true,
            },
          ],
        },
      },
      useSortBy
    );

  const getColumn = column => (
    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
      {column.render('Header')}

      <span>
        {column.isSorted && column.isSortedDesc && <IonIcon src={arrowUp} />}
        {column.isSorted && !column.isSortedDesc && <IonIcon src={arrowDown} />}
      </span>
    </th>
  );

  const getHeaderGroup = headerGroup => (
    <tr {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map(getColumn)}
    </tr>
  );

  const getRow = row => {
    prepareRow(row);
    const getCell = cell => (
      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
    );
    return <tr {...row.getRowProps()}>{row.cells.map(getCell)}</tr>;
  };
  return (
    <table {...getTableProps()}>
      <thead>{headerGroups.map(getHeaderGroup)}</thead>
      <tbody {...getTableBodyProps()}>{rows.map(getRow)}</tbody>
    </table>
  );
}

export default Table;
