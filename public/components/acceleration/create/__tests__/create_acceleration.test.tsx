/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { waitFor } from '@testing-library/dom';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';
import { CreateAcceleration } from '../create_acceleration';

describe('Create acceleration flyout components', () => {
  configure({ adapter: new Adapter() });

  it('renders acceleration flyout component with default options', async () => {
    const dataSource = '';
    const resetFlyout = jest.fn();
    const updateQueries = jest.fn();

    const wrapper = mount(
      <CreateAcceleration
        dataSource={dataSource}
        resetFlyout={resetFlyout}
        updateQueries={updateQueries}
      />
    );
    wrapper.update();
    await waitFor(() => {
      expect(
        toJson(wrapper, {
          noKey: false,
          mode: 'deep',
        })
      ).toMatchSnapshot();
    });
  });
});