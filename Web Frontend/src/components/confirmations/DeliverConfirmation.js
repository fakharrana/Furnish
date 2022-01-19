import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeliverConfirmation = (props) => {
  return (
    <Modal show={props.displayModal} onHide={props.cancelModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Deliver Confirmation</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-success">{props.message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => props.cancelModal()}>
          Cancel
        </Button>
        <Button variant="success" onClick={() => props.confirmModal(props.id)}>
          Deliver
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeliverConfirmation;
