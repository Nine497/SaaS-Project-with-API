import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

const EditContentModal = ({ isOpen, onClose, onSubmit, data = { image: '', title: '', description: '' } }) => {
    const [formData, setFormData] = useState({
        image: data.image,
        title: data.title,
        description: data.description,
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
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            formDataToSend.append('files.image', formData.image);
            formDataToSend.append('data.title', formData.title);
            formDataToSend.append('data.description', formData.description);
            const options = {
                method: 'PUT',
                body: formDataToSend,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await fetch(`http://localhost:1337/api/apps/${data.id}`, options);
            if (response.ok) {
                onClose();
            } else {
                console.error(`HTTP error: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '500px',
                    height: '22rem',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
                    padding: '20px',
                },
            }}
        >
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Edit Content</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>
                        Image:
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            style={{ width: '100%', padding: '5px' }}
                            onChange={handleImageChange} // add onChange handler for image
                        />
                        {formData.image && <img src={URL.createObjectURL(formData.image)} alt="selected" style={{ width: '100%', marginTop: '5px' }} />} {/* display the selected image */}
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>
                        Title:
                        <input
                            type="text"
                            name="title"
                            style={{ width: '100%', padding: '5px' }}
                            value={formData.title} // add value attribute
                            onChange={handleInputChange} // add onChange handler
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>
                        Description:
                        <textarea
                            name="description"
                            style={{ width: '100%', padding: '5px', minHeight: '100px' }}
                            value={formData.description} // add value attribute
                            onChange={handleInputChange} // add onChange handler
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    style={{
                        backgroundColor: hovered ? 'red' : 'blue',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    Submit
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
                    }}
                >
                    Close
                </button>
            </form>
        </Modal>
    );
}

export default EditContentModal;