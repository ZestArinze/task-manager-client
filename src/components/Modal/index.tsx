import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type InfoModalProps = {
  show: boolean;
  handleClose: () => any;
  message?: string | null;
  handleOk?: () => any;
};
export const InfoModal: React.FC<InfoModalProps> = ({
  show,
  message,
  handleClose,
  handleOk,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className='text-center'>{message ?? ''}</Modal.Body>

      <div className='d-flex justify-content-between p-4'>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>

        {handleOk && (
          <Button variant='secondary' onClick={handleOk}>
            OK
          </Button>
        )}
      </div>
    </Modal>
  );
};

type ContainerModalProps = {
  show: boolean;
  handleClose: () => any;
  children: React.ReactNode;
};
export const ContainerModal: React.FC<ContainerModalProps> = ({
  show,
  handleClose,
  children,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className=''>{children}</Modal.Body>

      <div className='d-flex justify-content-center p-4'>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};
