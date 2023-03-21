import { GrUserAdmin } from 'react-icons/gr'
import Select from 'react-select';
import styles from '../styles/LoginModal.module.css';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
export default function Dropdown() {
    const [session_username, setUsername] = useState("");
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const CheckSession = () => {
        let username;
        if (sessionStorage.username) {
            username = sessionStorage.getItem('username');
            setUsername(username);
        } else {
            router.push('/');
            sessionStorage.removeItem('username');
            localStorage.removeItem('token');
        }
    }
    const IndicatorSeparator = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                <GrUserAdmin />
                <span style={{ width: '1px', height: '12px', backgroundColor: '#ccc', marginLeft: '5px' }} />
            </div>
        );
    };
    function handleEdit() {
        router.push('/edit_content');
    }

    function handleIndex() {
        router.push('/');
    }

    function handleLogout() {
        enqueueSnackbar('ต้องการที่จะออกจากระบบ?', {
            variant: 'info',
            persist: true,
            action: (key) => (
                <>
                    <button className={styles.notistackbtn} onClick={() => {
                        router.push('/');
                        sessionStorage.removeItem('username');
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                        enqueueSnackbar('ออกจากระบบเรียบร้อยแล้ว', {
                            variant: 'success', style: {
                            },
                        });
                        closeSnackbar(key);
                    }}>ยืนยัน</button>
                    <button className={styles.notistackbtn} onClick={() => closeSnackbar(key)}>ยกเลิก</button>
                </>
            ),

        });
    }; 

    useEffect(() => {
        CheckSession();
    }, []);

    return (
        <div className={styles.dropdown}>
            <Select
                options={[
                    { value: 'edit', label: 'Edit Contents' },
                    { value: 'index', label: 'Index' },
                    { value: 'logout', label: 'Log out' }
                ]}
                onChange={(selectedOption) => {
                    if (selectedOption.value === 'logout') {
                        handleLogout();
                    } else if (selectedOption.value === 'edit') {
                        handleEdit();
                    } else if (selectedOption.value === 'index') {
                        handleIndex();
                    }
                }}
                placeholder={session_username}
                components={{
                    IndicatorSeparator
                }}
                isSearchable={false}
            />
        </div>
    );
}
