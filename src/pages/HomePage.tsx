import GameGrid from '@/components/GameGrid'
import GameHeading from '@/components/GameHeading'
import GenreList from '@/components/GenreList'
import PlatformSelector from '@/components/PlatformSelector'
import SortSelector from '@/components/SortSelector'
import { Grid, GridItem, useBreakpointValue, Box, Flex } from '@chakra-ui/react'

const HomePage = () => {
    return (
        <Grid templateAreas={{
            base: `"main"`,
            lg: `"aside main"`
        }} templateColumns={{
            base: '1fr',
            lg: '200px 1fr'
        }}>
            {useBreakpointValue({
                base: null, lg: <GridItem area={'aside'} paddingX={5}>
                    <GenreList />
                </GridItem>
            })}
            <GridItem area={'main'}>
                <Box paddingLeft={2}>
                    <GameHeading />
                    <Flex marginBottom={5}>
                        <Box marginRight={5}>
                            <PlatformSelector />
                        </Box>
                        <SortSelector />
                    </Flex>
                    <GameGrid />
                </Box>
            </GridItem>
        </Grid>
    )
}

export default HomePage