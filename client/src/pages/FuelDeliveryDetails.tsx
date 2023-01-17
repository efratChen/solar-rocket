import { Delivery } from "../graphql/schema";
import { AppLayout } from "../layouts/AppLayout";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Box
} from "@mui/material";
import { getDeliveryDetailsByDate } from "./api";

const FuelDeliveryDetails = ({ openfuelDeliveryDetails,
  setOpenFuelDeliveryDetails,
  selectedFuelDeliveryDate }: {
    openfuelDeliveryDetails: boolean;
    setOpenFuelDeliveryDetails: boolean;
    selectedFuelDeliveryDate: String
  }): JSX.Element => {
  const [deliveries, setDeliveries] = useState<Delivery[] | null>(null);

  const handleNewMissionClose = () => {
    setOpenFuelDeliveryDetails(false);
  };

  useEffect(() => {
    getDeliveryDetailsByDate({ selectedFuelDeliveryDate }).then((data) => {
      setDeliveries(data.deliveries);
    });

  }, [selectedFuelDeliveryDate]);

  return (
    <AppLayout title="Fuel Deliveries">
      <Container maxWidth="lg">
        <Dialog
          open={openfuelDeliveryDetails}
          onClose={handleNewMissionClose}
          fullWidth
          maxWidth="sm"
          className="text-align-center"
        >
          <DialogTitle>Fuel Delivery Details</DialogTitle>
          <DialogContent>
            <ol>   {deliveries && deliveries.map((launch: Delivery, key: number) => (
              <>
                <Box
                  component="img"
                  sx={{
                    height: 80,
                    width: 80,
                  }}
                  src={launch.icon} />
                <li>
                  <p><b>quantity: </b>{launch.quantity}</p>
                  <p><b>type: </b>{launch.type}</p>
                  <p><b>unit: </b>{launch.unit.toString()}</p></li>
                <p>**********************</p>
              </>
            ))} </ol>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewMissionClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppLayout>
  );
};

export { FuelDeliveryDetails as FuelDeliveryDetails };
