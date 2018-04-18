/**
 * Contains dashboard query param(s)
 */
export interface DashboardParams {
    /**
     * Query data - Content identifier and time period
     */
    data: { identifier: string, timePeriod: string };

    /**
     * Contains dashboard type - creation / consumption
     *
     * Used to construct dashboard api url
     */
    dataset?: string;
}
