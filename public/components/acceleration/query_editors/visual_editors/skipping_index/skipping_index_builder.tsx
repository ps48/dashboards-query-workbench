/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CreateAccelerationForm } from '../../../../../../common/types';
import { EuiBasicTable, EuiSelect, EuiSpacer, EuiText, EuiButtonIcon } from '@elastic/eui';

interface tableRowType {
  id: number;
  columnName: string;
  datatype: string;
  accelerationMethod: 'partition' | 'value_set' | 'min_max';
}

interface SkippingIndexBuilderProps {
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const SkippingIndexBuilder = ({
  accelerationFormData,
  setAccelerationFormData,
}: SkippingIndexBuilderProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalItemCount, setTotalItemCount] = useState(50);
  const [pageOfItems, setPageOfItems] = useState<tableRowType[]>([]);

  useEffect(() => {
    const tableRows: tableRowType[] = [
      { id: 1, columnName: 'Field 1', datatype: 'Integer', accelerationMethod: 'partition' },
      { id: 2, columnName: 'Field 2', datatype: 'Integer', accelerationMethod: 'partition' },
      { id: 3, columnName: 'Field 3', datatype: 'Integer', accelerationMethod: 'partition' },
      { id: 4, columnName: 'Field 4', datatype: 'Integer', accelerationMethod: 'partition' },
      { id: 5, columnName: 'Field 5', datatype: 'Integer', accelerationMethod: 'partition' },
      { id: 6, columnName: 'Field 6', datatype: 'Integer', accelerationMethod: 'partition' },
    ];
    setPageOfItems(tableRows);
    setTotalItemCount(tableRows.length);
  }, []);

  const accelerationMethods = [
    { value: 'partition', text: 'Partition' },
    { value: 'value_set', text: 'Value Set' },
    { value: 'min_max', text: 'Min Max' },
  ];

  const onTableChange = (page: { index: number; size: number }) => {
    setPageIndex(page.index);
    setPageSize(page.size);
  };

  const onChangeAccelerationMethod = (
    e: React.ChangeEvent<HTMLSelectElement>,
    updateRow: tableRowType
  ) => {
    newItems = setPageOfItems([
      ...pageOfItems,
      { ...updateRow, accelerationMethod: e.target.value },
    ]);
  };

  const columns = [
    {
      field: 'columnName',
      name: 'Column name',
    },
    {
      field: 'datatype',
      name: 'Datatype',
    },
    {
      name: 'Acceleration method',
      render: (item: tableRowType) => (
        <EuiSelect
          id="selectDocExample"
          options={accelerationMethods}
          value={item.accelerationMethod}
          onChange={(e) => onChangeAccelerationMethod(e, item)}
          aria-label="Use aria labels when no actual label is in use"
        />
      ),
    },
    {
      name: 'Delete',
      render: (item) => {
        return (
          <EuiButtonIcon
            onClick={() => console.log('item: ', item)}
            iconType="trash"
            color="danger"
          />
        );
      },
    },
  ];

  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount,
    pageSizeOptions: [10, 20, 50],
  };

  return (
    <>
      <EuiText data-test-subj="skipping-index-builder">
        <h3>Skipping Index Builder</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiBasicTable
        items={pageOfItems}
        columns={columns}
        pagination={pagination}
        onChange={({ page }) => onTableChange(page)}
        hasActions={true}
      />
    </>
  );
};
