/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { httpClientMock } from '../../../../../test/mocks';
import { mockDataSelectQuery, mockHttpQuery } from '../../../../../test/mocks/mockData';
import { CatalogTree } from '../catalog_tree';

jest.mock('../../../../dependencies/register_observability_dependencies', () => ({
  getRenderAccelerationDetailsFlyout: jest.fn(() => jest.fn()),
  getRenderCreateAccelerationFlyout: jest.fn(() => jest.fn()),
  setRenderAccelerationDetailsFlyout: jest.fn(() => jest.fn()),
  setRenderCreateAccelerationFlyout: jest.fn(() => jest.fn()),
}));

jest.mock('../../../../framework/catalog_cache_refs', () => ({
  catalogCacheRefs: {
    useLoadDatabasesToCache: jest.fn(() => ({
      loadStatus: '',
      startLoading: jest.fn(),
      stopLoading: jest.fn(),
    })),
    useLoadTablesToCache: jest.fn(() => ({
      loadStatus: '',
      startLoading: jest.fn(),
      stopLoading: jest.fn(),
    })),
    useLoadTableColumnsToCache: jest.fn(() => ({
      loadStatus: '',
      startLoading: jest.fn(),
      stopLoading: jest.fn(),
    })),
    useLoadAccelerationsToCache: jest.fn(() => ({
      loadStatus: '',
      startLoading: jest.fn(),
      stopLoading: jest.fn(),
    })),
    CatalogCacheManager: {
      getOrCreateDataSource: jest.fn(() => ({
        name: 'my_s3',
        lastUpdated: '',
        status: 'Updated',
        databases: [],
      })),
    },
  },
}));

describe('Test Catalog tree', () => {
  it('Loading state OpenSearch catalog tree', async () => {
    const client = httpClientMock;
    client.post = jest.fn().mockResolvedValue(mockHttpQuery);

    const { getByText } = render(
      <CatalogTree
        selectedItems={[{ label: 'OpenSearch' }]}
        updateSQLQueries={jest.fn()}
        refreshTree={true}
      />
    );

    await waitFor(() => {
      expect(getByText('.kibana_1')).toBeInTheDocument();
    });

    expect(document.body.children[0]).toMatchSnapshot();
  });

  it('Loading state S3 catalog tree', async () => {
    const client = httpClientMock;
    client.post = jest.fn().mockResolvedValue(mockHttpQuery);
    client.get = jest.fn().mockResolvedValue(mockDataSelectQuery);
    const { getByText } = render(
      <CatalogTree
        selectedItems={[{ label: 'my_s3' }]}
        updateSQLQueries={jest.fn()}
        refreshTree={true}
      />
    );

    await waitFor(() => {
      expect(getByText('No databases found')).toBeInTheDocument();
    });

    expect(document.body.children[0]).toMatchSnapshot();
  });
});
