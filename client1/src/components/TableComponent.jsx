import React from 'react';
import DataTable from 'react-data-table-component';
import { Spinner } from 'flowbite-react';

const Loading = () => {
    return(
    <div className="flex flex-wrap gap-2">
        <div className='text-center'>
            <Spinner size={'xl'} />
        </div>
    </div>
    )
}


const Options = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
}



const TableComponent = ({
    columns, data, onSort, progres
}) => {
    return (
        <DataTable
        className='w-full text-left text-sm text-gray-500'
        columns={columns}
        data={data}
        onSort={onSort}
        pagination
        paginationComponentOptions={Options}
        noDataComponent={'No hay datos para mostrar'}
        progressPending={progres}
        progressComponent={<Loading/>} />
    )
}

export default TableComponent
