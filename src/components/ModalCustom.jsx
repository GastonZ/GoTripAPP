import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { XCircleIcon } from '@heroicons/react/20/solid';

const modalVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  }
};

const ModalCustom = ({
  heigth, width, radius, children, modalState, handleModalClose,
  backgroundColor, hideCloseIcon, overflow, introText
}) => {

  // 🔹 Mueve la pantalla hacia arriba cuando se abre el modal
  useEffect(() => {
    if (modalState) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [modalState]);

  const customModalStyles = {
    content: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      right: "auto",
      bottom: "auto",
      border: "1px solid #d1d5db",
      borderColor: 'red',
      background: "#4896DF",
      borderRadius: radius,
      padding: "0",
      transition: "none",
      minWidth: 400,
      zIndex: 1000,
    },
    overlay: {
      zIndex: 999,
      backgroundColor: "rgba(0, 0, 0, 0.5)", 
    }
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={modalState}
      style={customModalStyles}
      onRequestClose={handleModalClose}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      closeTimeoutMS={250}
      aria={{
        labelledby: "heading_modal",
        describedby: "body_modal",
      }}
      overlayClassName="modal-overlay"
    >
      <motion.div
        className={`modal-container  relative w-full ${!overflow ? 'overflow-hidden' : ''} ${heigth} ${width ? width : "md:w-130"} px-2 my-6 mx-auto`}
        variants={modalVariants}
        initial="hidden"
        animate={modalState ? "visible" : "hidden"}
      >
        <div className='px-6 py-4'>
          <p className='font-semibold text-white text-2xl'>{introText}</p>
          {!hideCloseIcon && (
            <div className="flex justify-end" id="heading_modal">
              <button className="focus:outline-none" onClick={handleModalClose}>
                <XCircleIcon className='w-10 h-10'/>
              </button>
            </div>
          )}
          <div className="relative flex-auto" id="body_modal">
            <div className="flex flex-col justify-center items-center h-full">{children}</div>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ModalCustom;
