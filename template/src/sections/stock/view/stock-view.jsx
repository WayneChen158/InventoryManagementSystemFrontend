import * as React from 'react';
import { useRef, useState, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import Stack from '@mui/material/Stack';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { getConsumablesURL, getProductsInStockURL, getComponentsInStockURL  } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import ProductPage from './product-view';
import ComponentPage from './component-view';
import ConsumablePage from './consumable-view';
import ShipOrderModal from '../components/ShipOrderModal';

// ----------------------------------------------------------------------

export default function StockPage() {
  const [value, setValue] = useState('1');

  const [refreshTrigger, setRefreshTrigger] = useState(1);

  const [openModal, setOpenModal] = useState(false);

  const [productList, setProductList] = useState([]);

  const [componentList, setComponentList] = useState([]);

  const [inventoryData, setInventoryData] = useState([]); 

  const productsInStockURL = useRef(getProductsInStockURL());

  const componentsInStockURL = useRef(getComponentsInStockURL());

  const consumablesURL = useRef(getConsumablesURL());

  useEffect(() => {
    fetch(productsInStockURL.current, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resdata) => {
        setProductList(resdata);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [refreshTrigger]);

  useEffect(() => {
    fetch(componentsInStockURL.current, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resdata) => {
        setComponentList(resdata);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [refreshTrigger]);
  
  useEffect(() => {
    fetch(consumablesURL.current)
    .then(res => res.json())
    .then(data => {
      setInventoryData(data)
    })
  }, [refreshTrigger]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const triggerRefresh = () => {
      setRefreshTrigger(prev => prev * (-1));
    }
  
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Stock</Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
          Ship Order
        </Button>

        <ShipOrderModal
          open={openModal}
          handleClose={handleCloseModal}
          triggerRefresh = {triggerRefresh}
          productList={productList}
          componentList={componentList}
          inventoryData={inventoryData}
        />

      </Stack>

        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="manufacture tabs">
              <Tab label="Products" value="1" sx={{ minWidth: '120px' }}/>
              <Tab label="Components" value="2" sx={{ minWidth: '120px' }}/>
              <Tab label="Consumables" value="3" sx={{ minWidth: '120px' }}/>
            </TabList>
          </Box>
          <TabPanel value="1"><ProductPage productList={productList} /></TabPanel>
          <TabPanel value="2"><ComponentPage componentList={componentList}/></TabPanel>
          <TabPanel value="3"><ConsumablePage inventoryData={inventoryData}/></TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
