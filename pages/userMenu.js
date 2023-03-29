import { GrUserAdmin } from 'react-icons/gr';
import Select from 'react-select';
import styles from '../styles/LoginModal.module.css';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Dropdown({ isLoggedIn, setIsLoggedIn }) {
    const [session_username, setSessionUsername] = useState('');
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        const name = sessionStorage.getItem('session_username');
        setSessionUsername(name);
        console.log('session_username:', name);
    }, []);




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
        enqueueSnackbar('ต้องการที่จะออกจากระบบ ?', {
            variant: 'info',
            persist: true,
            action: (key) => (
                <>
                    <button
                        className={styles.notistackbtn}
                        onClick={() => {
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
                            setIsLoggedIn(false);
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

    return (
        <div className={styles.dropdown}>
            <Select
                options={[
                    { value: 'edit', label: 'Edit Contents' },
                    { value: 'index', label: 'Index' },
                    { value: 'logout', label: 'Log out' },
                ]}
                onChange={(selectedOption) => {
                    if (selectedOption.value === 'logout') {
                        handleLogout();
                    } else if (selectedOption.value === 'edit') {
                        handleEdit(isLoggedIn, setIsLoggedIn);
                    } else if (selectedOption.value === 'index') {
                        handleIndex();
                    }
                }}
                placeholder={session_username}
                components={{
                    IndicatorSeparator,
                }}
                isSearchable={false}
            />
        </div>
    );
}
