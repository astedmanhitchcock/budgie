import { useContext, useEffect, useRef, useState } from 'react';

import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import TransactionModal from '../components/TransactionModal';
import { useDataContext } from '../App';


const Transactions: React.FC = () => {
  const [filters, setFilters] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState(undefined)
  const [categories, setCategories] = useState(undefined);
  const [users, setUsers] = useState(undefined);

  const dataContext: any = useDataContext();

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

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
      },
      amount: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
      },
      source: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      category: { 
        operator: FilterOperator.OR, 
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] 
      },
      created_by: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      notes: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
      },
    });
    // setGlobalFilterValue('');
};

  const rowClassName = (rowData: any) => (rowData.is_income ? 'income-row' : '');

  const dateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const formatDate = (value) => {
    return value.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.date);
  };

  const amountTemplate = (rowData: any) => {
    const amount = rowData.is_income ? rowData.amount : `-${rowData.amount}`;

    return (<>{ amount }</>)
  }

  const amountFilterTemplate = (options) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => {
          options.filterCallback(e.value?.toFixed(2), options.index)
        }}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const categoryFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value} 
        options={categories}
        optionLabel='title'
        onChange={(e) => {
          options.filterCallback(e?.value?.title, options.index)
        }}
        placeholder="Select One"
        showClear
      />
    )
  }

  const userFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value} 
        options={users}
        optionLabel='username'
        onChange={(e) => {
          options.filterCallback(e?.value?.username, options.index)
        }}
        placeholder="Select User"
        showClear
      />
    )
  }

  const editButton = (rowData: any) => {
    return (
      <TransactionModal transaction={rowData} />
    )
  }

  const deleteButton = (rowData: any) => {
    const path = `/transactions/${rowData.id}`;
    return (
      <Button icon="pi pi-trash" severity="danger" onClick={(e) => confirm2(e, rowData)}></Button>
    )
  }

  const sanitizeTransactionDates = (data) => {

    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      d.amount = Number(parseFloat(d.amount)).toFixed(2)
      return d;
    });
  };

  useEffect(() => {
    if (dataContext.transactions) {
      initFilters();
      const transactionData = sanitizeTransactionDates(dataContext.transactions);
      setTransactions(transactionData);
      setLoading(false);

      const queryParameters = new URLSearchParams(window.location.search)
      const category = queryParameters.get("category")
      if (category) {
        console.log('filters : ', filters)
        setFilters({
          ...filters,
          'category': {
            operator: FilterOperator.OR, 
            constraints: [{ value: category, matchMode: FilterMatchMode.EQUALS }] 
          }
        })
      }
    }

  }, [dataContext.transactions])

  useEffect(() => {
    if (!categories && dataContext?.categories) {
      setCategories(dataContext?.categories);
    }
  }, [dataContext.categories])

  useEffect(() => {
    if (!users && dataContext?.users) {
      setUsers(dataContext.users)
    }
  }, [dataContext.users])

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
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable 
        loading={loading}
        value={transactions}
        rows={10}
        dataKey="id" 
        filters={filters}
        rowClassName={rowClassName} 
        stripedRows
        paginator={transactions?.length > 10}
      >
        <Column
          header="date"
          body={dateBodyTemplate}
          filterField='date'
          dataType='date'
          filter
          filterElement={dateFilterTemplate}
        ></Column>
        <Column 
          header="amount" 
          body={amountTemplate}
          field="amount" 
          filter
          filterField='amount'
          filterElement={amountFilterTemplate}
        ></Column>
        <Column
          header="source"
          field="source"
          filter
          filterField='source'
          filterPlaceholder='Search by source'
        ></Column>
        <Column
          header="category"
          field='category'
          filter
          filterField='category'
          filterElement={categoryFilterTemplate}
        ></Column>
        <Column
          header="user"
          field='created_by'
          filter
          filterField='created_by'
          filterElement={userFilterTemplate}
        ></Column>
        <Column
          header="notes"
          field="notes"
          filter
          filterField='notes'
          filterPlaceholder='Search notes'
        ></Column>
        <Column align='right' body={editButton}></Column>
        <Column headerClassName='w-px' body={deleteButton}></Column>
      </DataTable>
    </div>
  )
}

export default Transactions;