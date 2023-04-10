import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { FcAbout } from "react-icons/fc";
import SaaSDisplay from '../pages/api/SaaS';
import Footer from '../pages/footer'
import LoginModal from '../pages/loginModal';
import { SnackbarProvider } from 'notistack';

export default function Home() {
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <Head />
        <main className={styles.main}>
          <section className={styles.Section1}>
            <img className={styles.Logo} src="https://i.ibb.co/6rY3Lxy/750x422-914126-1608876526-depositphotos-bgremover.png"></img>
            <img className={styles.Logo2} src="https://www.eng.psu.ac.th/old-website/images/Moderator/hftimah/pru-bu125/Final_55ENG_PSU2.png"></img>
            <LoginModal />
            <div className={styles.Headertext}>
              <div className={styles.content}>
                <h2>SaaS</h2>
                <h2>SaaS</h2>
              </div>
              <a className={styles.h2} >คณะวิศวกรรมศาสตร์ ม.อ. ก้าวสู่ยุคของการ</a><br />
              <a className={styles.h2} >พัฒนาซอฟต์แวร์ อย่างไร้ขีดจำกัด</a>
            </div>
            <a className={styles.aboutbtn} onClick={scrollToAbout}>About</a>
          </section>
          <section className={styles.Section2}>
            <div className={styles.Diagonal1}></div>
            <div id='about-me' className={styles.boxleft}>
              <a className={styles.Leadtext}>About me    <FcAbout />
                <hr></hr></a><br />
              <a className={styles.text}>คณะวิศวกรรมศาสตร์ มหาวิทยาลัยสงขลานครินทร์ เราได้ออกแบบและวางรากฐานของแพลตฟอร์มสำหรับการพัฒนาแอพพลิเคชันสมัยใหม่ที่ทำงานภายใต้สถาปัตยกรรม Microservice มากว่า 5 ปีแล้ว</a><br /><br />
              <a className={styles.text}>เราได้พัฒนาแอพพลิเคชันที่พร้อมใช้งานภายในองค์กร (Internal Application) ที่ทำงานภายใต้แนวคิดของ SaaS (Sofware as a Service) เราได้ออกแบบให้บุคลากรของคณะวิศวกรรมศาสตร์สามารถสร้างและใช้งานแอพพลิเคชันได้ด้วยตนเอง</a>
            </div>
            {/*  <div className={styles.boxright}>
            <img className={styles.img} src='https://cdni.iconscout.com/illustration/premium/thumb/saas-4737531-3944055.png'></img>
          </div>*/}
          </section>
          <section className={styles.Section3}>
            <div className={styles.Diagonal2}></div>
            <div className={styles.textHeader}>
              <a className={styles.title}>Your Pre-title goes here</a><br />
              <a className={styles.Head}>Application demo build under SaaS</a>
            </div>
            <div className={styles.parentcontainer}>
              <div className={styles.Allcard}>
                <SaaSDisplay />
                <Footer />
              </div>
            </div>
          </section>
        </main>
      </SnackbarProvider>
    </>
  )
}


function scrollToAbout() {
  const aboutMe = document.querySelector('#about-me');
  aboutMe.scrollIntoView({ behavior: 'smooth' });
};
