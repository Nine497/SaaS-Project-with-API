import Modal from 'react-modal';
import React, { useState } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import styles from '../styles/DeleteContent.module.css';
import { useSnackbar } from 'notistack';

Modal.setAppElement('#__next');

const DeleteContent = ({ isOpen, onClose, itemId, itemTitle, onDeleted }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await axios.delete(`http://localhost:1337/api/apps/${itemId}`);
            onClose();
            onDeleted();
            enqueueSnackbar('ลบข้อมูลสำเร็จ', {
                variant: 'success',
                style: { fontFamily: 'Lato, "Noto Sans Thai", sans-serif' },
                fontSize: '20px'
            });
            setIsDeleting(false);
        } catch (error) {
            console.error(error);
            enqueueSnackbar(`เกิดข้อผิดพลาด : ${error}`, {
                variant: 'error',
                style: { fontFamily: 'Lato, "Noto Sans Thai", sans-serif' },
                fontSize: '20px'
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className={styles.modal} overlayClassName={styles.overlay}>
            <div className={styles.modalContent}>
                <h2 className="delete-title">Confirm Deletion</h2>
                {itemTitle ? (
                    <>
                        <p className="delete-message">Are you sure you want to delete?</p>
                        <p className="delete-item">ID: {itemId} "{itemTitle}"</p>
                    </>
                ) : (
                    <div className={styles.loaderContainer}>
                        <SyncLoader color="#0074D9" />
                    </div>
                )}
                <div className={styles.buttonContainer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={`${styles.deleteButton} ${isDeleting ? styles.disabled : ''}`}
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <SyncLoader color="#fff" /> : 'Delete'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteContent;
