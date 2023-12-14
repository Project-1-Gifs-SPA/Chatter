import {test, expect} from '@playwright/experimental-ct-react';
import SideBar from './SideBar';

test('it renders', async ({mount}) => {
    const component = await mount(<SideBar />)
});


