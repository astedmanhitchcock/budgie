import { MouseEvent, ReactComponentElement, ReactNode, useEffect, useState } from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { useDataContext } from '../App';
import { useUiContext } from '../App';

interface IEditModal {
  [key: string]: string | number | boolean | object | Date | ReactNode | undefined,
  type: 'transaction' | 'category' | 'budget',
  children: ReactNode,
  isCreate?: boolean,
  onClose?: Function
}

const EditModal: React.FC<IEditModal> = ({ children, isCreate, onClose, type }) => {
  const dataContext: any = useDataContext();
  const uiContext: any = useUiContext();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const dialogHeader = () => {
    const title = isCreate ? `Create a new ${type}` : `Edit ${type}`
    return title;
  }

  const handleClick = () => {
    setIsVisible(!isVisible)
  }

  useEffect(() => {
    if (!isVisible && onClose) {
      onClose()
    }
  }, [isVisible])

  useEffect(() => {
    setIsVisible(false)
  }, [dataContext])

  return (
    <>
      {isCreate ? (
        <Button 
          aria-label={`create ${type}`}
          icon="pi pi-plus"
          label={!uiContext.isMobile ? `create ${type}` : undefined}
          onClick={handleClick}
        />
      ) : (
        <Button 
          aria-label={`edit ${type}`}
          icon="pi pi-pencil"
          severity="secondary"
          onClick={handleClick}
        /> 
      )}
      <Dialog
        header={dialogHeader}
        visible={isVisible}
        className="w-screen md:w-[50vw] max-w-[400px]"
        onHide={() => setIsVisible(false)}
      >
        { children }
      </Dialog>
    </>
  )

}

export default EditModal;