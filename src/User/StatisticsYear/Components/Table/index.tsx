import { FC } from 'react';
import {
  useTable,
  useSortBy,
  HeaderGroup,
  Row,
  Cell,
  TableOptions,
} from 'react-table';
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

type Props = {
  data: any;
};

const Table: FC<Props> = ({ data }) => {
  const tableOptions: TableOptions<any> = {
    columns,
    data,
    initialState: {
      sortBy: [
        {
          id: 'record_count',
          desc: true,
        },
      ],
    } as any,
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(tableOptions, useSortBy);

  const getColumn = (column: any) => (
    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
      {column.render('Header')}

      <span>
        {column.isSorted && column.isSortedDesc && <IonIcon src={arrowUp} />}
        {column.isSorted && !column.isSortedDesc && <IonIcon src={arrowDown} />}
      </span>
    </th>
  );

  const getHeaderGroup = (headerGroup: HeaderGroup) => (
    <tr {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map(getColumn)}
    </tr>
  );

  const getRow = (row: Row) => {
    prepareRow(row);
    const getCell = (cell: Cell) => (
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
};

export default Table;
