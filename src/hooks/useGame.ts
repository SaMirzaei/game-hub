import Game from "@/entities/Game";
import APICLient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const apiClient = new APICLient<Game>("/games");

const useGame = (slug: string) =>
  useQuery({
    queryKey: ["games", slug],
    queryFn: () => apiClient.get(slug),
  });

export default useGame;
