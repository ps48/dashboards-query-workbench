/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiBadge,
  EuiComboBoxOptionOption,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLoadingSpinner,
  EuiNotificationBadge,
  EuiSpacer,
  EuiText,
  EuiToolTip,
  EuiTreeView,
} from '@elastic/eui';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { CoreStart } from '../../../../../src/core/public';
import {
  FETCH_OPENSEARCH_INDICES_PATH,
  LOAD_OPENSEARCH_INDICES_QUERY,
  TREE_ITEM_BADGE_NAME,
  TREE_ITEM_COVERING_INDEX_DEFAULT_NAME,
  TREE_ITEM_DATABASE_NAME_DEFAULT_NAME,
  TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME,
  TREE_ITEM_MATERIALIZED_VIEW_DEFAULT_NAME,
  TREE_ITEM_SKIPPING_INDEX_DEFAULT_NAME,
  TREE_ITEM_TABLE_NAME_DEFAULT_NAME,
} from '../../../common/constants';
import {
  AccelerationIndexType,
  AsyncApiResponse,
  AsyncQueryStatus,
  DatasourceTreeLoading,
  TreeItem,
  TreeItemType,
} from '../../../common/types';
import { executeAsyncQuery } from '../../../common/utils/async_query_helpers';
import { useToast } from '../../../common/utils/toast_helper';
import { AccelerationIndexFlyout } from './acceleration_index_flyout';
import './table_view.scss';

interface CustomView {
  http: CoreStart['http'];
  selectedItems: EuiComboBoxOptionOption[];
  updateSQLQueries: (query: string) => void;
  refreshTree: boolean;
}

