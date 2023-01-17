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
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia
} from "@mui/material";
import { getDeliveryDetailsByDate } from "./api";

const FuelDeliveryDetails = ({ openfuelDeliveryDetails,
  setOpenFuelDeliveryDetails,
  selectedFuelDeliveryDate }: {
    openfuelDeliveryDetails: boolean;
    setOpenFuelDeliveryDetails: (isOpen: boolean) => void;
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
      <AppLayout title="Fuel Deliveries" >
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
              {deliveries && deliveries.map((launch: Delivery, key: number) => (
                <>
                  <Grid item key={key}>
                    <Card sx={{ width: 275, height: 200, textAlign: "center" }}>
                      <CardMedia
                        component="img"
                        sx={{
                          height: 80,
                          width: 80,
                          display: "inline-flex"
                        }}
                        image={launch.icon.toString()}
                      />
                      <CardContent>
                        <>
                          quantity: {launch.quantity}{<br/>}
                          type: {launch.type}{<br/>}
                          unit: {launch.unit.toString()}{<br/>}
                        </>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              ))}
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
