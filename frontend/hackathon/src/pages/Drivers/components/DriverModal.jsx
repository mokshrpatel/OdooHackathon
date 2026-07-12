import React from 'react';
import Modal from '../../../components/ui/Modal';
import DriverForm from './DriverForm';

const DriverModal = ({ isOpen, onClose, onSubmit, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Driver">
      <DriverForm onSubmit={onSubmit} onCancel={onClose} loading={loading} />
    </Modal>
  );
};

export default DriverModal;
