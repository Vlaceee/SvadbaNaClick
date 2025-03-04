/* eslint-disable react/jsx-boolean-value */
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
import FotografClass from '../OglasiComponents/FotografClass';
import OglasiCardMladenac from '../OglasiComponents/OglasiCardMladenac';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Dekorater from '../OglasiComponents/DekoracijeClass';
// eslint-disable-next-line import/no-unresolved
import { Foods, Jelo, Pice } from '../OglasiComponents/Food';
import Baker from '../OglasiComponents/BakerClass';
import Torta from '../OglasiComponents/Torta';
import Restoran from '../OglasiComponents/RestorasClass';

function OglasiPage() {
  const [ListaFotografa, SetListaFotografa] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [minCenaUsluge, setMinCenaUsluge] = useState(0);
  const [maxCenaUsluge, setMaxCenaUsluge] = useState(1000000);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date(2000, 4, 11));
  const [endDate, setEndDate] = useState(new Date(2030, 4, 11));
  const [selectedLocation, setSelectedLocation] = useState('Majdanpek');
  const [selectedTimeframe, SetselectedTimeframe] = useState('Izaberi vremenski okvir');
  const [minCenaSlike, SetminCenaSlike] = useState(0);
  const [maxCenaSlike, SetmaxCenaSlike] = useState(1000000);
  const [nazivAgencije, setNazivAgencije] = useState('');

  const checkDateWithinTimeframe = (dates, timeframe) => {
    if (dates === undefined || dates == null) {
      return false;
    }
    const currentTime = new Date();
    const timeframesInHours = {
      'Izaberi vremenski okvir': 200000,
      '1 dan': 24,
      '3 dana': 72,
      '7 dana': 168,
      '14 dana': 336,
      '30 dana': 720,
    };

    const hoursToCheck = timeframesInHours[timeframe];

    // Računamo datum koji predstavlja trenutak "hoursToCheck" sati od trenutnog trenutka
    const futureTime = new Date(currentTime.getTime() + hoursToCheck * 60 * 60 * 1000);

    return dates.some((date) => {
      const terminDate = new Date(date.Slobodan_Termin);

      return terminDate >= currentTime && terminDate <= futureTime;
    });
  };

  const uniqueLocations = [...new Set(ListaFotografa.map((fotograf) => fotograf._Lokacija))];

  const handleSearch = (e) => { // Filtrira po Nazivu Agencije
    setSearchTerm(e.target.value);
  };
 
  const filterFotografiByDate = (fotograf) => {
    if (startDate && endDate) {
      return fotograf._Datumosnivanja >= startDate && fotograf._Datumosnivanja <= endDate;
    }
    return true;
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const addFotograf = async () => {
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

          
        ), 

        ID: item.FotografID,
        type: 'Fotograf',
      }));
    
      SetListaFotografa(fotografList);
      console.log('ovde je fotograf prvobitno');
      console.log(fotografList); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    addFotograf();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = ListaFotografa.slice(indexOfFirstPost, indexOfLastPost);

  const filteredPosts = currentPosts.filter((fotograf) => {
    const isCenaUslugeInRange = (!minCenaUsluge || fotograf._CenaUsluge >= minCenaUsluge)
      && (!maxCenaUsluge || fotograf._CenaUsluge <= maxCenaUsluge);
    const isCenaPosliciInRange = (!minCenaSlike || fotograf._Cenaposlici >= minCenaUsluge) && (!maxCenaSlike || fotograf._Cenaposlici <= maxCenaSlike);

    const isDateInRange = fotograf._Datumosnivanja >= startDate && fotograf._Datumosnivanja <= endDate;

    const isAgencyNameMatch = fotograf._NazivAgencije.toLowerCase().includes(searchTerm.toLowerCase());

    const isDateWithinTimeframe = checkDateWithinTimeframe(fotograf._SlobodniTermini, selectedTimeframe); // ovo vraca false
    console.log(`Tacno je  isCenaUslugeInRange${isCenaUslugeInRange}`);
    console.log(`Tacno je  isCenaPosliciInRange${isCenaPosliciInRange}`);
    console.log(`Tacno je  isDateInRange${isDateInRange}`);
    console.log(`Tacno je  isAgencyNameMatch${isAgencyNameMatch}`);
    console.log(`Tacno je isDateWithinTimeframe${isDateWithinTimeframe}`);

    // Return true if all conditions are met, indicating the fotograf should be included in the filtered list
    return isCenaPosliciInRange && isCenaUslugeInRange && isDateInRange && isAgencyNameMatch && isDateWithinTimeframe;
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className=" flex h-1/6 w-full justify-between bg-snclbrown px-12 py-6 ">
        <button type="button" disabled className="min-w-36  rounded-md bg-snclblue px-4 py-2 text-white">Fotograf</button>
        <button type="button" className="min-w-36 rounded-md bg-sncpink  px-4 py-2 text-white"><Link className="mx-2 hover:text-snclbrown" to="/oglasi/restoran">Restoran</Link></button>
        <button type="button" className="min-w-36 rounded-md bg-sncpink  px-4 py-2 text-white"><Link className="mx-2 hover:text-snclbrown" to="/oglasi/baker">Torta</Link></button>
        <button type="button" className="min-w-36 rounded-md bg-sncpink  px-4 py-2 text-white"><Link className="mx-2 hover:text-snclbrown" to="/oglasi/dekoracija">Dekoracija</Link></button>

      </div>

      <div className=" flex h-full flex-auto">
        <div className="  m-4 flex h-screen w-2/12 min-w-40 flex-col  rounded-md border-2 bg-snclbrown p-4">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">Ime Agencije</h3>
            <input
              type="text"
              placeholder="Upisi Ime Agencije..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-md border py-1"
            />
            <h3 className="mb-2 text-lg font-semibold">Filter Cene</h3>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Min CenaUsluge"
              value={minCenaUsluge}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
                  setMinCenaUsluge(parsedValue);
                }
              }}
              className="mb-2 w-full rounded-md border py-1"
            />
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Max CenaUsluge"
              value={maxCenaUsluge}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
                  setMaxCenaUsluge(parsedValue);
                }
              }}
              className="mb-2 w-full rounded-md border py-1"
            />
            <h3 className="mb-2 text-lg font-semibold">Cena Po Slici</h3>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Minimalna Cena Po Slici"
              value={minCenaUsluge}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
                  SetminCenaSlike(parsedValue);
                }
              }}
              className="mb-2 w-full rounded-md border py-1"
            />
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Maksimalna Cena Po Slici"
              value={maxCenaUsluge}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
                  SetmaxCenaSlike(parsedValue);
                }
              }}
              className="mb-2 w-full rounded-md border py-1"
            />

            <h3 className="mb-2 text-lg font-semibold">Datumi Osnivanja</h3>
            <h2>Najstariji Datum</h2>
            <input
              type="date"
              value={startDate.toISOString().substr(0, 10)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="mb-2 w-full rounded-md border py-1"
            />
            <h2>Najkasniji Datum</h2>
            <input
              type="date"
              value={endDate.toISOString().substr(0, 10)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="mb-2 w-full rounded-md border py-1"
            />
            <h3 className="mb-2 text-lg font-semibold">Lokacija Firme</h3>
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
            <h3 className="mb-2 text-lg font-semibold">Slobodni u narednih:</h3>
            <select
              value={selectedTimeframe}
              onChange={(e) => SetselectedTimeframe(e.target.value)}
              className="mb-2 w-full rounded-md border py-1"
            >
              <option value="Izaberi vremenski okvir">Izaberi vremenski okvir</option>
              <option value="1 dan">1 dan</option>
              <option value="3 dana">3 dana</option>
              <option value="7 dana">7 dana</option>
              <option value="14 dana">14 dana</option>
              <option value="30 dana">30 dana</option>
            </select>
          </div>
        </div>
        <div className="m-4 flex w-full flex-row flex-wrap ">
          {filteredPosts.map((fotograf, index) => (
            <div key={index} className="mb-2 ml-12 mr-2 h-2/6 w-3/12 min-w-72">
              <OglasiCardMladenac fotograf={fotograf} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center">

        {Array.from({ length: Math.ceil(ListaFotografa.length / postsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className="mx-1 rounded-md bg-bubble-gum px-3 py-1">{index + 1}</button>
        ))}
      </div>

    </div>
  );
}

export default OglasiPage;
