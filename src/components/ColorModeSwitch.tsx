import { HStack, Switch, } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";

const ColorModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <HStack>
            <Switch.Root checked={colorMode === 'dark'} onChange={toggleColorMode} colorPalette={'green'}>
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label whiteSpace='nowrap'>Dark Mode</Switch.Label>
            </Switch.Root>
        </HStack>
    );
};

export default ColorModeSwitch;
