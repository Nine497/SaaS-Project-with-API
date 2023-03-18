import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SaaSPage() {
    const [dataArr, setDataArr] = useState([]);
    const router = useRouter();
    const { Cardid } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:1337/api/apps/${Cardid}?populate=*`);
                const data = await res.json();
                const dataArray = data.data.attributes;
                setDataArr([dataArray]);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            {dataArr.length > 0 && (
                <>
                    {dataArr.map((OneCardData) => {
                        return (
                            <div style={{ textAlign: "center", padding:" 20px 20%" }} key={OneCardData.id}>
                                <img
                                    src={`http://localhost:1337${OneCardData.img.data.attributes.url}`}
                                    alt={OneCardData.title}
                                    style={{ width: "50%", height: "50%", display: "block", margin: "0 auto" }}
                                /><br />
                                <h2>Title: {OneCardData.title}</h2><br />
                                <p>Description: {OneCardData.Description}</p>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
