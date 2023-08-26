import { MouseEvent, useEffect, useState } from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';

import CategoryModal from '../components/CategoryModal';

import { useDataContext } from '../App';
import { CategoriesService } from '../services/CategoriesService';


interface ICategory {
  id: number,
  is_fixed: boolean,
  notes?: string,
  title: string
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const dataContext: any = useDataContext();

  const EditButton = (rowData: ICategory) => (
    <CategoryModal category={rowData} type="category" />
  )

  const DeleteButton = (rowData: ICategory) => (
    <Button
      icon="pi pi-trash"
      severity="danger"
      onClick={(e) => handleDeleteClick(e, rowData)}
    />
  )

  const handleDeleteClick = (event: MouseEvent, rowData: ICategory) => {
    CategoriesService.delete({'id': rowData.id}).then((data: any) => {
      dataContext.setCategories(data)
    })
  }

  useEffect(() => {
    if (dataContext?.categories) {
      setCategories(dataContext.categories);
      setIsLoading(false)
    }
  }, [dataContext.categories])

  return (
    <>
      <Toolbar
        start={
          <h2 className="font-bold text-xl">
            Categories
          </h2>
        }
        end={<CategoryModal isCreate />}
      />
      <DataTable
        loading={isLoading}
        value={categories}
      >
        <Column
          header="title"
          field="title"
        >
        </Column>
        <Column
          header="is fixed"
          field="is_fixed"
        >
        </Column>
        <Column
          header="notes"
          field="notes"
        >
        </Column>
        <Column align='right' body={EditButton}></Column>
        <Column headerClassName='w-px' body={DeleteButton}></Column>
      </DataTable>
    </>
  );
};

export default Categories;