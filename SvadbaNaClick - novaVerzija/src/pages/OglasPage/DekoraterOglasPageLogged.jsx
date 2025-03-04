/* eslint-disable max-len */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import { Carousel } from '@material-tailwind/react';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/base';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Tooltip from '@mui/material/Tooltip';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-named-as-default
import auth from '../../firebase';

// engleski PREVEDENO
function DekoraterOglasPageLogged() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [slobodniTermini, setSlobodniTermini] = useState([]);
  const [lajkovano, setLajkovano] = useState(false);
  const [neMoze, setNeMoze] = useState(false);
  const [naziv, setNaziv] = useState('');
  const [osnovniPodaci, setOsnovniPodaci] = useState('');
  const [images, setImages] = useState([]);
  const [brTelefona, setBrTelefona] = useState('');
  const [email, setEmail] = useState('');
  const [ocena, setOcena] = useState();
  const [cena, setCena] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Function to fetch profile data
    async function fetchProfileData() {
      try {
        const response = await axios.get(`http://localhost:8080/dekorater/prekoid/${id}`);
        const fetchedData = response.data;
        setNaziv(fetchedData[0].Ime);
        setOsnovniPodaci(fetchedData[0].Kratak_Opis);
        setEmail(fetchedData[0].Email);
        setBrTelefona(fetchedData[0].Broj_Telefona);
        setSlobodniTermini(fetchedData[0].Slobodni_Termini);
        setOcena(fetchedData[0].Ocena);
        setCena(fetchedData[0].Cena);

        const responseZakazano = await axios.get(`http://localhost:8080/zakazanomladencima/prekouid/${auth.currentUser.uid}`);
        const fetchedResponseZakazano = responseZakazano.data;
        if (fetchedResponseZakazano[0].Dekorater_Termin !== null) {
          setNeMoze(true);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        navigate('/badRequest');
      }
    }

    fetchProfileData();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseLiked = await axios.get(`http://localhost:8080/getLikedDekorater/${auth.currentUser.uid}`);
        const likedDekorater = responseLiked.data;

        const numericId = Number(id); // Ensure id is a number

        const isLiked = likedDekorater.some((dekorater) => dekorater.Dekorater_ID === numericId);

        if (likedDekorater.length > 0 && isLiked) {
          setLajkovano(true);
        }
      } catch (error) {
        console.error('Error fetching responseLiked:', error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchImages() {
      const responeSlike = await axios.get(`http://localhost:8080/slikeDekorater/url/${id}`);
      const dataSlike = responeSlike.data;
      setImages(dataSlike.images);

      console.log(dataSlike);
    }
    fetchImages();
  }, []);

  const isDateReserved = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return !slobodniTermini.some((item) => item.Slobodan_Termin.split('T')[0] === dateString);
  };

  const handleRezervisi = async () => {
    if (selectedDate == null) {
      alert('Morate izabrati datum!');
    } else {
      const formattedDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');
      try {
        await fetch(`http://localhost:8080/zakazivanjedekoratera/prekouid/${auth.currentUser.uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Dekorater_Termin: formattedDate,
            Dekorater_ID: id,
          }),
        });
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSacuvaj = async () => {
    try {
      await fetch('http://localhost:8080/addLikedEntity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UID: auth.currentUser.uid,
          Type: 'Dekorater',
          EntityID: id,
        }),
      });
      setLajkovano(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleIzbaci = async () => {
    try {
      await fetch('http://localhost:8080/deleteLikedEntity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UID: auth.currentUser.uid,
          Type: 'Dekorater',
          EntityID: id,
        }),
      });
      setLajkovano(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" relative h-full w-full">
      <img
        src="../../assets/pexels-atul11-1042152.jpg"
        alt="image 1"
        className="h-96 w-full object-cover shadow-lg"
      />
      <div className="pointer-events-none absolute inset-0 mt-32 flex flex-col items-center justify-items-start text-center">
        <h1 className=" mb-3 text-7xl font-bold text-white drop-shadow-lg">{naziv}</h1>
        <h1 className="text-xl text-white drop-shadow-lg">{t('DEKORATER')}</h1>
      </div>
      <div className="flex h-full flex-col items-center">
        <div className="mt-5 flex w-full flex-row flex-wrap justify-around p-2 px-5">

          <div className="mx-2 my-3 w-96">
            <div className="text-center font-bold">{t('prethodniRadovi')}</div>
            <hr className="my-3 h-1 border-0 bg-sncpink" />
            <div className="flex w-full justify-center">
              <div className="w-full text-center">
                <Carousel className="h-full w-full ">
                  {images.map((image) => (
                    <img
                      src={image}
                      alt="image 1"
                      className="h-auto max-w-full  shadow-lg"
                    />
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
          <div className="mx-2 my-3 w-96">
            <div className="text-center font-bold">{t('OsnovniPodaci')}</div>
            <hr className="my-3 h-1 border-0 bg-sncpink" />
            <p className="text-justify">
              {osnovniPodaci}
            </p>
          </div>
          <div className="mx-2 my-3 w-96">
            <div className="text-center font-bold">{t('Contact')}</div>
            <hr className="my-3 h-1 border-0 bg-sncpink" />
            <p>
              {t('phoneNumber')}
              :
              {brTelefona}
            </p>
            <p>
              Email:
              {email}
            </p>
          </div>
        </div>
        <div className="flex flex-row">
          <p className="mx-2">
            {t('ocena')}
            :
            {' '}
          </p>
          <Rating
            name="readOnly"
            value={ocena}
            readOnly
            precision={0.1}
          />
          <p className="mx-2">
            {ocena}
          </p>
          <Tooltip title={lajkovano ? 'Izbaci' : 'Sacuvaj'} placement="top" arrow>
            <Button className="text-sncpink hover:text-snclpink " onClick={lajkovano ? handleIzbaci : handleSacuvaj}>
              {lajkovano ? <HeartBrokenIcon /> : <FavoriteIcon />}
            </Button>
          </Tooltip>

        </div>
      </div>

      {neMoze ? null : (
        <div className="my-3 flex w-full flex-col items-center">
          <hr className="my-3 h-1 w-11/12 border-0 bg-sncpink" />
          <div>
            <p>
              {t('cenaUsluge')}
              :
              {' '}
              <span>{cena}</span>
            </p>
          </div>
          <div>
            <h1>{t('kalendarZaRezervisanje')}</h1>
            <DatePicker
              isClearable
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              filterDate={(date) => !isDateReserved(date)}
              className="border-2"
              popperPlacement="bottom"
            />
          </div>
          <Button onClick={handleRezervisi} className="mt-5 rounded-md bg-snclbrown p-2 shadow-lg hover:bg-sncdblue hover:text-white " icon={<FavoriteIcon />}>{t('zakazi')}</Button>

        </div>
      )}
    </div>
  );
}

export default DekoraterOglasPageLogged;
