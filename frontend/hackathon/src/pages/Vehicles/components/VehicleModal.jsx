import React from 'react';
import Modal from '../../../components/ui/Modal';
import VehicleForm from './VehicleForm';

const VehicleModal = ({ isOpen, onClose, onSubmit, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Vehicle">
      <VehicleForm onSubmit={onSubmit} onCancel={onClose} loading={loading} />
    </Modal>
  );
};

export default VehicleModal;
