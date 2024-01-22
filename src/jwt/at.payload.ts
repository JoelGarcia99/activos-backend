export interface AccessTokenPayload {
  rtId: number;
  userId: number;
  exp?: number | undefined;
}
