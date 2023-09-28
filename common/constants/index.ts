/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const PLUGIN_ID = 'queryWorkbenchDashboards';
export const PLUGIN_NAME = 'Query Workbench';
export const OPENSEARCH_ACC_DOCUMENTATION_URL = 'https://opensearch.org/docs/latest';
export const ACC_INDEX_TYPE_DOCUMENTATION_URL = 'https://opensearch.org/docs/latest';

export const ACCELERATION_INDEX_TYPES = [
  { label: 'Skipping Index', value: 'skipping' },
  { label: 'Covering Index', value: 'covering' },
  { label: 'Materialized View', value: 'materialized' },
];

export const ACCELERATION_AGGREGRATION_FUNCTIONS = [
  { label: 'count', value: 'count' },
  { label: 'sum', value: 'sum' },
  { label: 'avg', value: 'avg' },
  { label: 'max', value: 'max' },
  { label: 'min', value: 'min' },
];

export const ACCELERATION_TIME_INTERVAL = [
  { text: 'millisecond(s)', value: 'millisecond' },
  { text: 'second(s)', value: 'second' },
  { text: 'hour(s)', value: 'hour' },
  { text: 'day(s)', value: 'day' },
  { text: 'week(s)', value: 'week' },
];
