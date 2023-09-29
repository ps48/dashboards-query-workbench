/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { WorkbenchApp } from './components/app';
import { AppPluginStartDependencies } from './types';

export const renderApp = (
  { notifications, http, chrome, overlays }: CoreStart,
  { navigation }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <WorkbenchApp
      basename={appBasePath}
      notifications={notifications}
      http={http}
      navigation={navigation}
      chrome={chrome}
      overlays={overlays}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
