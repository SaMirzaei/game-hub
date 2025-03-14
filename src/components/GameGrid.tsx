import useGames from '@/hooks/useGames';
import { SimpleGrid, Text } from '@chakra-ui/react';
import GameCard from './GameCard';
import GameCardSkeleton from './GameCardSkeleton';
import GameCardContainer from './GameCardContainer';
import { GameQuery } from '@/App';

interface Props {
    gameQuery: GameQuery;
}

const GameGrid = ({ gameQuery }: Props) => {
    const { data: games, error, isLoading } = useGames(gameQuery);
    const skeletons = [1, 2, 3, 4, 5, 6];

    if (error) return <Text>{error}</Text>;

    return (
        <SimpleGrid columns={{
            sm: 1, md: 2, lg: 3, xl: 4
        }} spaceX={6} spaceY={6}>
            {isLoading && skeletons.map(skeleton => (
                <GameCardContainer key={skeleton}>
                    <GameCardSkeleton key={skeleton} />
                </GameCardContainer>
            ))}
            {games?.map(game => {
                return <GameCardContainer key={game.id}>
                    <GameCard key={game.id} game={game} />
                </GameCardContainer>
            })}
        </SimpleGrid>
    )
}

export default GameGrid;