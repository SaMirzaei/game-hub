import Platform from "@/entities/Platform";
import Genre from "./Genre";
import Publisher from "./Publisher";

export default interface Game {
  id: number;
  name: string;
  background_image: string;
  slug: string;
  genres: Genre[];
  publishers: Publisher[];
  released: string;
  parent_platforms: { platform: Platform }[];
  metacritic: number;
  rating_top: number;
  description: string;
  description_raw: string;
}

export interface GameDetails extends Game {
  website: string;
  developers: Publisher[];
  esrb_rating: {
    id: number;
    name: string;
    slug: string;
  };
  screenshots: { id: number; image: string }[];
}