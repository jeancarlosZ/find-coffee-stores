import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 50,
  });
  const unsplashResults = photos.response.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latLong = "43.65267326999575,-79.39545615725015",
  limit = 8,
) => {
  try {
    const photos = await getListOfCoffeeStorePhotos();
    const response = await fetch(
      getUrlForCoffeeStores(latLong, "coffee stores", limit),
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
        },
      },
    );
    const data = await response.json();
    return (
      data.results.map((venue, idx) => {
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
      }) || []
    );
  } catch (err) {
    if (
      !process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY ||
      !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    ) {
      console.error(
        "Make sure to setup your API keys, checkout the docs on Github",
      );
    }
    console.log("Something went wrong fetching coffee stores", err);
    return [];
  }
};
