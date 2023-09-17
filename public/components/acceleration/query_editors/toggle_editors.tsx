/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiButtonGroup, htmlIdGenerator } from '@elastic/eui';
import React, { useState } from 'react';
import { CreateAccelerationForm } from '../../../../common/types';

const idPrefix = htmlIdGenerator()();

interface ToggleEditorsProps {
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const ToggleEditors = ({
  accelerationFormData,
  setAccelerationFormData,
}: ToggleEditorsProps) => {
  const [toggleIdSelected, setToggleIdSelected] = useState(`${idPrefix}0`);

  const toggleButtons = [
    {
      id: `${idPrefix}0`,
      label: 'Visual Editor',
    },
    {
      id: `${idPrefix}1`,
      label: 'Code Editor',
    },
  ];

  return (
    <>
      <EuiButtonGroup
        legend="Select Query Editor Type"
        options={toggleButtons}
        idSelected={toggleIdSelected}
        onChange={(id) => {
          setAccelerationFormData({
            ...accelerationFormData,
            queryBuilderType: id === `${idPrefix}0` ? 'visual' : 'code',
          });
          setToggleIdSelected(id);
        }}
      />
    </>
  );
};
