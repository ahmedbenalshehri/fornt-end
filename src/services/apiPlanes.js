import axios from "axios";

export const locationSearch = async (term, lan) => {
  try {
    const res = await axios.get(
      "https://api.tequila.kiwi.com/locations/query",
      {
        params: {
          term: term,
          locale: lan,
          location_types: "city",
          limit: 5,
          active_only: true,
        },
        headers: {
          accept: "application/json",
          apikey: "DzzphWUXkgDUThzrRUWVHwr0ccQqRpNu",
        },
      }
    );

    // Handle the response data here
    return res.data.locations;
  } catch (error) {
    // Handle errors here
    return error.message;
  }
};
export const getCityById = async (id, lan) => {
  try {
    const res = await axios.get("https://api.tequila.kiwi.com/locations/id", {
      params: {
        id,
        locale: lan,
        limit: 1,
        active_only: true,
      },
      headers: {
        accept: "application/json",
        apikey: "DzzphWUXkgDUThzrRUWVHwr0ccQqRpNu",
      },
    });

    // Handle the response data here
    return res.data.locations[0];
  } catch (error) {
    // Handle errors here
    return error.message;
  }
};
