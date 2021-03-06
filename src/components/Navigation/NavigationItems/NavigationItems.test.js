import React from 'readline';

import { configure, shallow, expect } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()});

describe('<NavigationItems />', () => {

    it('should render two elements if not authenticated', () => {
        const wrapper = shallow(<NavigationItems />);
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should render three elements if  authenticated', () => {
        const wrapper = shallow(<NavigationItems isAuthenticated/>);
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });
});