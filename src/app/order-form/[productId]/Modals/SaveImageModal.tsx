import React, { ReactElement, useState, ChangeEvent } from "react";
import { Button, Modal, Form } from "react-bootstrap";

interface Props {
  saveDesignFunction: (
    format: string,
    fileName?: string,
    includeBackground?: boolean
  ) => string; // Debería devolver la imagen en base64
  setCustomImage: (image: string | null) => void;
}

function SaveImageModal({ saveDesignFunction, setCustomImage }: Props): ReactElement {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState("jpg");
  const [includeBackground, setIncludeBackground] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.name);
  };

  const handleSave = () => {
    // Llamamos a la función para guardar el diseño en vez de descargarlo
    const savedImageBase64 = saveDesignFunction(selected, "tshirt", includeBackground);

    // Guardamos la imagen en localStorage para que esté disponible
    localStorage.setItem("customImage", savedImageBase64);

    // Actualizamos el estado para mostrar la imagen en el modal del pedido
    setCustomImage(savedImageBase64);

    handleClose();
  };

  return (
    <>
      <Button className="" style={{ width: '90%' }} variant="primary" onClick={handleShow}>
        <i className="fas fa-image mr-1"></i>
        Save Design
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Form>
            <Form.Label>Export as: </Form.Label>
            <div key="inline-radio" className="mb-3">
              <Form.Check
                inline
                type="radio"
                label="jpg"
                name="jpg"
                checked={selected === "jpg"}
                onChange={handleOnChange}
              />
              <Form.Check
                inline
                type="radio"
                label="png"
                name="png"
                checked={selected === "png"}
                onChange={handleOnChange}
              />
              <Form.Check
                inline
                type="checkbox"
                label="Include Background"
                name="includeBackground"
                checked={includeBackground}
                onChange={() => {
                  setIncludeBackground(!includeBackground);
                }}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SaveImageModal;
