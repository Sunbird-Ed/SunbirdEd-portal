/**
 * Contains dashboard query param(s)
 */
export interface DashboardParams {
    /**
     * Query data - Content identifier and time period
     */
    data: object;

    /**
     * Contains dashboard type - creation / consumption
     *
     * Used to construct dashboard api url
     */
    dataset?: string;
}
