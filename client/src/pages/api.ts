const BASE_URL = "https://solar-rocket-fuel.benmanage.click";
const headers = {
    "content-type": "application/json",
    "UserID": "e0548403851@gmail.com",
    "ApiKey":"40b5eeeba5d431ee1f087128c836c3f6b575c45c957f4e8fa7105b30dfa12539"
};
export const getAsync = async (url: string) => {
    url = `${BASE_URL}${url}`;
    console.log(`[Request] GET ${url}`, { headers });
    try {
        let res = await fetch(url, { method: "GET", headers });
        res = await res.json();
        console.log(`[Response] GET ${url}`, res);
        return res;
    } catch (e) {
        console.log(`[Error] GET ${url}`, e);
        throw e;
    }
};
export const getDelivery = () => {
    const url = "/deliveries?startDate=2023-09-09&numberOfDays=5"
    return getAsync(url);
}
export const getDeliveryDetailsByDate = (date: any) => {
    const url = `/delivery/${date.selectedFuelDeliveryDate}`;
    return getAsync(url);
}