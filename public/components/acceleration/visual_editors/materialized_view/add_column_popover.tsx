/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiPopover,
  EuiButtonEmpty,
  EuiPopoverTitle,
  EuiText,
  EuiCode,
  EuiPopoverFooter,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldText,
  EuiFormRow,
  EuiComboBox,
} from '@elastic/eui';

import { CreateAccelerationForm, MaterializedViewColumn } from '../../../../../common/types';

interface AddColumnPopOverProps {
  isColumnPopOverOpen: boolean;
  setIsColumnPopOverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  columnExpressionValues: MaterializedViewColumn[];
  setColumnExpressionValues: React.Dispatch<React.SetStateAction<MaterializedViewColumn[]>>;
  accelerationFormData: CreateAccelerationForm;
}

export const AddColumnPopOver = ({
  isColumnPopOverOpen,
  setIsColumnPopOverOpen,
  columnExpressionValues,
  setColumnExpressionValues,
  accelerationFormData,
}: AddColumnPopOverProps) => {
  return (
    <EuiPopover
      panelPaddingSize="s"
      button={
        <EuiButtonEmpty
          iconType="plusInCircle"
          aria-label="add column"
          onClick={() => setIsColumnPopOverOpen(!isColumnPopOverOpen)}
          size="xs"
        >
          Add Column
        </EuiButtonEmpty>
      }
      isOpen={isColumnPopOverOpen}
      closePopover={() => setIsColumnPopOverOpen(false)}
    >
      <EuiPopoverTitle>Add Column</EuiPopoverTitle>
      <>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow label="Aggregate function">
              <EuiComboBox
                placeholder="Table name"
                singleSelection={{ asPlainText: true }}
                options={tables}
                selectedOptions={selectedTable}
                onChange={() => {}}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow label="Aggregation field" helpText="I am some friendly help text.">
              <EuiFieldText name="AggField" />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFormRow label="Column alias - optional">
          <EuiFieldText name="aliasField" />
        </EuiFormRow>
      </>
      <EuiPopoverFooter>
        <EuiButton size="s" fill>
          Add
        </EuiButton>
      </EuiPopoverFooter>
    </EuiPopover>
  );
};
