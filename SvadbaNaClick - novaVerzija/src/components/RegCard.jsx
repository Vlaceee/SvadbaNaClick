/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

// engleski PREVEDENO
function RegCard({ naziv, linkTo }) {
  return (
    <Link to={linkTo} className="m-3 h-10 w-32 rounded-md bg-snclbrown p-2 text-center shadow-lg hover:bg-sncdbrown">
      {naziv}
    </Link>
  );
}

export default RegCard;
