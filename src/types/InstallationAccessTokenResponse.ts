export default interface InstallationAccessTokenResponse {
  token:                string;
  expires_at:           Date;
  permissions:          Permissions;
  repository_selection: string;
}

export interface Permissions {
  metadata:      string;
  pull_requests: string;
}
