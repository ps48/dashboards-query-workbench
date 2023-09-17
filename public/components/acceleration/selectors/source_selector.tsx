/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiComboBox, EuiFormRow, EuiSpacer, EuiText } from '@elastic/eui';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { CreateAccelerationForm } from '../../../../common/types';

interface DataSourceTypes {
  label: string;
}

interface AccelerationDataSourceSelectorProps {
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const AccelerationDataSourceSelector = ({
  accelerationFormData,
  setAccelerationFormData,
}: AccelerationDataSourceSelectorProps) => {
  const [dataConnections, setDataConnections] = useState<DataSourceTypes[]>([]);
  const [selectedDataConnection, setSelectedDataConnection] = useState<DataSourceTypes[]>([]);
  const [tables, setTables] = useState<DataSourceTypes[]>([]);
  const [selectedTable, setSelectedTable] = useState<DataSourceTypes[]>([]);

  useEffect(() => {
    setDataConnections([
      {
        label: 'spark1',
      },
      {
        label: 'spark2',
      },
    ]);
  }, []);

  useEffect(() => {
    setTables([
      {
        label: 'Table1',
      },
      {
        label: 'Table2',
      },
    ]);
  }, [dataConnections]);

  return (
    <>
      <EuiText data-test-subj="datasource-selector-header">
        <h3>Select data connection</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiText size="s" color="subdued">
        Select data connection where the data you want to accelerate resides.{' '}
      </EuiText>
      <EuiSpacer size="s" />
      <EuiFormRow
        label="Data connection"
        helpText="A data connection has to be configured and active to be able to select it and index data from."
      >
        <EuiComboBox
          placeholder="Data connection name"
          singleSelection={{ asPlainText: true }}
          options={dataConnections}
          selectedOptions={selectedDataConnection}
          onChange={(dataConnectionOptions) => {
            setAccelerationFormData({
              ...accelerationFormData,
              dataSource: dataConnectionOptions[0].label,
            });
            setSelectedDataConnection(dataConnectionOptions);
          }}
        />
      </EuiFormRow>
      <EuiFormRow
        label="Select Table"
        helpText="Select the Spark table that has the data you would like to index."
      >
        <EuiComboBox
          placeholder="Table name"
          singleSelection={{ asPlainText: true }}
          options={tables}
          selectedOptions={selectedTable}
          onChange={(tableOptions) => {
            setAccelerationFormData({
              ...accelerationFormData,
              dataTable: tableOptions[0].label,
            });
            setSelectedTable(tableOptions);
          }}
        />
      </EuiFormRow>
      <EuiSpacer size="xxl" />
    </>
  );
};
