import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import EditTransactionModal from '../components/EditTransactionModal';

interface transaction {
  id: string;
}

const Transactions: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<transaction[] | undefined>(undefined);
  const [pageError, setPageError] = useState<boolean>(false);

  const getTransactions = async () => {
    fetch(`${process.env.API_URL}transactions`, {
      method: "GET"
    }).then(async (res) => {
      if (res.ok) {
        const jsonData = await res.json();
        setAllTransactions(jsonData);
      } else {
        console.log('res err? :: ', res);
        setPageError(true);
      }
    }).catch(err => {
      console.log('error :: ', err);
      setPageError(true);
    });
  };

  const toast = useRef<Toast>(null);

  const reject = () => {
    toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const confirm2 = (evt: any, id: number) => {
    
    const confirmDelete = async () => {
      fetch(`${process.env.API_URL}delete-transaction`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id})
      }).then((res) => res.json())
        .then(data => { 
          console.log('data ! ', data)
          getTransactions();
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

  const rowClassName = (rowData: any) => (rowData.is_income ? 'bg-green-500' : '');

  const editButton = (rowData: any) => {
    return (
      <EditTransactionModal {...rowData} onClose={getTransactions} />
    )
  }

  const deleteButton = (rowData: any) => {
    const path = `/transactions/${rowData.id}`;
    return (
      <Button icon="pi pi-trash" rounded severity="danger" onClick={(e) => confirm2(e, rowData.id)}></Button>
    )
  }
    
  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div>
      <h2 className="font-bold text-18 mb-12">
        transactions
      </h2>
      <hr />
      {pageError && (
        <>
          Error getting data.
        </>
      )}
      {!allTransactions ? (
        <div className='absolute top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%]'>
          <ProgressSpinner />
        </div>
      ) : allTransactions.length > 0 ? (
        <>
          <Toast ref={toast} />
          <ConfirmDialog />
          <DataTable value={allTransactions} rowClassName={rowClassName}>
            <Column field="date" header="date" ></Column>
            <Column field="amount" header="amount"></Column>
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