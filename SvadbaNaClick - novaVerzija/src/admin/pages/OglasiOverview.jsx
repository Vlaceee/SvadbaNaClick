/* eslint-disable no-empty-function */
/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, React, useEffect } from 'react';
import axios from 'axios';
import { Update } from '@mui/icons-material';
import FotografClass from '../../OglasiComponents/FotografClass';
// eslint-disable-next-line import/no-unresolved
import Baker from '../../OglasiComponents/BakerClass';
import Torta from '../../OglasiComponents/Torta';
import { Foods, Jelo, Pice } from '../../OglasiComponents/Food';
import Restoran from '../../OglasiComponents/RestorasClass';
import Dekorater from '../../OglasiComponents/DekoracijeClass';

// Engleski PREVEDENO
function OglasiOverview() {
  const [listaFotografa, setlistaFotografa] = useState([]);
  const [listaDekorater, setlistaDekorater] = useState([]);
  const [listaBaker, setlistaBaker] = useState([]);
  const [listaRestoran, setlistaRestoran] = useState([]);
  const [ListAll, setListAll] = useState([]);
  const [VisibleAds, setVisibleAds] = useState([false, false, false, false]); // Fotograf,Dekorater,Baker,Restoran
  const [NazivAgencije, setNazivAgencije] = useState('');
  const [Lokacija, setLokacija] = useState('');
  const [Email, setEmail] = useState('');
  const [MinServicePrice, setMinServicePrice] = useState(0);
  const [MaxServicePrice, setMaxServicePrice] = useState(2000000000);
  const [currentPage, setCurrentPage] = useState(1);
  const [ChangingValue, setChangingValue] = useState('');
  const [ChangingType, setChangingType] = useState('Tip nije pronadjen');
  const [inputType, setInputType] = useState('text'); // Default input type
  const [ChangingObject, setChangingObject] = useState([]);
  const [AttributeName, setAttributeName] = useState('');
  const [tipPruzaoca, settipPruzaoca] = useState('Jos niste izabrali pruzaoca usluga...');
  const [SwappingID, setSwappingID] = useState(0);
  const [ChangeBox, setChangeBox] = useState(false);

  const [FromDate, setFromDate] = useState(new Date(2000, 1, 1));
  const [ToDate, setToDate] = useState(new Date(2030, 1, 1));

  const itemsPerPage = 4; // Number of items per page
  const { t } = useTranslation();
  const [filteredList, setFilteredList] = useState([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    console.log('ListAll has been updated:', ListAll);
  }, [ListAll]);

  useEffect(() => {
    const updatedFilteredList = ListAll.filter((item) => {
      if (
        item._NazivAgencije.toLowerCase().includes(NazivAgencije.toLowerCase())
        && item._Lokacija.toLowerCase().includes(Lokacija.toLowerCase())
        && item._Email.toLowerCase().includes(Email.toLowerCase())
      ) {
        if (
          item.type === 'Fotograf'
          && new Date(item._Datumosnivanja).getTime() >= FromDate.getTime()
          && new Date(item._Datumosnivanja).getTime() <= ToDate.getTime()
          && item._CenaUsluge >= MinServicePrice
          && item._CenaUsluge <= MaxServicePrice
        ) {
          return true;
        }
        if (
          item.type === 'Baker'
          && new Date(item._DatumOsnivanja).getTime() >= FromDate.getTime()
          && new Date(item._DatumOsnivanja).getTime() <= ToDate.getTime()
          && item._CenaPosiljke >= MinServicePrice
          && item._CenaPosiljke <= MaxServicePrice
        ) {
          return true;
        }
        if (
          item.type === 'Dekorater'
          && new Date(item._DatumOsnivanja).getTime() >= FromDate.getTime()
          && new Date(item._DatumOsnivanja).getTime() <= ToDate.getTime()
          && item._CenaUsluge >= MinServicePrice
          && item._CenaUsluge <= MaxServicePrice
        ) {
          return true;
        }
        if (
          item.type === 'Restoran'
          && new Date(item._DatumOsnivanja).getTime() >= FromDate.getTime()
          && new Date(item._DatumOsnivanja).getTime() <= ToDate.getTime()
          && item._CenaUsluge >= MinServicePrice
          && item._CenaUsluge <= MaxServicePrice
        ) {
          return true;
        }
      }
      return false;
    });

    setFilteredList(updatedFilteredList);
    console.log(updatedFilteredList);
  }, [ListAll, NazivAgencije, Lokacija, Email, MaxServicePrice, MinServicePrice, FromDate, ToDate, listaFotografa, listaBaker, listaDekorater, listaRestoran]);

  const FillRestoran = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restoran');
      const fetchedData = response.data;
      console.log('Restoran vracanje');
      console.log(fetchedData);
      const restoranList = fetchedData.map((item) => ({
        ...new Restoran(item.Naziv, item.Email, item.Cena, item.Jelovnik, item.Kratak_Opis, new Date(item.Datum_Osnivanja), item.SigurnosniKod, item.Slobodni_Termini, item.RestoranPraviTortu, item.Bend, item.Lokacija),
        type: 'Restoran',
        ID: item.ID,
        Ocena: item.Ocena,
      }));
      setlistaRestoran(restoranList);
      console.log(restoranList);
    } catch (error) {
      console.error('Error fetching Restoran data:', error);
    }
  };

  const FillBaker = async () => {
    try {
      const response = await axios.get('http://localhost:8080/poslasticar');
      const fetchedData = response.data;
      // Bio je cist datum osnivanja
      const bakerList = fetchedData.map((item) => ({
        ...new Baker(item.Ime, item.Email, item.Cena_Posiljke, item.Kratak_Opis, new Date(item.Datum_Osnivanja), null, item.Torte, item.Slobodni_Termini, item.Lokacija),
        type: 'Baker',
        ID: item.ID,
        Prezime: item.Prezime,
        Ocena: item.Ocena,
      }));
      setlistaBaker(bakerList);
      console.log('Lista poslasticara');
      console.log(bakerList);
    } catch (error) {
      console.error('Error fetching Baker data:', error);
    }
  };

  const FillDekorater = async () => {
    try {
      const response = await axios.get('http://localhost:8080/dekorater'); // NazivAgencije, Email, CenaUsluge, DatumOsnivanja, SigurnosniKod, SlobodniTermini, Lokacija, OpisKompanije
      const fetchedData = response.data;
      // console.log('Dekorater ');
      // console.log(fetchedData);

      const dekoraterList = fetchedData.map((item) => ({ //
        ...new Dekorater(item.Ime, item.Email, item.Cena, new Date(item.Datum_Osnivanja), null, item.Slobodni_Termini, item.Lokacija, item.Kratak_Opis),
        type: 'Dekorater',
        ID: item.DekoraterID,
        Ocena: item.Ocena,
      }));
      console.log('Kako izgleda lista Dekoratera koji se konkatenira!');
      setlistaDekorater(dekoraterList);
      console.log(dekoraterList); // kad se pretvori u objekat ima _ ispred _NazivAgencije
    } catch (error) {
      console.error('Error fetching Dekorater data:', error);
    }
  };

  const FillFotograf = async () => {
    try {
      const response = await axios.get('http://localhost:8080/fotograf');
      const fetchedData = response.data;
      console.log('Ovo je fetchovan data');
      console.log(fetchedData);
      // NazivAgencije, Email, SigurnosniKod, CenaUsluge, Cenaposlici, Datumosnivanja, OpisKompanije, SlobodniTermini, Lokacija
      const fotografList = fetchedData.map((item) => ({
        ...new FotografClass(
          item.NazivAgencije,
          item.Email,
          '1213412',
          item.Cena_Usluge,
          item.Cena_Po_Slici,
          new Date(item.Datum_Osnivanja), // Assuming Datum_Osnivanja is a valid date string
          item.Opis_Kompanije,
          item.Slobodni_Termini,
          item.Lokacija,

          // ID je ID
        ), //

        ID: item.FotografID,
        type: 'Fotograf',
        Ocena: item.Ocena,
      }));
      // console.log(fetchedData[0].Lokacija);
      setlistaFotografa(fotografList);
      console.log('ovde je fotograf prvobitno');
      console.log(fotografList); // ovde dobro stize
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  async function UpdateFotograf() {
    console.log(ChangingObject);
    const updatedObject = { ...ChangingObject, [AttributeName]: ChangingValue };
    const updatedObjectv1 = {
      NazivAgencije: updatedObject._NazivAgencije,
      Opis_Kompanije: updatedObject._OpisKompanije,
      Email: updatedObject._Email,
      SigurnosniKod: updatedObject._SigurnosniKod,
      Cena_Usluge: updatedObject._CenaUsluge,
      Cena_Po_Slici: updatedObject._Cenaposlici,
      Lokacija: updatedObject._Lokacija,
      Datum_Osnivanja: updatedObject._Datumosnivanja,
      Ocena: updatedObject.Ocena,
    };
    console.log(updatedObjectv1);

    try {
      const response = await axios.put(`http://localhost:8080/fotograf/${ChangingObject.ID}`, updatedObjectv1);
      console.log('Update response:', response.data);

      if (inputType === 'date') {
        updatedObject._Datumosnivanja = new Date(ChangingValue); // Correct date update
      }

      // Update listaFotografa with the updated object
      const updatedList = listaFotografa.map((item) => (item.ID === ChangingObject.ID ? updatedObject : item));

      setlistaFotografa(updatedList); // Ensure listaFotografa is updated
      setListAll((prevListAll) => prevListAll.map((item) => (item.ID === ChangingObject.ID && item.type == 'Fotograf' ? updatedObject : item))); // Update ListAll as well
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  async function UpdateDekorater() {
    console.log(ChangingObject);
    const updatedObject = { ...ChangingObject, [AttributeName]: ChangingValue };
    const updatedObjectv1 = {
      Ime: updatedObject._NazivAgencije,
      Kratak_Opis: updatedObject._OpisKompanije,
      Email: updatedObject._Email,
      Cena: updatedObject._CenaUsluge,
      Lokacija: updatedObject._Lokacija,
      Datum_Osnivanja: updatedObject._DatumOsnivanja,
      Ocena: updatedObject.Ocena,
    };
    console.log('Ovo je poslat objekat');
    console.log(updatedObjectv1);

    try {
      const response = await axios.put(`http://localhost:8080/dekorater/${ChangingObject.ID}`, updatedObjectv1);
      console.log('Update response:', response.data);

      if (inputType === 'date') {
        updatedObject._DatumOsnivanja = new Date(ChangingValue); // Correct date update
      }

      // Update listaFotografa with the updated object
      const updatedList = listaDekorater.map((item) => (item.ID === ChangingObject.ID ? updatedObject : item));

      setlistaDekorater(updatedList); // Ensure listaFotografa is updated
      setListAll((prevListAll) => prevListAll.map((item) => (item.ID === ChangingObject.ID && item.type == 'Dekorater' ? updatedObject : item))); // Update ListAll as well
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  async function UpdatePoslasticar() {
    console.log(ChangingObject);
    const updatedObject = { ...ChangingObject, [AttributeName]: ChangingValue };
    const updatedObjectv1 = {
      Ime: updatedObject._NazivAgencije,
      Prezime: updatedObject.Prezime,
      Kratak_Opis: updatedObject._OpisPosla,
      Email: updatedObject._Email,
      Cena_Posiljke: updatedObject._CenaPosiljke,
      Lokacija: updatedObject._Lokacija,
      Datum_Osnivanja: updatedObject._DatumOsnivanja,
      Ocena: updatedObject.Ocena,
    };
    console.log(updatedObjectv1);

    try {
      const response = await axios.put(`http://localhost:8080/poslasticar/admin/${ChangingObject.ID}`, updatedObjectv1);
      console.log('Update response:', response.data);

      if (inputType === 'date') {
        updatedObject._DatumOsnivanja = new Date(ChangingValue); // Correct date update
      }

      // Update listaFotografa with the updated object
      const updatedList = listaBaker.map((item) => (item.ID === ChangingObject.ID ? updatedObject : item));

      setlistaBaker(updatedList);
      setListAll((prevListAll) => prevListAll.map((item) => (item.ID === ChangingObject.ID && item.type == 'Baker' ? updatedObject : item))); // Update ListAll as well
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  async function UpdateSlobodanTermin() {
    console.log(ChangingObject);

    const updatedObjectv1 = {
      Slobodan_Termin: ChangingValue,

    };
    console.log('Nova vrednost:');
    console.log(updatedObjectv1);

    try {
      const response = await axios.put(`http://localhost:8080/slobodnitermini/${SwappingID}`, updatedObjectv1);
      console.log('Update response:', response.data);
      // Ceo objekat da napravim
      const updatedObject = {
        Slobodan_Termin: ChangingValue,
        ID: SwappingID,
      };
      ChangingObject._SlobodniTermini = ChangingObject._SlobodniTermini.map((date) => (date.ID === SwappingID ? updatedObject : date));
      let updatedList;
      console.log('Promenjen objekat');
      console.log(ChangingObject);
      // Update listaFotografa with the updated object
      if (ChangingObject.type == 'Fotograf') {
        updatedList = listaFotografa.map((item) => (item.ID === ChangingObject.ID ? ChangingObject : item));
      } else if (ChangingObject.type == 'Dekorater') {
        updatedList = listaDekorater.map((item) => (item.ID === ChangingObject.ID ? ChangingObject : item));
      } else if (ChangingObject.type == 'Baker') {
        updatedList = listaBaker.map((item) => (item.ID === ChangingObject.ID ? ChangingObject : item));
      } else {
        updatedList = listaRestoran.map((item) => (item.ID === ChangingObject.ID ? ChangingObject : item));
        // Restoran
      }

      setlistaBaker(updatedList);
      setListAll((prevListAll) => prevListAll.map((item) => (item.ID === ChangingObject.ID && item.type == ChangingObject.type ? ChangingObject : item))); // Update ListAll as well
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  async function UpdateRestoran() {
    console.log(ChangingObject);
    const updatedObject = { ...ChangingObject, [AttributeName]: ChangingValue };
    const updatedObjectv1 = {
      Naziv: updatedObject._NazivAgencije,
      Bend: updatedObject._Bend,
      Kratak_Opis: updatedObject._OpisPosla,
      Email: updatedObject._Email,
      Cena: updatedObject._CenaUsluge,
      Lokacija: updatedObject._Lokacija,
      Datum_Osnivanja: updatedObject._DatumOsnivanja,
      SlobodniTermini: updatedObject._SlobodniTermini,
      RestoranPraviTortu: updatedObject._RestoranPraviTortu,
      Ocena: updatedObject.Ocena,
    };
    console.log(updatedObjectv1);

    try {
      const response = await axios.put(`http://localhost:8080/restoran/prekoid/${ChangingObject.ID}`, updatedObjectv1);
      console.log('Update response:', response.data);

      if (inputType === 'date') {
        updatedObject._DatumOsnivanja = new Date(ChangingValue); // Correct date update
      }
      if (AttributeName === '_RestoranPraviTortu') {
        updatedObject._RestoranPraviTortu = parseInt(ChangingValue, 10);
      }

      // Update listaFotografa with the updated object
      const updatedList = listaRestoran.map((item) => (item.ID === ChangingObject.ID ? updatedObject : item));

      setlistaRestoran(updatedList);
      setListAll((prevListAll) => prevListAll.map((item) => (item.ID === ChangingObject.ID && item.type == 'Restoran' ? updatedObject : item))); // Update ListAll as well
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  async function DeleteFotograf() {
    try {
      const response = await axios.delete(`http://localhost:8080/fotograf/${ChangingObject.ID}`);

      setListAll((prevListAll) => prevListAll.filter((item) => item.ID !== ChangingObject.ID && item.type == ChangingObject.type)); // Remove from ListAll
      setlistaFotografa((prevListaFotografa) => prevListaFotografa.filter((item) => item.ID !== ChangingObject.ID)); // Remove from listaFotografa
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }
  async function DeleteDekorater() {
    try {
      const response = await axios.delete(`http://localhost:8080/dekorater/${ChangingObject.ID}`);

      setListAll((prevListAll) => prevListAll.filter((item) => item.ID !== ChangingObject.ID && item.type == ChangingObject.type)); // Remove from ListAll
      setlistaDekorater((prevListaDekorater) => prevListaDekorater.filter((item) => item.ID !== ChangingObject.ID)); // Remove from listaDekorater
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  async function DeletePoslasticar() {
    try {
      const response = await axios.delete(`http://localhost:8080/poslasticar/${ChangingObject.ID}`);

      setListAll((prevListAll) => prevListAll.filter((item) => item.ID !== ChangingObject.ID && item.type == ChangingObject.type)); // Remove from ListAll
      setlistaBaker((prevListaPoslasticara) => prevListaPoslasticara.filter((item) => item.ID !== ChangingObject.ID)); // Remove from listaPoslasticara
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  async function DeleteRestoran() {
    try {
      const response = await axios.delete(`http://localhost:8080/restoran/${ChangingObject.ID}`);

      setListAll((prevListAll) => prevListAll.filter((item) => item.ID !== ChangingObject.ID && item.type == ChangingObject.type)); // Remove from ListAll
      setlistaRestoran((prevListaRestorana) => prevListaRestorana.filter((item) => item.ID !== ChangingObject.ID)); // Remove from listaRestorana
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  useEffect(() => {
    FillFotograf();
    FillBaker();
    FillDekorater();
    FillRestoran();
  }, []);

  const updateListAll = (visibleAds) => {
    let combinedList = [];
    if (visibleAds[0]) combinedList = combinedList.concat(listaFotografa);
    if (visibleAds[1]) combinedList = combinedList.concat(listaBaker);
    if (visibleAds[2]) combinedList = combinedList.concat(listaDekorater);
    if (visibleAds[3]) combinedList = combinedList.concat(listaRestoran);

    setListAll(combinedList);
  };

  const updateVisibleAds = (index) => {
    const updatedVisibleAds = [...VisibleAds];
    updatedVisibleAds[index] = !updatedVisibleAds[index];
    setVisibleAds(updatedVisibleAds);
    updateListAll(updatedVisibleAds);
  };

  const formatDateToLocal = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().split('T')[0];
  };

  const handleButtonClick = (typeofinput, inputvalue, ceoObjekat, datenum, NazivAtributa, ID) => {
    console.log(ID);
    setSwappingID(ID);
    setAttributeName(NazivAtributa);
    setChangingObject(ceoObjekat);
    settipPruzaoca(ceoObjekat.type);
    if (typeofinput === 'date') {
      setChangeBox(false);
      const date = new Date(inputvalue);
      const formattedDate = formatDateToLocal(date);
      setInputType(typeofinput);
      setChangingValue(formattedDate);
    } else if (typeofinput == 'textArea') {
      setChangeBox(true);
      setInputType(typeofinput);
      setChangingValue(inputvalue);
    } else {
      setChangeBox(false);
      setInputType(typeofinput);
      setChangingValue(inputvalue);
    }
  };
  const HandleDeleteButton = async () => {
    if (!ChangingObject || !AttributeName) {
      console.error('Missing ChangingObject or AttributeName');
    }
    if (ChangingObject.type == 'Fotograf') {
      console.log('Brisem Fotografa!');
      DeleteFotograf();
    } else if (ChangingObject.type == 'Dekorater') {
      console.log('Brisem Dekoratera!');
      DeleteDekorater();
    } else if (ChangingObject.type == 'Baker') {
      console.log('Brisem Poslasticara');
      DeletePoslasticar();
    } else {
      console.log('Brisem Restoran');
      DeleteRestoran();
    }
  };

  const updateDatabase = async () => {
    if (!ChangingObject || !AttributeName) {
      console.error('Missing ChangingObject or AttributeName');
      return;
    }
    if (AttributeName == '_SlobodniTermini') {
      UpdateSlobodanTermin();
      return;
    }
    if (ChangingObject.type == 'Fotograf') {
      console.log('Menjam Fotografa!');
      UpdateFotograf();
    } else if (ChangingObject.type == 'Dekorater') {
      console.log('Menjam Dekoratera!');
      UpdateDekorater();
    } else if (ChangingObject.type == 'Baker') {
      console.log('Menjam Poslasticara');
      UpdatePoslasticar();
    } else {
      console.log('Menjam Restoran');
      UpdateRestoran();
    }
  };

  const handleUpdateClick = () => {
    updateDatabase();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="m-3 flex w-full flex-row gap-3">
      <div className="h-full w-1/5 rounded-lg bg-snclbrown p-3 text-center shadow-lg">
        <p>{t('filtering')}</p>
        <div className="mt-5">
          <h4>{t('Date of Establishment')}</h4>
          <h3>{t('From')}</h3>
          <input
            type="date"
            placeholder={t('Date of Establishment')}
            className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue"
            value={FromDate.toLocaleDateString('en-CA')}
            onChange={(e) => setFromDate(new Date(e.target.value))}
          />
          <h3>{t('To')}</h3>
          <input
            type="date"
            placeholder={t('Date of Establishment')}
            className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue"
            value={ToDate.toLocaleDateString('en-CA')}
            onChange={(e) => setToDate(new Date(e.target.value))}
          />

          <input
            value={NazivAgencije}
            onChange={(e) => setNazivAgencije(e.target.value)}
            placeholder={t('name')}
            className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue"
          />
          <input
            value={Lokacija}
            onChange={(e) => setLokacija(e.target.value)}
            placeholder={t('location')}
            className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue"
          />

          <input value={Email} onChange={(e) => setEmail(e.target.value)} placeholder={t('E-mail')} className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue" />
          <input value={MinServicePrice} onChange={(e) => setMinServicePrice(e.target.value)} placeholder={t('Minimal Service Price')} className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue" />
          <input value={MaxServicePrice} onChange={(e) => setMaxServicePrice(e.target.value)} placeholder={t('Maximum Service Price')} className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue" />

          <div className="h-auto w-full">
            <h3 className="mb-2 mt-2">{t('adminPageChangeValue')}</h3>
            <h4>
              {t('typeOfAdd')}
              {' '}
              {tipPruzaoca}
              {' '}

            </h4>
            <h4>
              {t('adminChangingValue')}
              {AttributeName}
            </h4>

            {ChangeBox ? (
              <textarea
                id="w3review"
                name="w3review"
                rows="4"
                cols="33"
                value={ChangingValue}
                onChange={(e) => setChangingValue(e.target.value)}
              />
            ) : (
              <input
                type={inputType}
                value={ChangingValue}
                onChange={(e) => setChangingValue(e.target.value)}
                placeholder={t('Waiting for button click...')}
                className="mb-2 mt-4 w-full min-w-44 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue"
              />
            )}
            <button type="button" onClick={handleUpdateClick} className="mx-4 mt-2 h-10 w-8 rounded-sm bg-cyan-900 text-center hover:bg-sncpink">
              {' '}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
            <button type="button" onClick={HandleDeleteButton} className="mx-4 mt-2 h-10 w-8 rounded-sm bg-cyan-900 text-center hover:bg-sncpink">
              {' '}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
              </svg>

            </button>
          </div>
        </div>
      </div>
      <div className="h-full w-4/5 rounded-lg bg-snclbrown p-3 shadow-lg">
        <div>
          {t('addOverview')}
          <button type="button" className={`ml-4 rounded-md text-white shadow-lg hover:bg-sncdblue ${VisibleAds[0] == true ? 'bg-sncpink' : 'bg-snclblue'}`} onClick={() => updateVisibleAds(0)}>{t('Show Fotograf')}</button>
          <button type="button" className={`ml-4 rounded-md text-white shadow-lg hover:bg-sncdblue ${VisibleAds[2] == true ? 'bg-sncpink' : 'bg-snclblue'}`} onClick={() => updateVisibleAds(2)}>{t('Show Dekorater')}</button>
          <button type="button" className={`ml-4 rounded-md text-white shadow-lg hover:bg-sncdblue ${VisibleAds[1] == true ? 'bg-sncpink' : 'bg-snclblue'}`} onClick={() => updateVisibleAds(1)}>{t('Show Baker')}</button>
          <button type="button" className={`ml-4 rounded-md text-white shadow-lg hover:bg-sncdblue ${VisibleAds[3] == true ? 'bg-sncpink' : 'bg-snclblue'}`} onClick={() => updateVisibleAds(3)}>{t('Show Restoran')}</button>
        </div>
        <div className="mt-5 ">
          {currentItems.map((item, index) => (
            <div className="mx-4 mb-2 flex w-full flex-col  rounded-lg bg-sncdbrown p-3 text-white hover:bg-snclblue" key={index}>
              <div className="flex h-1/6 items-center">
                <div>
                  {item.type}
                  {' '}
                  ID:
                  {item.ID}
                </div>
              </div>
              <div>
                {item.type === 'Fotograf' && (
                <>
                  <button onClick={() => handleButtonClick('text', item._NazivAgencije, item, 0, '_NazivAgencije', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._NazivAgencije}</button>
                  <button onClick={() => handleButtonClick('text', item._Email, item, 0, '_Email', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Email}</button>
                  <button onClick={() => handleButtonClick('text', item.Ocena, item, 0, 'Ocena', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Ocena}</button>
                  <button onClick={() => handleButtonClick('text', item._CenaUsluge, item, 0, '_CenaUsluge', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._CenaUsluge}</button>
                  <button onClick={() => handleButtonClick('text', item._Cenaposlici, item, 0, '_Cenaposlici', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Cenaposlici}</button>

                  <button onClick={() => handleButtonClick('textArea', item._OpisKompanije, item, 0, '_OpisKompanije', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">Opis Kompanije</button>

                  <button onClick={() => handleButtonClick('text', item._Lokacija, item, 0, '_Lokacija', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Lokacija}</button>
                  {item._SlobodniTermini.map((dateObj, dateIndex) => {
                    const date = new Date(dateObj.Slobodan_Termin);
                    return (
                      <button onClick={() => handleButtonClick('date', date.toDateString(), item, dateIndex, '_SlobodniTermini', dateObj.ID)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink" key={dateIndex}>
                        {date.toDateString()}
                      </button>
                    );
                  })}
                  <button onClick={() => handleButtonClick('date', item._Datumosnivanja.toDateString(), item, 0, '_Datumosnivanja', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Datumosnivanja.toDateString()}</button>

                </>

                )}

                {item.type === 'Dekorater' && (
                <>
                  <button onClick={() => handleButtonClick('text', item._NazivAgencije, item, 0, '_NazivAgencije', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._NazivAgencije}</button>
                  <button onClick={() => handleButtonClick('text', item._Email, item, 0, '_Email', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Email}</button>
                  <button onClick={() => handleButtonClick('text', item.Ocena, item, 0, 'Ocena', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Ocena}</button>
                  <button onClick={() => handleButtonClick('text', item._CenaUsluge, item, 0, '_CenaUsluge', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._CenaUsluge}</button>

                  <button type="button" onClick={() => handleButtonClick('textArea', item._OpisKompanije, item, 0, '_OpisKompanije', 0)} className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">Opis Kompanije</button>

                  <button onClick={() => handleButtonClick('text', item._Lokacija, item, 0, '_Lokacija', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Lokacija}</button>

                  {item._SlobodniTermini.map((dateObj, dateIndex) => {
                    const date = new Date(dateObj.Slobodan_Termin);
                    return (
                      <button onClick={() => handleButtonClick('date', date.toDateString(), item, dateIndex, '_SlobodniTermini', dateObj.ID)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink" key={dateIndex}>
                        {date.toDateString()}
                      </button>
                    );
                  })}
                  <button onClick={() => handleButtonClick('date', item._DatumOsnivanja.toDateString(), item, 0, '_DatumOsnivanja', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._DatumOsnivanja.toDateString()}</button>
                </>
                )}

                {item.type === 'Baker' && (
                <>
                  <button onClick={() => handleButtonClick('text', item._NazivAgencije, item, 0, '_NazivAgencije', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._NazivAgencije}</button>
                  <button onClick={() => handleButtonClick('text', item.Prezime, item, 0, 'Prezime', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Prezime}</button>
                  <button onClick={() => handleButtonClick('text', item.Ocena, item, 0, 'Ocena', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Ocena}</button>
                  <button onClick={() => handleButtonClick('text', item._Email, item, 0, '_Email', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Email}</button>

                  <button onClick={() => handleButtonClick('text', item._CenaPosiljke, item, 0, '_CenaPosiljke', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._CenaPosiljke}</button>
                  <button type="button" onClick={() => handleButtonClick('textArea', item._OpisPosla, item, 0, '_OpisPosla', 0)} className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">Opis Posla</button>

                  <button onClick={() => handleButtonClick('text', item._Lokacija, item, 0, '_Lokacija', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Lokacija}</button>
                  {item._SlobodniTermini.map((dateObj, dateIndex) => {
                    const date = new Date(dateObj.Slobodan_Termin);
                    return (
                      <button onClick={() => handleButtonClick('date', date.toDateString(), item, dateIndex, '_SlobodniTermini', dateObj.ID)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink" key={dateIndex}>
                        {date.toDateString()}
                      </button>
                    );
                  })}
                  {item._ListaTorti.map((tobject, TortaIndex) => {
                    const torta = new Torta(tobject.Naziv, tobject.Tip_Slaga, tobject.Fondan, tobject.Tema, tobject.Posno, tobject.Kratak_Opis, tobject.Cena);
                    return (
                      <button onClick={() => handleButtonClick('torta', torta.NazivTorte, item, TortaIndex, '_Torta', tobject.ID)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink" key={TortaIndex}>
                        {torta.NazivTorte}
                      </button>
                    );
                  })}
                  <button onClick={() => handleButtonClick('date', item._DatumOsnivanja.toDateString(), item, 0, '_DatumOsnivanja')} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._DatumOsnivanja.toDateString()}</button>

                </>

                )}

                {item.type === 'Restoran' && (
                <>

                  <button onClick={() => handleButtonClick('text', item._NazivAgencije, item, 0, '_NazivAgencije', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._NazivAgencije}</button>
                  <button onClick={() => handleButtonClick('text', item._Email, item, 0, '_Email', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Email}</button>
                  <button onClick={() => handleButtonClick('text', item.Ocena, item, 0, 'Ocena', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Ocena}</button>
                  <button onClick={() => handleButtonClick('text', item._CenaUsluge, item, 0, '_CenaUsluge', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._CenaUsluge}</button>

                  <button type="button" onClick={() => handleButtonClick('textArea', item._OpisPosla, item, 0, '_OpisPosla', 0)} className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">Opis Restorana </button>

                  <button onClick={() => handleButtonClick('text', item._Lokacija, item, 0, '_Lokacija', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Lokacija}</button>

                  {item._SlobodniTermini.map((dateObj, dateIndex) => {
                    const date = new Date(dateObj.Slobodan_Termin);
                    return (
                      <button onClick={() => handleButtonClick('date', date.toDateString(), item, dateIndex, '_SlobodniTermini', dateObj.ID)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink" key={dateIndex}>
                        {date.toDateString()}
                      </button>
                    );
                  })}
                  <button onClick={() => handleButtonClick('date', item._DatumOsnivanja.toDateString(), item, 0, '_DatumOsnivanja', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._DatumOsnivanja.toDateString()}</button>
                  <button onClick={() => handleButtonClick('text', item._Bend, item, 0, '_Bend', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._Bend}</button>
                  <button onClick={() => handleButtonClick('text', item._RestoranPraviTortu, item, 0, '_RestoranPraviTortu', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item._RestoranPraviTortu ? 'Yes' : 'No' }</button>
                </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className=" flex justify-center bg-snclbrown p-3  ">
          <button
            type="button"
            className="mx-2 rounded-md bg-snclblue px-4 py-2 text-white hover:bg-sncdblue"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {t('Previous')}
          </button>
          <button
            type="button"
            className="mx-2 rounded-md bg-snclblue px-4 py-2 text-white hover:bg-sncdblue"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= ListAll.length}
          >
            {t('Next')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OglasiOverview;
