/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CreateAccelerationForm {
  dataSource: string;
  dataTable: string;
  accelerationIndexType: 'skipping' | 'covering' | 'materialized';
  queryBuilderType: 'visual' | 'code';
  codeQuery: string | undefined;
  accelerationIndexName: string;
  accelerationIndexAlias: string;
  primaryShardsCount: number;
  replicaShardsCount: number;
  refreshType: 'interval' | 'auto';
  refreshIntervalSeconds: string | undefined;
}
