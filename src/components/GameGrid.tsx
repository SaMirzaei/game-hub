import useGames from '@/hooks/useGames';
import { SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import GameCard from './GameCard';
import GameCardSkeleton from './GameCardSkeleton';
import GameCardContainer from './GameCardContainer';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';


const GameGrid = () => {

    const { data, error, isLoading, fetchNextPage, hasNextPage } = useGames();
    const skeletons = [1, 2, 3, 4, 5, 6];

    if (error) return <Text>{error.message}</Text>;

    const fetchedGamesCount = data?.pages.reduce((total, page) => total + page.results.length, 0) || 0;
    return (
        <InfiniteScroll
            next={() => fetchNextPage()}
            hasMore={!!hasNextPage}
            loader={<Spinner />}
            dataLength={fetchedGamesCount}>
            <SimpleGrid columns={{
                sm: 1, md: 2, lg: 3, xl: 4
            }} gap={4}>
                {isLoading && skeletons.map(skeleton => (
                    <GameCardContainer key={skeleton}>
                        <GameCardSkeleton key={skeleton} />
                    </GameCardContainer>
                ))}
                {data?.pages.map((page, index) =>
                    <React.Fragment key={index}>
                        {page.results.map(game => {
                            return <GameCardContainer key={game.id}>
                                <GameCard key={game.id} game={game} />
                            </GameCardContainer>
                        })}
                    </React.Fragment>)
                }
            </SimpleGrid>
        </InfiniteScroll>
    )
}

export default GameGrid;