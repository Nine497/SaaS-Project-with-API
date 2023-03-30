import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/EditContentModal.module.css';
import Strapi from 'strapi-sdk-javascript';
import { SyncLoader } from 'react-spinners';

Modal.setAppElement('#__next');

const EditContentModal = ({ isOpen, onClose, onSubmit, itemId }) => {
    const [itemData, setItemData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [formData, setFormData] = useState({
        image: itemData?.image || '',
        title: itemData?.title || '',
        description: itemData?.description || '',
    });
    const [hovered, setHovered] = useState(false);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const handleImageChange = (event) => {
        setFormData({
            ...formData,
            image: event.target.files[0], // set image to the selected file
        });
    };

    const strapi = new Strapi('http://localhost:1337');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiUrl = 'http://localhost:1337/api';
        const token = localStorage.getItem('token');
        const { image, title, description } = formData;
        try {
            // Upload new image
            let imageUploaded = false;
            let imageId = itemData.data.attributes.img.data.id;
            let formDataToSend = new FormData();
            if (image) {
                const formData = new FormData();
                formData.append('files', image);
                const uploadConfig = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                };
                const response = await fetch(`${apiUrl}/upload`, uploadConfig);
                const data = await response.json();
                formDataToSend.append('data.image', data[0].id);
                imageUploaded = true;
            } else {
                formDataToSend.append('data.image', imageId);
            }

            const { data: currentItemData } = await fetch(`${apiUrl}/apps/${itemId}?populate=*`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(response => response.json());

            const currentTitle = currentItemData.attributes.description;
            const currentDescription = currentItemData.attributes.description;

            if (formData.title && formData.title !== currentTitle) {
                formDataToSend.append('data.title', formData.title);
            } else {
                formDataToSend.append('data.title', currentTitle);
            }

            if (formData.description && formData.description !== currentDescription) {
                formDataToSend.append('data.description', formData.description);
            } else {
                formDataToSend.append('data.description', currentDescription);
            }

            const entryData = {
                data: {
                    title: formDataToSend.get('data.title'),
                    description: formDataToSend.get('data.description'),
                    img: {
                        id: formDataToSend.get('data.image'),
                    },
                },
            };

            const updateConfig = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entryData),
            };

            const response = await fetch(`${apiUrl}/apps/${itemId}`, updateConfig);
            const updatedItemData = await response.json();
            console.log(updatedItemData);

            if (updatedItemData) {
                console.log('Success');
                onClose();
                if (imageUploaded && currentItemData.image) {
                    await fetch(`${apiUrl}/apps/${itemId}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ image: null }),
                    });
                    await fetch(`${apiUrl}/upload/files/${currentItemData.image.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };





    const [hasFetchedItemData, setHasFetchedItemData] = useState(false);

    const fetchItemData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:1337/api/apps/${itemId}?populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            setItemData(data);
            setHasFetchedItemData(true);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setIsDataLoading(false);
            }, 500);
        }
    };



    useEffect(() => {
        if (isOpen && itemId && !hasFetchedItemData) {
            setIsDataLoading(true);
            fetchItemData();
        }
    }, [isOpen, itemId, hasFetchedItemData]);


    if (onClose && hasFetchedItemData) {
        setHasFetchedItemData(false);
        setFormData({
            title: '',
            description: '',
            image: null // set image state to null when modal is closed
        });
    }

    if (!isOpen || !itemData) {
        return null;
    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <>
                <h2 className={styles.header}>Edit Content</h2>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className={styles.imgBox}>
                        <label>
                            Image:
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange} // add onChange handler for image
                            />
                            <div className={styles.imagePreview}>
                                {isDataLoading ? (
                                    <div className={styles.loading}>
                                        <SyncLoader color={"#123abc"} className={styles.loadingimage} />
                                    </div>
                                ) : (
                                    (formData.image ? (
                                        <img
                                            src={URL.createObjectURL(formData.image)}
                                            alt="selected"
                                            className={styles.imgselected}
                                        />
                                    ) : itemData?.data?.attributes?.img?.data?.attributes?.url ? (
                                        <img
                                            src={`http://localhost:1337${itemData.data.attributes.img.data.attributes.url}`}
                                            alt="default"
                                            className={styles.imgselected}
                                        />
                                    ) : (
                                        <div>No image available</div>
                                    ))
                                )}
                            </div>
                        </label>
                    </div>
                    <div>
                        <label>
                            Title:
                            {itemData && (
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title || itemData.data.attributes.title} // add value attribute
                                    onChange={handleInputChange} // add onChange handler
                                />
                            )}
                        </label>
                    </div>
                    <div>
                        <label>
                            Description:
                            {itemData && (
                                <textarea
                                    name="description"
                                    value={
                                        formData.description ||
                                        itemData.data.attributes.description
                                    } // add value attribute
                                    onChange={handleInputChange} // add onChange handler
                                />
                            )}
                        </label>
                    </div>
                    <div>
                        <button
                            type="submit"
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            Save Changes
                        </button>
                        <button type="button" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </form>
            </>
        </Modal>
    );
}

export default EditContentModal;