/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  HttpInterceptorResponseError,
  IHttpInterceptController,
} from '../../../../src/core/public';

export function interceptError(): any {
  return (httpErrorResponse: HttpInterceptorResponseError, _: IHttpInterceptController) => {
    if (
      httpErrorResponse.response?.status === 401 &&
      httpErrorResponse.fetchOptions.path === '/api/v1/configuration/account'
    ) {
      console.log('hereeeeee! recieved 401 in status');
    }
  };
}
