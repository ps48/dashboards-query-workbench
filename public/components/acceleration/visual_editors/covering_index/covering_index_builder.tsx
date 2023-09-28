/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiComboBox,
  EuiExpression,
  EuiPopover,
  EuiPopoverTitle,
  EuiSpacer,
  EuiText,
  EuiFlexItem,
  EuiFlexGroup,
  EuiComboBoxOptionOption,
} from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { CreateAccelerationForm } from '../../../../../common/types';
import _ from 'lodash';
import { ACCELERATION_ADD_FIELDS_TEXT } from '../../../../../common/constants';

interface CoveringIndexBuilderProps {
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const CoveringIndexBuilder = ({
  accelerationFormData,
  setAccelerationFormData,
}: CoveringIndexBuilderProps) => {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [columnsValue, setColumnsValue] = useState('');
  const [selectedOptions, setSelected] = useState([]);

  const onChange = (selectedOptions: EuiComboBoxOptionOption[]) => {
    setSelected(selectedOptions);
  };

  useEffect(() => {
    let expresseionValue = ACCELERATION_ADD_FIELDS_TEXT;
    if (selectedOptions.length > 0) {
      expresseionValue =
        '(' +
        _.reduce(
          selectedOptions,
          function (columns, n, index) {
            const columnValue = columns + `${n.label}`;
            if (index !== selectedOptions.length - 1) return `${columnValue}, `;
            else return columnValue;
          },
          ''
        ) +
        ')';
    }
    setAccelerationFormData({ ...accelerationFormData, coveringIndexQueryData: expresseionValue });
    setColumnsValue(expresseionValue);
  }, [selectedOptions]);

  return (
    <>
      <EuiText data-test-subj="covering-index-builder">
        <h3>Covering index definition</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiFlexGroup direction="column" gutterSize="xs">
        <EuiFlexItem grow={false}>
          <EuiExpression
            description="CREATE INDEX"
            value={accelerationFormData.accelerationIndexName}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiExpression description="[IF NOT EXISTS]" />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiExpression
            description="ON"
            value={`${accelerationFormData.dataSource}.${accelerationFormData.database}.${accelerationFormData.dataTable}`}
          />
          <EuiPopover
            id="popover1"
            button={
              <EuiExpression
                description=""
                value={columnsValue}
                isActive={isPopOverOpen}
                onClick={() => setIsPopOverOpen(true)}
                isInvalid={columnsValue === ACCELERATION_ADD_FIELDS_TEXT}
              />
            }
            isOpen={isPopOverOpen}
            closePopover={() => setIsPopOverOpen(false)}
            panelPaddingSize="s"
            anchorPosition="downLeft"
          >
            <>
              <EuiPopoverTitle paddingSize="l">Columns</EuiPopoverTitle>
              <EuiComboBox
                placeholder="Select one or more options"
                options={accelerationFormData.dataTableFields.map((x) => {
                  return { label: x.fieldName };
                })}
                selectedOptions={selectedOptions}
                onChange={onChange}
              />
            </>
          </EuiPopover>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
