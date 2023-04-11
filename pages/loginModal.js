import React, { useState, useEffect } from 'react';
import styles from '../styles/LoginModal.module.css';
import { GrClose } from 'react-icons/gr';
import { BiLogIn } from 'react-icons/bi';
import { login, getCurrentUser } from '../pages/api/strapi';
import { useSnackbar } from 'notistack';
import ForgotPasswordForm from '../pages/ForgotPasswordForm';
import Select from 'react-select';
import { GrUserAdmin } from 'react-icons/gr';
import { useRouter } from 'next/router';
import { HashLoader } from 'react-spinners';

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
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

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
            setIsLoading(true);
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            setModalIsOpen(false);
            setUsername('');
            setPassword('');
            // Call getCurrentUser with the token to get the current user
            const user = await getCurrentUser(token);
            sessionStorage.setItem('session_username', user.username);
            enqueueSnackbar(`${user.username} เข้าสู่ระบบ`, {
                variant: 'success', style: {
                    fontFamily: 'Lato, "Noto Sans Thai", sans-serif',
                    fontSize: '18px'
                }
            });
            setError(null);
            setIsLoading(false);
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


    const IndicatorSeparator = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                <GrUserAdmin />
                <span style={{ width: '1px', height: '12px', backgroundColor: '#ccc', marginLeft: '5px' }} />
            </div>
        );
    };

    function handleEdit() {
        setIsLoading(true);
        router.push('/edit_content').then(() => {
            setIsLoading(false);
        });
    }

    function handleIndex() {
        setIsLoading(true);
        router.push('/').then(() => {
            setIsLoading(false);
        });
    }

    function handleLogout() {
        enqueueSnackbar('ต้องการที่จะออกจากระบบ ?', {
            variant: 'info',
            persist: true,
            action: (key) => (
                <>
                    <button
                        className={styles.notistackbtn}
                        onClick={() => {
                            setIsLoggedIn(false)
                            sessionStorage.clear();
                            localStorage.clear();
                            const cookies = document.cookie.split(";");
                            for (let i = 0; i < cookies.length; i++) {
                                const cookie = cookies[i];
                                const eqPos = cookie.indexOf("=");
                                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            }
                            for (let key in window) {
                                if (window.hasOwnProperty(key) && window[key] instanceof Storage) {
                                    window[key].clear();
                                }
                            }
                            setIsLoading(true);
                            router.push('/').then(() => {
                                setIsLoading(false);
                            });

                            enqueueSnackbar('ออกจากระบบเรียบร้อยแล้ว', {
                                variant: 'success',
                                style: {},
                            });
                            closeSnackbar(key);
                        }}
                    >
                        ยืนยัน
                    </button>
                    <button
                        className={styles.notistackbtn}
                        onClick={() => closeSnackbar(key)}
                    >
                        ยกเลิก
                    </button>
                </>
            ),
        });
    }

    useEffect(() => {
        const delay = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        if (isOpen || forgotPasswordOpen) {
            document.body.style.overflow = 'hidden';
        } else if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [isOpen, forgotPasswordOpen, isLoading]);

    return (
        <div className={styles.font}>
            {isLoading ? (
                <div className={styles.loaderStyles}>
                    <HashLoader color={"#36D7B7"} loading={isLoading} className={styles.spinnerStyles} size={60} />
                </div>
            ) : (
                isLoggedIn && sessionStorage.getItem('session_username') && localStorage.getItem('token') ? (
                    <div className={styles.dropdown}>
                        <Select
                            options={[
                                { value: "edit", label: "Edit Contents" },
                                { value: "index", label: "Index" },
                                { value: "logout", label: "Log out" },
                            ]}
                            onChange={(selectedOption) => {
                                if (selectedOption.value === "logout") {
                                    handleLogout();
                                } else if (selectedOption.value === "edit") {
                                    handleEdit();
                                } else if (selectedOption.value === "index") {
                                    handleIndex();
                                }
                            }}
                            placeholder={sessionStorage.getItem("session_username")}
                            components={{
                                IndicatorSeparator,
                            }}
                            isSearchable={false}
                        />
                    </div>
                ) : (
                    <button className={styles.loginBtn} onClick={handleOpen}>
                        Login
                    </button>
                )
            )}
            {isOpen && (
                <div className={styles.modalBackdrop} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={handleFormClick}>
                        <h2 style={{ display: 'flex', alignItems: 'center', fontSize: '24px' }}>เข้าสู่ระบบ <BiLogIn style={{ marginLeft: '10px' }} /></h2>
                        <hr style={{ marginTop: '10px', marginBottom: '5px', border: '0', borderTop: '1px solid #ccc' }} />
                        <form className={styles.formLog} onSubmit={handleSubmit}>
                            {error && <p className={styles.error}>{error}</p>}
                            <label>
                                E-mail :
                                <input type="email" className={styles.inputField} value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter Your e-mail' />
                            </label>
                            <label>
                                Password :
                                <input type="password" className={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Your Password' />
                            </label>
                            <button type="submit" className={styles.submitBtn}>ยืนยัน</button>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <GrClose />
                            </button>
                            <a className={styles.forgotpassbtn} onClick={handleForgotPasswordClick}>ลืมรหัสผ่าน ?</a>
                        </form>
                    </div>
                </div>
            )}
            {forgotPasswordOpen ? (
                <ForgotPasswordForm handleClose={handleClose} handleBackClick={handleBackClick} forgotPasswordOpen={forgotPasswordOpen} isOpen={isOpen} />
            ) : null}
        </div>
    );
}
export default LoginModal;