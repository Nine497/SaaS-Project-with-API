import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { SnackbarProvider } from 'notistack';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import CreateDataModal from '../pages/AddContentModal'
import EditContentModal from '../pages/EditContentModal'
import Modal from 'react-modal';
import styles from '../styles/LoginModal.module.css';
import { useRouter } from 'next/router';
import LoginModal from '../pages/loginModal';
import Swal from 'sweetalert2';

Modal.setAppElement('#__next');


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: 18,
        fontFamily: 'Noto Sans Thai, sans-serif',
        textAlign: 'center'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16,
        fontFamily: 'Noto Sans Thai, sans-serif',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 5,
    },
    '&:hover': {
        backgroundColor: theme.palette.grey[300],
        cursor: 'pointer',
    },
}));

const StyledTableCells = styled(TableCell)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '10px',
    height: '100%',
    width: '100%'
});


const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: '10px',
    padding: '10px 20px',
    boxShadow: 'none',
    fontFamily: 'Noto Sans Thai, sans-serif',
    transition: 'all 0.2s ease-in-out', // Add animation transition
    '&:hover': {
        backgroundColor: theme.palette.primary.main, // Change background color on hover
        color: theme.palette.common.white, // Change text color on hover
        boxShadow: `0px 2px 4px ${theme.palette.grey[500_25]}`, // Add box shadow on hover
        transform: 'translateY(-2px)', // Add animation on hover
    },
}));


const EditButton = styled(StyledButton)(({ theme }) => ({
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
}));

const DeleteButton = styled(StyledButton)(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
}));

function App() {
    const [data, setData] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const { enqueueSnackbar } = useSnackbar();

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const openEditModal = (itemId) => {
        setSelectedItemId(itemId);
        setIsEditModalOpen(true);
    };

    function handleContentChange() {
        fetchData();
    }

    const handleCloseModals = () => {
        setSelectedItemId(null);
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
    };

    const handleConfirmDelete = (itemId) => {
        Swal.fire({
            title: 'ยืนยันการลบ',
            text: `คุณแน่ใจหรือว่าต้องการลบ id : ${itemId} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            confirmButtonColor: '#dc3545',
            cancelButtonText: 'ยกเลิก',
            cancelButtonColor: '#0074d9',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteItem(itemId);
            }
        });
    };

    const deleteItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.delete(`http://localhost:1337/api/apps/${itemId}`, config);
            handleContentChange();
            if (response) {
                enqueueSnackbar('ลบข้อมูลสำเร็จ', {
                    variant: 'success',
                    style: { fontFamily: 'Lato, "Noto Sans Thai", sans-serif' },
                    fontSize: '20px'
                });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar(`เกิดข้อผิดพลาด : ${error}`, {
                variant: 'error',
                style: { fontFamily: 'Lato, "Noto Sans Thai", sans-serif' },
                fontSize: '20px'
            });
        }
    };


    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:1337/api/apps?populate=*', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (Array.isArray(response.data.data)) {
                setData(response.data.data);
                setFilteredData(response.data.data);
                console.log('response data:', data);
            } else {
                console.log('Invalid response data:', response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);
        const filteredItems = searchValue === '' ? data : data.filter((item) =>
            item.id.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
            item.attributes.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.attributes.description.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filteredItems);
    };

    return (
        <>
            <SnackbarProvider maxSnack={3}>
                <div className={styles.Container}>
                    <LoginModal />
                    <h1 className={styles.Textheader}>ข้อมูลทั้งหมด</h1>
                    <button className={styles.AddBtn} onClick={openCreateModal}>Add content + </button>
                    <CreateDataModal isOpen={isCreateModalOpen} onClose={() => handleCloseModals(false)} onCreated={handleContentChange} />
                    <div className={styles.TablePosition}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="ค้นหา"
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    fontSize: '16px',
                                    width: '300px',
                                    marginRight: '10px',
                                    fontFamily: 'Noto Sans Thai, sans-serif',
                                }}
                            />
                        </div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 300 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>ID</StyledTableCell>
                                        <StyledTableCell>img</StyledTableCell>
                                        <StyledTableCell>Title</StyledTableCell>
                                        <StyledTableCell>Description</StyledTableCell>
                                        <StyledTableCell>Created At</StyledTableCell>
                                        <StyledTableCell>Updated At</StyledTableCell>
                                        <StyledTableCell>Published At</StyledTableCell>
                                        <StyledTableCell>Edit</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.map((item) => (
                                        <StyledTableRow key={item.id}>
                                            <StyledTableCell>{item.id}</StyledTableCell>
                                            <StyledTableCell>
                                                <img src={`http://localhost:1337${item.attributes.img.data.attributes.url}`} width="100" height="100" />
                                            </StyledTableCell>
                                            <StyledTableCell style={{ maxWidth: '150px', wordWrap: 'break-word' }}>
                                                {item.attributes.title}</StyledTableCell>
                                            <StyledTableCell style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                                                {item.attributes.description}
                                            </StyledTableCell>
                                            <StyledTableCell>{new Date(item.attributes.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}</StyledTableCell>
                                            <StyledTableCell>{new Date(item.attributes.updatedAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}</StyledTableCell>
                                            <StyledTableCell>{new Date(item.attributes.publishedAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}</StyledTableCell>

                                            <StyledTableCell>
                                                <StyledTableCells>
                                                    <EditButton onClick={() => openEditModal(item.id)}>Edit</EditButton>
                                                    <DeleteButton onClick={() => handleConfirmDelete(item.id)}>Delete</DeleteButton>
                                                </StyledTableCells>
                                                <EditContentModal isOpen={isEditModalOpen} onClose={handleCloseModals} itemId={selectedItemId} onUpdated={handleContentChange} />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div >
            </SnackbarProvider>
        </>
    );
}

export default App;
