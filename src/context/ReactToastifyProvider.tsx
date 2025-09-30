import React, { Fragment } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';

export const ReactToastifyProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Fragment>
      <ToastContainer
        pauseOnHover={true}
        closeOnClick={true}
        draggable={true} 
      />
      {children}
    </Fragment>
  );
};