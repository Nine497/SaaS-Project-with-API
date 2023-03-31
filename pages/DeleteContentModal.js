import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Strapi from 'strapi-sdk-javascript';
import { SyncLoader } from 'react-spinners';
import styles from '../styles/DeleteContent.module.css';

Modal.setAppElement('#__next');

const DeleteContent = ({ isOpen, onClose, itemId }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemTitle, setItemTitle] = useState('');
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const fetchItemTitle = async () => {
        try {
            const response = await fetch(`http://localhost:1337/api/apps/${itemId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch item title');
            }
            const dataTitle = await response.json();
            setItemTitle(dataTitle.data.attributes.title);
        } catch (error) {
            console.error(error);
        }
        setIsDataLoading(false);
        setIsFetching(false);
    };

    useEffect(() => {
        if (isOpen && itemId && isDataLoading) {
            setIsFetching(true);
            fetchItemTitle();
        }
    }, [isOpen, itemId, isDataLoading]);

    useEffect(() => {
        if (onClose && itemId) {
            setIsDataLoading(true);
        }
    }, [onClose, itemId]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await axios.delete(`http://localhost:1337/api/apps/${itemId}`);
            onClose();
            location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className={styles.modal} overlayClassName={styles.overlay}>
            <div className={styles.modalContent}>
                <h2>Confirm Deletion</h2>
                {isDataLoading ? (
                    <div className={styles.loaderContainer}>
                        <SyncLoader color="#0074D9" />
                    </div>
                ) : (
                    <>
                        <p>Are you sure you want to delete "{itemTitle}"?</p>
                    </>
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
