import { MouseEvent, ReactComponentElement, useEffect, useState } from 'react';

import { Button } from 'primereact/button';
import { Checkbox } from "primereact/checkbox";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from "primereact/inputtextarea";

import { classNames } from 'primereact/utils';

import EditModal from "./EditModal";

import { useDataContext } from '../App';
import { CategoriesService } from '../services/CategoriesService';


interface ICategoryForm {
  [key: string]: string | number | boolean | Date | undefined,
  title?: string,
  is_fixed?: boolean,
  notes?: string
}

const CategoryModal: React.FC<any> = ({ category, isCreate }) => {
  const initalFormValue: ICategoryForm = category || {
    title: '',
    is_fixed: false,
    notes: ''
  }

  const requiredFields = ['title']

  const [formData, setFormData] = useState<ICategoryForm>(initalFormValue)
  const [formErrors, setFormErrors] = useState<string[]>([])

  const dataContext: any = useDataContext();

  const resetForm = () => {
    setFormData(initalFormValue);
    setFormErrors([])
  }

  const validateForm = () => {
    const errors: string[] = [];
    const formKeys = Object.keys(formData);
    // Check all necessary data is present.
    formKeys.forEach((key: string) => {
      if (!formData[key] && requiredFields.includes(key)) {
        errors.push(key)
      }
    });

    setFormErrors(errors)

    return errors.length < 1;
  }

  const handleFieldUpdate = (value: any, fieldName: string) => {
    const data: {[key: string]: any} = {...formData}
    data[fieldName] = value;
    setFormData(data);
  }

  const handleModalClose = () => {
    resetForm();
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const isValid = validateForm();

    if (isValid) {
      let categories;
      if (isCreate) {
        categories = await CategoriesService.create(formData)
      } else {
        categories = await CategoriesService.update(formData)
      }

      if (categories) {
        dataContext.setCategories(categories)
      }
    }
  }

  return (
    <EditModal
      isCreate={isCreate}
      type='category'
      onClose={handleModalClose}
    >
      <form>
        <div className="p-float-label my-5">
          <InputText
            id='title'
            className={classNames('w-full', {'p-invalid': formErrors.includes('title')})}
            placeholder='Category Title'
            value={formData?.title}
            onChange={(e) => handleFieldUpdate(e.target.value, 'title')}
          />
          <label htmlFor='title'>Category Title</label>
        </div>
        <div className="flex items-center my-3">
          <Checkbox
            inputId='isFixed'
            onChange={() => handleFieldUpdate(!formData?.is_fixed, 'is_fixed')}
            checked={formData?.is_fixed || false}
          />
          <label htmlFor="isFixed" className="ml-2">
            Is this a fixed income category?
          </label>
        </div>
        <div className='p-float-label my-5'>
          <InputTextarea
            id="notes"
            placeholder='Notes'
            className='w-full'
            value={formData?.notes}
            onChange={(e) => handleFieldUpdate(e.target.value, 'notes')}
            rows={5}
          />
          <label htmlFor='notes'>
            Notes
          </label>
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

export default CategoryModal;