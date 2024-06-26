import { flexRender, type Table as TableType } from '@tanstack/react-table'
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  type TableContainerProps,
  type TableRowProps,
} from '@chakra-ui/react'

import CustomPagination from './CustomPagination'
import MobileTable from './MobileTable'
import PaginationControl from './PaginationControl'

interface DataTableProps<T> extends TableContainerProps {
  table: TableType<T>
  totalPages?: number
  alwaysVisibleColumns: number[]
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  hidePerPage?: boolean
  hidePagination?: boolean
  useCustomPagination?: boolean
  rowStyle?: TableRowProps
  setCurrentPage?: (currentPage: number) => void
  onFetch?: (currentPage: number) => void
  setPageSize?: (pageLimit: number) => void
  bgColor?: string
  textAlignVal?: 'center' | 'left' | 'right'
}

const DataTable = <T,>({
  table,
  totalPages,
  alwaysVisibleColumns,
  breakpoint,
  hidePerPage = true,
  hidePagination = false,
  useCustomPagination = false,
  rowStyle,
  onFetch,
  setPageSize,
  bgColor = '',
  textAlignVal = 'center',
  ...props
}: DataTableProps<T>) => {
  const { getHeaderGroups, getRowModel } = table

  return (
    <>
      <MobileTable
        table={table}
        alwaysVisibleColumns={alwaysVisibleColumns}
        breakpoint={breakpoint}
      />

      <TableContainer display={{ base: 'none', [breakpoint]: 'block' }} {...props}>
        <Table
          size='sm'
          variant='unstyled'
          style={{ borderCollapse: 'separate', borderSpacing: '0 .5rem' }}
          data-testid='table'
        >
          <Thead>
            {getHeaderGroups()
              // filtering header depth is due to some headers including in both depth 0 and 1
              .filter(headerGroup => headerGroup.depth === 0)
              .map(headerGroup => {
                return (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <Th
                          key={header.id}
                          colSpan={header.colSpan}
                          textAlign={textAlignVal}
                          whiteSpace='pre-line'
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Th>
                      )
                    })}
                  </Tr>
                )
              })}
          </Thead>

          <Tbody>
            {getRowModel().rows.map(row => (
              <Tr key={row.id} bg='white' {...rowStyle}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <Td
                      key={cell.id}
                      // Set max width and padding only if the column is accessor type
                      px={cell.column.accessorFn ? '2' : '0'}
                      maxW={cell.column.accessorFn ? '28' : undefined}
                      textAlign={textAlignVal}
                      whiteSpace='pre-line'
                      lineHeight='base'
                      bg={bgColor}
                      pl={textAlignVal && textAlignVal !='center'?4:0}
                      // This is a workaround to set border-radius to table rows
                      _first={{ borderLeftRadius: 'md' }}
                      _last={{ borderRightRadius: 'md' }}
                    >
                      {/* c8 ignore next */}
                      {flexRender(cell.column.columnDef.cell, cell.getContext()) ?? '-'}
                    </Td>
                  )
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {!hidePagination &&
        getRowModel().rows.length > 0 &&
        (useCustomPagination ? (
          <CustomPagination
            table={table}
            totalPages={totalPages}
            hidePerPage={hidePerPage}
            onFetch={onFetch}
            setPageSize={setPageSize}
          />
        ) : (
          <PaginationControl
            table={table}
            totalPages={totalPages}
            hidePerPage={hidePerPage}
          />
        ))}
    </>
  )
}

export default DataTable
