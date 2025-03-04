/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/extensions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HiCamera, HiOutlineOfficeBuilding, HiCake, HiSparkles,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import FotografClass from '../OglasiComponents/FotografClass';
import OglasiCardDekorater from '../OglasiComponents/OglasiCardDekorater';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Dekorater from '../OglasiComponents/DekoracijeClass';
// eslint-disable-next-line import/no-unresolved
import { Foods, Jelo, Pice } from '../OglasiComponents/Food';
import OglasiCardDekoraterMladenci from '../OglasiComponents/OglasiCardDekoraterMladenac';

// PREVEDENO

function OglasiPageDekoraterMladenci({ korisnik }) {
  const { t } = useTranslation();
  const [ListaDekorater, SetListaDekorater] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [minCenaUsluge, setMinCenaUsluge] = useState(0);
  const [maxCenaUsluge, setMaxCenaUsluge] = useState(10000000);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date(2000, 4, 11));
  const [endDate, setEndDate] = useState(new Date(2030, 4, 11));
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTimeframe, SetselectedTimeframe] = useState('Izaberi vremenski okvir');
  console.log(korisnik.uid);
  const checkDateWithinTimeframe = (dates, timeframe) => {
    if (dates === undefined || dates == null) {
      console.log('Nisu Slobodni!');
      return false;
    }
    const currentTime = new Date();
    const timeframesInHours = {
      'Izaberi vremenski okvir': 200000,
      'vremenski okvir': 200000,
      '1 dan': 24,
      '3 dana': 72,
      '7 dana': 168,
      '14 dana': 336,
      '30 dana': 720,
      '60 dana': 1440,
      '120 dana': 2880,
      '1 godina': 8760,
      '2 godine': 17520,
    };

    const hoursToCheck = timeframesInHours[timeframe];

    // Računamo datum koji predstavlja trenutak "hoursToCheck" sati od trenutnog trenutka
    const futureTime = new Date(currentTime.getTime() + hoursToCheck * 60 * 60 * 1000);

    return dates.some((date) => {
      const datum = new Date(date.Slobodan_Termin);
      return datum >= currentTime && datum <= futureTime;
    });
  };

  const uniqueLocations = [...new Set(ListaDekorater.map((dekorater) => dekorater._Lokacija))];

  const handleSearch = (e) => { // Filtrira po Nazivu Agencije
    setSearchTerm(e.target.value);
  };

  const filterFotografiByDate = (dekorater) => {
    if (startDate && endDate) {
      return dekorater._DatumOsnivanja >= startDate && dekorater._DatumOsnivanja <= endDate;
    }
    return true;
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const addDekorater = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/dekorater/${korisnik.uid}`); // NazivAgencije, Email, CenaUsluge, DatumOsnivanja, SigurnosniKod, SlobodniTermini, Lokacija, OpisKompanije
      const fetchedData = response.data;
    

      const dekoraterList = fetchedData.map((item) => ({ //
        ...new Dekorater(item.Ime, item.Email, item.Cena, new Date(item.Datum_Osnivanja), null, item.Slobodni_Termini, item.Lokacija, item.Kratak_Opis),
        type: 'Dekorater',
        ID: item.DekoraterID,
        Ocena: item.Ocena,
        Liked: item.Liked,
      }));
      console.log('Kako izgleda lista Dekoratera koji se konkatenira!');
      SetListaDekorater(dekoraterList);
      console.log(dekoraterList); 
    } catch (error) {
      console.error('Error fetching Dekorater data:', error);
    }
  };

  useEffect(() => {
    addDekorater();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = ListaDekorater.slice(indexOfFirstPost, indexOfLastPost);

  const filteredPosts = currentPosts.filter((dekorater) => {
    const isCenaUslugeInRange = (!minCenaUsluge || dekorater._CenaUsluge >= minCenaUsluge)
      && (!maxCenaUsluge || dekorater._CenaUsluge <= maxCenaUsluge);

    const isDateInRange = dekorater._DatumOsnivanja >= startDate && dekorater._DatumOsnivanja <= endDate;

    const isAgencyNameMatch = dekorater._NazivAgencije.toLowerCase().includes(searchTerm.toLowerCase());

    const isDateWithinTimeframe = checkDateWithinTimeframe(dekorater._SlobodniTermini, selectedTimeframe);
    const isLokacijaMatch = selectedLocation === '' || dekorater._Lokacija.toLowerCase().includes(selectedLocation.toLowerCase());

    // Return true if all conditions are met, indicating the dekorater should be included in the filtered list
    return isCenaUslugeInRange && isDateInRange && isAgencyNameMatch && isDateWithinTimeframe && isLokacijaMatch;
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-snclblue">
        <div className=" my-3 text-center font-sans text-4xl font-bold text-white">{t('StranaOglasa')}</div>
      </div>
      <div className=" flex h-1/6 w-full justify-between bg-snclbrown px-12 py-6 ">
        <div className="w-1/12 max-w-8 " />
        <button type="button" className="min-w-36 rounded-md bg-sncpink px-4 py-2 text-white">
          <Link className="mx-2 flex items-center hover:text-snclbrown" to="/oglasi/fotograf">
            {t('Fotograf')}
            <HiCamera className="ml-1" />
          </Link>
        </button>
        <button type="button" className="min-w-36 rounded-md bg-sncpink px-4 py-2 text-white">
          <Link className="mx-2 flex items-center justify-center hover:text-snclbrown" to="/oglasi/restoran">
            {t('Restoran')}
            <HiOutlineOfficeBuilding className="ml-2" />
          </Link>
        </button>
        <button type="button" className="min-w-36 rounded-md bg-sncpink px-4 py-2 text-white">
          <Link className="mx-2 flex items-center justify-center hover:text-snclbrown" to="/oglasi/baker">
            {t('Torta')}
            <HiCake className="ml-2" />
          </Link>
        </button>
        <button type="button" disabled className="flex min-w-36 items-center rounded-md bg-snclblue px-4 py-2 text-white">
          {t('Dekoracija')}
          <HiSparkles className="ml-2" />
        </button>

        <div className="w-1/12 max-w-8 " />
      </div>

      <div className=" flex h-full flex-auto">
        <div className="  m-4 flex h-full w-2/12 min-w-40 flex-col  rounded-md border-2 bg-snclbrown p-4">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">{t('Ime Agencije')}</h3>
            <input
              type="text"
              placeholder={t('Upisi Ime Agencije')}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-md border py-1"
            />
            <h3 className="mb-2 text-lg font-semibold">{t('Osnovna Cena Usluge')}</h3>
            <h2>{t('Minimalna Cena')}</h2>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t('Min CenaUsluge')}
              value={minCenaUsluge}
              step={1000}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
                  setMinCenaUsluge(parsedValue);
                }
              }}
              className="mb-2 w-full rounded-md border py-1"
            />
            <h2>{t('Maksimalna Cena')}</h2>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t('Max CenaUsluge')}
              value={maxCenaUsluge}
              step={1000}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
                  setMaxCenaUsluge(parsedValue);
                }
              }}
              className="mb-2 w-full rounded-md border py-1"
            />
            <h3 className="mb-2 text-lg font-semibold">{t('Datumi Osnivanja')}</h3>
            <h2>{t('Najstariji Datum')}</h2>
            <input
              type="date"
              value={startDate.toISOString().substr(0, 10)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="mb-2 w-full rounded-md border py-1"
            />
            <h2>{t('Najkasniji Datum')}</h2>
            <input
              type="date"
              value={endDate.toISOString().substr(0, 10)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="mb-2 w-full rounded-md border py-1"
            />
            <h3 className="mb-2 text-lg font-semibold">{t('Lokacija Firme')}</h3>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="mb-2 w-full rounded-md border py-1"
            >
              <option value="">{t('Izaberi lokaciju')}</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <h3 className="mb-2 text-lg font-semibold">{t('Slobodni u narednih:')}</h3>
            <select
              value={selectedTimeframe}
              onChange={(e) => SetselectedTimeframe(e.target.value)}
              className="mb-2 w-full rounded-md border py-1"
            >
              <option value="vremenski okvir">{t('vremenskiOkvir')}</option>
              <option value="1 dan">{t('1dan')}</option>
              <option value="3 dana">{t('3dana')}</option>
              <option value="7 dana">{t('7dana')}</option>
              <option value="14 dana">{t('14dana')}</option>
              <option value="30 dana">{t('30dana')}</option>
              <option value="60 dana">{t('60dana')}</option>
              <option value="120 dana">{t('120dana')}</option>
              <option value="1 godina">{t('1 godina')}</option>
              <option value="2 godine">{t('2 godine')}</option>
            </select>
          </div>
        </div>
        <div className="m-4 flex w-full h-full flex-row flex-wrap ">
          {filteredPosts.map((dekorater, index) => (
            <div key={index} className="mb-8 ml-12 mr-2 h-2/6 w-3/12 min-w-96">
              <OglasiCardDekoraterMladenci dekorater={dekorater} korisnik={korisnik} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center">

        {Array.from({ length: Math.ceil(ListaDekorater.length / postsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className="mx-1 rounded-md bg-bubble-gum px-3 py-1">{index + 1}</button>
        ))}
      </div>

    </div>
  );
}

export default OglasiPageDekoraterMladenci;
