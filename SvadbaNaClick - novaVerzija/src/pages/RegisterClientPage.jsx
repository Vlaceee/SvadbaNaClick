/* eslint-disable max-len */
import { Button } from '@mui/base';
// import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { auth } from '../firebase';
import { registerClientSchema } from '../schemas/schema';

// Ilija
// Formik za forme
// PREVEDENO NA ENGLISH
function RegisterClientPage() {
  const navigate = useNavigate();
  const inputDugmeKlasa = 'w-full  bg-white text-sncdblue outline-none hover:ring-1 hover:ring-snclblue focus:ring-2 focus:ring-snclblue rounded-lg p-1 shadow-lg';
  const inputDugmeKlasaLosa = 'w-full  ring-red ring-1  bg-white text-sncdblue outline-none rounded-lg p-1 shadow-lg';
  const { t } = useTranslation();

  const handleSubmit = async (values) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
     
      await fetch('http://localhost:8080/mladenci', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Ime: values.ime,
          Prezime: values.prezime,
          Ime_Partnera: values.imePartnera,
          Prezime_Partnera: values.prezimePartnera,
          Broj_Telefona: values.brojTelefona,
          Email: values.email,
          Sifra: values.password, // or whatever field you want to update
          UID: auth.currentUser.uid,
        }),
      });
      navigate('/');
      window.location.reload();
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
      email: '',
      password: '',
      confirmPassword: '',
      ime: '',
      prezime: '',
      imePartnera: '',
      prezimePartnera: '',
      brojTelefona: '',
    },
    validationSchema: registerClientSchema,
    onSubmit: () => {
      handleSubmit(values);
    },
  });

  const formSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmit(values);
  };

  return (

    <div className="flex w-full flex-row flex-wrap-reverse items-center justify-center">
      <div className="m-6 mx-10 items-center self-center text-center">
        <Link to="/" className="hover:text-snclbrown">
          <p className="text-5xl font-extrabold ">Svadba Na Click</p>
          <p className="my-3 text-center font-thin">{t('organizeWedding')}</p>
        </Link>
      </div>
      <form onSubmit={formSubmitHandler} className="m-6 mx-10 grid h-fit min-w-96 max-w-96 rounded-xl bg-snclbrown p-6 text-white shadow-lg">
        <p className="text-xl font-extrabold text-snclgray">{t('registerPage')}</p>
        <div className="mt-5">
          <div className="flex flex-row">
            <div className="mr-2">
              <p>{t('loginName')}</p>
              <input
                name="ime"
                className={errors.ime && touched.ime ? inputDugmeKlasaLosa : inputDugmeKlasa}
                onChange={handleChange}
                value={values.ime}
                placeholder={t('loginYourName')}
                onBlur={handleBlur}
              />
              {errors.ime && touched.ime && <p className="text-red">{errors.ime}</p>}
            </div>
            <div className="ml-2">
              <p>{t('loginSurname')}</p>
              <input
                name="prezime"
                className={errors.prezime && touched.prezime ? inputDugmeKlasaLosa : inputDugmeKlasa}
                onChange={handleChange}
                value={values.prezime}
                placeholder={t('loginYourSurname')}
                onBlur={handleBlur}
              />
              {errors.prezime && touched.prezime && <p className="text-red">{errors.prezime}</p>}
            </div>
          </div>
          <div className="flex flex-row">
            <div className="mr-2">
              <p>{t('loginPartnerName')}</p>
              <input
                name="imePartnera"
                className={errors.imePartnera && touched.imePartnera ? inputDugmeKlasaLosa : inputDugmeKlasa}
                onChange={handleChange}
                value={values.imePartnera}
                placeholder={t('loginYourPartnerName')}
                onBlur={handleBlur}
              />
              {errors.imePartnera && touched.imePartnera && <p className="text-red">{errors.imePartnera}</p>}
            </div>
            <div className="ml-2">
              <p>{t('loginPartnerSurname')}</p>
              <input
                name="prezimePartnera"
                className={errors.prezimePartnera && touched.prezimePartnera ? inputDugmeKlasaLosa : inputDugmeKlasa}
                onChange={handleChange}
                value={values.prezimePartnera}
                placeholder={t('loginYourPartnerSurname')}
                onBlur={handleBlur}
              />
              {errors.prezimePartnera && touched.prezimePartnera && <p className="text-red">{errors.prezimePartnera}</p>}
            </div>
          </div>
          <div className="">
            <p>{t('phoneNumber')}</p>
            <input
              name="brojTelefona"
              className={errors.brojTelefona && touched.brojTelefona ? inputDugmeKlasaLosa : inputDugmeKlasa}
              onChange={handleChange}
              value={values.brojTelefona}
              placeholder="+381 61 1234567"
              onBlur={handleBlur}
            />
            {errors.brojTelefona && touched.brojTelefona && <p className="text-red">{errors.brojTelefona}</p>}
          </div>
          <div className="">
            <p>Email</p>
            <input
              name="email"
              className={errors.email && touched.email ? inputDugmeKlasaLosa : inputDugmeKlasa}
              onChange={handleChange}
              value={values.email}
              placeholder={t('emailExample')}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && <p className="text-red">{errors.email}</p>}
          </div>
          <div className="">
            <p>{t('password')}</p>
            <input
              name="password"
              className={errors.password && touched.password ? inputDugmeKlasaLosa : inputDugmeKlasa}
              type="password"
              onChange={handleChange}
              value={values.password}
              placeholder={t('yourPassword')}
              onBlur={handleBlur}
            />
            {errors.password && touched.password && <p className="text-red">{errors.password}</p>}
          </div>
          <div className="">
            <p>{t('confirmPassword')}</p>
            <input
              name="confirmPassword"
              className={errors.confirmPassword && touched.confirmPassword ? inputDugmeKlasaLosa : inputDugmeKlasa}
              type="password"
              onChange={handleChange}
              value={values.confirmPassword}
              placeholder={t('confirmYourPassword')}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && touched.confirmPassword && <p className="text-red">{errors.confirmPassword}</p>}
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button disabled={!(dirty && isValid)} type="submit" className={!(dirty && isValid) ? 'my-6 h-10 w-1/3  rounded-lg bg-snclgray shadow-lg' : 'my-6 h-10 w-1/3  rounded-lg bg-sncpink shadow-lg hover:bg-snclpink'}>{t('register')}</Button>
        </div>
        <div className="flex flex-row">
          <p>{t('alreadyHave')}</p>
          <span><Link to="/login" className="mx-2 text-sncpink">{t('login')}</Link></span>
        </div>
      </form>
    </div>
  );
}

export default RegisterClientPage;
