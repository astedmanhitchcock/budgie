import { MouseEvent, useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import EditModal from "./EditModal";

import { useDataContext } from '../App';
import { BudgetsService } from '../services/BudgetsService';

export interface IBudgetForm {
  [key: string]: string | number | boolean | Date | undefined,
  name?: string,
}

const BudgetModal: React.FC<any> = ({ budget }) => {
  const initalFormValue: IBudgetForm = budget || {
    name: '',
  }

  const [formData, setFormData] = useState<IBudgetForm>(initalFormValue)
  const [formErrors, setFormErrors] = useState<string[]>([])

  const handleFieldUpdate = (value: any, fieldName: string) => {
    const data: {[key: string]: any} = {...formData}
    data[fieldName] = value;
    setFormData(data);
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // const isValid = validateForm();
    console.log('form data : ', formData)

    // if (isValid) {
    //   let categories;
    //   if (isCreate) {
    //     categories = await CategoriesService.create(formData)
    //   } else {
    //     categories = await CategoriesService.update(formData)
    //   }

    //   if (categories) {
    //     dataContext.setCategories(categories)
    //   }
    // }
  }

  return (
    <EditModal type="budget">
      <form>
        <div className="p-float-label my-5">
        <InputText
            id='name'
            className={classNames('w-full', {'p-invalid': formErrors.includes('name')})}
            placeholder='Category Title'
            value={formData?.name}
            onChange={(e) => handleFieldUpdate(e.target.value, 'name')}
          />
          <label htmlFor='name'>Budget Name</label>
        </div>
        <Button
          icon="pi pi-check" 
          severity='secondary'
          onClick={handleSubmit}
          label='create'
        />
      </form>
    </EditModal>
  )
}

export default BudgetModal;
