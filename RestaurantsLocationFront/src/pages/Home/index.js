import style from './style.module.css'
import axios from 'axios';
import ShowList from '../../components/ShowList';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';






export default function Home() {
    const [dataInput, setDataInput] = useState("");
    const [resFromServer, setResFromServer] = useState("");
    const [showListButton, setShowListButton] = useState(false);
    let navigate = useNavigate();
    function searchRestaurantsByAddress() {
        console.log(dataInput);
        axios.post('http://localhost:3010/searchRestaurants', { dataInput: dataInput }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log(res.data);
                setResFromServer(res.data)
            })
            .catch((error) => {
                console.error(error);
            })
    }
    console.log(resFromServer[2]);
    const handleClickShowMap = () => {
        const data = {restaurants:resFromServer[1],coordinates:resFromServer[2]};
        navigate('/ShowRestaurantOnMap', { state: { data } });
      };
    console.log(resFromServer);

    return (
        <div className={style.container}>
            <h1>Search a restaurant?</h1>
            <input type='text' placeholder='write a address' onChange={(e) => setDataInput(e.target.value)} />
            <button onClick={searchRestaurantsByAddress}>search!</button>
            {
                resFromServer != "" &&

                <div className={style.res}>
                    <h1>We have results!</h1>
                    <button onClick={() => setShowListButton(!showListButton)}>to display the results as a list</button>
                    <button onClick={handleClickShowMap}>To display the results on a map</button>
                </div>
            }
            {
                showListButton &&
                <ShowList data={resFromServer[1]} />
            }
        </div>
    )
}
