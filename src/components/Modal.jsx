import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ children, modalIsOpen, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (modalIsOpen === true) {
      dialog.current.showModal();
    } else if (modalIsOpen === false) {
      dialog.current.close();
    }
  }, [modalIsOpen]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
