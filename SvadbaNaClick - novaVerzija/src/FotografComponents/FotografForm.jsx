/* eslint-disable no-unused-vars */
import React, { useState, useTransition } from 'react';
import { Email } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CalendarFotograf from './CalendarFotograf';

// engleski PREVEDENO
export default function FotografForm() {
  const [agencyName, setAgencyName] = useState('');
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [pricePerImage, setPricePerImage] = useState('');
  const [aboutBusiness, setAboutBusiness] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const { t } = useTranslation();

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Submitted');
    // You can use the state variables here as needed
    console.log('Agency Name:', agencyName);
    console.log('Email:', email);
    console.log('Security Code:', securityCode);
    console.log('Service Price:', servicePrice);
    console.log('Price Per Image:', pricePerImage);
    console.log('About Business:', aboutBusiness);
    console.log('Datum osnivanja firme', selectedDate);
  }

  return (
    <form onSubmit={handleSubmit} className="my-6 grid max-h-min  flex-1 grid-cols-2 grid-rows-2 gap-4 rounded-lg bg-snclbrown shadow-lg">
      <div className="ml-4 grid size-full  grid-rows-12 gap-4 text-center">
        <h1 className="flex items-center justify-between pl-28 text-2xl">
          Imas vec nalog?
          <span><button type="button" className="mr-20 rounded-md  p-1 px-3 text-sncpink  hover:text-midnight">{t('login')}</button></span>
        </h1>
        <p className="text-xl">{t('name')}</p>
        <input
          className="w-full rounded-md border bg-white shadow-lg  placeholder:italic focus:outline-none focus:ring-1 sm:text-sm"
          placeholder={t('typeNameOfAgency')}
          type="text"
          name="agencyName"
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
        />
        <p className="text-xl">E-mail</p>
        <input onChange={(e) => setEmail(e.target.value)} value={email} className=" w-full rounded-md border bg-white  shadow-lg placeholder:italic focus:outline-none focus:ring-1 sm:text-sm" placeholder="Upisite vas mejl..." type="text" name="search" />
        <p className="text-xl">{t('safetyCode!')}</p>
        <input onChange={(e) => setSecurityCode(e.target.value)} value={securityCode} className=" w-full rounded-md border bg-white  shadow-lg  placeholder:italic focus:outline-none focus:ring-1 sm:text-sm" placeholder="Dodajte Sigurnosni kod..." type="text" name="search " />
        <p className="text-xl">{t('Osnovna Cena Usluge')}</p>
        <input onChange={(e) => setServicePrice(e.target.value)} value={servicePrice} className=" w-full rounded-md border bg-white  shadow-lg  placeholder:italic focus:outline-none focus:ring-1 sm:text-sm" placeholder="Cena vasih usluga je..." type="text" name="search " />
        <p className="text-xl">{t('Cena Po Slici')}</p>
        <input onChange={(e) => setPricePerImage(e.target.value)} value={pricePerImage} className=" w-full rounded-md border bg-white  shadow-lg  placeholder:italic focus:outline-none focus:ring-1 sm:text-sm" placeholder="Cena koju naplacujete po slici..." type="text" name="search " />
        
      </div>
      <div className="ml-8 mr-8"><CalendarFotograf className="h-full max-h-fit" setSelectedDate={setSelectedDate} /></div>
      <div className="col-span-2 grid grid-rows-6 text-start">
        <h3 className="mt-8 text-center  text-2xl italic">{t('somethingAbout')}</h3>
        <textarea
          className="row-span-4 mb-32 ml-12   mt-0 w-11/12 rounded-md shadow-lg"
          placeholder={t('somethingAbout')}
          value={aboutBusiness}
          onChange={(e) => setAboutBusiness(e.target.value)}
          maxLength={200} // Limit the number of characters (words)
          rows={2} // Set the initial number of visible rows
          style={{ resize: 'vertical', textAlign: 'start' }}
        />
        <button type="submit" className="row-span-2 mb-20 mr-10 mt-0 h-3/5 w-4/12  place-self-end rounded-md bg-snclblue text-center text-white shadow-lg hover:text-midnight">
          {t('login')}
        </button>
      </div>
    </form>
  );
}
