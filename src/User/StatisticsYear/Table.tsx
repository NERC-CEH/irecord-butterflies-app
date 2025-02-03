import { arrowDown, arrowUp } from 'ionicons/icons';
import {
  useTable,
  useSortBy,
  HeaderGroup,
  Row,
  Cell,
  TableOptions,
} from 'react-table';
import { IonIcon, IonAvatar } from '@ionic/react';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import './styles.scss';

const columns: any = [
  {
    accessor: 'thumbnail',
    disableSortBy: true,
    className: 'avatar',
    Cell: ({ value }: Cell<any>) => (
      <IonAvatar>
        {value ? (
          <img src={value} />
        ) : (
          <IonIcon className="default-thumbnail" icon={butterflyIcon} />
        )}
      </IonAvatar>
    ),
  },
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

type Props = {
  data: any;
};

const Table = ({ data }: Props) => {
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

    const getCell = (cell: any) => {
      const isSubsSpecies =
        cell.column.Header === 'Species' &&
        cell.row.original?.taxon_rank === 'Subspecies';
      const italicFontStyle = isSubsSpecies ? 'italics' : '';

      return (
        <td {...cell.getCellProps({ className: italicFontStyle })}>
          {cell.render('Cell')}
        </td>
      );
    };
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
