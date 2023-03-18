import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Card.module.css';
import { BsFillCaretRightFill } from 'react-icons/bs';
import axios from 'axios';

export default function SaaSDisplay() {
  const [Alldata, setData] = useState([]);

  const router = useRouter();

  function handleClick(Cardid) {
    router.push({
      pathname: `../[Cardid]`,
      query: { Cardid: Cardid },
    });
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/apps?populate=*');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {Alldata.data?.map(CardData =>
        <div className={styles.card} key={CardData.id}>
          <img src={`http://localhost:1337${CardData.attributes.img.data.attributes.url}`} alt={CardData.attributes.title} />
          <div className={styles.cardcontent}>
            <h2 className={styles.h2}>
              {CardData.attributes.title}
            </h2>
            <p>
              {CardData.attributes.Description}
            </p>
            <a onClick={() => handleClick(CardData.id)} className={styles.button}>
              <span style={{ display: 'flex', alignItems: 'center' }} >
                Try me <BsFillCaretRightFill style={{ marginLeft: '5px' }} />
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
