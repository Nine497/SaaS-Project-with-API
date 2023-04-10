import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import React, { useState, useEffect } from 'react';
import styles from '../styles/EditContentModal.module.css';
import Strapi from 'strapi-sdk-javascript';
import { SyncLoader } from 'react-spinners';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';

Modal.setAppElement('#__next');

const EditContentModal = ({ isOpen, onClose, onSubmit, itemId, onUpdated }) => {
    const [itemData, setItemData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [oldItemId, setOldItemId] = useState(null);
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
        const file = e.target.files[0];
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to change the image to ${file.name}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData({ ...formData, image: file });
            }
        })
    };

    const strapi = new Strapi('http://localhost:1337');

    const handleSubmit = async (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'คุณแน่ใจไหม ?',
            text: "คุณจะเปลี่ยนกลับไม่ได้ !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            confirmButtonColor: '#dc3545',
            cancelButtonText: 'ยกเลิก',
            cancelButtonColor: '#0074d9',
        }).then(async (result) => {
            if (result.isConfirmed) {
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
                }
                catch (error) {
                    console.error('Error:', error.message);
                    enqueueSnackbar(`เกิดข้อผิดพลาด : ${error.message}`, {
                        variant: 'error',
                        style: { fontFamily: 'Lato, "Noto Sans Thai", sans-serif' },
                        fontSize: '20px'
                    });
                }
            }
        }
        )
    };






    useEffect(() => {
        console.log("fetchData called");
        const fetchData = async () => {
            setIsDataLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:1337/api/apps/${itemId}?populate=*`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const result = await response.json();
                setItemData(result);
                console.log(result);
                setIsDataLoading(false);
                return;
            } catch (error) {
                console.error(error);
                setIsDataLoading(false);
            }
        };

        if (isOpen && itemId) {
            fetchData();
        }
    }, [isOpen, itemId]);

    useEffect(() => {
        setOldItemId(itemId);
    }, [itemId]);

    useEffect(() => {
        if (onClose) {
            setFormData({
                title: '',
                description: '',
                image: null,
            });
        }
    }, [onClose]);

    if (!isOpen || !itemData) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} toggle={onClose}>
            <ModalHeader toggle={onClose}>Edit Content</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Image:</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <div>
                            {isDataLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <div>
                                    {formData.image ? (
                                        <img
                                            src={URL.createObjectURL(formData.image)}
                                            alt="selected"
                                            className="img-fluid"
                                        />
                                    ) : itemData?.data?.attributes?.img?.data?.attributes?.url ? (
                                        <img
                                            src={`http://localhost:1337${itemData.data.attributes.img.data.attributes.url}`}
                                            alt="default"
                                            className="img-fluid"
                                        />
                                    ) : (
                                        <div>No image available</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label>Title:</label>
                        {itemData && (
                            <input
                                type="text"
                                name="title"
                                value={formData.title || itemData.data.attributes.title}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                    <div>
                        <label>Description:</label>
                        {itemData && (
                            <textarea
                                name="description"
                                value={
                                    formData.description ||
                                    itemData.data.attributes.description
                                }
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>{" "}
                <Button color="secondary" onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default EditContentModal;