/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/extensions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */

import { ComboBox, Item } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HiCamera, HiOutlineOfficeBuilding, HiCake, HiSparkles,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import OglasiCard from '../OglasiComponents/OglasiCard';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
// eslint-disable-next-line import/no-unresolved
import { Foods, Jelo, Pice } from '../OglasiComponents/Food';
import Baker from '../OglasiComponents/BakerClass';
import Torta from '../OglasiComponents/Torta';
import OglasiCardBaker from '../OglasiComponents/OglasiCardBaker';
import OglasiCardBakerMladenci from '../OglasiComponents/OglasiCardBakerMladenac';

// PREVEDENO

// eslint-disable-next-line react/prop-types
function OglasiPageBakerMladenci({ korisnik }) {
  const { t } = useTranslation();
  const [ListaBaker, SetListaBaker] = useState([]);

  const [ImeTorte, setImeTorte] = useState('');
  const [FilteredBakers, setFilteredBakers] = useState([]);
  const [autoFillOptions, setAutoFillOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [minCenaUsluge, setMinCenaUsluge] = useState(0);
  const [maxCenaUsluge, setMaxCenaUsluge] = useState(13000000000);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date(2000, 4, 11));
  const [endDate, setEndDate] = useState(new Date(2030, 4, 11));
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTimeframe, SetselectedTimeframe] = useState('Izaberi vremenski okvir');


  console.log(korisnik.uid);

  const handleOptionClick1 = (selectedOption) => {
    setImeTorte(selectedOption);
  };
  const getMostCommonOptions = (bakerList) => {
    const countMap = {};

    bakerList.forEach((baker) => {
      baker._ListaTorti.forEach((torta) => {
        countMap[torta.Naziv] = (countMap[torta.Naziv] || 0) + 1;
      });
    });

    const options = Object.keys(countMap).map((Naziv) => ({
      Naziv,
      count: countMap[Naziv],
    }));
    console.log('Napravljeni objekti');
    console.log(options);

    // descending order
    options.sort((a, b) => b.count - a.count);
    console.log('Sortirani objekti');
    console.log(options);

    // Return only the first 5 most common options
    return options.slice(0, 5).map((option) => option.Naziv); // gde je bio NazivTorte sad je Naziv Svugde
  };

  const filterOptions = (inputValue) => {
    const filteredOptions = getMostCommonOptions(FilteredBakers).filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()));

    return filteredOptions;
  };

  const handleOptionClick = (selectedOption) => {
    setImeTorte(selectedOption.Naziv);
    // You can perform additional actions here if needed
  };
  const handleInputChange = (event) => { 
    // eslint-disable-next-line prefer-destructuring
    const value = event.target.value;
    setImeTorte(value);

    // Filter the bakers based on the input value
    const filtered = ListaBaker.filter((baker) => baker._ListaTorti.some((torta) => torta.Naziv.toLowerCase().includes(value.toLowerCase())));

    setFilteredBakers(filtered);
    const options = getMostCommonOptions(filtered);
    console.log('opcije kada su se vratile iz getMostCommonOptions');
    console.log(options);
    setAutoFillOptions(options);
    console.log('autoFillOptions posle inicijalizacije');
    console.log(autoFillOptions);
  };

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
      const terminDate = new Date(date.Slobodan_Termin);

      return terminDate >= currentTime && terminDate <= futureTime;
    });
  };

  const uniqueLocations = [...new Set(ListaBaker.map((baker) => baker._Lokacija))];

  const handleSearch = (e) => { // Filtrira po Nazivu Agencije
    setSearchTerm(e.target.value);
  };

  const filterBakerByDate = (baker) => {
    if (startDate && endDate) {
      return baker._DatumOsnivanja >= startDate && baker._DatumOsnivanja <= endDate;
    }
    return true;
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const addBaker = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/poslasticar/${korisnik.uid}`);
      const fetchedData = response.data;
      const bakerList = fetchedData.map((item) => ({
        ...new Baker(item.Ime, item.Email, item.Cena_Posiljke, item.Kratak_Opis, new Date(item.Datum_Osnivanja), null, item.Torte, item.Slobodni_Termini, item.Lokacija),
        type: 'Baker',
        ID: item.ID,
        Prezime: item.Prezime,
        Ocena: item.Ocena,
        Liked: item.Liked, 
      }));
      SetListaBaker(bakerList);
      console.log('Lista poslasticara');
      console.log(bakerList);
    } catch (error) {
      console.error('Error fetching Baker data:', error);
    }
  };

  useEffect(() => {
    addBaker();
  }, []);
  // autofilloptions
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = ListaBaker.slice(indexOfFirstPost, indexOfLastPost);

  const filteredPosts = currentPosts.filter((baker) => {
    const isCenaUslugeInRange = (!minCenaUsluge || baker._CenaPosiljke >= minCenaUsluge)
      && (!maxCenaUsluge || baker._CenaPosiljke <= maxCenaUsluge);

    const isDateInRange = baker._DatumOsnivanja >= startDate && baker._DatumOsnivanja <= endDate;

    const isAgencyNameMatch = baker._NazivAgencije.toLowerCase().includes(searchTerm.toLowerCase());

    const isDateWithinTimeframe = checkDateWithinTimeframe(baker._SlobodniTermini, selectedTimeframe);
    const isBakerIncluded = ImeTorte ? FilteredBakers.includes(baker) : true;
    const isLokacijaMatch = selectedLocation === '' || baker._Lokacija.toLowerCase().includes(selectedLocation.toLowerCase());

    // Return true if all conditions are met, indicating the baker should be included in the filtered list
    return isCenaUslugeInRange && isDateInRange && isAgencyNameMatch && isDateWithinTimeframe && isBakerIncluded && isLokacijaMatch;
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-snclblue">
        <div className=" my-3 text-center font-sans text-4xl font-bold text-white">{t('StranaOglasa')}</div>
      </div>
      <div className=" flex h-1/6 w-full justify-between bg-snclbrown px-12 py-6 ">
        <div className="w-1/12 max-w-8 " />
        <button type="button" className="min-w-36 rounded-md bg-sncpink px-4 py-2 text-white">
          <Link className="mx-2 flex items-center justify-center hover:text-snclbrown" to="/oglasi/fotograf">
            {t('Fotograf')}
            <HiCamera className="ml-2" />
          </Link>
        </button>
        <button type="button" className="min-w-36 rounded-md bg-sncpink px-4 py-2 text-white">
          <Link className="mx-2 flex items-center justify-center hover:text-snclbrown" to="/oglasi/restoran">
            {t('Restoran')}
            <HiOutlineOfficeBuilding className="ml-2" />
          </Link>
        </button>
        <button type="button" disabled className="flex min-w-36 items-center rounded-md bg-snclblue px-4 py-2 text-white">
          <span className="mx-2 hover:text-snclbrown">{t('Torta')}</span>
          <HiCake className="ml-2" />
        </button>

        <button type="button" className="min-w-36 rounded-md bg-sncpink px-4 py-2 text-white">
          <Link className="mx-2 flex items-center justify-center hover:text-snclbrown" to="/oglasi/dekoracija">
            {t('Dekoracija')}
            <HiSparkles className="ml-2" />
          </Link>
        </button>

        <div className="w-1/12 max-w-8 " />
      </div>

      <div className=" flex h-full  flex-auto">
        <div className="  m-4 flex h-full w-2/12 min-w-40 flex-col rounded-md  border-2 bg-snclbrown p-4">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">{t('Ime Poslasticare')}</h3>
            <input
              type="text"
              placeholder={t('Upisi Ime Poslasticare')}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-md border py-1"
            />
            <h3 className="mb-2 text-lg font-semibold">{t('Cena Posiljke')}</h3>
            <h2>{t('Minimalna Cena')}</h2>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t('Min Cena Posiljke')}
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
            <h2>Maksimalna Cena</h2>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t('Max Cena Posiljke')}
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
            <h3 className="mb-2 text-lg font-semibold">{t('Lokacija Poslasticare')}</h3>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="mb-2 w-full rounded-md border py-1"
            >
              <option value="">Izaberi lokaciju</option>
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
            <h3 className="mb-2 text-lg font-semibold">{t('Naziv Torte')}</h3>
            <input
              type="text"
              placeholder={t('Upiši naziv torte')}
              value={ImeTorte}
              onChange={handleInputChange}
              className="mb-2 w-full rounded-md border py-1"
            />
            <h2 className="mb-2 text-center font-semibold">{t('Neke od opcija:')}</h2>
            {autoFillOptions.length > 0 && (
            <ul className=" left-0 right-0 mt-1 max-h-24 overflow-y-auto rounded-md border bg-white">
              {autoFillOptions.map((option, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <li
                  key={index}
                  className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                  onClick={() => handleOptionClick1(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
            )}

          </div>
        </div>
        <div className="m-4 flex h-full w-full flex-row flex-wrap ">
          {filteredPosts.map((baker, index) => (
            <div key={baker.ID} className="mb-8 ml-12 mr-2 h-2/6 w-3/12 min-w-96">
              <OglasiCardBakerMladenci baker={baker} korisnik={korisnik} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center">

        {Array.from({ length: Math.ceil(ListaBaker.length / postsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className="mx-1 rounded-md bg-bubble-gum px-3 py-1">{index + 1}</button>
        ))}
      </div>

    </div>
  );
}

export default OglasiPageBakerMladenci;
