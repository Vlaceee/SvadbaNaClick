/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { HiCake } from 'react-icons/hi';
import Rating from '@mui/material/Rating';
import { useTranslation } from 'react-i18next';
import Baker from './BakerClass';

// engleski PREVEDENO
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function OglasiCardBaker({ baker }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);
  const url = `/poslasticar/${baker.ID}`;
  // const url1 = '/poslasticar/12';
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345, bgcolor: '#EAE4CC', border: '3px solid #B4436C' }}>
      <CardHeader
        avatar={(
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <HiCake />
          </Avatar>
        )}
        // action={(
        //  <IconButton aria-label="settings">
        //    <MoreVertIcon />
        //  </IconButton>
       // )}
        title={`${baker._NazivAgencije} ${baker.Prezime}`}
        subheader={`Datum osnivanja: ${baker._DatumOsnivanja.toDateString()}`}
      />
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center', // Align vertically
          justifyContent: 'start', // Align horizontally
          paddingLeft: '16px',
        }}
      >
        {`Lokacija : ${baker._Lokacija}`}
      </Typography>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {baker._OpisPosla}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>

        <Link className="ml-2 mr-20 hover:text-snclbrown" to={url}>
          <Button variant="contained" endIcon={<SendIcon />}>
            {' '}
            {t('visitAd')}
            {' '}
          </Button>
        </Link>

      </CardActions>

    </Card>
  );
}
