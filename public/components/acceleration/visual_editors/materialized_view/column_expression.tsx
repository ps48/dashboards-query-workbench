/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ACCELERATION_AGGREGRATION_FUNCTIONS } from '../../../../../common/constants';
import {
  MaterializedViewColumn,
  CreateAccelerationForm,
  AggregationFunctionType,
} from '../../../../../common/types';
import _ from 'lodash';
import {
  EuiButtonIcon,
  EuiComboBox,
  EuiExpression,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiPopover,
} from '@elastic/eui';

interface ColumnExpressionProps {
  index: number;
  currentColumnExpressionValue: MaterializedViewColumn;
  columnExpressionValues: MaterializedViewColumn[];
  setColumnExpressionValues: React.Dispatch<React.SetStateAction<MaterializedViewColumn[]>>;
  accelerationFormData: CreateAccelerationForm;
}

export const ColumnExpression = ({
  index,
  currentColumnExpressionValue,
  columnExpressionValues,
  setColumnExpressionValues,
  accelerationFormData,
}: ColumnExpressionProps) => {
  const [isFunctionPopOverOpen, setIsFunctionPopOverOpen] = useState(false);
  const [isAliasPopOverOpen, setIsAliasPopOverOpen] = useState(false);

  const updateColumnExpressionValue = (newValue: MaterializedViewColumn, index: number) => {
    const updatedArray = [...columnExpressionValues];
    updatedArray[index] = newValue;
    setColumnExpressionValues(updatedArray);
  };

  return (
    <EuiFlexItem grow={false}>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiPopover
            id={'columnFunctionExpression-' + currentColumnExpressionValue.id}
            button={
              <EuiExpression
                description=""
                value={`${currentColumnExpressionValue.functionName}(${currentColumnExpressionValue.functionParam})`}
                isActive={isFunctionPopOverOpen}
                onClick={() => {
                  setIsAliasPopOverOpen(false);
                  setIsFunctionPopOverOpen(true);
                }}
              />
            }
            isOpen={isFunctionPopOverOpen}
            closePopover={() => setIsFunctionPopOverOpen(false)}
            panelPaddingSize="s"
            anchorPosition="downLeft"
          >
            <>
              <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                  <EuiFormRow label="Aggregate function">
                    <EuiComboBox
                      singleSelection={{ asPlainText: true }}
                      options={ACCELERATION_AGGREGRATION_FUNCTIONS}
                      selectedOptions={[
                        {
                          label: currentColumnExpressionValue.functionName,
                        },
                      ]}
                      onChange={(functionOption) =>
                        updateColumnExpressionValue(
                          {
                            ...currentColumnExpressionValue,
                            functionName: functionOption[0].label as AggregationFunctionType,
                          },
                          index
                        )
                      }
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiFormRow label="Aggregation field">
                    <EuiComboBox
                      singleSelection={{ asPlainText: true }}
                      options={[
                        {
                          label: '*',
                          disabled: currentColumnExpressionValue.functionName !== 'count',
                        },
                        ...accelerationFormData.dataTableFields.map((x) => ({
                          label: x.fieldName,
                        })),
                      ]}
                      selectedOptions={[
                        {
                          label: currentColumnExpressionValue.functionParam,
                        },
                      ]}
                      onChange={(fieldOption) =>
                        updateColumnExpressionValue(
                          { ...currentColumnExpressionValue, functionParam: fieldOption[0].label },
                          index
                        )
                      }
                    />
                  </EuiFormRow>
                </EuiFlexItem>
              </EuiFlexGroup>
            </>
          </EuiPopover>
        </EuiFlexItem>
        {currentColumnExpressionValue.fieldAlias !== '' && (
          <EuiFlexItem grow={false}>
            <EuiPopover
              id={'columnFunctionExpressionAlias-' + currentColumnExpressionValue.id}
              button={
                <EuiExpression
                  description="AS"
                  color="accent"
                  value={currentColumnExpressionValue.fieldAlias}
                  isActive={isAliasPopOverOpen}
                  onClick={() => {
                    setIsFunctionPopOverOpen(false);
                    setIsAliasPopOverOpen(true);
                  }}
                />
              }
              isOpen={isAliasPopOverOpen}
              closePopover={() => setIsAliasPopOverOpen(false)}
              panelPaddingSize="s"
              anchorPosition="downLeft"
            >
              <EuiFormRow label="Column alias">
                <EuiFieldText
                  name="aliasField"
                  value={currentColumnExpressionValue.fieldAlias}
                  onChange={(e) =>
                    updateColumnExpressionValue(
                      { ...currentColumnExpressionValue, fieldAlias: e.target.value },
                      index
                    )
                  }
                />
              </EuiFormRow>
            </EuiPopover>
          </EuiFlexItem>
        )}
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            color="danger"
            onClick={() => {
              setColumnExpressionValues([
                ..._.filter(
                  columnExpressionValues,
                  (o) => o.id !== currentColumnExpressionValue.id
                ),
              ]);
            }}
            iconType="trash"
            aria-label="delete-column-expression"
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  );
};
