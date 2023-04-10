import Modal from 'react-modal';
import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/EditContentModal.module.css';
import Strapi from 'strapi-sdk-javascript';
import { MoonLoader, PulseLoader } from 'react-spinners';
import { useSnackbar } from 'notistack';
import axios from 'axios';

Modal.setAppElement('#__next');

const EditContentModal = ({ isOpen, onClose, onSubmit, itemId, onUpdated }) => {
    const [itemData, setItemData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
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
                onClose();
                onUpdated();
                enqueueSnackbar('แก้ไขข้อมูลสำเร็จ', {
                    variant: 'success',
                    style: { fontFamily: 'Lato, "Noto Sans Thai", sans-serif' },
                    fontSize: '18px'
                });
            }
        } catch (error) {
            console.error('Error:', error.message);
            enqueueSnackbar(`เกิดข้อผิดพลาด : ${error.message}`, {
                variant: 'error',
                style: { fontFamily: 'Lato, "Noto Sans Thai", sans-serif' },
                fontSize: '20px'
            });
        }
    };





    const fetchData = async (itemId, token, setItemData) => {
        try {
            // Set a timeout of 500ms to delay the response
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response = await axios.get(`http://localhost:1337/api/apps/${itemId}?populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setItemData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    const hasFetchedDataRef = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (isOpen && itemId && !hasFetchedDataRef.current) {
            setIsDataLoading(true);
            fetchData(itemId, token, setItemData).then(() => setIsDataLoading(false));
            hasFetchedDataRef.current = true;
        }
    }, [isOpen, itemId, setItemData, setIsDataLoading]);


    useEffect(() => {
        if (!isOpen) {
            setFormData({
                title: '',
                description: '',
                image: null
            });
            setItemData(null);
            hasFetchedDataRef.current = false;
        }
    }, [isOpen, setFormData]);



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
                                        <MoonLoader color={"#123abc"} className={styles.loadingimage} />
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
                    <div className={styles.inputContainer}>
                        <label>
                            Title:
                            {isDataLoading ? (
                                <PulseLoader color={"#123abc"} size={8} margin={4} />
                            ) : (
                                itemData && (
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title || itemData.data.attributes.title}
                                        onChange={handleInputChange}
                                    />
                                )
                            )}
                        </label>
                    </div>
                    <div className={styles.textareaContainer}>
                        <label>
                            Description:
                            {isDataLoading ? (
                                <PulseLoader color={"#123abc"} size={8} margin={4} />
                            ) : (
                                itemData && (
                                    <textarea
                                        name="description"
                                        value={
                                            formData.description ||
                                            itemData.data.attributes.description
                                        }
                                        onChange={handleInputChange}
                                    />
                                )
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
};

export default EditContentModal;