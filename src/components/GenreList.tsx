import useGenres, { Genre } from "@/hooks/useGenres";
import getCroppedImageUrl from "@/services/image-url";
import { Button, Heading, HStack, Image, List, Spinner } from "@chakra-ui/react";

interface Props {
    onSelectedGenre: (genre: Genre) => void;
    selectedGenre: Genre | null;
}

const GenreList = ({ onSelectedGenre, selectedGenre }: Props) => {
    const { data, isLoading, error } = useGenres();

    if (error) return null;

    if (isLoading) return <Spinner />;

    return (
        <>
            <Heading fontSize={'2xl'} marginBottom={3}>
                Genres
            </Heading>
            <List.Root listStyle="none">
                {data.map((genre) => (
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
                                fontWeight={genre.id === selectedGenre?.id ? "bold" : "normal"}
                                onClick={() => onSelectedGenre(genre)}
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
