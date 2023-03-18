import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from '../styles/LoginModal.module.css';
import { GrClose } from 'react-icons/gr';
import { BiLogIn } from 'react-icons/bi';
import { GrUserAdmin } from 'react-icons/gr'
import strapi, { login, getCurrentUser } from '../pages/api/Strapi';
import { useSnackbar } from 'notistack';

const LoginModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleFormClick = (e) => e.stopPropagation();


    const IndicatorSeparator = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                <GrUserAdmin />
                <span style={{ width: '1px', height: '12px', backgroundColor: '#ccc', marginLeft: '5px' }} />
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            const token = response.jwt;

            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            setIsOpen(false);
            setUsername('');
            setPassword('');
            // Call getCurrentUser with the token to get the current user
            const user = await getCurrentUser(token);
            setUsername(user.username);
            enqueueSnackbar(`${user.username} เข้าสู่ระบบ!`, {
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUsername('');
        enqueueSnackbar('ออกจากระบบ เรียบร้อยแล้ว', {
            variant: 'success',
            style: {
                fontFamily: 'Lato, "Noto Sans Thai", sans-serif',
                fontSize: '18px'
            }
        });
    };




    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }

        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [isOpen]);

    return (
        <div className={styles.font}>
            {isLoggedIn ? (
                <div className={styles.dropdown}>
                    <Select
                        options={[{ value: 'profile', label: 'Profile' }, { value: 'settings', label: 'Settings' }, { value: 'logout', label: 'Log out' }]}
                        onChange={(selectedOption) => {
                            if (selectedOption.value === 'logout') {
                                handleLogout();
                            } else {
                                // handle other options
                            }
                        }}
                        placeholder={username}
                        components={{
                            IndicatorSeparator
                        }}
                        isSearchable={false}
                    />
                </div>
            ) : (
                <button className={styles.loginBtn} onClick={handleOpen}>
                    Login
                </button>
            )}
            {isOpen && (
                <div className={styles.modalBackdrop} onClick={handleClose}>
                    <div className={styles.modal} onClick={handleFormClick}>
                        <h2 style={{ display: 'flex', alignItems: 'center', fontSize: '24px' }}>เข้าสู่ระบบ <BiLogIn style={{ marginLeft: '10px' }} /></h2>
                        <hr style={{ marginTop: '10px', marginBottom: '5px', border: '0', borderTop: '1px solid #ccc' }} />
                        <form className={styles.formLog} onSubmit={handleSubmit}>
                            {error && <p className={styles.error}>{error}</p>}
                            <label>
                                E-mail:
                                <input type="email" className={styles.inputField} value={username} onChange={(e) => setUsername(e.target.value)} />
                            </label>
                            <label>
                                Password:
                                <input type="password" className={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)} />
                            </label>
                            <button type="submit" className={styles.submitBtn}>Submit</button>
                            <button className={styles.closeBtn} onClick={handleClose}>
                                <GrClose />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginModal;
