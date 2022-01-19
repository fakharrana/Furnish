import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmation = (props) => {
  return (
    <Modal show={props.displayModal} onHide={props.cancelModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Delete Confirmation</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger">{props.message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.cancelModal()}>
          Cancel
        </Button>

        {props.type === "product" ? (
          <Button
            variant="danger"
            onClick={() =>
              props.confirmModal(
                props.productDetails.id,
                props.productDetails.thumbnail,
                props.productDetails.image1,
                props.productDetails.image2,
                props.productDetails.image3,
                props.productDetails.model
              )
            }
          >
            Delete
          </Button>
        ) : props.type === "deleteall" ? (
          <Button variant="danger" onClick={() => props.deleteAll()}>
            Delete
          </Button>
        ) : (
          <Button
            className="model-delete-button"
            variant="danger"
            onClick={() => props.confirmModal(props.id)}
          >
            Delete
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmation;
