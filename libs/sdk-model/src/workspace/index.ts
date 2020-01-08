// (C) 2019 GoodData Corporation

/**
 * Workspace represents a set of related data, insights and so on.
 *
 * TODO: move to backend spi, rename to workspace descriptor; favor IAnalyticalWorkspace
 *
 * @public
 */
export interface IWorkspace {
    id: string;
    title: string;
    description: string;
}

/**
 * @public
 */
export type WorkspacePermission =
    | "canAccessWorkbench"
    | "canCreateVisualization"
    | "canManageAnalyticalDashboard"
    | "canUploadNonProductionCSV"
    | "canCreateReport"
    | "canExecuteRaw"
    | "canExportReport";

/**
 *
 * @public
 */
export type IWorkspacePermissions = {
    [permission in WorkspacePermission]: boolean;
};