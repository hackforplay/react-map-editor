import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { StoreState } from '../redux';

export const useTypedSelector: TypedUseSelectorHook<StoreState> = useSelector;
