/* eslint-disable max-len */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react/jsx-no-bind */
import {
  Button,
  Tab, TabPanel, Tabs, TabsList,
} from '@mui/base';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Rating from '@mui/material/Rating';
import axios from 'axios';
import auth from '../../firebase';
import { changeDekoraterSchema } from '../../schemas/schema';

// engleski PREVEDENO
function DekoraterProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [freeDate, setFreeDate] = useState([]);
  const [image, setImage] = useState();

  const [change, setChange] = useState(false);
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [brTelefona, setBrTelefona] = useState('');
  const [cena, setCena] = useState(0);
  const [zakazaniMladenci, setZakazaniMladenci] = useState([]);
  const [datumOsnivanja, setDatumOsnivanja] = useState('');
  const [email, setEmail] = useState('');
  const [ocena, setOcena] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [reservedDates, setReservedDates] = useState([]);
  const [idDekoratera, setIdDekoratera] = useState(0);

  useEffect(() => {
    // Function to fetch profile data
    async function fetchProfileData() {
      try {
        const response = await axios.get(`http://localhost:8080/dekorater/prekouid/${auth.currentUser.uid}`);
        const fetchedData = response.data;
        setIdDekoratera(fetchedData[0].DekoraterID);
        console.log(fetchedData[0]);
        setNaziv(fetchedData[0].Ime);
        setOpis(fetchedData[0].Kratak_Opis);
        setEmail(fetchedData[0].Email);
        setBrTelefona(fetchedData[0].Broj_Telefona);
        setOcena(fetchedData[0].Ocena);
        setDatumOsnivanja(fetchedData[0].Datum_Osnivanja);
        setFreeDate(fetchedData[0].Slobodni_Termini);
        setCena(fetchedData[0].Cena);

        const responseZakazano = await axios.get(`http://localhost:8080/zakazanidekorateri/prekouid/${auth.currentUser.uid}`);
        const dataZakazano = responseZakazano.data;
        setZakazaniMladenci(dataZakazano);
        console.log(dataZakazano);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    }

    fetchProfileData();
  }, []); // Empty dependency array ensures this runs only once

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.log('Greska!');
      console.error(err);
    }
  };

  // eslint-disable-next-line no-unused-vars

  const isDateReserved = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return reservedDates.includes(dateString);
  };

  const handleSetChange = async () => {
    if (change === true) {
      try {
        const isValid = await changeDekoraterSchema.validate({
          naziv,
          opis,
          cena,
          brTelefona,
        });
        console.log(isValid);
        if (isValid) {
          await fetch(`http://localhost:8080/dekorater/prekouid/${auth.currentUser.uid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Ime: naziv,
              Kratak_Opis: opis,
              Cena: cena,
              Broj_Telefona: brTelefona,
            }),
          });
          setChange(!change);
        }
        if (selectedDate != null) {
          const formattedDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');

          await fetch(`http://localhost:8080/slobodniterminidekorater/prekoid/${idDekoratera}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Slobodan_Termin: formattedDate,
            }),
          });
          console.log(formattedDate);
          setSelectedDate(null);
        }
        if (image != null) {
          const formData = new FormData();
          formData.append('images', image);
          const result = await axios.post(
            `http://localhost:8080/slikeDekorater/${idDekoratera}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          console.log(result);
        }
        console.log('Successfully updated the profile');
        const response = await axios.get(`http://localhost:8080/dekorater/prekouid/${auth.currentUser.uid}`);
        const fetchedData = response.data;
        setFreeDate(fetchedData[0].Slobodni_Termini);
        console.log('Successfully updated the profile');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      setChange(!change);
    }
  };

  const overview = () => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('nazivAgencije')}
          {' '}
        </p>
        <p className="mx-2 ">{naziv}</p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('trenutnaOcena')}
          :
          {' '}
        </p>
        <Rating
          name="readOnly"
          value={ocena}
          readOnly
          precision={0.1}
        />
        <p className="">{ocena}</p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('Opis')}
          :
          {' '}
        </p>
        <p className="mx-2 ">
          {opis}
        </p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">Email: </p>
        <p className="mx-2 ">
          {email}

        </p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('phoneNumber')}
          :
          {' '}
        </p>
        <p className="mx-2 ">
          {brTelefona}
        </p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('datumOsnivanja')}
          :
          {' '}
        </p>
        <p className="mx-2 ">
          {datumOsnivanja}
        </p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('cenaUsluge')}
          :
          {' '}
        </p>
        <p className="mx-2 ">
          {cena}
        </p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('dodajFotografijePrethodnihRadova')}
          :
          {' '}
        </p>

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('slobodniTermini')}
          :
          {' '}
        </p>

      </div>
      <button type="button" onClick={handleSetChange} className="w-64 self-end rounded-md bg-snclbrown p-1 text-black hover:bg-sncdbrown">
        {' '}
        {t('izmeni')}
      </button>
    </div>
  );

  const changing = () => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('nazivAgencije')}
          :
          {' '}
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" value={naziv} onChange={(e) => setNaziv(e.target.value)} />

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('trenutnaOcena')}
          :
          {' '}
        </p>
        <Rating
          name="readOnly"
          value={ocena}
          readOnly
          precision={0.1}
        />
        <p className="">{ocena}</p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('Opis')}
          :
          {' '}
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" value={opis} onChange={(e) => setOpis(e.target.value)} />
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">Email: </p>
        <p className="mx-2 ">{email}</p>

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('phoneNumber')}
          :
          {' '}
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" value={brTelefona} onChange={(e) => setBrTelefona(e.target.value)} />

      </div>

      <div className="flex flex-row">
        <p className=" font-bold">
          {t('datumOsnivanja')}
          :
          {' '}
        </p>
        <p className="mx-2 ">
          {datumOsnivanja}
        </p>

      </div>

      <div className="flex flex-row">
        <p className=" font-bold">
          {t('cenaUsluge')}
          :
          {' '}
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" value={cena} onChange={(e) => setCena(e.target.value)} />

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('dodajFotografijePrethodnihRadova')}
          :
          {' '}
        </p>
        <input type="file" className="bg-white text-black" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

      </div>
      <div className="flex flex-row ">
        <p className=" mr-2 font-bold">
          {t('slobodniTermini')}
          :
          {' '}
        </p>
        <DatePicker
          isClearable
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={new Date()}
          filterDate={(date) => !isDateReserved(date)}
          className="border-2 text-black"
          popperPlacement="bottom"
        />

      </div>
      <div className="flex flex-row gap-3 self-end">
        <button type="button" onClick={handleSetChange} className="w-64 self-end rounded-md bg-snclbrown p-1 text-black hover:bg-sncdbrown"> Sacuvaj</button>
      </div>
    </div>
  );

  return (
    <Tabs defaultValue={1} className="m-3 flex h-full w-full flex-col justify-center">
      <TabsList className="mx-2 mb-2 flex h-fit flex-row justify-around  rounded-lg bg-snclbrown p-4 shadow-lg">
        <Tab value={1} className="text-sncdblue hover:text-sncdbrown">{t('OsnovniPodaci')}</Tab>
        <Tab value={2} className="text-sncdblue hover:text-sncdbrown">{t('zakazano')}</Tab>
      </TabsList>
      <TabPanel value={1} className="flex h-fit ">
        {' '}
        <div className=" flex  w-full flex-col rounded-md bg-snclblue p-5 text-white shadow-lg">
          {change ? changing() : overview()}

          <hr className="my-3" />

          <div className="flex w-full justify-center">
            <Button onClick={handleLogout} className=" w-36 rounded-md bg-snclbrown p-2 text-sncdblue shadow-md hover:bg-sncdblue hover:text-white">{t('logout')}</Button>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={2}>
        {' '}
        <div className=" flex  w-full flex-col rounded-md bg-snclblue p-5 text-white shadow-lg ">
          <h1 className="mb-3 text-2xl font-bold">{t('zakazaniTermini')}</h1>
          <div className="   flex flex-row flex-wrap items-center justify-center">
            {zakazaniMladenci.map((zakazan) => (
              <div className="mx-2 mb-3 min-h-20 w-96 rounded-lg bg-snclbrown p-3 text-lg text-sncdblue shadow-lg">
                <p>
                  {t('clientName')}
                  :
                  {zakazan.Ime}
                </p>
                <p>
                  {t('clientSurname')}
                  :
                  {zakazan.Prezime}
                </p>
                <p>
                  {t('partnerName')}
                  :
                  {zakazan.Ime_Partnera}
                </p>
                <p>
                  {t('partnerSurname')}
                  :
                  {zakazan.Prezime_Partnera}
                </p>
                <p>
                  {t('phoneNumber')}
                  :
                  {zakazan.Broj_Telefona}
                </p>
                <p>
                  {t('datumSvadbe')}
                  :
                  {' '}
                </p>
                {zakazan.Dekorater_Termin}

              </div>
            ))}
          </div>

        </div>
      </TabPanel>

    </Tabs>
  );
}

export default DekoraterProfile;
