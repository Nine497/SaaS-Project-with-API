import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/table.module.css';
import Strapi from 'strapi-sdk-javascript';

Modal.setAppElement('#__next');

const EditContentModal = ({ isOpen, onClose, onSubmit, itemId }) => {
    const [itemData, setItemData] = useState(null);
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
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            if (formData.image) {
                formDataToSend.append('files.image', formData.image, formData.image.name);
                const responseIMG = await axios({
                    method: 'POST',
                    url: 'http://localhost:1337'
                })
            }
            if (!formData.title && !formData.description) {
                throw new Error('Please provide either a title or a description');
            }
            if (formData.title) {
                formDataToSend.append('data.title', formData.title);
            } else {
                formDataToSend.append('data.title', itemData.data.attributes.title);
            }
            if (formData.description) {
                formDataToSend.append('data.description', formData.description);
            } else {
                formDataToSend.append('data.description', itemData.data.attributes.Description);
            }

            const response = await strapi.updateEntry('collectionType', itemId, {
                title: formDataToSend.get('data.title'),
                Description: formDataToSend.get('data.description'),
                image: formDataToSend.get('files.image'),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log('Success');
                onClose();
                location.reload();
            } else {
                console.error(`HTTP error: ${response.status}`);
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
            console.log(itemData);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (isOpen && itemId && !hasFetchedItemData) {
            console.log(itemId);
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
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: '1000',
                },
                content: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto',
                    height: '90vh',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
                    padding: '20px',
                    backgroundColor: '#f1f1f1', // new background color
                },
            }}
        >
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Edit Content</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{
                        display: 'block', fontFamily: 'Noto Sans Thai, sans-serif',
                    }}>
                        Image:
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            style={{
                                width: '100%', padding: '5px', fontFamily: 'Noto Sans Thai, sans-serif'
                            }}
                            onChange={handleImageChange} // add onChange handler for image
                        />
                        {formData.image
                            ? <img src={URL.createObjectURL(formData.image)} alt="selected" style={{ width: '100%', marginTop: '5px' }} />
                            : itemData?.data?.attributes?.img?.data?.attributes?.url
                                ? <img src={`http://localhost:1337${itemData.data.attributes.img.data.attributes.url}`} alt="default" style={{ width: '100%', marginTop: '5px' }} />
                                : <div>No image available</div>
                        } {/* display the selected image or the default image */}
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontFamily: 'Noto Sans Thai, sans-serif' }}>
                        Title:
                        {itemData && (
                            <input
                                type="text"
                                name="title"
                                style={{ width: '100%', padding: '5px', fontFamily: 'Noto Sans Thai, sans-serif', fontSize: '18px' }}
                                value={formData.title || itemData.data.attributes.title} // add value attribute
                                onChange={handleInputChange} // add onChange handler
                            />
                        )}
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontFamily: 'Noto Sans Thai, sans-serif' }}>
                        Description:
                        {itemData && (
                            <textarea
                                name="description"
                                style={{ width: '100%', padding: '5px', minHeight: '100px', fontFamily: 'Noto Sans Thai, sans-serif', fontSize: '13px' }}
                                value={formData.description || itemData.data.attributes.description} // add value attribute
                                onChange={handleInputChange} // add onChange handler
                            />
                        )}
                    </label>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#ff6f61',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            fontFamily: 'Noto Sans Thai, sans-serif',
                            position: 'relative',
                            overflow: 'hidden',
                            marginRight: '30px'
                        }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            backgroundColor: 'gray',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '10px',
                            fontFamily: 'Noto Sans Thai, sans-serif'
                        }}
                    >
                        Close
                    </button>
                </div>
            </form>
        </Modal >
    );
}

export default EditContentModal;