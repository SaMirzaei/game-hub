import { Platform } from "@/hooks/useGames";
import usePlatforms from "@/hooks/usePlatforms";
import {
    Button,
    MenuContent,
    MenuItem,
    MenuItemGroup,
    MenuRoot,
    MenuTrigger,
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";

interface Props {
    onSelectPlatform: (platform: Platform) => void;
    selectedPlatform: Platform | null;
}

const PlatformSelector = ({ onSelectPlatform, selectedPlatform }: Props) => {
    const { data, error } = usePlatforms()

    if (error) return null;

    return (
        <MenuRoot>
            <MenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <BsChevronDown /> {selectedPlatform?.name || 'Platforms'}
                </Button>
            </MenuTrigger>
            <MenuContent minW="10rem">
                <MenuItemGroup>
                    {data?.map(platform => <MenuItem key={platform.id} value={platform.id.toString()} onClick={() => onSelectPlatform(platform)}>{platform.name}</MenuItem>)}
                </MenuItemGroup>
            </MenuContent>
        </MenuRoot>
    );
};

export default PlatformSelector;
