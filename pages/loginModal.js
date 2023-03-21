import React, { useState, useEffect } from 'react';
import styles from '../styles/LoginModal.module.css';
import { GrClose } from 'react-icons/gr';
import { BiLogIn } from 'react-icons/bi';
import strapi, { login, getCurrentUser } from '../pages/api/Strapi';
import { useSnackbar } from 'notistack';
import ForgotPasswordForm from '../pages/ForgotPasswordForm';
import Dropdown from '../pages/userMenu';

const LoginModal = ({ handleClose }) => {
    const [isOpen, setModalIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState([]);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const handleOpen = () => setModalIsOpen(true);
    const handleCloseModal = () => setModalIsOpen(false);
    const handleFormClick = (e) => e.stopPropagation();

    const handleForgotPasswordClick = () => {
        setForgotPasswordOpen(true);
        handleCloseModal();
    };

    const handleBackClick = () => {
        setForgotPasswordOpen(false);
        setModalIsOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            const token = response.jwt;

            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            setModalIsOpen(false);
            setUsername('');
            setPassword('');
            // Call getCurrentUser with the token to get the current user
            const user = await getCurrentUser(token);
            sessionStorage.setItem('username', user.username);
            setUsername(user.username);
            enqueueSnackbar(`${user.username} เข้าสู่ระบบ`, {
                variant: 'success', style: {
                    fontFamily: 'Lato, "Noto Sans Thai", sans-serif',
                    fontSize: '18px'
                }
            });
            setError(null);
        } catch (error) {
            setError(error.message);
            enqueueSnackbar('อีเมลหรือรหัสผ่านไม่ถูกต้อง', {
                variant: 'error', style: {
                    fontFamily: 'Lato, "Noto Sans Thai", sans-serif',
                    fontSize: '18px'
                }
            });
        }
    };

    const checkSession = () => {
        if (!sessionStorage.username || !localStorage.token) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            enqueueSnackbar('You need to log in first.', {
                variant: 'error',
                action: () => (
                    <Button color="inherit" onClick={() => push('/')}>
                        Go to index
                    </Button>
                ),
            });
        }
    };

    useEffect(() => {
        checkSession();
        if (isOpen || forgotPasswordOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [isOpen, forgotPasswordOpen]);


    return (
        <div className={styles.font}>
            {isLoggedIn ? (
                <Dropdown />
            ) : (
                <button className={styles.loginBtn} onClick={handleOpen}>
                    Login
                </button>
            )
            }
            {
                isOpen ? (
                    <div className={styles.modalBackdrop} onClick={handleCloseModal}>
                        <div className={styles.modal} onClick={handleFormClick}>
                            <h2 style={{ display: 'flex', alignItems: 'center', fontSize: '24px' }}>เข้าสู่ระบบ <BiLogIn style={{ marginLeft: '10px' }} /></h2>
                            <hr style={{ marginTop: '10px', marginBottom: '5px', border: '0', borderTop: '1px solid #ccc' }} />
                            <form className={styles.formLog} onSubmit={handleSubmit}>
                                {error && <p className={styles.error}>{error}</p>}
                                <label>
                                    E-mail :
                                    <input type="email" className={styles.inputField} value={username} onChange={(e) => setUsername(e.target.value)} />
                                </label>
                                <label>
                                    Password :
                                    <input type="password" className={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)} />
                                </label>
                                <button type="submit" className={styles.submitBtn}>ยืนยัน</button>
                                <button className={styles.closeBtn} onClick={handleCloseModal}>
                                    <GrClose />
                                </button>
                                <a className={styles.forgotpassbtn} onClick={handleForgotPasswordClick}>ลืมรหัสผ่าน ?</a>
                            </form>
                        </div>
                    </div>
                ) : (
                    forgotPasswordOpen ?
                        <ForgotPasswordForm handleClose={handleClose} handleBackClick={handleBackClick} forgotPasswordOpen={forgotPasswordOpen} isOpen={isOpen} />
                        : null
                )
            }
        </div >
    );
}
export default LoginModal;