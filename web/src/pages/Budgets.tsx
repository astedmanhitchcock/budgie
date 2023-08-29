import { MouseEvent, useEffect, useState } from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';

import BudgetModal from '../components/BudgetModal';

import { useDataContext } from '../App';

export interface IBudget {
  id: number,
  income: string,
  name: string,
  month: string,
  fixed_expenses: Object,
  flex_expenses: Object
}

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<IBudget[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const dataContext: any = useDataContext();

  useEffect(() => {
    if (dataContext?.budgets) {
      setBudgets(dataContext.budgets)
      setIsLoading(false)
      console.log(dataContext.budgets)
    }
  }, [dataContext.budgets])

  const EditButton = (rowData: IBudget) => (
    <BudgetModal budget={rowData} />
  )

  return (
    <>
      <Toolbar
        start={
          <h2 className="font-bold text-xl">
            Budget
          </h2>
        }
      />
      <DataTable
        loading={isLoading}
        value={budgets}
      >
        <Column
          header="name"
          field="name"
        ></Column>
        <Column align='right' body={EditButton}></Column>
      </DataTable>
    </>
  )
}

export default Budgets