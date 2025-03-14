import { Button, MenuContent, MenuItem, MenuItemGroup, MenuRoot, MenuTrigger } from '@chakra-ui/react';
import { BsChevronDown } from 'react-icons/bs';

interface Props {
    onSelectSortOrder: (sortOrder: string) => void;
    sortOrder: string;
}

const SortSelector = ({ onSelectSortOrder, sortOrder }: Props) => {
    const sortOrders = [
        { value: '', label: 'Relevance' },
        { value: '-added', label: 'Date added' },
        { value: 'name', label: 'Name' },
        { value: '-released', label: 'Release date' },
        { value: '-metacritic', label: 'Popularity' },
        { value: '-rating', label: 'Average rating' },
    ];

    const currentSortOrder = sortOrders.find(order => order.value === sortOrder);

    return (
        <MenuRoot>
            <MenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <BsChevronDown /> Order by: {currentSortOrder?.label || 'Relevance'}
                </Button>
            </MenuTrigger>
            <MenuContent minW="10rem">
                <MenuItemGroup>
                    {sortOrders?.map(order => <MenuItem key={order.value} value={order.value} onClick={() => onSelectSortOrder(order.value)}>{order.label}</MenuItem>)}
                </MenuItemGroup>
            </MenuContent>
        </MenuRoot>
    );
}

export default SortSelector