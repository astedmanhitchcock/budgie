import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
        

import TransactionModal from '../components/TransactionModal';
import { useDataContext } from '../App';


const Transactions: React.FC = () => {
  const dataContext: any = useDataContext();
  const pageError = false

  const toast = useRef<Toast>(null);

  const reject = () => {
    toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const confirm2 = (evt: any, rowData: {id: string}) => {
    const { id } = rowData;
    
    const confirmDelete = async () => {
      fetch(`${process.env.API_URL}delete-transaction`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).then((res) => res.json())
        .then(data => { 
          console.log('data :: ', data)
          dataContext?.setTransactions(data);
          toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        });
    }

    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: confirmDelete,
      reject
    });
  };

  const rowClassName = (rowData: any) => (rowData.is_income ? 'income-row' : '');

  const amountTemplate = (rowData: any) => {
    const amount = rowData.is_income ? rowData.amount : `-${rowData.amount}`;

    return (<>{ amount }</>)
  }

  const editButton = (rowData: any) => {
    return (
      <TransactionModal transaction={rowData} />
    )
  }

  const deleteButton = (rowData: any) => {
    const path = `/transactions/${rowData.id}`;
    return (
      <Button icon="pi pi-trash" rounded severity="danger" onClick={(e) => confirm2(e, rowData)}></Button>
    )
  }

  return (
    <div>
      <Toolbar
        start={
          <h2 className="font-bold text-xl">
            Transactions
          </h2>
        } 
        end={<TransactionModal />}
      />
      {pageError ? (
        <>
          Error getting data.
        </>
      ) :
      !dataContext?.transactions ? (
        <div className='absolute top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%]'>
          <ProgressSpinner />
        </div>
      ) : 
      dataContext?.transactions?.length > 0 ? (
        <>
          <Toast ref={toast} />
          <ConfirmDialog />
          <DataTable value={dataContext?.transactions} rowClassName={rowClassName}>
            <Column field="is_income" header="is income" ></Column>
            <Column field="date" header="date" ></Column>
            <Column field="amount" header="amount" body={amountTemplate}></Column>
            <Column field="category" header="category"></Column>
            <Column field="source" header="source"></Column>
            <Column field="created_by" header="user"></Column>
            <Column field="notes" header="notes"></Column>
            <Column body={editButton}></Column>
            <Column body={deleteButton}></Column>
          </DataTable>
        </>
      ) : (
        <>no results</>
      )}
    </div>
  )
}

export default Transactions;