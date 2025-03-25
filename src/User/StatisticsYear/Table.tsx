import { useState } from 'react';
import { IonIcon, IonAvatar } from '@ionic/react';
import {
  createColumnHelper,
  useReactTable,
  getSortedRowModel,
  getCoreRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import './styles.scss';

const columnHelper = createColumnHelper<any>();

const columns: any = [
  columnHelper.accessor('thumbnail', {
    enableSorting: false,
    header: () => '',

    cell: value => (
      <IonAvatar>
        {value ? (
          <img src={value.getValue()} />
        ) : (
          <IonIcon className="default-thumbnail" icon={butterflyIcon} />
        )}
      </IonAvatar>
    ),
  }),
  columnHelper.accessor('name', {
    header: () => 'Species',
    cell: ({ getValue, row }) => {
      const isSubsSpecies = row.original?.taxon_rank === 'Subspecies';
      const italicFontStyle = isSubsSpecies ? 'italic' : '';

      return <span className={italicFontStyle}>{getValue()}</span>;
    },
  }),
  columnHelper.accessor('record_count', {
    header: () => 'Records',
  }),
  columnHelper.accessor('total_individual_count', {
    header: () => 'Count',
  }),
];

type Props = {
  data: any;
};

const Table = ({ data }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'record_count', desc: true },
  ]);

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="my-5 w-full max-w-full overflow-scroll px-2">
      <table>
        <thead>
          {getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
