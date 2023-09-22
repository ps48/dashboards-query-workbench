/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreateAccelerationForm, MaterializedViewColumn } from '../../../../../common/types';
import {
  EuiSpacer,
  EuiText,
  EuiExpression,
  EuiButton,
  EuiCode,
  EuiPopover,
  EuiPopoverFooter,
  EuiPopoverTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonEmpty,
} from '@elastic/eui';
import { AddColumnPopOver } from './add_column_popover';

interface MaterializedViewBuilderProps {
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const MaterializedViewBuilder = ({
  accelerationFormData,
  setAccelerationFormData,
}: MaterializedViewBuilderProps) => {
  const [isColumnPopOverOpen, setIsColumnPopOverOpen] = useState(false);
  const [columnExpressionValues, setColumnExpressionValues] = useState<MaterializedViewColumn[]>(
    []
  );

  return (
    <>
      <EuiText data-test-subj="covering-index-builder">
        <h3>Materialized view definition</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiExpression description="CREATE MATERIALIZED VIEW" value={'index-1'} />
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiExpression description="AS SELECT" value="" />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <AddColumnPopOver
            isColumnPopOverOpen={isColumnPopOverOpen}
            setIsColumnPopOverOpen={setIsColumnPopOverOpen}
            columnExpressionValues={columnExpressionValues}
            setColumnExpressionValues={setColumnExpressionValues}
            accelerationFormData={accelerationFormData}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiExpression description="FROM" value={'table-1'} />
    </>
  );
};
