// Initialize unsplash
import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 10,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map(result => result.urls["small"]);
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores("43.65267326999575,-79.39545615725015", "coffee stores", 6),
    {
      headers: {
        Authorization: process.env.FOURSQUARE_API_KEY,
      },
    },
  );
  const data = await response.json();
  return data.results.map((venue, idx) => {
    const neighborhood = venue.location.neighborhood;
    return {
      id: venue.fsq_id,
      name: venue.name,
      address: venue.location.address || "",
      neighborhood:
        (neighborhood && neighborhood.length > 0 && neighborhood[0]) ||
        venue.location.cross_street ||
        "",
      imgUrl: photos[idx],
    };
  });
};
