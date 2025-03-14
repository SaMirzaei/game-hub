import { Card, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

const GameCardSkeleton = () => {
    return (
        <Card.Root maxW="sm" overflow="hidden" borderRadius={10} width='230px'>
            <Skeleton height='200px' />
            <Card.Body gap="2">
                <SkeletonText />
            </Card.Body>
            <Card.Footer gap="2">
                <SkeletonCircle />
            </Card.Footer>
        </Card.Root >
    )
}

export default GameCardSkeleton