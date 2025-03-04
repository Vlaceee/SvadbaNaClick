/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { useEffect, useState, React } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Engleski PREVEDENO
function ClientsOverview() {
  const { t } = useTranslation();
  const [listaMladenaca, setlistaMladenaca] = useState([]);
  const [listaSvidjanja, setlistaSvidjanja] = useState([]);
  const [ListAll, setListAll] = useState([]);

  const [VisibleClients, setVisibleClients] = useState([false, false]); // Fotograf,Dekorater,Baker,Restoran
  const [ClientName, setClientName] = useState('');
  const [ClientLastName, setClientLastName] = useState('');
  const [ClientEmail, setClientEmail] = useState('');
  const [PartnerName, setPartnerName] = useState('');
  const [PartnerLastName, setPartnerLastName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ChangingValue, setChangingValue] = useState('');
  const [ChangingType, setChangingType] = useState('Tip nije pronadjen');
  const [inputType, setInputType] = useState('text'); // Default input type
  const [ChangingObject, setChangingObject] = useState([]);
  const [AttributeName, setAttributeName] = useState('');
  const [tipTabele, settipTabele] = useState('Jos niste izabrali odredjeni atribut..');
  const [SwappingID, setSwappingID] = useState(0);
  const [ChangeBox, setChangeBox] = useState(false);
  const [FromDate, setFromDate] = useState(new Date(2000, 1, 1));
  const [ToDate, setToDate] = useState(new Date(2030, 1, 1));

  const [filteredList, setFilteredList] = useState([]);
  const itemsPerPage = 4; // Number of items per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    const updatedFilteredList = ListAll.filter((item) => {
      if (item.type != 'Mladenci') {
        return true;
      }

      // Filtering conditions for Mladenci items
      const isNameMatch = item.Ime.toLowerCase().includes(ClientName.toLowerCase());
      const isLastNameMatch = item.Prezime.toLowerCase().includes(ClientLastName.toLowerCase());
      const isEmailMatch = item.Email.toLowerCase().includes(ClientEmail.toLowerCase());
      const isPhoneNumberMatch = item.Broj_Telefona.includes(PhoneNumber);

      return isNameMatch && isLastNameMatch && isEmailMatch && isPhoneNumberMatch;
    });

    setFilteredList(updatedFilteredList);
    console.log(updatedFilteredList);
  }, [ListAll, ClientEmail, ClientLastName, ClientName, PhoneNumber]);

  const formatDateToLocal = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().split('T')[0];
  };
  const handleButtonClick = (typeofinput, inputvalue, ceoObjekat, datenum, NazivAtributa, ID) => {
    console.log(ID);
    setSwappingID(ID);
    setAttributeName(NazivAtributa);
    setChangingObject(ceoObjekat);
    settipTabele(ceoObjekat.type);

    setChangeBox(false);
    setInputType(typeofinput);
    setChangingValue(inputvalue);
  };

  async function updateMladenac(updatedObject) {
    try {
      const response = await axios.put(`http://localhost:8080/mladenci/${updatedObject.Mladenci_ID}`, updatedObject);
      console.log('Data updated successfully:', response.data);

      // Update listaMladenaca with the updated object
      const updatedList = listaMladenaca.map((item) => (item.Mladenci_ID === updatedObject.Mladenci_ID ? updatedObject : item));
      setlistaMladenaca(updatedList);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  async function DeleteMladenac() {
    try {
      const response = await axios.delete(`http://localhost:8080/mladencicelo/${ChangingObject.UID}`);
      console.log('Data deleted successfully:', response.data);

      // Remove from listaMladenaca
      const updatedList = listaMladenaca.filter((item) => item.Mladenci_ID !== ChangingObject.Mladenci_ID);
      setlistaMladenaca(updatedList);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  async function DeleteSvidjanje() {
    try {
      let response;
      if (ChangingObject.type === 'SvidjanjaFotograf') {
        response = await axios.delete(`http://localhost:8080/likedfotograf/${ChangingObject.LikedFotograf_ID}`);
        console.log('Data deleted successfully:', response.data);

        // Update listaSvidjanja by removing the deleted item
        const updatedList = listaSvidjanja.filter((item) => item.LikedFotograf_ID !== ChangingObject.LikedFotograf_ID);
        setlistaSvidjanja(updatedList);
      } else if (ChangingObject.type === 'SvidjanjaDekorater') {
        response = await axios.delete(`http://localhost:8080/likeddekorater/${ChangingObject.LikedDekorater_ID}`);
        console.log('Data deleted successfully:', response.data);

        // Update listaSvidjanja by removing the deleted item
        const updatedList = listaSvidjanja.filter((item) => item.LikedDekorater_ID !== ChangingObject.LikedDekorater_ID);
        setlistaSvidjanja(updatedList);
      } else if (ChangingObject.type === 'SvidjanjaPoslasticar') {
        response = await axios.delete(`http://localhost:8080/likedposlasticar/${ChangingObject.LikedPoslasticar_ID}`);
        console.log('Data deleted successfully:', response.data);

        // Update listaSvidjanja by removing the deleted item
        const updatedList = listaSvidjanja.filter((item) => item.LikedPoslasticar_ID !== ChangingObject.LikedPoslasticar_ID);
        setlistaSvidjanja(updatedList);
      } else {
        response = await axios.delete(`http://localhost:8080/likedrestoran/${ChangingObject.LikedRestoran_ID}`);
        console.log('Data deleted successfully:', response.data);

        // Update listaSvidjanja by removing the deleted item
        const updatedList = listaSvidjanja.filter((item) => item.LikedRestoran_ID !== ChangingObject.LikedRestoran_ID);
        setlistaSvidjanja(updatedList);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  const updateDatabase = async () => {
    console.log('Hey');
    if (!ChangingObject || !AttributeName) {
      console.error('Missing ChangingObject or AttributeName');
    }
    if (ChangingObject.type == 'Mladenci') {
      console.log('Objekat koji se menja');

      const updatedObject = { ...ChangingObject, [AttributeName]: ChangingValue };
      console.log(updatedObject);
      updateMladenac(updatedObject);
    }
  };

  const HandleDeleteButton = async () => {
    if (!ChangingObject || !AttributeName) {
      console.error('Missing ChangingObject or AttributeName');
    }
    if (ChangingObject.type == 'Mladenci') {
      console.log('Brisem Mladenac!');
      DeleteMladenac();
    } else {
      console.log('Brisem Svidjanje!');
      DeleteSvidjanje();
    }
  };

  const handleUpdateClick = () => {
    updateDatabase();
  };
  const updateListAll = (visibleAds) => {
    let combinedList = [];
    if (visibleAds[0]) combinedList = combinedList.concat(listaMladenaca);
    if (visibleAds[1]) combinedList = combinedList.concat(listaSvidjanja);

    setListAll(combinedList);
    console.log(combinedList);
  };

  const updateVisibleAds = (index) => {
    const updatedVisibleAds = [...VisibleClients];
    updatedVisibleAds[index] = !updatedVisibleAds[index];
    setVisibleClients(updatedVisibleAds);
  };
  useEffect(() => {
    updateListAll(VisibleClients);
  }, [VisibleClients, listaMladenaca, listaSvidjanja]);

  const data = [{ name: 'Client1' }, { name: 'Client2' }];
  const DodajKlijente = async () => {
    try {
      const response = await axios.get('http://localhost:8080/mladenciadmin');
      const fetchedData = response.data;
      console.log('Ovo je fetchovan data');
      console.log(fetchedData);

      // Create Mladenci list
      const MladenciList = fetchedData.map((item) => ({
        Broj_Telefona: item.Broj_Telefona,
        Email: item.Email,
        Ime: item.Ime,
        Ime_Partnera: item.Ime_Partnera,
        Mladenci_ID: item.Mladenci_ID,
        Prezime: item.Prezime,
        Prezime_Partnera: item.Prezime_Partnera,
        Sifra: item.Sifra,
        UID: item.UID,

        type: 'Mladenci',
      }));

      // Create Svidjanja list
      const SvidjanjaList = fetchedData.flatMap((item) => [
        ...item.LikedFotograf.map((likedItem) => ({
          LikedFotograf_ID: likedItem.LikedFotograf_ID,
          Fotograf_ID: likedItem.Fotograf_ID,
          type: 'SvidjanjaFotograf',
          ID: item.Mladenci_ID,

        })),
        ...item.LikedDekorater.map((likedItem) => ({
          LikedDekorater_ID: likedItem.LikedDekorater_ID,
          Dekorater_ID: likedItem.Dekorater_ID,
          type: 'SvidjanjaDekorater',
          ID: item.Mladenci_ID,

        })),
        ...item.LikedPoslasticar.map((likedItem) => ({
          LikedPoslasticar_ID: likedItem.LikedPoslasticar_ID,
          Poslasticar_ID: likedItem.Poslasticar_ID,
          type: 'SvidjanjaPoslasticar',
          ID: item.Mladenci_ID,

        })),
        ...item.LikedRestoran.map((likedItem) => ({
          LikedRestoran_ID: likedItem.LikedRestoran_ID,
          Restoran_ID: likedItem.Restoran_ID,
          type: 'SvidjanjaRestoran',
          ID: item.Mladenci_ID,

        })),
      ]);

      setlistaMladenaca(MladenciList);
      setlistaSvidjanja(SvidjanjaList);

      console.log('Mladenci list:', MladenciList);
      console.log('Svidjanja list:', SvidjanjaList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    DodajKlijente();
  }, []);

  return (
    <div className="m-3 flex w-full flex-row gap-3">
      <div className="h-full w-1/5 rounded-lg bg-snclbrown p-3 text-center shadow-lg">
        <p>{t('filtering')}</p>
        <div className="mt-5">
          <h3>{t('clientName')}</h3>
          <input
            value={ClientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder={t('Name')}
            className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue"
          />
          <h3>{t('clientSurname')}</h3>
          <input
            value={ClientLastName}
            onChange={(e) => setClientLastName(e.target.value)}
            placeholder={t('Last name')}
            className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue"
          />
          <h3>Email</h3>
          <input value={ClientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder={t('E-mail')} className="mb-2 rounded-lg bg-white p-1 text-sncdblue shadow-lg outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue" />
          <h3>{t('phoneNumber')}</h3>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={t('phoneNumber')}
            value={PhoneNumber}
            step={1}
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value, 10);
              if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
                setPhoneNumber(parsedValue);
              }
            }}
            className="mb-2 w-full rounded-md border py-1"
          />

          <div className="h-auto w-full">
            <h3 className="mb-2 mt-2">{t('adminPageChangeValue')}</h3>
            <h4>
              {t('adminChangingTable')}
              {tipTabele}
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
            {ChangingObject.type === 'Mladenci' && (
            <button type="button" onClick={handleUpdateClick} className="mx-4 mt-2 h-10 w-8 rounded-sm bg-cyan-900 text-center hover:bg-sncpink">
              {' '}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
            )}
            <button
              type="button"
              onClick={HandleDeleteButton}
              className="mx-4 mt-2 h-10 w-8 rounded-sm bg-cyan-900 text-center hover:bg-sncpink"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

          </div>
        </div>
      </div>
      <div className="h-full w-4/5 rounded-lg bg-snclbrown p-3 shadow-lg">
        <div>
          {t('addOverview')}
          <button type="button" className={`ml-4 rounded-md text-white shadow-lg hover:bg-sncdblue ${VisibleClients[0] == true ? 'bg-sncpink' : 'bg-snclblue'}`} onClick={() => updateVisibleAds(0)}>{t('Klijent Podaci')}</button>
          <button type="button" className={`ml-4 rounded-md text-white shadow-lg hover:bg-sncdblue ${VisibleClients[1] == true ? 'bg-sncpink' : 'bg-snclblue'}`} onClick={() => updateVisibleAds(1)}>{t('Omiljeni Oglasi')}</button>

        </div>
        <div className="mt-5 ">
          {currentItems.map((item, index) => (
            <div className="mx-4 mb-2 flex w-full flex-col  rounded-lg bg-sncdbrown p-3 text-white hover:bg-snclblue" key={index}>
              <div className="flex h-1/6 items-center">
                <div>
                  {item.type}

                </div>
              </div>
              <div>

                {item.type === 'Mladenci' && ( // Datum Osnivanja je poslednji
                <>
                  <div>
                    Mladenac ID:
                    {item.Mladenci_ID}
                  </div>
                  <button onClick={() => handleButtonClick('text', item.Ime, item, 0, 'Ime', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Ime}</button>
                  <button onClick={() => handleButtonClick('text', item.Prezime, item, 0, 'Prezime', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Prezime}</button>

                  <button onClick={() => handleButtonClick('text', item.Email, item, 0, 'Email', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Email}</button>
                  <button onClick={() => handleButtonClick('text', item.Broj_Telefona, item, 0, 'Broj_Telefona', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Broj_Telefona}</button>

                  <button onClick={() => handleButtonClick('text', item.Prezime_Partnera, item, 0, 'Prezime_Partnera', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Prezime_Partnera}</button>

                  <button onClick={() => handleButtonClick('text', item.Ime_Partnera, item, 0, 'Ime_Partnera', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Ime_Partnera}</button>

                </>

                )}

                {item.type === 'SvidjanjaFotograf' && (

                <>
                  <h3>ID u tabeli, ID Mladenca, ID Fotografa</h3>
                  <button onClick={() => handleButtonClick('text', item.LikedFotograf_ID, item, 0, 'LikedFotograf_ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.LikedFotograf_ID}</button>
                  <button onClick={() => handleButtonClick('text', item.ID, item, 0, 'ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.ID}</button>

                  <button onClick={() => handleButtonClick('text', item.Fotograf_ID, item, 0, 'Fotograf_ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Fotograf_ID}</button>

                </>
                )}

                {item.type === 'SvidjanjaDekorater' && (
                <>
                  <h3>ID u tabeli, ID Mladenca, ID Dekoratera</h3>
                  <button onClick={() => handleButtonClick('text', item.LikedDekorater_ID, item, 0, 'LikedDekorater_ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.LikedDekorater_ID}</button>
                  <button onClick={() => handleButtonClick('text', item.ID, item, 0, 'ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.ID}</button>

                  <button onClick={() => handleButtonClick('text', item.Dekorater_ID, item, 0, 'Dekorater_ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Dekorater_ID}</button>

                </>
                )}
                {item.type === 'SvidjanjaPoslasticar' && (
                <>
                  <h3>ID u tabeli, ID Mladenca, ID Poslasticara</h3>
                  <button onClick={() => handleButtonClick('text', item.LikedPoslasticar_ID, item, 0, 'LikedPoslasticar_ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.LikedPoslasticar_ID}</button>
                  <button onClick={() => handleButtonClick('text', item.ID, item, 0, 'ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.ID}</button>

                  <button onClick={() => handleButtonClick('text', item.Poslasticar_ID, item, 0, 'Poslasticar_ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Poslasticar_ID}</button>

                </>
                )}

                {item.type === 'SvidjanjaRestoran' && (
                <>
                  <h3>ID u tabeli, ID Mladenca, ID Restorana</h3>
                  <button onClick={() => handleButtonClick('text', item.LikedRestoran_ID, item, 0, 'LikedRestoran_ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.LikedRestoran_ID}</button>
                  <button onClick={() => handleButtonClick('text', item.ID, item, 0, 'ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.ID}</button>

                  <button onClick={() => handleButtonClick('text', item.Restoran_ID, item, 0, 'Restoran_ID', 0)} type="button" className="mx-4 mt-2 h-10 min-w-36 rounded-sm bg-snclgray text-center hover:bg-sncpink">{item.Restoran_ID}</button>

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

export default ClientsOverview;
