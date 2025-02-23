import './Motorista.css'
import React from 'react';
import NavBar2 from './components/NavBar2';
import { Paper, Typography,Box,Button ,Card,CardMedia,CardActionArea,CardContent,CardActions,Snackbar,Alert} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useMutation,useQuery } from 'react-query';
import axios from 'axios';
import { useState } from 'react';
import Carregando from './Carregando';


const AlertSnack = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FinalizarViagem = async ({viagemId}) => {
  
  const response = await fetch(```http://localhost:8081/viagem/${viagemId}/cancel```, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  return response.json();
};

const statusMotorista = async ({motoristaId}) => {
  
  const response = await fetch(```http://localhost:8080/motorista/${motoristaId}/ocupacao```, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  return response.json();
};



function NovaViagem() {

  const location = useLocation();
  const [open,setOpen] = useState(false);
  const [loading,setLoading] = useState();
  const { motoristaId } = location.state || {};

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const { data, isLoading, error } = useQuery("motorista", () => 
    axios.get(```http://localhost:8080/viagem/${motoristaId}/confirmado```).then((res) => res.data)
    );

  

  const { mutate1 } = useMutation(FinalizarViagem, {
    onSuccess: () => {
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
    }
  });

  const { mutate2 } = useMutation(statusMotorista, {
    onSuccess: () => {
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
    }
  });
  const handleConfirmClick = async () => {
    setOpen(true);
  
    try {
      if (motoristaId) {
        mutate1({ 
          viagemId: data.viagemId
        });
        mutate2({
          motoristaId: motoristaId
        })}
    } catch (e) {
        // Tratamento de erro aqui
    }
};

    
    return (
        <>
        <NavBar2/>
        {loading ? <Carregando></Carregando>:
        <div className='teste'>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>

          Viagem Finalizada com Sucesso!
        </Alert>
        </Snackbar>

        <Card sx={{ maxWidth: 750,maxHeight:750 }}>
      <CardMedia
        component="img"
        alt="taxi animation"
        height="500"
        image="https://cdn.dribbble.com/users/674925/screenshots/4749353/media/e2f370153a90139d89c57e9ac459b991.gif"
        
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Viagem em Progresso
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleConfirmClick} variant='outlined' color="error" size="small">Finalizar Viagem</Button>
        
      </CardActions>
    </Card>
        </div> }
        </>
    )
    }

export default NovaViagem;