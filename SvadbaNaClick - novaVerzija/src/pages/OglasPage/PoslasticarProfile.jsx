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
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import axios from 'axios';
import auth from '../../firebase';
import { changePoslasticarSchema } from '../../schemas/schema';

// prevedeno ENGLESKI
function PoslasticarProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [torte, setTorte] = useState([]);
  const [change, setChange] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [nazivTorte, setNazivTorte] = useState('');
  const [cenaTorte, setCenaTorte] = useState('');
  const [opisTorte, setOpisTorte] = useState('');
  const [brTelefona, setBrTelefona] = useState('');
  const [datumOsnivanja, setDatumOsnivanja] = useState('');
  const [email, setEmail] = useState('');
  const [zakazaniMladenci, setZakazaniMladenci] = useState([]);
  const [ocena, setOcena] = useState(0);
  const [naziv, setNaziv] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [freeDate, setFreeDate] = useState([]);
  const [image, setImage] = useState();
  const [opis, setOpis] = useState('');
  const [idPoslasticara, setIdPoslasticara] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [reservedDates, setReservedDates] = useState([]);

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

  useEffect(() => {
    // Function to fetch profile data
    async function fetchProfileData() {
      try {
        const response = await axios.get(`http://localhost:8080/poslasticar/prekouida/${auth.currentUser.uid}`);
        const fetchedData = response.data;
        console.log(fetchedData);
        setIdPoslasticara(fetchedData.PoslasticarID);
        setNaziv(fetchedData.Ime);
        setOpis(fetchedData.Kratak_Opis);
        setEmail(fetchedData.Email);
        setBrTelefona(fetchedData.Broj_Telefona);
        setOcena(fetchedData.Ocena);
        setDatumOsnivanja(fetchedData.Datum_Osnivanja);
        setFreeDate(fetchedData.Slobodni_Termini);
        setTorte(fetchedData.Torte);
        console.log(fetchedData.Torte);
        const responseZakazano = await axios.get(`http://localhost:8080/zakazaniposlasticari/prekouid/${auth.currentUser.uid}`);
        const dataZakazano = responseZakazano.data;
        setZakazaniMladenci(dataZakazano);
        console.log(dataZakazano);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    }

    fetchProfileData();
  }, []); // Empty dependency array ensures this runs only once

  // eslint-disable-next-line no-unused-vars

  const isDateReserved = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return reservedDates.includes(dateString);
  };

  const handleSetChange = async () => {
    if (change === true) {
      try {
        const isValid = await changePoslasticarSchema.validate({
          naziv,
          opis,
          brTelefona,
        });
        console.log(isValid);
        if (isValid) {
          console.log(auth.currentUser.uid);
          await fetch(`http://localhost:8080/poslasticar/prekouid/${auth.currentUser.uid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Ime: naziv,
              Kratak_Opis: opis,
              Broj_Telefona: brTelefona,
            }),
          });
          setChange(!change);
        }
        if (selectedDate != null) {
          const formattedDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');

          await fetch(`http://localhost:8080/slobodniterminiposlasticar/prekoid/${idPoslasticara}`, {
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
            `http://localhost:8080/slikePoslasticar/${idPoslasticara}`,
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
        setFreeDate(fetchedData.Slobodni_Termini);

        console.log('Successfully updated the profile');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      setChange(!change);
    }
  };

  const handleDodaj = async () => {
    if (nazivTorte !== '' && cenaTorte !== '' && opisTorte !== '') {
      await fetch(`http://localhost:8080/posttorte/${auth.currentUser.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Naziv: nazivTorte,
          Cena: cenaTorte,
          Kratak_Opis: opisTorte,
        }),
      });

      const response = await axios.get(`http://localhost:8080/poslasticar/prekouida/${auth.currentUser.uid}`);
      const fetchedData = response.data;
      setTorte(fetchedData.Torte);

      setNazivTorte('');
      setCenaTorte('');
      setOpisTorte('');
    }
  };

  const handleObrisi = async (idg) => {
    await axios.delete(`http://localhost:8080/deletetorte/${idg}`);
    const response = await axios.get(`http://localhost:8080/poslasticar/prekouida/${auth.currentUser.uid}`);
    const fetchedData = response.data;
    setTorte(fetchedData.Torte);
  };

  const overview = () => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('nazivAgencije')}
          :
          {' '}
        </p>
        {naziv}
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
        {opis}
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">Email: </p>
        {email}
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('datumOsnivanja')}
          :
          {' '}
        </p>
        {datumOsnivanja}
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('phoneNumber')}
          :
          {' '}
        </p>
        {brTelefona}
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
      <button type="button" onClick={handleSetChange} className="w-64 self-end rounded-md bg-snclbrown p-1 text-black hover:bg-sncdbrown"> Izmeni</button>
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
          {' '}
          {t('Opis')}
          :
          {' '}
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" value={opis} onChange={(e) => setOpis(e.target.value)} />
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">Email: </p>
        {email}

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('datumOsnivanja')}
          :
          {' '}
        </p>
        {datumOsnivanja}

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
          {t('phoneNumber')}
          :
          {' '}
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" onChange={(e) => setBrTelefona(e.target.value)} />

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
          {t('dodajFotografijePrethodnihRadova')}
          :
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
          <div>
            <div className="mb-3  flex flex-row flex-wrap items-center gap-3">
              <h1 className=" items-center text-xl font-extrabold">{t('Torte')}</h1>
              <input type="text" value={nazivTorte} onChange={(e) => setNazivTorte(e.target.value)} placeholder="Naziv torte" className="h-7 rounded-lg p-2 text-black" />
              <input type="number" value={cenaTorte} onChange={(e) => setCenaTorte(e.target.value)} placeholder="Cena u dinarima" className="h-7 rounded-lg p-2 text-black" />
              <input type="text" value={opisTorte} onChange={(e) => setOpisTorte(e.target.value)} placeholder="Kratak opis" className="h-7 rounded-lg p-2 text-black" />
            </div>
            <div className="mb-3 flex flex-col gap-3">
              {torte.map((torta) => (
                <div className="flex flex-row items-center gap-3" key={torta.ID}>
                  <p><span className="font-bold">{torta.TIP}</span></p>
                  <p>{torta.Naziv}</p>
                  <p>
                    {torta.Cena}
                    {' '}
                    <span className="font-bold">din</span>
                  </p>
                  <p>
                    {torta.Kratak_Opis}
                  </p>
                  <button type="button" className="rounded-md bg-snclbrown p-1 text-black hover:bg-sncdbrown" onClick={() => handleObrisi(torta.ID)}>Obrisi</button>
                </div>
              ))}
            </div>
            <div className="mb-3 flex flex-col gap-3">

              <button onClick={handleDodaj} type="button" className="rounded-md bg-snclbrown p-1 text-black hover:bg-sncdbrown">
                {t('add')}
              </button>
            </div>
          </div>
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
                  {zakazan.Poslasticar_Termin}
                </p>
                <p>
                  {t('Cake')}
                  {zakazan.Naziv_Torte}
                </p>

              </div>
            ))}
          </div>
        </div>
      </TabPanel>

    </Tabs>
  );
}

export default PoslasticarProfile;
