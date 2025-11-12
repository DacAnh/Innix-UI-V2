import React from 'react';
import HotelViewCardSkeleton from '../../hotel-view-card-skeleton/HotelViewCardSkeleton';

describe('<HotelViewCardSkeleton />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<HotelViewCardSkeleton />);
  });
});
