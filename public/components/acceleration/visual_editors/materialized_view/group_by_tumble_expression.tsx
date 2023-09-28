/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EuiComboBox,
  EuiExpression,
  EuiFieldNumber,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiPopover,
  EuiSelect,
  EuiComboBoxOptionOption,
} from '@elastic/eui';
import { ACCELERATION_TIME_INTERVAL } from '../../../../../common/constants';
import { CreateAccelerationForm } from '../../../../../common/types';
import _ from 'lodash';
import { isTimePlural } from '../../create/utils';

interface GroupByTumbleValues {
  timeField: string;
  tumbleWindow: number;
  tumbleInterval: string;
}

interface GroupByTumbleExpressionProps {
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const GroupByTumbleExpression = ({
  accelerationFormData,
  setAccelerationFormData,
}: GroupByTumbleExpressionProps) => {
  const [IsGroupPopOverOpen, setIsGroupPopOverOpen] = useState(false);
  const [groupbyValues, setGroupByValues] = useState<GroupByTumbleValues>({
    timeField: '',
    tumbleWindow: 1,
    tumbleInterval: ACCELERATION_TIME_INTERVAL[0].text,
  });

  const onChangeTumbleWindow = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupByValues({ ...groupbyValues, tumbleWindow: +e.target.value });
  };

  const onChangeTumbleInterval = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroupByValues({ ...groupbyValues, tumbleInterval: e.target.value });
  };

  const onChangeTimeField = (selectedOptions: EuiComboBoxOptionOption[]) => {
    if (selectedOptions.length > 0)
      setGroupByValues({ ...groupbyValues, timeField: selectedOptions[0].label });
  };

  return (
    <EuiFlexItem grow={false}>
      <EuiPopover
        id="popover1"
        button={
          <EuiExpression
            description="GROUP BY"
            value={`TUMBLE(${groupbyValues.timeField}, '${groupbyValues.tumbleWindow} ${
              groupbyValues.tumbleInterval
            }${isTimePlural(groupbyValues.tumbleWindow)}')`}
            isActive={IsGroupPopOverOpen}
            onClick={() => setIsGroupPopOverOpen(true)}
            isInvalid={groupbyValues.timeField === ''}
          />
        }
        isOpen={IsGroupPopOverOpen}
        closePopover={() => setIsGroupPopOverOpen(false)}
        panelPaddingSize="s"
        anchorPosition="downLeft"
      >
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiFormRow label="Time Field">
              <EuiComboBox
                placeholder="Select one or more options"
                singleSelection={{ asPlainText: true }}
                options={[
                  ..._.reduce(
                    accelerationFormData.dataTableFields,
                    (dateFields, value) => {
                      if (value.dataType.includes('TimestampType'))
                        dateFields.push({ label: value.fieldName });
                      return dateFields;
                    },
                    []
                  ),
                ]}
                selectedOptions={[{ label: groupbyValues.timeField }]}
                onChange={onChangeTimeField}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow label="Tumble Window">
              <EuiFieldNumber
                value={groupbyValues.tumbleWindow}
                onChange={onChangeTumbleWindow}
                min={1}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow label="Tumble Interval">
              <EuiSelect
                value={groupbyValues.tumbleInterval}
                onChange={onChangeTumbleInterval}
                options={ACCELERATION_TIME_INTERVAL}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPopover>
    </EuiFlexItem>
  );
};
