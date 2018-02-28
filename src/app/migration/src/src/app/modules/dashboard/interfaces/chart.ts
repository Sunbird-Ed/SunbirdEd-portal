export interface ChartData {
  /**
   * bucketData contains chart data like time_unite
  */
  bucketData: any;

  /**
   * Contains time unit - second / mins
   */
  time_unit: string;

  /**
   * Contains bucket name like Number of users per day or Time spent by day
   */
  name: string;

  /**
   * Contains series data like number of content created, number of author(s), number of reviewer(s)
   */
  series: any;
}
