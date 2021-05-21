export interface TelemetryPacketsObject {
  id: string, // Packet id
  pluginId: string, // Plugin id the packet belongs to
  status: string, // Status of the packet. Synced/NotSynced.
  statusMsg: string, // Associated message to the status
  createdOn: Date, // Date of packet creation
  updatedOn: Date, // Date when the document is updated
  size: number, // Size of the events in the packet
  events: Array<any> // events
}
