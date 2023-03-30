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
import { Button } from '@mui/material';
import CreateDataModal from '../pages/AddContentModal'
import EditContentModal from '../pages/EditContentModal'
import Modal from 'react-modal';
import styles from '../styles/LoginModal.module.css';
import { useRouter } from 'next/router';
import LoginModal from '../pages/loginModal';

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
    const router = useRouter();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const openEditModal = (itemId) => {
        setSelectedItemId(itemId);
        setIsEditModalOpen(true);
    };

    const handleCloseModals = () => {
        setSelectedItemId(null);
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:1337/api/apps?populate=*', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (Array.isArray(response.data.data)) {
                    setData(response.data.data);
                    console.log('response data:', data);
                } else {
                    console.log('Invalid response data:', response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <SnackbarProvider maxSnack={3}>
                <div className={styles.Container}>
                    <LoginModal />
                    <h1 className={styles.Textheader}>ข้อมูลทั้งหมด</h1>
                    <button className={styles.AddBtn} onClick={openCreateModal}>Add content + </button>
                    <CreateDataModal isOpen={isCreateModalOpen} onClose={() => handleCloseModals(false)} />
                    <div className={styles.TablePosition}>
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
                                    {data.map((item) => (
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
                                            <StyledTableCell>{new Date(item.attributes.createdAt).toLocaleDateString()}</StyledTableCell>
                                            <StyledTableCell>{new Date(item.attributes.updatedAt).toLocaleDateString()}</StyledTableCell>
                                            <StyledTableCell>{new Date(item.attributes.publishedAt).toLocaleDateString()}</StyledTableCell>
                                            <StyledTableCell>
                                                <StyledTableCells>
                                                    <EditButton onClick={() => openEditModal(item.id)}>Edit</EditButton>
                                                    <DeleteButton>Delete</DeleteButton>
                                                </StyledTableCells>
                                                <EditContentModal isOpen={isEditModalOpen} onClose={handleCloseModals} itemId={selectedItemId} />
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
