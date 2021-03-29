import React from 'react';
import { shallow } from 'enzyme';
import Skeleton from 'react-loading-skeleton';

import { NavLinkSwiper } from './NavLinkSwiper';

let wrapped;

const props = {
  linkArray: ['10', '20', '28'],
  isLoading: false,
  selectedIndex: 2,
  beforeChange: jest.fn(),
  borderBottom: true,
};

describe('Nav Link Swiper', () => {
  beforeEach(() => {
    wrapped = shallow(<NavLinkSwiper {...props} />);
  });

  afterEach(() => {
    wrapped.unmount();
  });

  it('should render the loading state', () => {
    wrapped.setProps({ isLoading: true });
    expect(wrapped.find(Skeleton).exists()).toBeTruthy();
  });
});
