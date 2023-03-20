import { useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import styles from '../styles/ForgotPasswordForm.module.css';
import { BiArrowBack } from 'react-icons/bi';

const ForgotPasswordForm = ({ handleClose, handleBackClick, forgotPasswordOpen, isOpen }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const handleFormClick = (e) => e.stopPropagation();
    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form with email:', email);
        try {
            await axios.post('http://localhost:1337/api/auth/forgot-password', { email });
            enqueueSnackbar('ส่งอีเมลล์ลิงก์เปลี่ยนรหัสผ่านแล้ว', {
                variant: 'success',
                style: {
                    fontFamily: 'Lato, "Noto Sans Thai", sans-serif',
                    fontSize: '18px',
                },
            });
            handleClose();
        } catch (error) {
            setError(error.message);
            enqueueSnackbar('ไม่พบอีเมลนี้ในระบบ', {
                variant: 'error', style: {
                    fontFamily: 'Lato, "Noto Sans Thai", sans-serif',
                    fontSize: '18px'
                }
            });

        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={handleClose}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <BiArrowBack onClick={handleBackClick} className={styles.backIcon} />
                    <h2>ลืมรหัสผ่าน   </h2>

                </div>
                <form className={styles.formLog} onSubmit={handleSubmit} onClick={handleFormClick}>
                    {error && <p className={styles.error}>{error}</p>}
                    <label className={styles.label}>
                        E-mail :
                        <input type="email" className={styles.inputField} value={email} onChange={handleEmailChange} placeholder="กรอกอีเมลล์เพื่อส่งลิงก์ยังอีเมลล์" />
                    </label>
                    <button type="submit" className={styles.submitBtn}>
                        ยืนยัน
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;

