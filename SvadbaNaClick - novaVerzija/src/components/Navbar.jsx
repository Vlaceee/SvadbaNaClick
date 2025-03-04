import {
  Button,
} from '@mui/base';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import { auth } from '../firebase';

// engleski PREVEDNO
// eslint-disable-next-line react/prop-types
function Navbar() {
  const [isOpen, setisOpen] = useState(false);

  const changeOpen = () => {
    setisOpen(!isOpen);
  };
  return (
    <div className="position:fixed flex h-fit w-full flex-wrap justify-between bg-sncpink px-10 pb-2 pt-1 text-white">
      <Link className="text-xl font-extrabold hover:text-snclbrown" to="/">Svadba Na Click</Link>
      <div className="pt-1">
        <div className="hidden md:flex">
          <Links1 />
        </div>
        <Button className="md:hidden" onClick={changeOpen}>
          {isOpen
            ? <CloseIcon />
            : <MenuIcon />}
        </Button>
      </div>
      {isOpen && (
      <div className="basis-full items-center md:hidden">
        <Links2 />
      </div>
      )}
    </div>
  );
}

function Links1() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSrpski = () => {
    setAnchorEl(null);
    i18next.changeLanguage('srb');
  };
  const handleCloseEngleski = () => {
    setAnchorEl(null);
    i18next.changeLanguage('en');
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = async () => {
    navigate('/profile');
  };
  return (
    <div className="flex flex-row">
      <Button
        className="mx-2"
        id="jezikButton"
        aria-controls={open ? 'jezikMenu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {t('language')}
      </Button>
      <Link className="mx-2 hover:text-snclbrown" to="/oglasi/fotograf">{t('ads')}</Link>
      <Link className="mx-2 hover:text-snclbrown" to="/about">{t('info')}</Link>
      {isLoggedIn === false
        ? (
          <div>
            <Link className="ml-2 rounded-bl-lg bg-snclpink p-1 px-3 text-sncdblue shadow-lg hover:text-sncpink" to="/login">{t('login')}</Link>
            <Link className="mr-2 rounded-tr-lg bg-snclblue p-1 px-3 text-white shadow-lg hover:text-snclbrown" to="/register">{t('register')}</Link>
          </div>
        )
        : (
          <Button className="ml-2 rounded-lg bg-snclblue  px-3 text-white shadow-lg hover:text-snclbrown" onClick={handleProfile}>
            {' '}
            {t('myProfile')}
            {' '}
          </Button>
        )}
      <Menu
        id="jezikMenu"
        aria-labelledby="jezikButton"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleCloseSrpski}>Srpski</MenuItem>
        <MenuItem onClick={handleCloseEngleski}>English</MenuItem>
      </Menu>

    </div>
  );
}

function Links2() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSrpski = () => {
    setAnchorEl(null);
    i18next.changeLanguage('srb');
  };
  const handleCloseEngleski = () => {
    setAnchorEl(null);
    i18next.changeLanguage('en');
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = async () => {
    navigate('/profile');
  };
  return (
    <div className="flex flex-col items-center">
      <Button
        id="jezikButton"
        aria-controls={open ? 'jezikMenu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="mx-2"
      >
        {t('language')}
      </Button>
      <Link className="mx-2 hover:text-snclbrown" to="/oglasi/fotograf">{t('ads')}</Link>
      <Link className="mx-2 hover:text-snclbrown" to="/about">{t('info')}</Link>
      {isLoggedIn === false
        ? (
          <div className="flex flex-col text-center">
            <Link className="mx-2 hover:text-snclbrown" to="/login">{t('login')}</Link>
            <Link className="mx-2 hover:text-snclbrown" to="/register">{t('register')}</Link>
          </div>
        )
        : (
          <Button onClick={handleProfile}>
            {' '}
            {t('myProfile')}
            {' '}
          </Button>
        )}
      <Menu
        id="jezikMenu"
        aria-labelledby="jezikButton"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleCloseSrpski}>Srpski</MenuItem>
        <MenuItem onClick={handleCloseEngleski}>English</MenuItem>
      </Menu>
    </div>
  );
}

export default Navbar;
