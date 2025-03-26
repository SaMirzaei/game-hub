import usePlatform from "@/hooks/usePlatform";
import usePlatforms from "@/hooks/usePlatforms";
import useGameQueryStore from "@/store";
import {
    Button,
    MenuContent,
    MenuItem,
    MenuItemGroup,
    MenuRoot,
    MenuTrigger,
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";

const PlatformSelector = () => {
    const { data, error } = usePlatforms();
    const setSelectedPlatformId = useGameQueryStore(s => s.setPlatformId);
    const selectedPlatformId = useGameQueryStore(s => s.gameQuery.platformId);
    const selectedPlatform = usePlatform(selectedPlatformId);

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
                    {data?.results.map(platform => <MenuItem key={platform.id} value={platform.id.toString()} onClick={() => setSelectedPlatformId(platform.id)}>{platform.name}</MenuItem>)}
                </MenuItemGroup>
            </MenuContent>
        </MenuRoot>
    );
};

export default PlatformSelector;