export const TableView = ({ http, selectedItems, updateSQLQueries, refreshTree }: CustomView) => {
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [_selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [_selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isLoadingBanner, setIsLoading] = useState<DatasourceTreeLoading>({
    flag: false,
    status: 'Not loading',
  });
  const [indexFlyout, setIndexFlyout] = useState(<></>);
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [currentQueryHandler, setCurrentQueryHandler] = useState(() => () => {});
  const { setToast } = useToast();

  const resetFlyout = () => {
    setIndexFlyout(<></>);
  };

  const handleAccelerationIndexClick = (
    accelerationIndexType: AccelerationIndexType,
    dataSource: string,
    database: string,
    dataTable: string,
    indexName?: string
  ) => {
    setIndexFlyout(
      <AccelerationIndexFlyout
        accelerationIndexType={accelerationIndexType}
        dataSource={dataSource}
        database={database}
        dataTable={dataTable}
        indexName={indexName}
        resetFlyout={resetFlyout}
        updateSQLQueries={updateSQLQueries}
      />
    );
  };

  function loadTreeItem(elements: string[], type: TreeItemType): TreeItem[] {
    return elements.map((element) => {
      const treeItem: TreeItem = {
        name: element,
        type,
        isExpanded: false,
      };

      if (
        type !== TREE_ITEM_COVERING_INDEX_DEFAULT_NAME &&
        type !== TREE_ITEM_SKIPPING_INDEX_DEFAULT_NAME
      ) {
        treeItem.values = [];
        treeItem.isLoading = false;
      }
      return treeItem;
    });
  }

  const getSidebarContent = () => {
    // Cancel any async running queries
    currentQueryHandler();

    if (selectedItems[0].label === 'OpenSearch') {
      setTableNames([]);
      setIsLoading({
        flag: false,
        status: 'Fetching OpenSearch indices ...',
      });
      const query = { query: LOAD_OPENSEARCH_INDICES_QUERY };
      http
        .post(FETCH_OPENSEARCH_INDICES_PATH, {
          body: JSON.stringify(query),
        })
        .then((res) => {
          const responseObj = JSON.parse(res.data.resp);
          const dataRows: any[][] = _.get(responseObj, 'datarows');
          if (dataRows.length > 0) {
            const fields = dataRows.map((data) => {
              return data[2];
            });
            setTableNames(fields);
          } else {
            setIsLoading({
              flag: false,
              status: 'Error fetching data',
            });
            setToast(`ERROR fetching data`, 'danger');
          }
        })
        .catch((err) => {
          console.error(err);
          setIsLoading({
            flag: false,
            status: 'Error in loading OpenSearch indices',
          });
          setToast(`Error in loading OpenSearch indices, please check user permissions`, 'danger');
        });
    } else {
      setTableNames([]);
      const query = {
        lang: 'sql',
        query: `SHOW SCHEMAS IN \`${selectedItems[0].label}\``,
        datasource: selectedItems[0].label,
      };
      setCurrentQueryHandler(() =>
        executeAsyncQuery(
          selectedItems[0].label,
          query,
          (response: AsyncApiResponse) => {
            const status = response.data.resp.status.toLowerCase();
            setIsLoading({ flag: true, status });
            if (status === AsyncQueryStatus.Success) {
              const fetchedDatabases = [].concat(...response.data.resp.datarows);
              setTreeData(loadTreeItem(fetchedDatabases, TREE_ITEM_DATABASE_NAME_DEFAULT_NAME));
              setIsLoading({ flag: false, status });
            } else if (
              status === AsyncQueryStatus.Failed ||
              status === AsyncQueryStatus.Cancelled
            ) {
              setIsLoading({
                flag: false,
                status: response.data.resp.error ?? '',
              });
            }
          },
          () => {
            setIsLoading({
              flag: false,
              status: 'Failed to load databases',
            });
          }
        )
      );
    }
  };

  useEffect(() => {
    setTreeData([]);
    setIsLoading({
      flag: true,
      status: 'Fetching associated objects ...',
    });
    getSidebarContent();
  }, [selectedItems, refreshTree]);

  const setTreeDataDatabaseError = (databaseName: string) => {
    setTreeData((prevTreeData) => {
      return prevTreeData.map((database) => {
        if (database.name === databaseName) {
          return { ...database, isLoading: false };
        }
        return database;
      });
    });
  };

  const handleDatabaseClick = (databaseName: string) => {
    setTreeData((prevTreeData) => {
      return prevTreeData.map((database) => {
        if (database.name === databaseName) {
          return { ...database, isExpanded: true, isLoading: true };
        }
        return database;
      });
    });
    setSelectedDatabase(databaseName);
    const query = {
      lang: 'sql',
      query: `SHOW TABLES IN \`${selectedItems[0].label}\`.\`${databaseName}\``,
      datasource: selectedItems[0].label,
    };

    setCurrentQueryHandler(() =>
      executeAsyncQuery(
        selectedItems[0].label,
        query,
        (response: AsyncApiResponse) => {
          const status = response.data.resp.status.toLowerCase();
          if (status === AsyncQueryStatus.Success) {
            const fetchTables = response.data.resp.datarows.map((subArray) => subArray[1]);
            let values = loadTreeItem(fetchTables, TREE_ITEM_TABLE_NAME_DEFAULT_NAME);
            const mvObj = loadTreeItem(
              [TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME],
              TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME
            );
            values = [...values, ...mvObj];
            setTreeData((prevTreeData) => {
              return prevTreeData.map((database) => {
                if (database.name === databaseName) {
                  return { ...database, values, isExpanded: true, isLoading: false };
                }
                return database;
              });
            });
          } else if (status === AsyncQueryStatus.Failed || status === AsyncQueryStatus.Cancelled) {
            setIsLoading({
              flag: false,
              status: response.data.resp.error ?? '',
            });
          }
        },
        () => setTreeDataDatabaseError(databaseName)
      )
    );
  };

  const setTreeDataTableError = (databaseName: string, tableName: string) => {
    setTreeData((prevTreeData) => {
      return prevTreeData.map((database) => {
        if (database.name === databaseName) {
          return {
            ...database,
            values: database.values?.map((table) => {
              if (table.name === tableName) {
                return {
                  ...table,
                  isLoading: false,
                  isExpanded: false,
                };
              }
              return table;
            }),
          };
        }
        return database;
      });
    });
  };

  const loadCoveringIndex = (tableName: string, databaseName: string) => {
    const coverQuery = {
      lang: 'sql',
      query: `SHOW INDEX ON \`${selectedItems[0].label}\`.\`${databaseName}\`.\`${tableName}\``,
      datasource: selectedItems[0].label,
    };

    setCurrentQueryHandler(() =>
      executeAsyncQuery(
        selectedItems[0].label,
        coverQuery,
        (response: AsyncApiResponse) => {
          const status = response.data.resp.status.toLowerCase();
          if (status === AsyncQueryStatus.Success) {
            const res = [].concat(response.data.resp.datarows);
            const coverIndexObj = loadTreeItem(res, TREE_ITEM_COVERING_INDEX_DEFAULT_NAME);
            setTreeData((prevTreeData) => {
              return prevTreeData.map((database) => {
                if (database.name === databaseName) {
                  return {
                    ...database,
                    values: database.values?.map((table) => {
                      if (table.name === tableName) {
                        let newValues = table.values?.concat(...coverIndexObj);
                        if (newValues?.length === 0) {
                          newValues = [
                            { name: 'No Indicies', type: TREE_ITEM_BADGE_NAME, isExpanded: false },
                          ];
                        }
                        return {
                          ...table,
                          values: newValues,
                          isLoading: false,
                          isExpanded: true,
                        };
                      }
                      return table;
                    }),
                  };
                }
                return database;
              });
            });
          } else if (status === AsyncQueryStatus.Failed || status === AsyncQueryStatus.Cancelled) {
            setIsLoading({
              flag: false,
              status: response.data.resp.error ?? '',
            });
          }
        },
        () => setTreeDataTableError(databaseName, tableName)
      )
    );
  };

  const setLoadingForTableElements = (databaseName: string, tableName: string) => {
    setTreeData((prevTreeData) => {
      return prevTreeData.map((database) => {
        if (database.name === databaseName) {
          return {
            ...database,
            values: database.values?.map((table) => {
              if (table.name === tableName) {
                return {
                  ...table,
                  isLoading: true,
                };
              }
              return table;
            }),
          };
        }
        return database;
      });
    });
  };

  const handleButtonClick = (tableName: string, databaseName: string) => {
    tableName = TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME;
    setSelectedTable(tableName);
    setLoadingForTableElements(databaseName, tableName);
    const materializedViewQuery = {
      lang: 'sql',
      query: `SHOW MATERIALIZED VIEW IN \`${selectedItems[0].label}\`.\`${databaseName}\``,
      datasource: selectedItems[0].label,
    };

    setCurrentQueryHandler(() =>
      executeAsyncQuery(
        selectedItems[0].label,
        materializedViewQuery,
        (response: AsyncApiResponse) => {
          const status = response.data.resp.status.toLowerCase();
          if (status === AsyncQueryStatus.Success) {
            const fetchMaterialzedView = response.data.resp.datarows;
            let values = loadTreeItem(
              fetchMaterialzedView,
              TREE_ITEM_MATERIALIZED_VIEW_DEFAULT_NAME
            );
            if (values.length === 0) {
              values = [
                {
                  name: 'No Materialized View',
                  type: TREE_ITEM_BADGE_NAME,
                  isExpanded: false,
                  isLoading: false,
                },
              ];
            }
            setTreeData((prevTreeData) => {
              return prevTreeData.map((database) => {
                if (database.name === databaseName) {
                  const updatedValues = database.values?.filter(
                    (item) => item.type !== TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME
                  );
                  return {
                    ...database,
                    values: updatedValues?.concat(...values),
                    isLoading: false,
                    isExpanded: true,
                  };
                }
                return database;
              });
            });
          } else if (status === AsyncQueryStatus.Failed || status === AsyncQueryStatus.Cancelled) {
            setIsLoading({
              flag: false,
              status: response.data.resp.error ?? '',
            });
          }
        },
        () => setTreeDataTableError(tableName, databaseName)
      )
    );
  };

  const handleTableClick = (tableName: string, databaseName: string) => {
    setSelectedTable(tableName);
    setLoadingForTableElements(databaseName, tableName);
    const skipQuery = {
      lang: 'sql',
      query: `DESC SKIPPING INDEX ON \`${selectedItems[0].label}\`.\`${databaseName}\`.\`${tableName}\``,
      datasource: selectedItems[0].label,
    };

    setCurrentQueryHandler(() =>
      executeAsyncQuery(
        selectedItems[0].label,
        skipQuery,
        (response: AsyncApiResponse) => {
          const status = response.data.resp.status.toLowerCase();
          if (status === AsyncQueryStatus.Success) {
            if (response.data.resp.datarows.length > 0) {
              setTreeData((prevTreeData) => {
                return prevTreeData.map((database) => {
                  if (database.name === databaseName) {
                    return {
                      ...database,
                      values: database.values?.map((table) => {
                        if (table.name === tableName) {
                          return {
                            ...table,
                            values: loadTreeItem(
                              [TREE_ITEM_SKIPPING_INDEX_DEFAULT_NAME],
                              TREE_ITEM_SKIPPING_INDEX_DEFAULT_NAME
                            ),
                          };
                        }
                        return table;
                      }),
                    };
                  }
                  return database;
                });
              });
            }
            loadCoveringIndex(tableName, databaseName);
          } else if (status === AsyncQueryStatus.Failed || status === AsyncQueryStatus.Cancelled) {
            setIsLoading({
              flag: false,
              status: response.data.resp.error ?? '',
            });
          }
        },
        () => setTreeDataTableError(databaseName, tableName)
      )
    );
  };

  const handleQuery = (e: MouseEvent, parentName: string, tableName: string) => {
    e.stopPropagation();
    updateSQLQueries(
      `select * from \`${selectedItems[0].label}\`.\`${parentName}\`.\`${tableName}\` limit 10`
    );
  };

  const iconCreation = (node: TreeItem) => {
    if (node.type === TREE_ITEM_MATERIALIZED_VIEW_DEFAULT_NAME) {
      return (
        <EuiNotificationBadge aria-label="Materialized view" color="subdued">
          MV
        </EuiNotificationBadge>
      );
    } else if (
      node.type === TREE_ITEM_BADGE_NAME ||
      node.type === TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME
    ) {
      return null;
    } else if (node.type === TREE_ITEM_TABLE_NAME_DEFAULT_NAME) {
      return <EuiIcon type="tableDensityCompact" size="s" />;
    } else if (node.type === TREE_ITEM_DATABASE_NAME_DEFAULT_NAME) {
      return <EuiIcon type="database" size="m" />;
    } else if (
      node.type === TREE_ITEM_COVERING_INDEX_DEFAULT_NAME ||
      TREE_ITEM_SKIPPING_INDEX_DEFAULT_NAME
    ) {
      return <EuiIcon type="bolt" size="m" />;
    }
  };

  const createLabel = (node: TreeItem, parentName: string, index: number) => {
    switch (node.type) {
      case TREE_ITEM_BADGE_NAME:
        return (
          <div key={`${parentName}.${node.name}.${index}`}>
            <EuiToolTip position="right" content={node.name} delay="long">
              <EuiBadge>{_.truncate(node.name, { length: 50 })}</EuiBadge>
            </EuiToolTip>{' '}
          </div>
        );

      case TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME:
        return (
          <div key={node.name}>
            <EuiFlexGroup direction="row">
              <EuiFlexItem grow={false}>
                <EuiBadge color="hollow">Load Materialized View</EuiBadge>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiText>{node.isLoading && <EuiLoadingSpinner size="m" />}</EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </div>
        );

      default:
        return (
          <div key={node.name}>
            <EuiToolTip position="right" content={node.name} delay="long">
              <EuiFlexGroup direction="row">
                <EuiFlexItem grow={false}>
                  <EuiText>
                    {_.truncate(node.name, { length: 50 })}{' '}
                    {node.isLoading && <EuiLoadingSpinner size="m" />}
                    {node.type === TREE_ITEM_TABLE_NAME_DEFAULT_NAME && !node.isLoading && (
                      <EuiIcon
                        type="editorCodeBlock"
                        onClick={(e) => handleQuery(e, parentName, node.name)}
                      />
                    )}
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiToolTip>
          </div>
        );
    }
  };

  const OpenSearchIndicesTree = tableNames.map((database, index) => ({
    label: (
      <div key={database}>
        <EuiToolTip position="right" content={database} delay="long">
          <EuiText>{_.truncate(database, { length: 50 })}</EuiText>
        </EuiToolTip>{' '}
      </div>
    ),
    icon: <EuiIcon type="database" size="m" />,
    id: 'element_' + index,
    isSelectable: false,
  }));

  const treeDataDatabases = treeData.map((database, index) => ({
    label: createLabel(database, selectedItems[0].label, index),
    icon: iconCreation(database),
    id: 'element_' + index,
    callback: () => {
      if (database.values?.length === 0 && selectedItems[0].label !== 'OpenSearch') {
        handleDatabaseClick(database.name);
      }
    },
    isSelectable: true,
    isExpanded: database.isExpanded,
    children: database.values?.map((table, idx) => ({
      label: createLabel(table, database.name, idx),
      id: `${database.name}_${table.name}`,
      icon: iconCreation(table),
      callback: () => {
        if (table.type === TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME) {
          handleButtonClick(table.name, database.name);
        }
        if (
          table.type !== TREE_ITEM_LOAD_MATERIALIZED_BADGE_NAME &&
          table.type !== TREE_ITEM_MATERIALIZED_VIEW_DEFAULT_NAME &&
          table.values?.length === 0
        ) {
          handleTableClick(table.name, database.name);
        }
        if (table.type === TREE_ITEM_MATERIALIZED_VIEW_DEFAULT_NAME) {
          handleAccelerationIndexClick(
            'materialized',
            selectedItems[0].label,
            database.name,
            table.name
          );
        }
      },
      isSelectable: true,
      isExpanded: table.isExpanded,
      children: table.values?.map((indexChild, idxValue) => ({
        label: createLabel(indexChild, table.name, idxValue),
        id: `${database.name}_${table.name}_${indexChild.name}`,
        icon: iconCreation(indexChild),
        callback: () => {
          if (indexChild.type !== TREE_ITEM_BADGE_NAME) {
            handleAccelerationIndexClick(
              indexChild.type === 'skipping_index' ? 'skipping' : 'covering',
              selectedItems[0].label,
              database.name,
              table.name,
              indexChild.name
            );
          }
        },
      })),
    })),
  }));

  return (
    <>
      {isLoadingBanner.flag ? (
        <EuiFlexGroup alignItems="center" gutterSize="s" direction="column">
          <EuiSpacer />
          <EuiFlexItem>
            <EuiLoadingSpinner size="l" />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>Loading data</EuiFlexItem>
          <EuiFlexItem grow={false}>
            <div style={{ padding: '10px' }}>
              <EuiFlexItem>
                <EuiText textAlign="center" color="subdued">
                  Loading may take over 30 seconds
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText textAlign="center" color="subdued">
                  Status: {isLoadingBanner.status}
                </EuiText>
              </EuiFlexItem>
            </div>
          </EuiFlexItem>
        </EuiFlexGroup>
      ) : OpenSearchIndicesTree.length > 0 || treeDataDatabases.length > 0 ? (
        <EuiFlexItem grow={false} className="workbench-tree">
          {selectedItems[0].label === 'OpenSearch' ? (
            <EuiTreeView
              aria-label="OpenSearch Folder Tree"
              data-test-subj="opensearch-tree"
              items={OpenSearchIndicesTree}
            />
          ) : (
            <EuiTreeView
              aria-label="S3 Datasource Folder Tree"
              data-test-subj="s3-datasource-tree"
              items={treeDataDatabases}
            />
          )}
        </EuiFlexItem>
      ) : (
        <EuiFlexGroup alignItems="center" direction="column">
          <EuiFlexItem grow={false}>
            <EuiEmptyPrompt
              icon={<EuiIcon type="database" size="m" />}
              iconColor="subdued"
              titleSize="xs"
              title={<p>No Data available</p>}
              body={<p>{isLoadingBanner.status}</p>}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
      {indexFlyout}
    </>
  );
};
