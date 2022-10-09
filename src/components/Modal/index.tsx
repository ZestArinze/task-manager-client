import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

type Props = {
  show: boolean;
  handleClose: () => any;
  message?: string | null;
};

export const InfoModal: React.FC<Props> = ({ show, message, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className='text-center'>{message ?? ''}</Modal.Body>

      <div className='d-flex justify-content-center p-4'>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};
