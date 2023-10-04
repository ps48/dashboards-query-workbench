/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiComboBox, EuiComboBoxOptionOption } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { CoreStart } from '../../../../../src/core/public';

interface CustomView {
  http: CoreStart['http'];
  onSelect: (selectedItems: []) => void;
}

export const DataSelect = ({ http, onSelect }: CustomView) => {
  const [selectedOptions, setSelectedOptions] = useState<EuiComboBoxOptionOption[]>([{ label: 'OpenSearch' }]);
  const [options, setOptions] = useState<any[]>([]);

  const datasources = () => {
    http
      .get(`/api/get_datasources`)
      .then((res) => {
        const data = res.data.resp;

        const connectorGroups = {};

        data.forEach((item) => {
          const connector = item.connector;
          const name = item.name;

          if (connector === 'S3GLUE') {
            if (!connectorGroups[connector]) {
              connectorGroups[connector] = [];
            }

            connectorGroups[connector].push(name);
          }
        });
        options.push({ label: 'OpenSearch' });
        for (const connector in connectorGroups) {
          if (connectorGroups.hasOwnProperty(connector)) {
            const connectorNames = connectorGroups[connector];

            options.push({
              label: connector,
              options: connectorNames.map((name) => ({ label: name })),
            });
          }
        }

        setOptions(options);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    datasources();
  }, []);

  const handleSelectionChange = (selectedItems: any[]) => {
    setSelectedOptions(selectedItems);
    onSelect(selectedItems);
  };

  return (
    <EuiComboBox
      singleSelection={{ asPlainText: true }}
      isClearable={false}
      options={options}
      selectedOptions={selectedOptions}
      onChange={(selectedItems) => handleSelectionChange(selectedItems)}
    />
  );
};