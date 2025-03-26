import { Input } from '@chakra-ui/react'
import { InputGroup } from './ui/input-group'
import { LuSearch } from 'react-icons/lu'
import { useRef } from 'react'
import useGameQueryStore from '@/store';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
    const ref = useRef<HTMLInputElement>(null)
    const setSearchText = useGameQueryStore(s => s.setSearchText);
    const navigate = useNavigate();

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            if (ref.current) {
                setSearchText(ref.current.value);
                navigate('/')
            }
        }}>
            <InputGroup
                flex="1"
                width='100%'
                startElement={<LuSearch />}
            >
                <Input ref={ref} borderRadius={20} placeholder='Search games...' variant='subtle' />
            </InputGroup>
        </form>
    )
}

export default SearchInput