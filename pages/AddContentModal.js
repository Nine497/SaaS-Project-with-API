import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from '../styles/AddContentModal.module.css';

Modal.setAppElement('#__next');

const AddContentModal = ({ isOpen, onClose, onSubmit }) => {
    const [hovered, setHovered] = useState(false);
    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const [formData, setFormData] = useState({
        image: null,
        title: '',
        description: ''
    });


    function handleImageChange(event) {
        setFormData({
            ...formData,
            image: event.target.files[0]
        });
    }

    function handleInputChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    async function uploadEntry(entryData) {
        const { image, title, description } = entryData;
        const apiUrl = 'http://localhost:1337/api';
        const token = localStorage.getItem('token');

        try {
            // Upload image
            const formData = new FormData();
            formData.append('files', image);
            const uploadConfig = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            };
            const uploadResponse = await fetch(`${apiUrl}/upload`, uploadConfig);
            const uploadedFile = await uploadResponse.json();
            // Create entry with image file and text
            const entryData = {
                data: {
                    title,
                    description,
                    img: {
                        id: uploadedFile[0].id,
                    },
                },
            };

            const createConfig = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entryData),
            };
            const createResponse = await fetch(`${apiUrl}/apps`, createConfig);
            const createdEntry = await createResponse.json();
            console.log('Entry created:', createdEntry);
            window.location.reload();
            return createdEntry;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error(error);
        }
    }






    function handleSubmit(event) {
        event.preventDefault();
        uploadEntry(formData);
    }












    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
        >
            <h2 className={styles.header}>Add Content</h2><hr />
            <form onSubmit={handleSubmit}>
                <div className={styles.imgBox}>
                    <label>
                        Image :
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <div className={styles.imagePreview}>
                            {formData.image && (
                                <>
                                    <img
                                        src={URL.createObjectURL(formData.image)}
                                        alt="selected"
                                        className={styles.imgselected}
                                    />
                                </>
                            )}
                            {!formData.image && (
                                <div style={{ marginTop: '5px' }}>Upload Image here</div>
                            )}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange} // add onChange handler
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange} // add onChange handler
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={onClose}
                >
                    Close
                </button>
            </form>
        </Modal>
    );
}

export default AddContentModal;




