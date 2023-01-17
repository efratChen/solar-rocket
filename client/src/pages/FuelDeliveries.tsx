import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { getDelivery } from "./api";
import { FuelDeliveryDetails } from "./FuelDeliveryDetails";

const FuelDeliveries = (): JSX.Element => {
  const [deliveryDates, setDeliveryDates] = useState<String[] | null>(null);
  const [openfuelDeliveryDetails, setOpenFuelDeliveryDetails] = useState<boolean>(false);
  const [selectedFuelDeliveryDate, setSelectedFuelDeliveryDate] = useState<String | null>(null);

  getDelivery().then((data) => {
    setDeliveryDates(data.deliveryDates);
  });

  const fuelDeliveryDetails = (missions: String) => {
    setSelectedFuelDeliveryDate(missions);
    setOpenFuelDeliveryDetails(true)
  }

  useEffect(() => {
  }, [openfuelDeliveryDetails, selectedFuelDeliveryDate]);

  return (
    <AppLayout title="Fuel Deliveries">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Upcoming Fuel Deliveries
        </Typography>
        <p></p>
        {deliveryDates ? (
          <Grid container spacing={2}>
            {" "}
            {deliveryDates.map((missions: String, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={missions}
                  />
                  <CardContent>
                    <Typography noWrap>Upcoming in {missions}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => fuelDeliveryDetails(missions)}>Show Details</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}
        {openfuelDeliveryDetails && <FuelDeliveryDetails
          openfuelDeliveryDetails={openfuelDeliveryDetails}
          setOpenFuelDeliveryDetails={setOpenFuelDeliveryDetails}
          selectedFuelDeliveryDate={selectedFuelDeliveryDate}
        />}
      </Container>
    </AppLayout>
  );
};

export { FuelDeliveries as FuelDeliveries };
