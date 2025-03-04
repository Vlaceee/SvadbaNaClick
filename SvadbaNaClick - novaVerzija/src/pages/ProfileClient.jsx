/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { Rating, Tooltip } from '@mui/material';
import { Select, Option } from '@material-tailwind/react';
import axios from 'axios';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CakeIcon from '@mui/icons-material/Cake';
import CelebrationIcon from '@mui/icons-material/Celebration';
import auth from '../firebase';
import { changeMladenciSchema } from '../schemas/schema';

// prevedeno na eng
function ProfileClient() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [obavestenje, setObavestenje] = useState(false);
  const [brojTelefona, setBrojTelefona] = useState('');
  const [tip, setTip] = useState('');
  const [imeGosta, setImeGosta] = useState('');
  const [prezimeGosta, setPrezimeGosta] = useState('');
  const [brojStola, setBrojStola] = useState('');
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [imePartnera, setImePartnera] = useState('');
  const [prezimePartnera, setPrezimePartnera] = useState('');
  const [email, setEmail] = useState('');
  const [idMLadenci, setIDMLadenci] = useState(0);
  const [fetchedGosti, setFetchedGosti] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [sacuvaniRestorani, setSacuvaniRestorani] = useState([{}]);
  const [sacuvaniDekorateri, setSacuvaniDekorateri] = useState([{}]);
  const [sacuvaniPosalsticari, setSacuvaniPoslasticari] = useState([{}]);
  const [sacuvaniFotografi, setSacuvaniFotografi] = useState([{}]);
  const [changing, setChanging] = useState(false);

  const [idPoslasticara, setIdPoslasticara] = useState(0);
  const [nazivPoslasticara, setNazivPoslasticara] = useState('');
  const [terminPoslasticara, setTerminPoslasticara] = useState('');
  const [nazivTorte, setNazivTorte] = useState('');
  const [cenaPoslasticara, setCenaPoslasticara] = useState(0);

  const [idRestorana, setIdRestorana] = useState(0);
  const [nazivRestorana, setNazivRestorana] = useState('');
  const [terminRestorana, setTerminRestorana] = useState('');
  const [jelovnikZakazan, setJelovnikZakazan] = useState([]);
  const [cenaRestorana, setCenaRestorana] = useState(0);

  const [idFotografa, setIdFotografa] = useState(0);
  const [nazivFotografa, setNazivFotografa] = useState('');
  const [terminFotografa, setTerminFotografa] = useState('');
  const [cenaFotografa, setCenaFotografa] = useState(0);

  const [idDekoratera, setIdDekoratera] = useState(0);
  const [nazivDekoratera, setNazivDekoratera] = useState('');
  const [terminDekoratera, setTerminDekoratera] = useState('');
  const [cenaDekoratera, setCenaDekoratera] = useState(0);

  const [ocenaRestoran, setOcenaRestoran] = useState(0);
  const [ocenaDekorater, setOcenaDekorater] = useState(0);
  const [ocenaFotografa, setOcenaFotografa] = useState(0);
  const [ocenaPoslasticara, setOcenaPoslasticara] = useState(0);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await axios.get(`http://localhost:8080/mladenci/${auth.currentUser.uid}`);
        const fetchedDataMladenci = response.data;

        const responseLikedRestoran = await axios.get(`http://localhost:8080/getLikedRestoran/${auth.currentUser.uid}`);
        const restoranPromises = responseLikedRestoran.data.map((restoran) => axios.get(`http://localhost:8080/restoran/prekoid/${restoran.Restoran_ID}`));
        const likedRestorans = await Promise.all(restoranPromises);
        const likedRestoransData = likedRestorans.map((responselikedData) => responselikedData.data);
        setSacuvaniRestorani(likedRestoransData.flat());

        const responseLikedDekorater = await axios.get(`http://localhost:8080/getLikedDekorater/${auth.currentUser.uid}`);
        const dekorateriPromises = responseLikedDekorater.data.map((dekorater) => axios.get(`http://localhost:8080/dekorater/prekoid/${dekorater.Dekorater_ID}`));
        const likedDekoraters = await Promise.all(dekorateriPromises);
        const likedDekoratersData = likedDekoraters.map((responselikedData) => responselikedData.data);
        setSacuvaniDekorateri(likedDekoratersData.flat());

        const responseLikedPoslasticar = await axios.get(`http://localhost:8080/getLikedPoslasticar/${auth.currentUser.uid}`);
        const poslasticarPromises = responseLikedPoslasticar.data.map((poslasticar) => axios.get(`http://localhost:8080/poslasticar/prekoid/${poslasticar.Poslasticar_ID}`));
        const likedPoslasticars = await Promise.all(poslasticarPromises);
        const likedPoslasticarsData = likedPoslasticars.map((responselikedData) => responselikedData.data);
        setSacuvaniPoslasticari(likedPoslasticarsData.flat());

        const responseLikedFotograf = await axios.get(`http://localhost:8080/getLikedFotograf/${auth.currentUser.uid}`);
        const fotografiPromises = responseLikedFotograf.data.map((fotograf) => axios.get(`http://localhost:8080/fotograf/prekoid/${fotograf.Fotograf_ID}`));
        const likedFotografs = await Promise.all(fotografiPromises);
        const likedFotografsData = likedFotografs.map((responselikedData) => responselikedData.data);
        setSacuvaniFotografi(likedFotografsData.flat());

        const responseZakazano = await axios.get(`http://localhost:8080/zakazanomladencima/prekouid/${auth.currentUser.uid}`);
        const fetchedResponseZakazano = responseZakazano.data;
        console.log(fetchedResponseZakazano);

        setIdPoslasticara(fetchedResponseZakazano[0].Poslasticar_ID);
        setCenaPoslasticara(fetchedResponseZakazano[0].Cena_Poslasticara);
        setTerminPoslasticara(fetchedResponseZakazano[0].Poslasticar_Termin);
        setNazivTorte(fetchedResponseZakazano[0].Naziv_Torte);

        setIdRestorana(fetchedResponseZakazano[0].Restoran_ID);
        setCenaRestorana(fetchedResponseZakazano[0].Cena_Restorana);
        setTerminRestorana(fetchedResponseZakazano[0].Restoran_Termin);
        // get jelovnik

        setIdFotografa(fetchedResponseZakazano[0].Fotograf_ID);
        setTerminFotografa(fetchedResponseZakazano[0].Fotograf_Termin);

        setIdDekoratera(fetchedResponseZakazano[0].Dekorater_ID);
        setTerminDekoratera(fetchedResponseZakazano[0].Dekorater_Termin);

        console.log(sacuvaniRestorani);
        console.log(sacuvaniDekorateri);
        console.log(sacuvaniPosalsticari);
        console.log(sacuvaniFotografi);
        setIDMLadenci(fetchedDataMladenci.ID);
        setIme(fetchedDataMladenci.Ime);
        setPrezime(fetchedDataMladenci.Prezime);
        setImePartnera(fetchedDataMladenci.Ime_Partnera);
        setPrezimePartnera(fetchedDataMladenci.Prezime_Partnera);
        setEmail(fetchedDataMladenci.Email);
        setBrojTelefona(fetchedDataMladenci.Broj_Telefona);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    }

    fetchProfileData();
  }, []);

  useEffect(() => {
    async function fetchGuests() {
      try {
        if (idMLadenci !== 0) {
          const responseGosti = await axios.get(`http://localhost:8080/gosti/${idMLadenci}`);
          const fetchedDataGosti = responseGosti.data;
          fetchedDataGosti.sort((a, b) => a.Broj_Stola - b.Broj_Stola);
          setFetchedGosti(fetchedDataGosti);
        }
      } catch (error) {
        console.error('Failed to fetch guests data:', error);
      }
    }
    fetchGuests();
  }, [idMLadenci]);

  useEffect(() => {
    async function fetchPU() {
      const responseFotografZakazan = await axios.get(`http://localhost:8080/fotograf/prekoid/${idFotografa}`);
      const dataFotograf = responseFotografZakazan.data;
      setNazivFotografa(dataFotograf[0].NazivAgencije);
      setCenaFotografa(dataFotograf[0].Cena_Usluge);
    }
    fetchPU();
  }, [idFotografa]);

  useEffect(() => {
    async function fetchPU() {
      console.log('FETCH PU');
      const responsePoslasticarZakazan = await axios.get(`http://localhost:8080/poslasticar/prekoid/${idPoslasticara}`);
      const dataPoslasticar = responsePoslasticarZakazan.data;
      setNazivPoslasticara(dataPoslasticar[0].Ime);
    }
    fetchPU();
  }, [idPoslasticara]);

  useEffect(() => {
    async function fetchPU() {
      console.log('FETCH PU');
      const responseRestoranZakazan = await axios.get(`http://localhost:8080/restoran/prekoid/${idRestorana}`);
      const dataRestoran = responseRestoranZakazan.data;
      setNazivRestorana(dataRestoran[0].Naziv);
      const responseJelovnik = await axios.get(`http://localhost:8080/jelovnikzakazano/${idMLadenci}`);
      const dataJelovnik = responseJelovnik.data;
      setJelovnikZakazan(dataJelovnik);
      console.log(dataJelovnik);
    }
    fetchPU();
  }, [idRestorana]);

  useEffect(() => {
    async function fetchPU() {
      const responseDekoraterZakazan = await axios.get(`http://localhost:8080/dekorater/prekoid/${idDekoratera}`);
      const dataDekorater = responseDekoraterZakazan.data;
      setNazivDekoratera(dataDekorater[0].Ime);
      setCenaDekoratera(dataDekorater[0].Cena);
    }
    fetchPU();
  }, [idDekoratera]);
  const handleDodaj = async () => {
    if (imeGosta !== '' && prezimeGosta !== '' && brojStola !== '') {
      await fetch('http://localhost:8080/gosti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Ime: imeGosta,
          Prezime: prezimeGosta,
          Broj_Stola: brojStola,
          Mladenci_ID: idMLadenci,
        }),
      });
    }

    const responseGosti = await axios.get(`http://localhost:8080/gosti/${idMLadenci}`);
    console.log(responseGosti);

    const fetchedDataGosti = responseGosti.data;
    console.log(fetchedDataGosti);
    fetchedDataGosti.sort((a, b) => a.Broj_Stola - b.Broj_Stola);
    setFetchedGosti(fetchedDataGosti);
    console.log(fetchedGosti);
    setImeGosta('');
    setPrezimeGosta('');
    setBrojStola('');
  };
  const handleObrisi = async (idg) => {
    try {
      await axios.delete(`http://localhost:8080/gosti/${idg}`);
      const responseGosti = await axios.get(`http://localhost:8080/gosti/${idMLadenci}`);
      const fetchedDataGosti = responseGosti.data;
      fetchedDataGosti.sort((a, b) => a.Broj_Stola - b.Broj_Stola);
      setFetchedGosti(fetchedDataGosti);
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const handleOceniDekoratera = async () => {
    await fetch(`http://localhost:8080/oceneDekorater/${idDekoratera}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Ocena: ocenaDekorater,
      }),
    });
  };
  const handleOceniFotografa = async () => {
    await fetch(`http://localhost:8080/oceneFotograf/${idFotografa}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Ocena: ocenaFotografa,
      }),
    });
  };
  const handleOceniPoslasticara = async () => {
    await fetch(`http://localhost:8080/ocenePoslasticar/${idPoslasticara}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Ocena: ocenaPoslasticara,
      }),
    });
  };
  const handleOceniRestoran = async () => {
    await fetch(`http://localhost:8080/oceneRestoran/${idRestorana}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Ocena: ocenaRestoran,
      }),
    });
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

  const handlePosetiPoslasticara = (id) => {
    navigate(`/poslasticar/${id}`);
  };
  const handlePosetiRestoran = (id) => {
    navigate(`/restoran/${id}`);
  };
  const handlePosetiFotografa = (id) => {
    navigate(`/fotograf/${id}`);
  };
  const handlePosetiDekoratera = (id) => {
    navigate(`/dekorater/${id}`);
  };

  const handleUkloniDekoratera = async (id) => {
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
      setSacuvaniDekorateri((prevDekorateri) => prevDekorateri.filter((dekorater) => dekorater.DekoraterID !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const handleUkloniFotografa = async (id) => {
    try {
      await fetch('http://localhost:8080/deleteLikedEntity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UID: auth.currentUser.uid,
          Type: 'Fotograf',
          EntityID: id,
        }),
      });
      setSacuvaniFotografi((prevFotografi) => prevFotografi.filter((fotograf) => fotograf.FotografID !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const handleUkloniPoslasticara = async (id) => {
    try {
      await fetch('http://localhost:8080/deleteLikedEntity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UID: auth.currentUser.uid,
          Type: 'Poslasticar',
          EntityID: id,
        }),
      });
      setSacuvaniPoslasticari((prevPoslasticari) => prevPoslasticari.filter((poslasticar) => poslasticar.PoslasticarID !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const handleUkloniRestoran = async (id) => {
    try {
      await fetch('http://localhost:8080/deleteLikedEntity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UID: auth.currentUser.uid,
          Type: 'Restoran',
          EntityID: id,
        }),
      });
      setSacuvaniRestorani((prevRestorani) => prevRestorani.filter((restoran) => restoran.ID !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const handleChange = async () => {
    if (changing === true) {
      try {
        const isValid = await changeMladenciSchema.validate({
          ime,
          prezime,
          imePartnera,
          prezimePartnera,
          email,
          brojTelefona,
        });
        console.log(isValid);
        if (isValid) {
          await fetch(`http://localhost:8080/mladenci/${idMLadenci}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Ime: ime,
              Prezime: prezime,
              Ime_Partnera: imePartnera,
              Prezime_Partnera: prezimePartnera,
              Email: email,
              Broj_Telefona: brojTelefona,
            }),
          });
          setChanging(!changing);
        } else {
          setObavestenje(true);
        }
        console.log('Successfully updated the profile');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      setChanging(!changing);
    }
  };

  const overviewDiv = () => (
    <div className="flex w-full flex-col gap-2">
      <div>
        <span className="text-xs ">
          {t('yourName')}
          {' '}
        </span>
        <div className="">
          {' '}
          {ime}
        </div>
      </div>
      <div>
        <span className="text-xs ">
          {t('yourSurname')}
          {' '}
        </span>
        <div className="">
          {prezime}
        </div>
      </div>
      <div>
        <span className="text-xs ">
          {t('partnerName')}
          {' '}
        </span>
        <div className="">
          {imePartnera}
        </div>
      </div>
      <div>
        <span className="text-xs ">
          {t('partnerSurname')}
          {' '}
        </span>
        <div className="">
          {prezimePartnera}
        </div>
      </div>
      <div>
        <span className="text-xs ">{t('E-mail')}</span>
        <div className="">
          {email}
        </div>
      </div>
      <div>
        <span className="text-xs ">{t('Broj Telefona')}</span>
        <div className="">
          {brojTelefona}
        </div>
      </div>
    </div>
  );
  const changingDiv = () => (
    <div className="flex w-full flex-col gap-2">
      <div>
        <span className="text-xs ">
          {t('yourName')}
          {' '}
        </span>
        <div className="">
          {' '}
          <input type="text" className=" rounded-md shadow-md" value={ime} onChange={(e) => setIme(e.target.value)} />
        </div>
      </div>
      <div>
        <span className="text-xs ">
          {t('yourSurname')}
          {' '}
        </span>
        <div className="">
          <input type="text" className=" rounded-md shadow-md" value={prezime} onChange={(e) => setPrezime(e.target.value)} />
        </div>
      </div>
      <div>
        <span className="text-xs ">
          {t('partnerName')}
          {' '}
        </span>
        <div className="">
          <input type="text" className=" rounded-md shadow-md" value={imePartnera} onChange={(e) => setImePartnera(e.target.value)} />
        </div>
      </div>
      <div>
        <span className="text-xs ">
          {t('partnerSurname')}
          {' '}
        </span>
        <div className="">
          <input type="text" className=" rounded-md shadow-md" value={prezimePartnera} onChange={(e) => setPrezimePartnera(e.target.value)} />
        </div>
      </div>
      <div>
        <span className="text-xs ">{t('E-mail')}</span>
        <div className="">
          {email}
        </div>
      </div>
      <div>
        <span className="text-xs ">{t('Broj Telefona')}</span>
        <div className="">
          <input type="text" className=" rounded-md shadow-md" value={brojTelefona} onChange={(e) => setBrojTelefona(e.target.value)} />
        </div>
      </div>
    </div>
  );

  return (
    <Tabs defaultValue={1} className="m-3 flex h-full w-full flex-col justify-center">
      <TabsList className="mx-2 mb-2 flex h-fit flex-row justify-around  rounded-lg bg-snclblue p-4">
        <Tab value={1} className="text-white hover:text-sncdbrown">{t('myProfile')}</Tab>
        <Tab value={2} className="text-white hover:text-sncdbrown">{t('wedding')}</Tab>
        <Tab value={3} className="text-white hover:text-sncdbrown">{t('saved')}</Tab>
        <Tab value={4} className="text-white hover:text-sncdbrown">{t('guests')}</Tab>
      </TabsList>
      <TabPanel value={1} className="flex h-fit">
        {' '}
        <div className=" mx-2 flex w-full flex-col items-center justify-center rounded-md bg-snclbrown p-5 shadow-lg">
          {changing ? changingDiv() : overviewDiv()}
          <div className="flex flex-row gap-2">
            <Button onClick={handleLogout} className="rounded-md bg-snclblue p-2 text-white shadow-md hover:bg-sncdblue">{t('logout')}</Button>
            <Button onClick={handleChange} className="rounded-md bg-snclblue p-2 text-white shadow-md hover:bg-sncdblue">{changing ? 'Sacuvaj' : 'Izmeni'}</Button>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={2}>
        {' '}
        <div className=" flex w-full flex-col gap-3 rounded-md bg-snclbrown p-5 shadow-lg">
          <div className="w-full rounded-lg bg-snclblue p-3 text-white shadow-lg">
            <div className="flex flex-row items-center gap-3">
              <p className="text-lg font-bold">{t('RESTORAN')}</p>
              <RestaurantIcon />
            </div>
            <div>
              <p>{nazivRestorana}</p>
              <p>
                {t('Datum zakazivanja:')}
                {terminRestorana}
              </p>
              {jelovnikZakazan.map((jelo) => (
                <p key={jelo.ID}>
                  {jelo.ImeJela}
                  {' '}
                  {' '}
                  {' '}
                  {jelo.Cena}
                  {' '}
                  {' '}
                  {' '}
                  {t('dinara')}
                </p>
              ))}
              <p>
                {t('Cena po osobi:')}
                {cenaRestorana}
              </p>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-3">
              <Rating
                name="readOnly"
                value={ocenaRestoran}
                onChange={(e) => setOcenaRestoran(e.target.value)}
                precision={1}
                disabled={nazivRestorana === ''}

              />
              {ocenaRestoran}
              <Button onClick={handleOceniRestoran} disabled={nazivRestorana === ''} className={nazivRestorana === '' ? 'rounded-lg bg-sncdbrown p-2 text-sncdblue shadow-md ' : 'rounded-lg bg-snclbrown p-2 text-sncdblue shadow-md hover:bg-sncdbrown'}>{t('Oceni Restoran')}</Button>
            </div>

          </div>
          <div className="w-full rounded-lg bg-snclblue p-3 text-white shadow-lg">
            <div className="flex flex-row items-center gap-3">
              <p className="text-lg font-bold">{t('POSLASTICAR')}</p>
              <CakeIcon />
            </div>
            <div>
              <p>{nazivPoslasticara}</p>
              <p>
                {t('Datum zakazivanja:')}
                {terminPoslasticara}
              </p>
              <p>
                {t('Izabrana torta:')}
                {nazivTorte}
              </p>
              <p>
                {t('Cena:')}
                {cenaPoslasticara}
              </p>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-3">
              <Rating
                name="readOnly"
                value={ocenaPoslasticara}
                onChange={(e) => setOcenaPoslasticara(e.target.value)}
                precision={1}
                disabled={nazivPoslasticara === ''}
              />
              {ocenaPoslasticara}
              <Button onClick={handleOceniPoslasticara} disabled={nazivPoslasticara === ''} className={nazivPoslasticara === '' ? 'rounded-lg bg-sncdbrown p-2 text-sncdblue shadow-md ' : 'rounded-lg bg-snclbrown p-2 text-sncdblue shadow-md hover:bg-sncdbrown'}>{t('Oceni poslasticara')}</Button>
            </div>

          </div>
          <div className="w-full rounded-lg bg-snclblue p-3 text-white shadow-lg">
            <div className="flex flex-row items-center gap-3">
              <p className="text-lg font-bold">{t('FOTOGRAF')}</p>
              <CameraAltIcon />
            </div>
            <div>
              <p>{nazivFotografa}</p>
              <p>
                {t('Datum zakazivanja:')}
                {terminFotografa}
              </p>
              <p>
                {t('Cena:')}
                {cenaFotografa}
              </p>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-3">
              <Rating
                name="readOnly"
                value={ocenaFotografa}
                onChange={(e) => setOcenaFotografa(e.target.value)}
                precision={1}
                disabled={nazivFotografa === ''}

              />
              {ocenaFotografa}
              <Button onClick={handleOceniFotografa} disabled={nazivFotografa === ''} className={nazivFotografa === '' ? 'rounded-lg bg-sncdbrown p-2 text-sncdblue shadow-md ' : 'rounded-lg bg-snclbrown p-2 text-sncdblue shadow-md hover:bg-sncdbrown'}>{t('Oceni fotografa')}</Button>
            </div>

          </div>
          <div className="w-full rounded-lg bg-snclblue p-3 text-white shadow-lg">
            <div className="flex flex-row items-center gap-3">
              <p className="text-lg font-bold">{t('DEKORATER')}</p>
              <CelebrationIcon />
            </div>
            <div>
              <p>{nazivDekoratera}</p>
              <p>
                {t('Datum zakazivanja:')}
                {terminDekoratera}
              </p>
              <p>
                {t('Cena:')}
                {cenaDekoratera}
              </p>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-3">
              <Rating
                name="readOnly"
                value={ocenaDekorater}
                onChange={(e) => setOcenaDekorater(e.target.value)}
                precision={1}
                disabled={nazivDekoratera === ''}
              />
              {ocenaDekorater}
              <Button onClick={handleOceniDekoratera} disabled={nazivDekoratera === ''} className={nazivDekoratera === '' ? 'rounded-lg bg-sncdbrown p-2 text-sncdblue shadow-md ' : 'rounded-lg bg-snclbrown p-2 text-sncdblue shadow-md hover:bg-sncdbrown'}>{t('Oceni dekoratera')}</Button>
            </div>
          </div>

        </div>
      </TabPanel>
      <TabPanel value={3}>
        {' '}
        <div className=" flex w-full flex-col rounded-md bg-snclbrown p-5 shadow-lg">
          <p className="mb-3 text-2xl font-bold text-white">{t('savedServices')}</p>

          <div className="flex w-full flex-row  flex-wrap items-center justify-center ">
            <div className=" my-2 flex h-fit flex-col items-center gap-3 rounded-md bg-snclblue p-5 text-white shadow-lg">
              <Select label="Odaberi opciju" className="text-white" value={tip} onChange={(val) => setTip(val)}>
                <Option value="Sve">Sve</Option>
                <Option value="Fotograf">{t('Fotograf')}</Option>
                <Option value="Poslasticar">{t('Poslasticar')}</Option>
                <Option value="Restoran">{t('Restoran')}</Option>
                <Option value="Dekorater">{t('Dekorater')}</Option>
              </Select>
            </div>
            <div className="mx-3 w-4/5">
              {(tip === 'Restoran' || tip === 'Sve' || tip === '') && sacuvaniRestorani.map((oglas) => (
                <div className="my-2 flex w-full flex-row justify-between rounded-md  bg-snclblue p-4 pr-10 text-xl text-white shadow-sm" key={`RESTORAN${oglas.ID}`}>
                  <div>
                    {t('Restoran')}
                    {' '}
                    -
                    {' '}
                    {oglas.Naziv}

                  </div>
                  <div>
                    <Tooltip title="Ukloni" arrow placement="top">
                      <Button className="mx-1 rounded-lg  px-3 py-1 text-center text-xs text-white hover:text-sncdblue" onClick={() => handleUkloniRestoran(oglas.ID)}>
                        <HeartBrokenIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Poseti" arrow placement="top">
                      <Button className="mx-1 rounded-lg  px-3 py-1 text-center text-xs text-white hover:text-sncdblue" onClick={() => handlePosetiRestoran(oglas.ID)}>
                        <ArrowForwardIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}
              {(tip === 'Dekorater' || tip === 'Sve' || tip === '') && sacuvaniDekorateri.map((oglas) => (
                <div className="my-2 flex w-full flex-row justify-between rounded-md  bg-snclblue p-4 pr-10 text-xl text-white shadow-sm" key={`DEKORATER${oglas.DekoraterID}`}>
                  <div>
                    {t('Dekorater')}
                    {' '}
                    -
                    {' '}
                    {oglas.Ime}

                  </div>
                  <div>
                    <Tooltip title="Ukloni" arrow placement="top">
                      <Button className="mx-1 rounded-lg  px-3 py-1 text-center text-xs text-white hover:text-sncdblue" onClick={() => handleUkloniDekoratera(oglas.DekoraterID)}>
                        <HeartBrokenIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Poseti" arrow placement="top">
                      <Button className="mx-1 rounded-lg  px-3 py-1 text-center text-xs text-white hover:text-sncdblue" onClick={() => handlePosetiDekoratera(oglas.DekoraterID)}>
                        <ArrowForwardIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}
              {(tip === 'Fotograf' || tip === 'Sve' || tip === '') && sacuvaniFotografi.map((oglas) => (
                <div className="my-2 flex w-full flex-row justify-between rounded-md  bg-snclblue p-4 pr-10 text-xl text-white shadow-sm" key={`FOTOGRAF${oglas.FotografID}`}>
                  <div>
                    {t('Fotograf')}
                    {' '}
                    -
                    {' '}
                    {oglas.NazivAgencije}

                  </div>
                  <div>
                    <Tooltip title="Ukloni" arrow placement="top">
                      <Button className="mx-1 rounded-lg  px-3 py-1 text-center text-xs text-white hover:text-sncdblue" onClick={() => handleUkloniFotografa(oglas.FotografID)}>
                        <HeartBrokenIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Poseti" arrow placement="top">
                      <Button className="mx-1 rounded-lg  px-3 py-1 text-center text-xs text-white hover:text-sncdblue" onClick={() => handlePosetiFotografa(oglas.FotografID)}>
                        <ArrowForwardIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}
              {(tip === 'Poslasticar' || tip === 'Sve' || tip === '') && sacuvaniPosalsticari.map((oglas) => (
                <div className="my-2 flex w-full flex-row justify-between rounded-md  bg-snclblue p-4 pr-10 text-xl text-white shadow-sm" key={`POSALSTICAR${oglas.PoslasticarID}`}>
                  <div>
                    {t('Poslasticar')}
                    {' '}
                    -
                    {' '}
                    {oglas.Ime}
                  </div>
                  <div>
                    <Tooltip title="Ukloni" arrow placement="top">
                      <Button className="mx-1 rounded-lg  px-3 py-1 text-center text-xs text-white hover:text-sncdblue" onClick={() => handleUkloniPoslasticara(oglas.PoslasticarID)}>
                        <HeartBrokenIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Poseti" arrow placement="top">
                      <Button className="mx-1 rounded-lg  px-3 py-1 text-center text-xs text-white hover:text-sncdblue" onClick={() => handlePosetiPoslasticara(oglas.PoslasticarID)}>
                        <ArrowForwardIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={4}>
        {' '}

        <div className="flex flex-col rounded-md bg-snclbrown p-5 shadow-lg">
          <div className=" flex w-full flex-row justify-center gap-3 ">
            <input type="text" placeholder={t('guestName')} value={imeGosta} onChange={(e) => setImeGosta(e.target.value)} className="h-8 w-32  rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue" />
            <input type="text" placeholder={t('guestSurname')} value={prezimeGosta} onChange={(e) => setPrezimeGosta(e.target.value)} className="h-8 w-32  rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue" />
            <input type="number" placeholder={t('tableNumber')} value={brojStola} onChange={(e) => setBrojStola(e.target.value)} className="h-8 w-32  rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue" />
            <Button className="h-8 w-24 rounded-md bg-snclblue text-white shadow-lg hover:bg-sncdblue " onClick={handleDodaj}>
              {t('add')}
            </Button>
          </div>
          <div>
            {fetchedGosti.map((gost, index) => (
              <div key={gost.ID}>
                <div className="m-3 flex flex-row items-center justify-center gap-2">
                  <p>
                    {gost.Ime}
                    {' '}
                    {gost.Prezime}
                    ,
                    {' '}

                    <span className="text-sncpink">
                      {t('tableNumber')}
                      :
                      {' '}
                    </span>
                    {' '}
                    {gost.Broj_Stola}
                  </p>
                  <div>
                    <Button
                      className="rounded-lg bg-sncpink p-1 px-2 text-white shadow-lg hover:bg-sncdblue"
                      onClick={() => { console.log(gost.ID); handleObrisi(gost.ID); }}
                    >
                      X
                    </Button>

                  </div>
                </div>
                {index < fetchedGosti.length - 1 && fetchedGosti[index + 1].Broj_Stola !== gost.Broj_Stola && (
                <hr className="my-4 w-full bg-sncdbrown" />
                )}
              </div>
            ))}

          </div>

        </div>
      </TabPanel>
    </Tabs>
  );
}

export default ProfileClient;
