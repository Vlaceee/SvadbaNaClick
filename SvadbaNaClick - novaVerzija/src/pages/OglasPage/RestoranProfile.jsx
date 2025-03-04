/* eslint-disable no-restricted-globals */
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
import Rating from '@mui/material/Rating';
import axios from 'axios';
import { Select, Option } from '@material-tailwind/react';
import DatePicker from 'react-datepicker';
import auth from '../../firebase';

import 'react-datepicker/dist/react-datepicker.css';
import { changeRestoranSchema } from '../../schemas/schema';
// engleski PREVEDENO
function RestoranProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [change, setChange] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [freeDate, setFreeDate] = useState([]);
  const [fetchedJela, setFetchedJela] = useState([]);
  const [image, setImage] = useState();

  const [idRestorana, setIdRestorana] = useState(0);
  const [tipJela, setTipJela] = useState(0);
  const [nazivJela, setNazivJela] = useState('');
  const [cenaJela, setCenaJela] = useState();
  const [gramazaJela, setGramazaJela] = useState();
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [brTelefona, setBrTelefona] = useState('');
  const [zakazaniMladenci, setZakazaniMladenci] = useState([]);
  const [minimumCena, setMinimumCena] = useState(0);
  const [datumOsnivanja, setDatumOsnivanja] = useState('');
  const [pravite, setPravite] = useState(false);
  const [email, setEmail] = useState('');
  const [ocena, setOcena] = useState(0);

  // eslint-disable-next-line no-unused-vars

  const handleDodaj = async () => {
    console.log(fetchedJela);

    console.log(idRestorana);
    if (tipJela !== 0 && nazivJela !== '' && cenaJela !== '' && gramazaJela !== '') {
      await fetch(`http://localhost:8080/jelovnik/${idRestorana}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ImeJela: nazivJela,
          TIP: tipJela,
          Cena: cenaJela,
          Kolicina: gramazaJela,
        }),
      });
    }
    const responseJela = await axios.get(`http://localhost:8080/jelovnik/${idRestorana}`);
    console.log(responseJela);

    const fetchedDataJela = responseJela.data;
    // fetchedDataJela.sort((a, b) => a.TIP - b.TIP);
    setFetchedJela(fetchedDataJela);
    console.log(fetchedJela);
    setNazivJela('');
    setCenaJela('');
    setGramazaJela('');
    setTipJela(0);
  };

  const handleObrisi = async (idg) => {
    console.log(idg);
    try {
      await axios.delete(`http://localhost:8080/jelovnik/${idg}`);
      const responseJelovnik = await axios.get(`http://localhost:8080/jelovnik/${idRestorana}`);
      const fetchedDataJelovnik = responseJelovnik.data;
      fetchedDataJelovnik.sort((a, b) => a.TIP - b.TIP);
      setFetchedJela(fetchedDataJelovnik);
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

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
        const response = await axios.get(`http://localhost:8080/restoran/prekouid/${auth.currentUser.uid}`);
        const fetchedData = response.data;
        console.log(fetchedData);
        setIdRestorana(fetchedData[0].ID);

        setNaziv(fetchedData[0].Naziv);
        setOpis(fetchedData[0].Kratak_Opis);
        setEmail(fetchedData[0].Email);
        setBrTelefona(fetchedData[0].Broj_Telefona);
        setOcena(fetchedData[0].Ocena);
        setDatumOsnivanja(fetchedData[0].Datum_Osnivanja);
        setMinimumCena(fetchedData[0].Cena);
        setPravite(fetchedData[0].RestoranPraviTortu);
        setFreeDate(fetchedData[0].Slobodni_Termini);
        console.log(fetchedData[0]);

        const responseZakazano = await axios.get(`http://localhost:8080/zakazanirestorani/prekouid/${auth.currentUser.uid}`);
        const dataZakazano = responseZakazano.data;
        setZakazaniMladenci(dataZakazano);
        console.log(dataZakazano);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    }

    fetchProfileData();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    async function fetchJela() {
      try {
        if (idRestorana !== 0) {
          const responseJela = await axios.get(`http://localhost:8080/jelovnik/${idRestorana}`);
          const fetchedDataJela = responseJela.data;
          fetchedDataJela.sort((a, b) => a.TIP - b.TIP);
          setFetchedJela(fetchedDataJela);
          console.log(fetchedJela);
        }
      } catch (error) {
        console.error('Failed to fetch guests data:', error);
      }
    }
    fetchJela();
  }, [idRestorana]);

  const handleSetChange = async () => {
    console.log(freeDate);
    if (change === true) {
      try {
        const isValid = await changeRestoranSchema.validate({
          naziv,
          opis,
          minimumCena,
          brTelefona,
          pravite,
        });
        console.log(isValid);
        if (isValid) {
          await fetch(`http://localhost:8080/restoran/prekouid/${auth.currentUser.uid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Naziv: naziv,
              Kratak_Opis: opis,
              Cena: minimumCena,
              Broj_Telefona: brTelefona,
              RestoranPraviTortu: pravite,
            }),
          });
          setChange(!change);
        }
        if (selectedDate != null) {
          const formattedDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');

          await fetch(`http://localhost:8080/slobodniterminirestoran/prekoid/${idRestorana}`, {
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
            `http://localhost:8080/slikeRestoran/${idRestorana}`,
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
        const response = await axios.get(`http://localhost:8080/restoran/prekouid/${auth.currentUser.uid}`);
        const fetchedData = response.data;
        setFreeDate(fetchedData[0].Slobodni_Termini);
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
          {t('nazivRestorana')}
          :
          {' '}
        </p>
        <p>{naziv}</p>
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
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
        {opis}
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">Email: </p>
        {email}
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('DaLiPraviteTortu')}
          :
          {' '}
        </p>
        {pravite ? 'Da' : 'Ne'}
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
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
        {brTelefona}
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {t('minimumcenaMenijaPoOsobi')}
          :
          {' '}
        </p>
        {minimumCena}
      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
          {t('dodajFotografijePrethodnihRadova')}
          :
        </p>

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
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
          {' '}
          {t('nazivAgencije')}
          :
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
          {' '}
          {t('DaLiPraviteTortu')}
          :
          {' '}
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" value={pravite} onChange={(e) => setPravite(e.target.value)} />

      </div>

      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
          {t('datumOsnivanja')}
          :
        </p>
        {datumOsnivanja}

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
          {t('phoneNumber')}
          :
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" value={brTelefona} onChange={(e) => setBrTelefona(e.target.value)} />

      </div>
      <div className="flex flex-row">
        <p className=" font-bold">
          {' '}
          {t('minimumcenaMenijaPoOsobi')}
          :
        </p>
        <input type="text" className="mx-2 rounded-md text-black shadow-md" value={minimumCena} onChange={(e) => setMinimumCena(e.target.value)} />

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
          {' '}
          {t('slobodniTermini')}
          :
        </p>
        <DatePicker
          isClearable
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={new Date()}
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
              <h1 className=" items-center text-xl font-extrabold">{t('meni')}</h1>
              <div className="w-52">
                <Select label="Odaberi tip" className=" text-white" value={tipJela} onChange={(val) => setTipJela(val)}>
                  <Option value="Predjelo">{t('Predjelo')}</Option>
                  <Option value="Glavno jelo">{t('Glavno jelo')}</Option>
                  <Option value="Salata">{t('Salata')}</Option>
                  <Option value="Pice">{t('Pice')}</Option>
                </Select>
              </div>
              <input type="text" value={nazivJela} onChange={(e) => setNazivJela(e.target.value)} placeholder="Naziv" className="h-7 rounded-lg p-2 text-black" />
              <input type="number" value={cenaJela} onChange={(e) => setCenaJela(e.target.value)} placeholder="Cena u dinarima" className="h-7 rounded-lg p-2 text-black" />
              <input type="number" value={gramazaJela} onChange={(e) => setGramazaJela(e.target.value)} placeholder="Gramaza jela" className="h-7 rounded-lg p-2 text-black" />
            </div>
            <div className="mb-3 flex flex-col gap-3">
              {fetchedJela.map((jelo) => (
                <div className="flex flex-row items-center gap-3" key={jelo.ID}>
                  <p><span className="font-bold">{jelo.TIP}</span></p>
                  <p>{jelo.ImeJela}</p>
                  <p>
                    {jelo.Cena}
                    {' '}
                    <span className="font-bold">din</span>
                  </p>
                  <p>
                    {jelo.Kolicina}
                    {' '}
                    <span className="font-bold">g</span>
                  </p>
                  <button type="button" className="rounded-md bg-snclbrown p-1 text-black hover:bg-sncdbrown" onClick={() => handleObrisi(jelo.ID)}>Obrisi</button>
                </div>
              ))}
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

                  {zakazan.Restoran_Termin}
                </p>
                <p>
                  {t('meni')}
                  :
                  {zakazan.Jelovnik.map((jelo) => (
                    <p>
                      {jelo.ImeJela}
                      {' '}
                      {' - '}
                      {' '}
                      {jelo.Cena}
                      {' '}
                      din
                    </p>
                  ))}
                </p>

              </div>
            ))}

          </div>

        </div>
      </TabPanel>

    </Tabs>
  );
}

export default RestoranProfile;
