import { Game } from '@/hooks/useGames'
import { Button, Card, HStack, Image } from '@chakra-ui/react'
import PlatformIconList from './PlatformIconList'
import CriticScore from './CriticScore'
import getCroppedImageUrl from '@/services/image-url'
import Emoji from './Emoji'

interface Props {
    game: Game
}

const GameCard = ({ game }: Props) => {
    return (
        <Card.Root maxW="sm" overflow="hidden" borderRadius={10}>
            <Image
                src={getCroppedImageUrl(game.background_image)}
                alt={game.name}
            />
            <Card.Body gap="2">
                <HStack justifyContent={'space-between'} marginBottom={3}>
                    <PlatformIconList platforms={game.parent_platforms.map(p => p.platform)} />
                    <CriticScore score={game.metacritic} />
                </HStack>
                <Card.Title>
                    {game.name}
                    <Emoji rating={game.rating_top} />
                </Card.Title>
                <Card.Description>
                    {game.released}
                    {/* This sofa is perfect for modern tropical spaces, baroque inspired
                    spaces. */}
                </Card.Description>
                {/* <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                    $450
                </Text> */}
            </Card.Body>
            <Card.Footer gap="2">
                <Button variant="solid">Buy now</Button>
                <Button variant="ghost">Add to cart</Button>
            </Card.Footer>
        </Card.Root >
    )
}

export default GameCard