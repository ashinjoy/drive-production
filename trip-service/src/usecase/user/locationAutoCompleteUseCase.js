import axios from "axios";
export class LocationAutoCompleteUseCase {
  async execute(search) {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURI(
          search
        )}.json&access_token=${
          process.env.MAPBOX_ACCESS_TOKEN
        }&autocomplete=true&limit=5`
      );
      return response.data?.features;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
