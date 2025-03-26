import useGenres from "@/hooks/useGenres";
import getCroppedImageUrl from "@/services/image-url";
import useGameQueryStore from "@/store";
import { Button, Heading, HStack, Image, List, Spinner } from "@chakra-ui/react";


const GenreList = () => {
    const { data, isLoading, error } = useGenres();
    const selectedGenreId = useGameQueryStore(s => s.gameQuery.genreId)
    const setSelectedGenreId = useGameQueryStore(s => s.setGenreId)

    if (error) return null;

    if (isLoading) return <Spinner />;

    return (
        <>
            <Heading fontSize={'2xl'} marginBottom={3}>
                Genres
            </Heading>
            <List.Root listStyle="none">
                {data?.results.map((genre) => (
                    <List.Item key={genre.id} paddingY="5px">
                        <HStack>
                            <Image
                                boxSize="32px"
                                objectFit={'cover'}
                                borderRadius={8}
                                src={getCroppedImageUrl(genre.image_background)}
                            />
                            <Button
                                whiteSpace={"normal"}
                                textAlign={"left"}
                                fontWeight={genre.id === selectedGenreId ? "bold" : "normal"}
                                onClick={() => setSelectedGenreId(genre.id)}
                                fontSize="lg"
                                variant="plain"
                            >
                                {genre.name}
                            </Button>
                        </HStack>
                    </List.Item>
                ))}
            </List.Root>
        </>
    );
};

export default GenreList;
