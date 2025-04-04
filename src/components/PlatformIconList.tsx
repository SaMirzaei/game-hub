import Platform from "@/entities/Platform"
import { HStack, Icon } from '@chakra-ui/react'
import { FaWindows, FaPlaystation, FaXbox, FaApple, FaLinux, FaAndroid } from 'react-icons/fa'
import { MdPhoneIphone } from 'react-icons/md'
import { SiNintendo, SiSega, SiNeo4J } from 'react-icons/si'
import { BsGlobe } from 'react-icons/bs'
import { IconType } from 'react-icons'

interface Props {
    platforms: Platform[]
}

const PlatformIconList = ({ platforms }: Props) => {
    const iconMap: { [key: string]: IconType } = {
        pc: FaWindows,
        playstation: FaPlaystation,
        xbox: FaXbox,
        nintendo: SiNintendo,
        mac: FaApple,
        ios: MdPhoneIphone,
        web: BsGlobe,
        android: FaAndroid,
        linux: FaLinux,
        sega: SiSega,
    }
    iconMap['neo-geo'] = SiNeo4J;

    return (
        <HStack>
            {platforms.map((platform) => (
                <Icon key={platform.id} as={iconMap[platform.slug]} />
            ))}
        </HStack>
    )
}

export default PlatformIconList