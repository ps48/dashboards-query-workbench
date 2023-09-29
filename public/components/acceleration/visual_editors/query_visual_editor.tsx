/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiSpacer } from '@elastic/eui';
import { CreateAccelerationForm } from '../../../../common/types';
import { SkippingIndexBuilder } from './skipping_index/skipping_index_builder';
import { CoveringIndexBuilder } from './covering_index/covering_index_builder';
import { MaterializedViewBuilder } from './materialized_view/materialized_view_builder';

interface QueryVisualEditorProps {
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const QueryVisualEditor = ({
  accelerationFormData,
  setAccelerationFormData,
}: QueryVisualEditorProps) => {
  return (
    <>
      <EuiSpacer size="l" />
      {accelerationFormData.accelerationIndexType === 'skipping' && (
        <SkippingIndexBuilder
          accelerationFormData={accelerationFormData}
          setAccelerationFormData={setAccelerationFormData}
        />
      )}
      {accelerationFormData.accelerationIndexType === 'covering' && (
        <CoveringIndexBuilder
          accelerationFormData={accelerationFormData}
          setAccelerationFormData={setAccelerationFormData}
        />
      )}
      {accelerationFormData.accelerationIndexType === 'materialized' && (
        <MaterializedViewBuilder
          accelerationFormData={accelerationFormData}
          setAccelerationFormData={setAccelerationFormData}
        />
      )}
    </>
  );
};
