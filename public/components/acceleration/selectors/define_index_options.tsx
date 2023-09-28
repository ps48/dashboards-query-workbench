/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, useEffect, useState } from 'react';
import { CreateAccelerationForm } from '../../../../common/types';
import { EuiFieldText, EuiFormRow, EuiSpacer, EuiText, EuiToolTip } from '@elastic/eui';
import { validateIndexName } from '../create/utils';

interface DefineIndexOptionsProps {
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const DefineIndexOptions = ({
  accelerationFormData,
  setAccelerationFormData,
}: DefineIndexOptionsProps) => {
  const [indexName, setIndexName] = useState('');

  const onChangeIndexName = (e: ChangeEvent<HTMLInputElement>) => {
    setAccelerationFormData({ ...accelerationFormData, accelerationIndexName: e.target.value });
    setIndexName(e.target.value);
  };

  useEffect(() => {
    accelerationFormData.accelerationIndexType === 'skipping'
      ? setIndexName('skipping')
      : setIndexName('');
  }, [accelerationFormData.accelerationIndexType]);

  return (
    <>
      <EuiText data-test-subj="define-index-header">
        <h3>Index settings</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiFormRow
        label="Index name"
        helpText='Must be in lowercase letters. Cannot begin with underscores or hyphens. Spaces, commas, and characters :, ", *, +, /, \, |, ?, #, >, or < are not allowed. 
        Prefix and suffix are added to the name of generated OpenSearch index.'
      >
        <EuiToolTip
          position="right"
          content={
            accelerationFormData.accelerationIndexType === 'skipping'
              ? 'Skipping Index name follows a pre-defined in the format `flint_datasource_datatable_skipping_index` and cannot be changed.'
              : 'Generated OpenSearch index names follow the format `flint_datasource_datatable_<covering_index_name>_index` and `flint_datasource_datatable_<materialized_view>`'
          }
        >
          <EuiFieldText
            placeholder="Enter Index Name"
            value={indexName}
            onChange={onChangeIndexName}
            aria-label="Enter Index Name"
            prepend={`flint_${accelerationFormData.dataSource}_${accelerationFormData.database}_`}
            append={accelerationFormData.accelerationIndexType === 'materialized' ? '' : '_index'}
            disabled={accelerationFormData.accelerationIndexType === 'skipping'}
            isInvalid={validateIndexName(indexName)}
          />
        </EuiToolTip>
      </EuiFormRow>
    </>
  );
};
