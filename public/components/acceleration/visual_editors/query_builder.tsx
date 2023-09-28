/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import _ from 'lodash';
import { CreateAccelerationForm, SkippingIndexRowType } from '../../../../common/types';
import { isTimePlural } from '../create/utils';

/* Add index options to query */
const buildIndexOptions = (accelerationformData: CreateAccelerationForm) => {
  const indexOptions: string[] = [];

  // Add index settings option
  indexOptions.push(
    `index_settings = '{"number_of_shards":${accelerationformData.primaryShardsCount},"number_of_replicas":${accelerationformData.replicaShardsCount}}'`
  );

  // Add auto refresh option
  indexOptions.push(`auto_refresh = ${accelerationformData.refreshType === 'auto'}`);

  // Add refresh interval option
  if (accelerationformData.refreshType === 'interval') {
    const { refreshWindow, refreshInterval } = accelerationformData.refreshIntervalOptions;
    indexOptions.push(
      `refresh_interval = '${refreshWindow} ${refreshInterval}${isTimePlural(refreshWindow)}'`
    );
  }

  // Add checkpoint location option
  if (accelerationformData.checkpointLocation) {
    indexOptions.push(`checkpoint_location = '${accelerationformData.checkpointLocation}'`);
  }

  // Combine all options with commas and return as a single string
  return `WITH (\n${indexOptions.join(',\n')}\n)`;
};

/* Add skipping index columns to query */
const buildSkippingIndexColumns = (skippingIndexQueryData: SkippingIndexRowType[]) => {
  return skippingIndexQueryData
    .map((n) => `   ${n.fieldName} ${n.accelerationMethod}`)
    .join(', \n');
};

/* Builds create skipping index query */
const skippingIndexQueryBuilder = (accelerationformData: CreateAccelerationForm) => {
  /*
   * Skipping Index Example
   *
   * CREATE SKIPPING INDEX ON table_name
   * FOR COLUMNS (
   *    field1 VALUE_SET,
   *    field2 PARTITION,
   *    field3 MIN_MAX,
   * ) WITH (
   * auto_refresh = true,
   * refresh_interval = '1 minute',
   * checkpoint_location = 's3://test/',
   * index_settings = '{"number_of_shards":9,"number_of_replicas":2}'
   * )
   */
  const { dataSource, database, dataTable, skippingIndexQueryData } = accelerationformData;

  const codeQuery = `CREATE SKIPPING INDEX
[IF NOT EXISTS]
ON ${dataSource}.${database}.${dataTable}
FOR COLUMNS (
  ${buildSkippingIndexColumns(skippingIndexQueryData)}
  ) ${buildIndexOptions(accelerationformData)}`;

  return codeQuery;
};

const coveringIndexQueryBuilder = (accelerationformData: CreateAccelerationForm) => {
  return '';
};

const materializedQueryViewBuilder = (accelerationformData: CreateAccelerationForm) => {
  return '';
};

export const accelerationQueryBuilder = (accelerationformData: CreateAccelerationForm) => {
  switch (accelerationformData.accelerationIndexType) {
    case 'skipping': {
      return skippingIndexQueryBuilder(accelerationformData);
    }
    case 'covering': {
      return coveringIndexQueryBuilder(accelerationformData);
    }
    case 'materialized': {
      return materializedQueryViewBuilder(accelerationformData);
    }
    default: {
      return '';
    }
  }
};
