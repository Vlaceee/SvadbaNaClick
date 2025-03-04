/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LooksOneRoundedIcon from '@mui/icons-material/LooksOneRounded';
import LooksTwoRoundedIcon from '@mui/icons-material/LooksTwoRounded';
import Looks3RoundedIcon from '@mui/icons-material/Looks3Rounded';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { loginSchema } from '../schemas/schema';
import auth from '../firebase';
// engleski PREVEDENO
function RegisterRestoranPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const inputDugmeKlasa = 'h-7 w-64 rounded-md px-2 shadow-md';
  const inputDugmeKlasaLosa = ' ring-red ring-1 outline-none h-7 w-64 rounded-md px-2 shadow-md';

  const handleSubmit = async (values) => {
    try {
      const sigCode = await axios.get(`http://localhost:8080/sigurnosnikod/${values.skod}`);
      const fetchedSigCode = sigCode.data;
      console.log(fetchedSigCode);

      if (fetchedSigCode[0].Sigurnosni_Kod === values.skod) {
        await createUserWithEmailAndPassword(auth, values.email, values.password);

        await fetch('http://localhost:8080/restoran', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Naziv: values.naziv,
            Kratak_Opis: values.opis,
            Email: values.email,
            Lokacija: values.lokacija,
            Cena: null,
            Datum_Osnivanja: values.datum,
            Sifra: values.password,
            Sigurnosni_Kod: values.skod,
            RestoranPraviTortu: values.restoranPraviTortu,
            Bend: false,
            UID: auth.currentUser.uid,
            Broj_Telefona: values.brojTelefona,
          }),
        });
        console.log(values);
        navigate('/');
        window.location.reload();
      } else {
        alert('Sigurnosni kod nije ispravan');
      }
    } catch (err) {
      console.error('Error posting data:', err);
      console.log('Greska u registrovanju');
      console.error(err);
    }
  };

  const {
    values, handleBlur, handleChange, errors, touched, dirty, isValid,
  } = useFormik({
    initialValues: {
      naziv: '',
      datum: '',
      email: '',
      skod: '',
      password: '',
      confirmPassword: '',
      opis: '',
      lokacija: '',
      restoranPraviTortu: '',
      brojTelefona: '',
    },
    validationSchema: loginSchema,
    onSubmit: () => {
      handleSubmit(values);
    },
  });

  const formSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmit(values);
  };

  return (
    <div className="flex size-full flex-row flex-wrap-reverse items-center justify-around p-3">

      <div className="m-6 mx-10 items-center self-center text-center">
        <Link to="/" className="hover:text-snclbrown">
          <p className="text-5xl font-extrabold">Svadba Na Click</p>
          <p className="my-3 text-center font-thin">{t('organizeWedding')}</p>
        </Link>
      </div>
      <form onSubmit={formSubmitHandler} className=" flex w-2/5 min-w-80 flex-row flex-wrap items-center justify-center  gap-3 rounded-lg bg-snclbrown p-3  shadow-lg">
        <div className="w-full">
          <div className="my-3 flex w-full flex-row items-center text-center text-2xl font-bold text-snclgray">
            <LooksOneRoundedIcon className="text-white" />
            <span>{t('osnovneInformacijeOVama')}</span>
          </div>
          <hr className="mx-2 h-0.5 border-0 bg-snclgray" />

          <div className="mt-3 flex flex-col items-center">
            <div className="flex flex-row flex-wrap justify-center">
              <div className="mx-3">
                <p className="text-xl font-bold text-white">{t('nazivRestorana')}</p>
                <input
                  name="naziv"
                  placeholder={t('upisiteImeRestorana')}
                  type="text"
                  className={errors.naziv && touched.naziv ? inputDugmeKlasaLosa : inputDugmeKlasa}
                  onChange={handleChange}
                  value={values.naziv}
                  onBlur={handleBlur}
                />
                {errors.naziv && touched.naziv && <p className="text-red">{errors.naziv}</p>}

              </div>
              <div className="mx-3">
                <h1 className="text-xl font-bold text-white">{t('datumOsnivanja')}</h1>
                <DatePicker
                  isClearable
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    handleChange({ target: { name: 'datum', value: date } }); // Add this line to set the value in formik
                  }}
                  className="h-8  w-64 rounded-md border-2 shadow-md"
                  popperPlacement="bottom"
                  showIcon
                  placeholderText={t('unesiteDatumOsnivanja')}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="mx-3">
                  <p className="text-xl font-bold text-white">{t('phoneNumber')}</p>
                  <input
                    name="brojTelefona"
                    placeholder={t('vasBrojTelefona')}
                    type="text"
                    className={errors.brojTelefona && touched.brojTelefona ? inputDugmeKlasaLosa : inputDugmeKlasa}
                    onChange={handleChange}
                    value={values.brojTelefona}
                    onBlur={handleBlur}
                  />
                  {errors.brojTelefona && touched.brojTelefona && <p className="text-red">{errors.brojTelefona}</p>}

                </div>
                <p className="mt-3 text-center text-lg text-white">{t('informacijeOMeniju')}</p>
              </div>
            </div>
            {/* Repeat similar input fields for other form elements */}
          </div>
        </div>
        <div className="w-full">
          <div className="my-3 flex w-full flex-row items-center text-center text-2xl font-bold text-snclgray">
            <LooksTwoRoundedIcon className="text-white" />
            {t('InformacijeONalogu')}
          </div>
          <hr className="mx-2 h-0.5 border-0 bg-snclgray" />

          <div className="mt-3 flex flex-col flex-wrap items-center">

            <div className="flex flex-row flex-wrap  justify-center">
              <div className="mx-3">
                <p className="text-xl font-bold text-white">E-mail</p>
                <input
                  name="email"
                  type="text"
                  className={errors.email && touched.email ? inputDugmeKlasaLosa : inputDugmeKlasa}
                  onChange={handleChange}
                  value={values.email}
                  onBlur={handleBlur}
                  placeholder={t('emailExample')}
                />
                {errors.email && touched.email && <p className="text-red">{errors.email}</p>}

              </div>
              {' '}
              <div className="mx-3">
                <p className="text-xl font-bold text-white">{t('safetyCode!')}</p>
                <input
                  name="skod"
                  type="text"
                  className={errors.skod && touched.skod ? inputDugmeKlasaLosa : inputDugmeKlasa}
                  onChange={handleChange}
                  value={values.skod}
                  onBlur={handleBlur}
                  placeholder={t('unesitesigkod')}
                />
                {errors.skod && touched.skod && <p className="text-red">{errors.skod}</p>}

              </div>
            </div>
            <div className="flex flex-row flex-wrap  justify-center ">
              <div className="mx-3">
                <p className="text-xl font-bold text-white">{t('password')}</p>
                <input
                  name="password"
                  type="password"
                  className={errors.password && touched.password ? inputDugmeKlasaLosa : inputDugmeKlasa}
                  onChange={handleChange}
                  value={values.password}
                  onBlur={handleBlur}
                  placeholder={t('yourPassword')}
                />
                {errors.password && touched.password && <p className="text-red">{errors.password}</p>}

              </div>
              <div className="mx-3">
                <p className="text-xl font-bold text-white">{t('confirmPassword')}</p>
                <input
                  name="confirmPassword"
                  type="password"
                  className={errors.confirmPassword && touched.confirmPassword ? inputDugmeKlasaLosa : inputDugmeKlasa}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  placeholder={t('confirmYourPassword')}
                />
                {errors.confirmPassword && touched.confirmPassword && <p className="text-red">{errors.confirmPassword}</p>}

              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="my-3 flex w-full flex-row items-center text-center text-2xl font-bold text-snclgray">
            <Looks3RoundedIcon className="text-white" />
            {t('ostaleInformacije')}
          </div>
          <hr className="mx-2 h-0.5 border-0 bg-snclgray" />

          <div className="mt-6 flex flex-col items-center px-6">

            <textarea
              name="opis"
              type="text"
              className={errors.opis && touched.opis ? 'h-32 w-full rounded-md px-2 shadow-md outline-none ring-1 ring-red' : 'h-32 w-full rounded-md px-2 shadow-md'}
              onChange={handleChange}
              value={values.opis}
              onBlur={handleBlur}
              placeholder={t('KaziteNamNestoOVama')}
              maxLength={200} // Limit the number of characters (words)
              rows={2} // Set the initial number of visible rows
              style={{ resize: 'vertical', textAlign: 'start' }}
            />
            {errors.opis && touched.opis && <p className="text-red">{errors.opis}</p>}
            <div className="mx-2 mt-3 flex flex-row items-center">
              <p className="text-xl font-bold text-white">
                {t('DaLiPraviteTortu')}
                ?
              </p>
              <input
                name="restoranPraviTortu"
                type="checkbox"
                className="mx-3 h-6 w-6"
                onChange={handleChange}
                value={values.restoranPraviTortu}
                onBlur={handleBlur}
              />
            </div>
            <div className="mt-3 flex flex-row flex-wrap justify-center">
              <div className="mx-2">
                <p className="text-xl font-bold text-white">{t('Lokacija')}</p>
                <input
                  name="lokacija"
                  type="text"
                  className={errors.lokacija && touched.lokacija ? inputDugmeKlasaLosa : inputDugmeKlasa}
                  onChange={handleChange}
                  value={values.lokacija}
                  onBlur={handleBlur}
                  placeholder={t('enterLocation')}
                />
                {errors.lokacija && touched.lokacija && <p className="text-red">{errors.lokacija}</p>}

              </div>
              {' '}

            </div>

            <button type="submit" className=" my-6 h-10 w-36  rounded-lg bg-sncpink text-white shadow-lg hover:bg-snclpink">
              {t('register')}
            </button>
            <h1 className="mx-2 mb-3 text-center">
              {t('alreadyHave')}
              <span><button type="button" className=" mx-2 text-sncpink hover:text-snclpink">{t('login')}</button></span>
            </h1>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterRestoranPage;

